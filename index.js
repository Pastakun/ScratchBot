import http from 'http';
import httpProxy from 'http-proxy';

http.get('http://api.ipify.org/?format=json', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const ip = JSON.parse(data).ip;
    console.log('IPアドレス:', ip);
  });
}).on('error', (error) => {
  console.error('IPアドレスを取得できませんでした。', error);
});


// プロキシサーバーを作成
const proxy = httpProxy.createProxyServer({});

// リクエストがあるたびに呼ばれるイベントハンドラーを設定
const server = http.createServer((req, res) => {
  console.log(`Proxying request to: ${req.url}`);

  // リクエストをプロキシに転送
  proxy.web(req, res, { target: req.url, changeOrigin: true });
});

// プロキシサーバーをポート8000で起動
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
