const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);
const appLogStream = fs.createWriteStream(
  path.join(logsDir, 'app.log'),
  { flags: 'a' }
);

const requestLogger = morgan('combined', { stream: accessLogStream });

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] ${timestamp}: ${message}\n`;
    console.log(logMessage.trim());
    appLogStream.write(logMessage);
  },
  error: (message, error = '') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[ERROR] ${timestamp}: ${message} ${error ? `- ${error.stack || error}` : ''}\n`;
    console.error(logMessage.trim());
    appLogStream.write(logMessage);
  },
};

module.exports = { requestLogger, logger };