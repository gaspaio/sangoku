const winston = require('winston')
const Elasticsearch = require('winston-elasticsearch')
const config = require('./configurator').getConfig().app.logger

const defaultTransports = [new winston.transports.Console({
  handleExceptions: true,
  level: config.level,
  json: false,
  colorize: true
})]

const actionTransports = [new winston.transports.Console({
  handleExceptions: false,
  level: config.level,
  json: false,
  colorize: true
})]

if (config.elasticsearch.on) {
  defaultTransports.push(
    new Elasticsearch({
      level: config.level,
      messageType: 'default',
      clientOpts: {
        host: config.elasticsearch.host
      }
    })
  )
  actionTransports.push(
    new Elasticsearch({
      level: config.level,
      messageType: 'actions',
      clientOpts: {
        host: config.elasticsearch.host
      }
    })
  )
}

const def = new winston.Logger({
  transports: defaultTransports,
  exitOnError: false,
  emitErrors: true
})

const actions = new winston.Logger({
  transports: actionTransports,
  exitOnError: false,
  emitErrors: true
})

// Logger error handling
def.on('error', err => console.error('Logger Default error:', err))
actions.on('error', err => console.error('Logger Actions error:', err))

module.exports = { actions, default: def  }

