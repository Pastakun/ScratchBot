import http from 'http';

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
