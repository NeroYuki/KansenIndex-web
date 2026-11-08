/*
 * Refresh cg_info.count in data/franchise_list.json from MongoDB.
 *
 * Usage:
 *   node scripts/update_franchise_cg_counts.js            # apply
 *   node scripts/update_franchise_cg_counts.js --dry-run  # preview only
 *
 * This is also called by scripts/import_shipgirl_db.js after a successful
 * --apply import, so the franchise counts stay in sync with the shipgirl
 * collection.
 */

const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const DB_NAME = 'kansen_index'
const COLLECTION = 'shipgirl'
const FRANCHISE_PATH = path.join(__dirname, '..', 'data', 'franchise_list.json')

async function collectCounts(db) {
    const rows = await db.collection(COLLECTION).aggregate([
        { $group: { _id: '$folder', count: { $sum: 1 } } },
    ]).toArray()

    const counts = {}
    for (const row of rows) {
        counts[row._id] = row.count
    }
    return counts
}

async function updateFranchiseCounts(db, options = {}) {
    const apply = options.apply !== false
    const counts = await collectCounts(db)
    const franchises = JSON.parse(fs.readFileSync(FRANCHISE_PATH, 'utf8'))

    let updated = 0
    let unchanged = 0
    const missing = []
    const asOf = new Date().toISOString().slice(0, 10)

    for (const franchise of franchises) {
        if (!franchise.cg_info) continue

        const next = counts[franchise.name] || 0
        const previous = franchise.cg_info.count
        franchise.cg_info.count = next
        franchise.cg_info.as_of = asOf

        if (previous === next) {
            unchanged += 1
        }
        else {
            updated += 1
        }

        if (next === 0 && !counts[franchise.name]) {
            missing.push(franchise.name)
        }
    }

    if (apply) {
        fs.writeFileSync(FRANCHISE_PATH, JSON.stringify(franchises, null, 2) + '\n', 'utf8')
    }

    return { apply, updated, unchanged, missing, counts }
}

async function main() {
    const dryRun = process.argv.includes('--dry-run')
    const client = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/')
    try {
        const db = client.db(DB_NAME)
        const result = await updateFranchiseCounts(db, { apply: !dryRun })
        console.log(dryRun ? 'Dry run only; no file written.' : `Updated ${FRANCHISE_PATH}`)
        console.log('changed:', result.updated, 'unchanged:', result.unchanged)
        console.log('folders with no rows:', result.missing)
        for (const [folder, count] of Object.entries(result.counts).sort()) {
            console.log(`  ${folder}: ${count}`)
        }
    }
    finally {
        await client.close()
    }
}

module.exports = { updateFranchiseCounts, collectCounts }

if (require.main === module) {
    main().catch((error) => {
        console.error(error)
        process.exit(1)
    })
}
