const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// IP real do seu painel XUI.one
const target = "http://194.140.198.241:80";

// Middleware de proxy reverso
app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => path, // mantém subpastas
    onProxyReq(proxyReq, req, res) {
      // Remove cabeçalhos que possam identificar o origin
      proxyReq.removeHeader("referer");
      proxyReq.removeHeader("origin");
    },
    onError(err, req, res) {
      console.error("❌ Erro ao conectar ao painel IPTV:", err.message);
      res.status(502).send("Erro 502: Não foi possível conectar ao painel IPTV.");
    }
  })
);

// Inicializa servidor
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Proxy reverso ativo na porta ${port}`);
});
