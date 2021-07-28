const express = require('express');
const { renderToString } = require('react-dom/server');
// 获取要SSR的文件
const SSR = require('../dist/search-server');

const renderMarkup = (str) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root">${str}</div>
</body>
</html>
  `;

const server = (port) => {
  const app = express();
  app.use(express.static('dist')); // 将dist设置为静态目录

  app.get('/search', (req, res) => {
    const str = renderToString(SSR); // 生产了字符串
    const html = renderMarkup(str)
    res.status(200).send(html); // 这里
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`${port}  success`);
  });
};

server(3001);


