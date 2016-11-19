const onHeaders = require('on-headers')
const onFinished = require('on-finished')
const logging = require('../services/logging')

module.exports = () => {
  return function (req, res, next) {
    req._startAt = undefined
    req._startTime = undefined
    req._remoteAddress = getip(req)
    res._startAt = undefined
    res._startTime = undefined

    function logRequest () {
      const info = buildRequestInfo(req, res)

      logging.log(
        'info',
        `${info.method} ${info.url} ${info.status} ${info.responseTime} ms`,
        '-',
        logging.cs.EVENT_REQUEST,
        info
      )
    }

    recordStartTime.call(req)
    // record response start
    onHeaders(res, recordStartTime)
    // log when response finished
    onFinished(res, logRequest)

    next()
  }
}

function buildRequestInfo (req, res) {
  const status = res._header ? res.statusCode : undefined
  const method = req.method
  const url = req.originalUrl || req.url
  const referer = req.headers['referer'] || req.headers['referrer']
  const responseTime = computeResponseTime(req, res, 3)
  const remoteIp = req._remoteAddress
  const userAgent = req.headers['user-agent']

  return { status, method, url, referer, responseTime, remoteIp, userAgent }
}

function computeResponseTime (req, res, digits) {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return
  }

  // calculate diff
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6

  // return truncated value
  return ms.toFixed(digits === undefined ? 3 : digits)
}

function recordStartTime () {
  this._startAt = process.hrtime()
  this._startTime = new Date()
}

function getip (req) {
  return req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined
}
