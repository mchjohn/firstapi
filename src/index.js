const http = require('http');
const { URL } = require('url');

const routes = require('./routes')

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndPoint = pathname.split('/').filter(Boolean);

  if (splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`;
    id = splitEndPoint[1];
  }

  const route = routes.find(routeObj =>
    routeObj.endpoint === pathname && routeObj.method === request.method
  );

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    }

    route.handler(request, response);
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${pathname}`);
  }
});

server.listen(3000, () => console.log('Server started on http://localhost:3000'));
