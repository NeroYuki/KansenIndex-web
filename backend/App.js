const express = require('express')
const path = require('path');
const cors = require("cors")

const databaseConn = require('./database/database_connection')

const game_route = require('./routes/game')
const shipgirl_route = require('./routes/shipgirl')

const app = express()
const port = 5000


app.use(cors({
    origin: ['https://kansenindex.xyz', 'https://www.kansenindex.xyz']
}));

app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.use('/data/assets', express.static(path.join(__dirname, '/data/assets')))
app.use('/data/thumbs', express.static(path.join(__dirname, '/data/thumbs')))

app.get('/api/test', (req, res) => {
    res.send('Hello World! From neroyuki\'s droplet')
})

app.use('/api/shipgirl', shipgirl_route)
app.use('/api/game', game_route)

app.get('/api*', (req, res) => {
    res.send('Unknown API call')
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
    databaseConn.initConnection(() => {}) 
})