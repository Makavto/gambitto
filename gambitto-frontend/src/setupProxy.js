const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  function relayRequestHeaders(proxyReq, req) {
    Object.keys(req.headers).forEach(function (key) {
      proxyReq.setHeader(key, req.headers[key]);
    });
  }

  function relayResponseHeaders(proxyRes, req, res) {
    Object.keys(proxyRes.headers).forEach(function (key) {
      res.append(key, proxyRes.headers[key]);
    });
  }

  app.use(
    '/api/',
    createProxyMiddleware({
      target:
        process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api',
      pathRewrite: {
        '^/api/': '/',
      },
      cookiePathRewrite: {
        '*': '/api',
      },
      changeOrigin: true,
      onProxyReq: relayRequestHeaders,
      onProxyRes: relayResponseHeaders,
    })
  );
};
