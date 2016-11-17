const winston = require('winston')
const config = require('./configurator').getConfig().app.logger

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      level: config.level,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
})

// Logger error handling
logger.on('error', err => console.error('Logger error:', err))

module.exports = logger

