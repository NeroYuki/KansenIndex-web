const express = require('express')
const path = require('path');
const cors = require("cors")

const game_route = require('./routes/game')
const ship_route = require('./routes/ship')

const app = express()
const port = 5000

app.use(cors({
    origin: ['https://kansenindex.xyz', 'https://www.kansenindex.xyz']
}));

app.use(express.static(path.join(__dirname, '/../frontend/build')));

app.get('/api/test', (req, res) => {
    res.send('Hello World! From neroyuki\'s droplet')
})

app.use('/api/ship', ship_route)
app.use('/api/game', game_route)

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
})