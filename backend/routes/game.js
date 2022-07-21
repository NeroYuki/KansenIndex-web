const express = require('express')
const router = express.Router()
const franchise_data = require('../data/franchise_list.json')

router.get('/list_all', (req, res) => {
    let fetch_res = franchise_data.map((val) => {return {id: val.id, name: val.name, desc: val.desc, icon_image: val.icon_image}})

    res.status(200).send(fetch_res)
})

router.get('/info/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(400).send("Bad request")
    }

    let fetch_res = franchise_data.find((val) => val.id === req.params.id)

    if (!res) {
        return res.status(200).send({})
    }
    else {
        return res.status(200).send(fetch_res)
    }
})

module.exports = router