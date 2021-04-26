const { Logger } = require('heroku-logger');

function createLogger (...modules) {
  return new Logger({
    color: true,
    prefix: `[${modules.join('][')}] `
  });
}

module.exports = {
  createLogger
};
