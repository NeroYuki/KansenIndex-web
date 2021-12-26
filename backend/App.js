const express = require('express')
const path = require('path');
const cors = require("cors")

const app = express()
const port = 5000

app.use(cors({
    origin: ['https://kansenindex.xyz', 'https://www.kansenindex.xyz']
}));
app.use(express.static(path.join(__dirname, '/../frontend/build')));

app.get('/api/test', (req, res) => {
    res.send('Hello World! From neroyuki\'s droplet')
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
})