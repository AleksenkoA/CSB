const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const proxyMiddleware = createProxyMiddleware({
    target: "https://api.csb-admin.com/api/v1",
    changeOrigin: true,
    secure: true,
    timeout: 30000,
    pathRewrite: {
      "^/api/v1": "",
    },
    onError: (err, req, res) => {
      res.status(500).send("Proxy error");
    },
  });

  app.use("/api/v1", proxyMiddleware);
};
