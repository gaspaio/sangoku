let config = null

module.exports.init = () => {
  // Load env vars
  require('dotenv').config()
  config = require(`../../config/${process.env.NODE_ENV}.json`)

  // Put env vars in main config
  config.env = process.env.NODE_ENV
  config.app.mongodb = process.env.MONGODB_URI
  config.app.server = { port: process.env.SERVER_PORT }
  config.app.logger.level = process.env.LOGGER_LEVEL
  config.app.logger.elasticsearch.host = process.env.ELASTICSEARCH

  return config
}

module.exports.getConfig = () => {
  if (!config) this.init()
  return config
}

