const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://localhost:3000',
            changeOrigin: true,
            secure: false
        })
    );
    app.use(
        '/auth/me',
        createProxyMiddleware({
            target: 'https://localhost:3000',
            changeOrigin: true,
            secure: false
        })
    );
    app.use(
        '/socket.io',
        createProxyMiddleware({
            target: 'https://localhost:3000',
            changeOrigin: true,
            secure: false
        })
    );
};