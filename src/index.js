const http = require('http');

const routes = require('./routes')

const server = http.createServer((request, response) => {
  const route = routes.find(routeObj =>
    routeObj.endpoint === request.url && routeObj.method === request.method
  );



  if (route) {
    route.handler(request, response);
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${request.url}`);
  }
});

server.listen(3000, () => console.log('Server started on http://localhost:3000'));
