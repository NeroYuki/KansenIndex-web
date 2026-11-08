const assert = require('node:assert/strict')
const { once } = require('node:events')
const fs = require('node:fs')
const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')
const { createRequire } = require('node:module')

const backend = path.resolve(__dirname, '..')
const projectRequire = createRequire(path.join(backend, 'App.js'))
const express = projectRequire('express')
const maxBytes = 100 * 1024 * 1024
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4AAAAABJRU5ErkJggg==', 'base64')

function loadModule(relative, contextDirectory, resolveDependency) {
    const module = { exports: {} }
    const context = {
        module, exports: module.exports, require: resolveDependency,
        __dirname: contextDirectory, Buffer, process,
        setInterval: () => 0,
        console: { log() {}, error() {} }
    }
    vm.runInNewContext(fs.readFileSync(path.join(backend, relative), 'utf8'), context, { filename: relative })
    return module.exports
}

async function fixture(t, options = {}) {
    const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'kansen-security-'))
    const articles = path.join(directory, 'backend/data/articles')
    const uploads = path.join(directory, 'uploaded_image')
    await fs.promises.mkdir(articles, { recursive: true })
    await fs.promises.mkdir(path.join(directory, 'frontend/build'), { recursive: true })
    await fs.promises.writeFile(path.join(directory, 'frontend/build/index.html'), '<html>STATIC INDEX</html>')
    await fs.promises.writeFile(path.join(articles, 'valid_article.md'), 'PUBLIC ARTICLE')
    await fs.promises.writeFile(path.join(directory, 'backend/data/outside.md'), 'PRIVATE MARKER')

    const records = options.records || []
    let quotaReads = 0
    const db = {
        async queryRecord(collection) {
            assert.equal(collection, 'submission')
            quotaReads += 1
            if (options.quotaError) throw new Error('database error')
            return [...records]
        },
        async addRecord(collection, record) {
            assert.equal(collection, 'submission')
            if (options.saveError) throw new Error('database error')
            if (options.beforeSave) await options.beforeSave()
            records.push(record)
            return { insertedId: String(records.length) }
        }
    }
    const createSubmission = loadModule('middleware/submission.js', path.join(directory, 'backend/middleware'), projectRequire)
    const shipgirl = loadModule('routes/shipgirl.js', path.join(directory, 'backend/routes'), name => {
        if (name === '../database/database_interaction') return db
        if (name === '../middleware/submission') return createSubmission
        return projectRequire(name)
    })
    const app = loadModule('App.js', path.join(directory, 'backend'), name => {
        if (name === './database/database_connection') return {}
        if (name === './utils/inject_opengraph') return { injectOpenGraph: async () => '<html>REACT PAGE</html>' }
        if (name === './routes/shipgirl') return shipgirl
        if (name === './routes/game') return express.Router()
        return projectRequire(name)
    })
    const server = http.createServer(app)
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    t.after(async () => {
        server.closeAllConnections()
        await new Promise(resolve => server.close(resolve))
        await fs.promises.rm(directory, { recursive: true, force: true })
    })
    return { directory, articles, uploads, records, app,
        port: server.address().port, quotaReads: () => quotaReads }
}

function request(port, pathname, method = 'GET', body, headers = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request({ hostname: '127.0.0.1', port, path: pathname, method, headers }, res => {
            let text = ''
            res.setEncoding('utf8')
            res.on('data', chunk => { text += chunk })
            res.on('end', () => resolve({ status: res.statusCode, body: text, headers: res.headers }))
        })
        req.on('error', reject)
        req.setTimeout(10000, () => req.destroy(new Error('Request timed out')))
        req.end(body)
    })
}

