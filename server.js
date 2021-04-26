require('dotenv').config();
const logger = require('./lib/logger').createLogger('server');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const app = require('./app');

const port = process.env.PORT || 3000;

// start the server!
logger.info('Hit it!');

let serverName, server;
if (process.env.NODE_ENV === 'production') {
  // Heroku: create simple HTTP server
  serverName = 'HTTP';
  server = http.createServer(app);
} else {
  // local: create HTTPS server with self-signed cert
  serverName = 'HTTPS';
  const certOptions = {
    key: fs.readFileSync(path.resolve('./cert/demo.key')),
    cert: fs.readFileSync(path.resolve('./cert/demo.crt'))
  };
  server = https.createServer(certOptions, app);  
}

server.listen(port, () => {
  logger.info(`${serverName} server, listening on port ${port}`);
});
