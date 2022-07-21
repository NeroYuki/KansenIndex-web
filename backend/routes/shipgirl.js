const express = require('express')
const router = express.Router()

router.get('/query', (req, res) => {
    return res.status(501).send("Not implemented")
})

router.get('/get_info/:id', (req, res) => {
    return res.status(501).send("Not implemented") 
})

module.exports = router