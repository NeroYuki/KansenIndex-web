const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')

router.get('/query', async (req, res) => {
    let query = req.query

    let db_query = {}
    let skip = 0
    const ENTRY_PER_PAGE = 20

    if (query.keyword) {
        db_query.filename = {$regex: query.keyword, $options: 'i'}
    }
    if (query.page) {
        let pageParse = parseInt(req.query.page)
        if (!Number.isNaN(pageParse)) {
            skip = Math.max(0, pageParse - 1) * ENTRY_PER_PAGE
        }
    }

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