function multipart(file = png, filename = 'example.png', mime = 'image/png', fields = { ship_name: 'Example', source: 'Example franchise' }) {
    const boundary = 'kansen-test-boundary'
    const parts = Object.entries(fields).map(([name, value]) => Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`))
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`))
    parts.push(file, Buffer.from(`\r\n--${boundary}--\r\n`))
    return { body: Buffer.concat(parts), headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` } }
}

function upload(f, file = png, filename, mime, fields) {
    const form = multipart(file, filename, mime, fields)
    return request(f.port, '/api/shipgirl/submission', 'POST', form.body, form.headers)
}

async function uploadSized(f, size) {
    const boundary = 'kansen-size-test'
    const start = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="ship_name"\r\n\r\nExample\r\n--${boundary}\r\nContent-Disposition: form-data; name="source"\r\n\r\nExample\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="large.png"\r\nContent-Type: image/png\r\n\r\n`)
    const end = Buffer.from(`\r\n--${boundary}--\r\n`)
    let req
    const response = new Promise((resolve, reject) => {
        req = http.request({ hostname: '127.0.0.1', port: f.port, path: '/api/shipgirl/submission', method: 'POST',
            headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': start.length + size + end.length } }, res => {
            let body = ''
            res.on('data', chunk => { body += chunk })
            res.on('end', () => resolve({ status: res.statusCode, body }))
        })
        req.on('error', reject)
    })
    req.write(start)
    req.write(png)
    let remaining = size - png.length
    const padding = Buffer.alloc(1024 * 1024)
    while (remaining > 0) {
        const chunk = padding.subarray(0, Math.min(remaining, padding.length))
        if (!req.write(chunk)) await once(req, 'drain')
        remaining -= chunk.length
    }
    req.end(end)
    return response
}

async function uploadFiles(f) {
    try { return await fs.promises.readdir(f.uploads) }
    catch (error) { if (error.code === 'ENOENT') return []; throw error }
}

async function waitFor(condition) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
        if (await condition()) return
        await new Promise(resolve => setTimeout(resolve, 10))
    }
    assert.fail('Expected cleanup did not complete')
}

test('unknown paths and APIs return 404 while real React pages still work', async t => {
    const f = await fixture(t)
    for (const pathname of ['/.env', '/service_account.json', '/.git/config', '/api/v1/env', '/@fs/app/.env', '/missing-page']) {
        assert.equal((await request(f.port, pathname)).status, 404, pathname)
    }
    for (const pathname of ['/', '/ship_list', '/cg_info?id=example', '/about/']) {
        const result = await request(f.port, pathname)
        assert.equal(result.status, 200, pathname)
        assert.equal(result.body, '<html>REACT PAGE</html>')
    }
    assert.equal((await request(f.port, '/api/missing', 'POST')).status, 404)
    assert.equal(f.app.get('trust proxy'), 'loopback')
    assert.equal(f.app.enabled('x-powered-by'), false)
})

test('articles reject encoded traversal and allow valid IDs', async t => {
    const f = await fixture(t)
    assert.equal((await request(f.port, '/api/shipgirl/article/valid_article')).body, 'PUBLIC ARTICLE')
    for (const id of ['..%2foutside', '..%5coutside', '%2e%2e%2foutside', '%252e%252e%252foutside', 'missing', 'valid_article.md']) {
        const result = await request(f.port, '/api/shipgirl/article/' + id)
        assert.equal(result.status, 404, id)
        assert.ok(!result.body.includes('PRIVATE MARKER'))
    }
})

test('article symlinks cannot expose a file outside the article directory', async t => {
    const f = await fixture(t)
    try {
        await fs.promises.symlink(path.join(f.directory, 'backend/data/outside.md'), path.join(f.articles, 'linked.md'))
    } catch (error) {
        if (error.code === 'EPERM') return t.skip('Creating file symlinks requires Windows developer mode or administrator rights')
        throw error
    }
    assert.equal((await request(f.port, '/api/shipgirl/article/linked')).status, 404)
})

test('valid uploads use generated filenames and preserve the success contract', async t => {
    const f = await fixture(t)
    const result = await upload(f)
    assert.equal(result.status, 200)
    assert.deepEqual(JSON.parse(result.body), { status: 'submitted' })
    assert.equal(f.records.length, 1)
    assert.match(f.records[0].filename, /^[a-f0-9]{32}\.png$/)
    assert.equal((await uploadFiles(f)).length, 1)
})

