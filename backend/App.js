const express = require('express')
const path = require('path');
const cors = require("cors")
const compression = require("compression")

const databaseConn = require('./database/database_connection')
const { injectOpenGraph }= require('./utils/inject_opengraph')

const game_route = require('./routes/game')
const shipgirl_route = require('./routes/shipgirl')

const app = express()
const port = Number(process.env.PORT || 5001)
const host = '127.0.0.1'

// nginx supplies one client address after restoring trusted Cloudflare IPs.
app.set('trust proxy', 'loopback')
app.disable('x-powered-by')

app.use(cors({
    origin: ['https://kansenindex.dev', 'https://www.kansenindex.dev']
}));
app.use(compression());

app.get('/', async (req, res, next) => {
    try {
        res.send(await injectOpenGraph('', {}))
    } catch (error) {
        next(error)
    }
})

app.get('/api/test', (req, res) => {
    res.send('Hello World! From neroyuki\'s droplet')
})

app.use('/api/shipgirl', shipgirl_route)
app.use('/api/game', game_route)

app.get('/api/ip', (request, response) => response.send(request.ip))

app.use('/api', (req, res) => {
    res.status(404).send('Unknown API call')
})

app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.use('/data/assets', express.static(path.join(__dirname, '/data/assets')))
app.use('/data/thumbs', express.static(path.join(__dirname, '/data/thumbs')))

const pagePaths = new Set([
    '/', '/game_list', '/about', '/ship_list', '/project',
    '/game_info', '/ship_info', '/cg_info', '/top_fav'
])

app.get('*', async (req, res, next) => {
    const pagePath = req.path.replace(/\/+$/, '') || '/'
    if (!pagePaths.has(pagePath)) {
        return res.status(404).send('Not found')
    }
    try {
        res.send(await injectOpenGraph(pagePath, req.query))
    } catch (error) {
        next(error)
    }
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    const status = error.status === 400 ? 400 : 500
    res.status(status).send(status === 400 ? 'Bad request' : 'Internal server error')
})

module.exports = app

if (require.main === module) {
    app.listen(port, host, () => {
        console.log(`Application listening at http://${host}:${port}`)
        databaseConn.initConnection(() => {})
    })
}
