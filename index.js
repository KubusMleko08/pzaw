import http from 'http';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 3000;
const basePath = new URL('.', import.meta.url).pathname;

const htmlFile = path.resolve(basePath, 'public.html');
const iconFile = path.resolve(basePath, 'favicon.ico');

const respond = (res, status, headers, content) => {
  res.writeHead(status, headers);
  res.end(content);
};

const requestHandler = (req, res) => {
  const { url, method } = req;

  if (url === '/') {
    if (method !== 'GET') {
      return respond(res, 405, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Allow': 'GET'
      }, '405 Method Not Allowed');
    }

    fs.readFile(htmlFile, 'utf8', (error, html) => {
      if (error) {
        return respond(res, 500, {
          'Content-Type': 'text/plain; charset=utf-8'
        }, '500 Internal Server Error');
      }

      respond(res, 200, {
        'Content-Type': 'text/html; charset=utf-8'
      }, html);
    });
    return;
  }

  if (url === '/favicon.ico') {
    if (method !== 'GET') {
      return respond(res, 405, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Allow': 'GET'
      }, '405 Method Not Allowed');
    }

    fs.readFile(iconFile, (err, ico) => {
      if (err) {
        return respond(res, 404, {
          'Content-Type': 'text/plain; charset=utf-8'
        }, '404 Not Found');
      }

      respond(res, 200, {
        'Content-Type': 'image/vnd.microsoft.icon'
      }, ico);
    });
    return;
  }

  respond(res, 404, {
    'Content-Type': 'text/plain; charset=utf-8'
  }, '404 Not Found');
};

const app = http.createServer(requestHandler);

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