test('spoofed image content, SVG and invalid submission fields are rejected and cleaned up', async t => {
    const f = await fixture(t)
    assert.equal((await upload(f, Buffer.from('not an image'))).status, 400)
    assert.equal((await upload(f, Buffer.from('<svg/>'), 'image.svg', 'image/svg+xml')).status, 400)
    assert.equal((await upload(f, png, 'image.jpg', 'image/jpeg')).status, 400)
    assert.equal((await upload(f, png, 'image.png', 'image/png', { source: 'Example' })).status, 400)
    await waitFor(async () => (await uploadFiles(f)).length === 0)
    assert.equal(f.records.length, 0)
})

test('a full submission queue is rejected before files are written', async t => {
    const f = await fixture(t, { records: Array.from({ length: 100 }, () => ({})) })
    assert.equal((await upload(f)).status, 503)
    assert.equal((await uploadFiles(f)).length, 0)
})

test('database failures fail closed and remove uploaded files', async t => {
    const quota = await fixture(t, { quotaError: true })
    assert.equal((await upload(quota)).status, 500)
    assert.equal((await uploadFiles(quota)).length, 0)
    const save = await fixture(t, { saveError: true })
    assert.equal((await upload(save)).status, 500)
    await waitFor(async () => (await uploadFiles(save)).length === 0)
})

test('concurrent uploads cannot overrun the last pending submission slot', async t => {
    const f = await fixture(t, { records: Array.from({ length: 99 }, () => ({})),
        beforeSave: () => new Promise(resolve => setTimeout(resolve, 30)) })
    const results = await Promise.all([upload(f), upload(f), upload(f)])
    assert.deepEqual(results.map(result => result.status).sort(), [200, 503, 503])
    assert.equal(f.records.length, 100)
    assert.equal((await uploadFiles(f)).length, 1)
})

test('rate limiting rejects excess submission attempts before quota access', async t => {
    const f = await fixture(t)
    for (let index = 0; index < 10; index += 1) {
        assert.equal((await request(f.port, '/api/shipgirl/submission', 'POST')).status, 400)
    }
    assert.equal((await request(f.port, '/api/shipgirl/submission', 'POST')).status, 429)
    assert.equal(f.quotaReads(), 10)
})

test('the 100 MiB file boundary is accepted and an extra byte is rejected', { timeout: 120000 }, async t => {
    const f = await fixture(t)
    assert.equal((await uploadSized(f, maxBytes)).status, 200)
    assert.equal((await uploadSized(f, maxBytes + 1)).status, 413)
    await waitFor(async () => (await uploadFiles(f)).length === 1)
    assert.equal(f.records.length, 1)
})


test('aborted uploads clean partial files and release admission slots', async t => {
    const f = await fixture(t)
    for (let attempt = 0; attempt < 4; attempt += 1) {
        const form = multipart()
        const request = http.request({ hostname: '127.0.0.1', port: f.port,
            path: '/api/shipgirl/submission', method: 'POST', headers: form.headers })
        request.on('error', () => {})
        request.write(form.body.subarray(0, form.body.length - 30))
        await waitFor(async () => (await uploadFiles(f)).length === 1)
        request.destroy()
        await waitFor(async () => (await uploadFiles(f)).length === 0)
    }
    assert.equal((await upload(f)).status, 200)
    assert.equal(f.records.length, 1)
})

test('malformed multipart requests are rejected without bringing down the app', async t => {
    const f = await fixture(t)
    const broken = await request(f.port, '/api/shipgirl/submission', 'POST', Buffer.from('broken form'), {
        'Content-Type': 'multipart/form-data; boundary=missing-boundary'
    })
    assert.equal(broken.status, 400)
    assert.equal((await request(f.port, '/about')).status, 200)
    assert.equal((await upload(f)).status, 200)
})
