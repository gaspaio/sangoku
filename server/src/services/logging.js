const winston = require('winston')
const Elasticsearch = require('winston-elasticsearch')
const config = require('./configurator').getConfig().app.logger

const cs = {
  ACTION_PLAY: 'play',
  ACTION_PAUSE: 'pause',
  ACTION_UNPAUSE: 'unpause',
  ACTION_SKIP: 'skip',
  ACTION_FAVE: 'fave',
  ACTION_UNFAVE: 'unfave',
  ACTION_PLAYER_MOUNT: 'player_mount',
  ACTION_PLAYER_UNMOUNT: 'player_unmount',
  EVENT_PING: 'ping',
  EVENT_REQUEST: 'request',
  EVENT_PLGEN: 'plgen',
  EVENT_SYSTEM: 'system',
  LOG_TYPE_ACTION: 'action',
  LOG_TYPE_EVENT: 'event'
}

const getType = evt => {
  const actions = [
    cs.ACTION_PLAY, cs.ACTION_PAUSE, cs.ACTION_UNPAUSE, cs.SKIP, cs.FAVE, cs.UNFAVE,
    cs.PLAYER_MOUNT, cs.PLAYER_UNMOUNT
  ]
  return actions.indexOf(evt) !== -1 ? cs.LOG_TYPE_ACTION : cs.LOG_TYPE_EVENT
}

  /*
ACTIONS: PLAY, PAUSE, UNPAUSE, SKIP, FAVE, UNFAVE, PLAYER_MOUNT, PLAYER_UNMOUNT, PING (toutes les 30s)
EVENTS: REQUEST, PLAYLIST_GENERATION, SYSTEM

{ event: PLAYLIST_GENERATION, duration: *SECS*, bscore: *SCR*, size: *NB*, startIndex: *NB* }
event_obj: { user: *ID*, event: *EVT*, timestamp: *TS*, data: { ... }  }
- PLGEN data: { duration: *SECS*, bscore: *SCR*, size: *NB*, params: *params*,
    startIndes: *NB* }
- REQUEST: { ... }
action_obj: data: { current: *ID*, state: PAUSED/PLAYING, position: *POS*, faved: *T/F* } }

   */
const transports = [
  new winston.transports.Console({
    handleExceptions: true,
    level: config.level,
    json: false,
    colorize: true
  })
]

if (config.elasticsearch.on) {
  transports.push(new Elasticsearch({
    level: config.level,
    clientOpts: { host: config.elasticsearch.host }
  }))
}

const logger = new winston.Logger({
  transports: transports,
  exitOnError: false,
  emitErrors: true
})

// Logger error handling
logger.on('error', err => console.error('Logger Default error:', err))

module.exports.logger = logger
module.exports.cs = cs
module.exports.log = (level, message, user = '-', event = cs.EVENT_SYSTEM, fields = {}) => {
  const data = Object.assign({}, fields)

  let timestamp = Date.now()
  if (data['timestamp']) {
    timestamp = data['timestamp']
    delete data['timestamp']
  }

  const meta = { user, type: getType(event), event, timestamp, data }
  this.logger.log(level, message, meta)
}
