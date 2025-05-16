const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Painel real
const target = "http://194.140.198.241:80";

// Proxy todas as rotas
app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => path, // mantém subpastas
    onProxyReq(proxyReq, req, res) {
      // opcional: remova headers que revelem a origem
      proxyReq.removeHeader("referer");
      proxyReq.removeHeader("origin");
    },
  })
);

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Proxy rodando na porta ${port}`);
});
