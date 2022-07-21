const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );

    app.use(
        '/data/assets',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    )
};