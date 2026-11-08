/*
 * Refresh the local dev MongoDB `kansen_index.shipgirl` collection from the
 * generated data/shipgirl_list_db_new.json.
 *
 * Usage:
 *   node scripts/import_shipgirl_db.js          # inspect only
 *   node scripts/import_shipgirl_db.js --apply  # backup + replace
 */

const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const DB_NAME = 'kansen_index'
const COLLECTION = 'shipgirl'
const JSON_PATH = path.join(__dirname, '..', 'data', 'shipgirl_list_db_new.json')
const APPLY = process.argv.includes('--apply')
const CHUNK_SIZE = 500

function timestamp() {
    return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_')
}

async function summarize(db) {
    const col = db.collection(COLLECTION)
    const count = await col.countDocuments()
    const withM3d = await col.countDocuments({ m3d: { $exists: true } })
    const withM3dNotNull = await col.countDocuments({ m3d: { $ne: null } })
    const byFolder = await col.aggregate([
        { $match: { m3d: { $ne: null } } },
        { $group: { _id: '$folder', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]).toArray()
    const sample = await col.findOne({ m3d: { $ne: null } })
    const indexes = await col.indexes().catch(() => [])
    return { count, withM3d, withM3dNotNull, byFolder, sample, indexes }
}

async function main() {
    if (!fs.existsSync(JSON_PATH)) {
        throw new Error(`missing ${JSON_PATH}`)
    }
    const docs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
    if (!Array.isArray(docs)) {
        throw new Error('shipgirl_list_db_new.json is not an array')
    }

    const client = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/')
    try {
        const db = client.db(DB_NAME)
        const before = await summarize(db)
        const collections = (await db.listCollections().toArray()).map((entry) => entry.name).sort()
        console.log('--- current collection ---')
        console.log('count:', before.count, 'with m3d field:', before.withM3d, 'non-null m3d:', before.withM3dNotNull)
        console.log('by folder:', before.byFolder)
        console.log('indexes:', before.indexes.map((index) => index.name))
        console.log('sample keys:', before.sample ? Object.keys(before.sample).sort() : null)
        console.log('collections:', collections)

        console.log('--- source json ---')
        console.log('docs:', docs.length, 'with m3d:', docs.filter((doc) => doc.m3d).length)

        if (!APPLY) {
            console.log('\nDry run only. Re-run with --apply to backup and replace.')
            return
        }

        const backupName = `${COLLECTION}_backup_${timestamp()}`
        console.log(`\nBacking up to ${backupName} ...`)
        await db.collection(COLLECTION).aggregate([{ $out: backupName }]).toArray()
        const backupCount = await db.collection(backupName).countDocuments()
        console.log('backup docs:', backupCount)
        if (backupCount !== before.count) {
            throw new Error(`backup count mismatch: ${backupCount} !== ${before.count}`)
        }

        console.log('Clearing collection ...')
        await db.collection(COLLECTION).deleteMany({})

        console.log('Inserting ...')
        for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
            await db.collection(COLLECTION).insertMany(docs.slice(i, i + CHUNK_SIZE), { ordered: false })
            if ((i + CHUNK_SIZE) % 5000 === 0 || i + CHUNK_SIZE >= docs.length) {
                console.log(`  inserted ${Math.min(i + CHUNK_SIZE, docs.length)} / ${docs.length}`)
            }
        }

        const after = await summarize(db)
        console.log('\n--- updated collection ---')
        console.log('count:', after.count, 'with m3d field:', after.withM3d, 'non-null m3d:', after.withM3dNotNull)
        console.log('by folder:', after.byFolder)

        const spot = await db.collection(COLLECTION).findOne({ folder: 'Azur Lane', filename: 'Saratoga_Default.png' })
        console.log('AL spot check:', spot ? { filename: spot.filename, m3d: spot.m3d } : 'MISSING')

        if (after.count !== docs.length) {
            throw new Error(`post-import count mismatch: ${after.count} !== ${docs.length}`)
        }
        console.log(`\nDone. Backup collection: ${backupName}`)
    }
    finally {
        await client.close()
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
