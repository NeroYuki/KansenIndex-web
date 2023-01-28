const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const multer  = require('multer')

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

const upload = multer({ storage: storage, limits: {fileSize: 20 * 1000 * 1000}, fileFilter: fileFilter })

router.get('/query', async (req, res) => {
    let query = req.query

    let db_query = {}
    let skip = 0
    const ENTRY_PER_PAGE = Math.min(query.limit ? parseInt(query.limit) : 20, 20)

    //console.log(query)

    if (query.keyword) {
        db_query.filename = {$regex: query.keyword, $options: 'i'}
    }
    if (query.folder) {
        db_query.folder = query.folder
    }
    if (query.page) {
        let pageParse = parseInt(query.page) || 0
        skip = Math.max(0, pageParse - 1) * ENTRY_PER_PAGE
    }
    if (query.keyword_mod) {
        let val = parseInt(query.keyword_mod) || 0
        if ((val >> 0) & 1) {   //char name only
            delete db_query.filename
            db_query.char = {$regex: query.keyword, $options: 'i'}
        }
        if ((val >> 1) & 1) {   //modifier name only
            db_query.filename = {$regex: "_.*" + query.keyword, $options: 'i'}
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
        if ((val >> 5) & 1) {   //alt form only
            db_query.is_base = false
        }
    }

    //console.log(db_query, skip)

    let query_res = await db.queryRecordLimit('shipgirl', db_query, ENTRY_PER_PAGE, {}, {}, skip)
        .catch(e => {
            res.status(500).send("Internal server error")
        })
    if (!query_res) return

    //if (query)
    return res.status(200).send(query_res)
})

router.get('/get_info/:id', (req, res) => {
    return res.status(501).send("Not implemented") 
})

router.get('/random', async (req, res) => {
    const db_agg = [
        {$match: {}},
        {$sample: {size: 1}}
    ]
    let random_res = await db.aggregateRecord('shipgirl', db_agg)

    return res.status(200).send(random_res)
})

router.post('/submission', upload.single('file'), async (req, res) => {
    let file = req.file
    let body = req.body

    if (!file || !body) {
        return res.status(400).send("Bad request")
    }

    // count number of submission entry in submission collection
    let count_res = await db.aggregateRecord('submission', [
        {$match: {}},
        {$count: "count"}
    ]).catch(e => {
        res.status(500).send("Internal server error")
    })

    if (!count_res) return
    if (count_res[0].count > 100) {
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


module.exports = router