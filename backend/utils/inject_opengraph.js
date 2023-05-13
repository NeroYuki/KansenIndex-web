const fs = require('fs')
const path = require('path')
const db = require('../database/database_interaction')
const { ObjectId } = require('mongodb')

const entryHtml = fs.readFileSync(path.join(__dirname + '/../../frontend/build/index.html'), 'utf8')

module.exports.injectOpenGraph = async (path) => {
    // inject open graph meta tags
    let result = entryHtml
    let og_title = 'KansenIndex'
    let og_description = 'The all-in-one index of (almost) all franchise involving anthropomorphic warships'
    let og_image = ''

    // https://kansenindex.dev/cg_info?id=6430948aacfdfe2c13dcc90b
    if (path.startsWith('/cg_info')) {
        let id = path.split('=')[1]
        let db_res = await db.queryRecord('shipgirl', {_id: ObjectId(id)}).catch(e => {})
        if (db_res && db_res.length) {
            const {char, modifier, folder, full_dir} = db_res[0]
            const thumb_dir = full_dir.replace('./data/assets/', 'data/thumbs/')
            og_title = `KansenIndex - ${char}`
            og_description = `CG Info for ${char} - ${modifier} from ${folder}`
            og_image = `https://kansenindex.dev/${thumb_dir}`
        }
        else {
            og_description = 'CG Info not found'
        }
    }
    result = result.replace('$OG_TITLE', og_title).replace('$OG_DESCRIPTION', og_description).replace('$OG_IMAGE', og_image)
    return result
}