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
        '/me',
        createProxyMiddleware({
            target: 'https://localhost:3000',
            changeOrigin: true,
            secure: false
        })
    );

    app.use(
        '/login',
        createProxyMiddleware({
            target: 'https://localhost:3000',
            changeOrigin: true,
            secure: false
        })
    );

    app.use(
        '/logout',
        createProxyMiddleware({
            target: 'https://localhost:3000',
            changeOrigin: true,
            secure: false
        })
    );
};
