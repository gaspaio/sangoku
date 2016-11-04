
const express = require('express')
const errorHandler = require('errorhandler')
const compression = require('compression')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const apiRoutes = require('./routes/api')
require('colors')
require('dotenv').config()

const app = express()

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`MongoDB connection ${'ok'.green}.`)
})
mongoose.connection.on('error', err => {
  console.log(`Mongo connection error - ${err.toString().red}`)
  process.exit(1)
})

app.set('port', process.env.PORT || 4000)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/', apiRoutes)

app.use(function (req, res) {
  res.status(404).json({ error: 'Not found.' })
})

if (app.get('env') === 'development') {
  // only use in development
  app.use(errorHandler())
}

app.listen(app.get('port'), () => {
  console.log(`Sangoku server listening on port ${app.get('port').toString().green} in ${app.get('env').green} mode`)
})
