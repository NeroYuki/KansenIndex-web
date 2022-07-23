const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')

router.get('/query', async (req, res) => {
    let query = req.query

    let db_query = {}
    let skip = 0
    const ENTRY_PER_PAGE = 20

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

module.exports = router