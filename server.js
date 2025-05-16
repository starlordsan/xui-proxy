const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { HttpsProxyAgent } = require("https-proxy-agent");

const app = express();

// IP real do seu painel IPTV
const target = "http://194.140.198.241:80";

// Lista de proxies IPRoyal
const proxyList = [
  "http://14a524eab7130:6c60b71cdb@85.209.123.226:12323",
  "http://14a524eab7130:6c60b71cdb@136.175.224.19:12323",
  "http://14a524eab7130:6c60b71cdb@163.5.103.135:12323",
  "http://14a524eab7130:6c60b71cdb@191.101.246.254:12323",
  "http://14a524eab7130:6c60b71cdb@185.238.142.81:12323",
  "http://14a524eab7130:6c60b71cdb@163.5.146.7:12323"
];

// Função para escolher proxy aleatório
function getRandomProxy() {
  const index = Math.floor(Math.random() * proxyList.length);
  return proxyList[index];
}

app.use(
  "/",
  (req, res, next) => {
    const proxyUrl = getRandomProxy();
    const agent = new HttpsProxyAgent(proxyUrl);

    console.log("➡️ Usando proxy:", proxyUrl);

    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path) => path,
      agent,
      onError(err, req, res) {
        console.error("❌ Erro de proxy:", err.message);
        if (!res.headersSent) {
          res.status(502).send("Erro 502: Falha ao conectar usando proxy.");
        }
      },
    });

    proxy(req, res, next);
  }
);

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🔁 Proxy reverso com rotação IPRoyal rodando na porta ${port}`);
});
