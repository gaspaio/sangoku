const express = require('express')
const errorHandler = require('errorhandler')
const compression = require('compression')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const apiRoutes = require('./routes/api')
const logger = require('./services/logger')
const requestLogger = require('./middlewares/RequestLogger')

require('colors')

const app = express()
const config = require('./services/configurator').getConfig()

mongoose.Promise = global.Promise
mongoose.connect(config.app.mongodb)
mongoose.connection.on('connected', () => {
  logger.info(`MongoDB connection ${'ok'.green}.`)
})
mongoose.connection.on('error', err => {
  logger.error(`Mongo connection error - ${err.toString().red}`)
  process.exit(1)
})

app.use(compression())
app.use(requestLogger())
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/', apiRoutes)

app.use(function (req, res) {
  res.status(404).json({ error: 'Not found.' })
})

if (config.env === 'development') {
  // only use in development
  app.use(errorHandler())
}

app.listen(config.app.server.port, () => {
  logger.info(`Sangoku server listening on port ${config.app.server.port.toString().green} in ${config.env.green} env`)
})
