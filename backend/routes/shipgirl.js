const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const multer  = require('multer')
const { ObjectId } = require('mongodb')

const jsonParser = express.json()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploaded_image/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

function fileFilter (req, file, cb) {
    // only allow image file to go through
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, limits: {fileSize: 20 * 1000 * 1000 * 1000}, fileFilter: fileFilter })

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

router.get('/query', async (req, res) => {
    let query = req.query

    let db_query = {}
    let skip = 0
    const ENTRY_PER_PAGE = Math.max(query.limit ? Math.min(parseInt(query.limit), 100) : 20, 10)

    // console.log(query)

    if (query.keyword) {
        db_query.$or = [
            {filename: {$regex: escapeRegExp(query.keyword), $options: 'i'}},
            {alias: {$regex: escapeRegExp(query.keyword), $options: 'i'}}
        ]
    }
    if (query.folder) {
        db_query.folder = query.folder
    }
    if (query.nation) {
        if (query.nation === "Unknown") {
            db_query.nation = null
        }
        else {
            db_query.nation = query.nation
        }
    }
    if (query.type) {
        if (query.type === "Unknown") {
            db_query.ship_type = null
        }
        else {
            db_query.ship_type = query.type
        }
    }
    if (query.page) {
        let pageParse = parseInt(query.page) || 0
        skip = Math.max(0, pageParse - 1) * ENTRY_PER_PAGE
    }
    if (query.keyword_mod) {
        let val = parseInt(query.keyword_mod) || 0
        if ((val >> 0) & 1) {   //char name only
            delete db_query.$or
            db_query.$or = [
                {char: {$regex: (query.strict ? "^" : "") + escapeRegExp(query.keyword) + (query.strict ? "$" : ""), $options: 'i'}},
                {alias: {$regex: (query.strict ? "^" : "") + escapeRegExp(query.keyword) + (query.strict ? "$" : ""), $options: 'i'}}
            ]
        }
        if ((val >> 1) & 1) {   //modifier name only
            delete db_query.$or
            db_query.filename = {$regex: "_.*" + escapeRegExp(query.keyword), $options: 'i'}
        }
    }
    if (query.construct_mod) {
        //TODO: populate data before even attempt this
    }
    if (query.alt_outfit_mod) {
        let val = parseInt(query.alt_outfit_mod) || 0
        if ((val >> 0) & 1) {   //base form only
            db_query.is_base = true
        }
        if ((val >> 1) & 1) {   //oath form only
            db_query.is_oath = true
        }
        if ((val >> 2) & 1) {   //retrofit form only
            db_query.is_retrofit = true
        }
        if ((val >> 3) & 1) {   //damage form only
            db_query.is_damage = true
        }
        if ((val >> 4) & 1) {   //skin form only
            db_query.is_outfit = true
        }
        if ((val >> 5) & 1) {   //alt form only
            db_query.is_base = false
        }
        if ((val >> 6) & 1) {
            db_query.is_censored = true
        }
    }

    // console.dir(db_query, {depth: null})

    let query_res = await db.queryRecordLimit('shipgirl', db_query, ENTRY_PER_PAGE, {}, {}, skip)
        .catch(e => {
            res.status(500).send("Internal server error")
        })
    if (!query_res) {
        return res.status(404).send("Not Found")
    }

    //if (query)
    return res.status(200).send(query_res)
})

router.get('/cg/:id', (req, res) => {
    let id = req.params.id
    if (!ObjectId.isValid(id))
       return res.status(404).send("Not found")
       
    db.queryRecord('shipgirl', {_id: ObjectId(id)})
        .then(db_res => {
            if (!db_res || !db_res.length) {
                return res.status(404).send("Not found")
            }
            return res.status(200).send(db_res[0])
        })
        .catch(e => {
            res.status(500).send("Internal server error")
        })
})

router.get('/random', async (req, res) => {
    const db_agg = [
        {$match: {}},
        {$sample: {size: 1}}
    ]
    let random_res = await db.aggregateRecord('shipgirl', db_agg)

    return res.status(200).send(random_res)
})

router.post('/get_fav', jsonParser, async (req, res) => {
    const { char, folder, fav } = req.body

    if (!char || !folder) {
        return res.status(400).send("Bad request")
    }

    let db_res = await db.queryRecord('favorite', {char: char, folder: folder})

    if (!db_res || !db_res.length) {
        // create new entry
        db_create_res = await db.addRecord('favorite', {char: char, folder: folder, fav: []})
    }

    return res.status(200).send({
        count: db_res[0]?.fav.length || 0,
        is_fav: db_res[0]?.fav.findIndex(e => e.id === fav) > -1
    })
})

router.post('/toggle_fav', jsonParser, async (req, res) => {
    const { char, folder, fav } = req.body

    if (!char || !folder || !fav) {
        return res.status(400).send("Bad request")
    }

    let db_res = await db.queryRecord('favorite', {char: char, folder: folder})

    let fav_list = db_res[0]?.fav || []
    const index = fav_list.findIndex(e => e.id === fav)
    const isFav =  index > -1
    if (isFav) {
        fav_list.splice(index, 1)
    }
    else {
        fav_list.push({id: fav, date: new Date()})
    }

    await db.editRecords('favorite', {char: char, folder: folder}, {$set: {fav: fav_list}}, {upsert: true})

    return res.status(200).send({
        count: fav_list.length || 0,
        is_fav: !isFav
    })
})

router.post('/submission', upload.single('file'), async (req, res) => {
    let file = req.file
    let body = req.body

    if (!file || !body) {
        return res.status(400).send("Bad request")
    }

    // count number of submission entry in submission collection
    let check_res = await db.queryRecord('submission', {})

    let count_res = check_res?.length ?? 0

    if (count_res > 100) {
        return res.status(400).send("Too many submission")
    }

    let db_res = await db.addRecord('submission', {
        filename: file.filename,
        folder: body.source,
        char: body.ship_name,
        uploader: body.email,
        creator: body.creator,
    }).catch(e => {
        res.status(500).send("Internal server error")
    })

    if (!db_res) return

    return res.status(200).send({
        status: "submitted"
    })
})

// TODO: cache the result
router.get('/bote_fav_lb', async (req, res) => {
    let db_res = await db.aggregateRecord('favorite', [
        { $match: {} },
        {
            $project: {
                char: 1,
                folder: 1,
                fav: { $size: '$fav' }
            }
        },
        { $sort: { fav: -1 } },
        { $limit: 40 }
    ]).catch(e => {
        res.status(500).send("Internal server error")
    })

    if (!db_res) return []

    const db_res_final = []

    // get base cg of each bote
    for (let e of db_res) {
        if (db_res_final.length >= 20) break
        const base_cg = await db.queryRecord('shipgirl', {char: e.char, folder: e.folder, is_base: true}).catch(err => {})
        if (base_cg && base_cg.length) {
            // mutate db_res entry to include base cg
            db_res_final.push({
                ...e,
                base_cg: base_cg[0].full_dir
            }) 
        }
    }

    return res.status(200).send(db_res_final)
})


module.exports = router