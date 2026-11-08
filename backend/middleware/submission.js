const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const rateLimit = require('express-rate-limit')

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024
const MAX_SUBMISSIONS = 100
const MAX_ACTIVE_UPLOADS = 4
const formats = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
    '.tif': 'image/tiff', '.tiff': 'image/tiff'
}

function uploadError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}

async function validateImage(file) {
    const handle = await fs.promises.open(file.path, 'r')
    const header = Buffer.alloc(256)
    let bytesRead
    try {
        const result = await handle.read(header, 0, header.length, 0)
        bytesRead = result.bytesRead
    } finally {
        await handle.close()
    }
    const startsWith = bytes => bytesRead >= bytes.length && header.subarray(0, bytes.length).equals(Buffer.from(bytes))
    let mime
    if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) mime = 'image/png'
    else if (startsWith([0xff, 0xd8, 0xff])) mime = 'image/jpeg'
    else if (bytesRead >= 6 && ['GIF87a', 'GIF89a'].includes(header.toString('ascii', 0, 6))) mime = 'image/gif'
    else if (bytesRead >= 12 && header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP') mime = 'image/webp'
    else if (startsWith([0x49, 0x49, 0x2a, 0x00]) || startsWith([0x4d, 0x4d, 0x00, 0x2a])) mime = 'image/tiff'
    else if (bytesRead >= 16 && header.toString('ascii', 4, 8) === 'ftyp') {
        const boxSize = header.readUInt32BE(0)
        const brands = [header.toString('ascii', 8, 12)]
        for (let offset = 16; offset + 4 <= Math.min(boxSize, bytesRead); offset += 4) {
            brands.push(header.toString('ascii', offset, offset + 4))
        }
        if (boxSize >= 16 && brands.some(brand => brand === 'avif' || brand === 'avis')) mime = 'image/avif'
    }
    if (!mime || mime !== formats[path.extname(file.originalname).toLowerCase()]) {
        throw uploadError(400, 'The file contents do not match a supported image format')
    }
}

module.exports = function createSubmissionMiddleware(db) {
    const uploadDirectory = path.resolve(__dirname, '../../uploaded_image')
    let activeUploads = 0
    let quotaQueue = Promise.resolve()

    // Serialize quota reads/reservations and commits in this PM2 fork process.
    function withQuotaLock(action) {
        const result = quotaQueue.then(action)
        quotaQueue = result.catch(() => {})
        return result
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDirectory),
        filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname).toLowerCase())
    })
    const receiveFile = multer({
        storage,
        // Busboy reports the limit when it is reached, so allow the exact maximum.
        limits: { fileSize: MAX_UPLOAD_BYTES + 1, files: 1, fields: 7, parts: 8, fieldSize: 4096, fieldNameSize: 100 },
        fileFilter(req, file, cb) {
            const expectedMime = formats[path.extname(file.originalname).toLowerCase()]
            if (!expectedMime || ![expectedMime, 'application/octet-stream'].includes(file.mimetype)) {
                return cb(uploadError(400, 'Upload a JPEG, PNG, GIF, WebP, AVIF or TIFF image'))
            }
            cb(null, true)
        }
    }).single('file')

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many submissions. Please try again later.'
    })

    async function submit(req, res) {
        let reserved = false
        let saved = false
        try {
            await withQuotaLock(async () => {
                if (activeUploads >= MAX_ACTIVE_UPLOADS) {
                    throw uploadError(503, 'Uploads are busy. Please try again later.')
                }
                const pending = await db.queryRecord('submission', {}, { _id: 1 })
                if (!Array.isArray(pending)) throw new Error('Submission quota unavailable')
                if (pending.length + activeUploads >= MAX_SUBMISSIONS) {
                    throw uploadError(503, 'Too many submissions awaiting review. Please try again later.')
                }
                activeUploads += 1
                reserved = true
            })
            if (req.aborted) return
            await fs.promises.mkdir(uploadDirectory, { recursive: true, mode: 0o700 })
            await new Promise((resolve, reject) => {
                receiveFile(req, res, error => {
                    if (!error) return resolve()
                    if (!error.status && !error.code) {
                        return reject(uploadError(400, 'Invalid multipart upload'))
                    }
                    reject(error)
                })
            })
            if (req.aborted) return
            if (!req.file) throw uploadError(400, 'An image file is required')
            if (req.file.size > MAX_UPLOAD_BYTES) throw uploadError(413, 'The image must be 100 MiB or smaller')

            const body = req.body || {}
            for (const field of ['ship_name', 'source']) {
                if (typeof body[field] !== 'string' || !body[field].trim()) {
                    throw uploadError(400, 'Ship name and source are required')
                }
            }
            for (const value of Object.values(body)) {
                if (typeof value !== 'string') throw uploadError(400, 'Invalid submission fields')
            }
            await validateImage(req.file)
            await withQuotaLock(async () => {
                const result = await db.addRecord('submission', {
                    filename: req.file.filename,
                    folder: body.source,
                    char: body.ship_name,
                    uploader: body.email,
                    creator: body.creator
                })
                if (!result) throw new Error('Submission could not be saved')
                saved = true
                activeUploads -= 1
                reserved = false
            })
            res.status(200).send({ status: 'submitted' })
        } catch (error) {
            let status = error.status || 500
            let message = status < 500 || status === 503 ? error.message : 'Internal server error'
            if (error instanceof multer.MulterError) {
                status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
                message = status === 413 ? 'The image must be 100 MiB or smaller' : 'Invalid multipart upload'
            }
            if (!req.aborted && !res.headersSent) res.status(status).send(message)
        } finally {
            if (req.file && !saved) {
                try {
                    await fs.promises.unlink(req.file.path)
                } catch (error) {
                    if (error.code !== 'ENOENT') console.error('Unable to clean up a rejected submission upload')
                }
            }
            if (reserved) {
                await withQuotaLock(() => { activeUploads -= 1 })
            }
        }
    }

    return [limiter, submit]
}

module.exports.MAX_UPLOAD_BYTES = MAX_UPLOAD_BYTES
