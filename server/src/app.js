const express = require('express')
const errorHandler = require('errorhandler')
const compression = require('compression')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const apiRoutes = require('./routes/api')
const logging = require('./services/logging')
const requestLogger = require('./middlewares/RequestLogger')

const app = express()
const config = require('./services/configurator').getConfig()

mongoose.Promise = global.Promise
mongoose.connect(config.app.mongodb)
mongoose.connection.on('connected', () => {
  logging.log('info', 'MongoDB connection ok')
})
mongoose.connection.on('error', err => {
  logging.log('error', `Mongo connection error - ${err.toString()}`)
  process.exit(1)
})

app.use(compression())
app.use(requestLogger())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'x-user,Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,PUT')
  next()
})

app.use((req, res, next) => {
  req.userId = req.headers['x-user'] ? req.headers['x-user'] : null
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
  logging.log('info', `Sangoku server listening on port ${config.app.server.port.toString()} in ${config.env} env`)
})
