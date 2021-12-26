const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World! From neroyuki\'s droplet')
})

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
})