const fs = require('fs')
const path = require('path')
const db = require('../database/database_interaction')
const { ObjectId } = require('mongodb')

const entryHtml = fs.readFileSync(path.join(__dirname + '/../../frontend/build/index.html'), 'utf8')

module.exports.injectOpenGraph = (path, query) => {
    return new Promise(async (resolve, reject) => {
        // inject open graph meta tags
        let result = entryHtml
        let og_title = 'KansenIndex'
        let og_description = 'The all-in-one index of (almost) all franchise involving anthropomorphic warships'
        let og_image = ''
    
        // https://kansenindex.dev/cg_info?id=6430948aacfdfe2c13dcc90b
        if (path.startsWith('/cg_info') && query.id && ObjectId.isValid(query.id)) {
            const id = query.id
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
        else if (path.startsWith('/ship_list')) {
            og_title = `KansenIndex - Ship Index`
            og_description = `Query our vast anthropomorphic warships data here`
        }
        else if (path.startsWith('/top_fav')) {
            og_title = `KansenIndex - Top Favorite`
            og_description = `Top 20 of the site most loved anthropomorphic warships by visitors`
        }
        result = result.replace(/\$OG_TITLE/g, og_title).replace(/\$OG_DESCRIPTION/g, og_description).replace(/\$OG_IMAGE/g, og_image)
        resolve(result)
    })
}