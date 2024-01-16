import http from 'http';
import httpProxy from 'http-proxy';

// プロキシサーバーを作成
const proxy = httpProxy.createProxyServer({});

// リクエストがあるたびに呼ばれるイベントハンドラーを設定
const server = http.createServer((req, res) => {
  console.log(`Proxying request to: ${req.url}`);

  // リクエストをプロキシに転送
  proxy.web(req, res, { target: req.url, changeOrigin: true });
});

// プロキシサーバーをポート3000で起動
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
