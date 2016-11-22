const express = require('express')
const router = express.Router()
const Song = require('../models/Song')  // eslint-disable-line no-unused-vars
const Playlist = require('../models/Playlist')
const plGenerator = require('../services/plGenerator')
const config = require('../services/configurator').getConfig().app
const logging = require('../services/logging')

function generatePlaylist (playedSongs, n) {
  return Song
    .find({})
    .then(songCatalog => plGenerator.generate(playedSongs, songCatalog, {}, n))
}

router.get('/playlist', (req, res, next) => {
  const startTime = process.hrtime()

  if (!req.userId) {
    next(Error('No userid provided for playlist request'))
    return
  }

  const user = req.userId

  // Get queryparams
  let { startIndex } = req.query
  startIndex = parseInt(startIndex) || 0

  let realStartIndex, userPlaylist

  Playlist
    .findOne({ user })
    .then(plist => {
      plist = plist || new Playlist({ user })
      return plist.populate('songs').execPopulate()
    })
    .then(plist => {
      userPlaylist = plist
      // generate N songs from context (current playlist) - IDs only
      return generatePlaylist(plist.songs, config.playlist_step)
    })
    .then(songs => {
      // append N songs to playlist starting from startIndex (take into account firstIndex)
      realStartIndex = startIndex - userPlaylist.firstIndex

      if (realStartIndex > userPlaylist.songs.length) {
        throw new Error(`Invalid startIndex (startIndex=${startIndex}, realStartIndex=${realStartIndex})`)
      }

      userPlaylist.songs = userPlaylist.songs.slice(0, realStartIndex).concat(songs)

      // TODO: truncate to user_playlist_amnesia and update firstIndex

      return userPlaylist.save()
    })
    .then(plist => {
      const time = process.hrtime(startTime)
      const duration = (time[0] * 1e3 + time[1] * 1e-6).toFixed(3)
      const songs = plist.songs.slice(realStartIndex)

      logging.log(
        'info',
        `Playlist generation for user ${user} ran for ${duration} ms`,
        user,
        logging.cs.EVENT_PLGEN,
        { duration, size: songs.length, startIndex }
      )
      res.json({ startIndex, user, songs: plist.songs.slice(realStartIndex) })
    })
    .catch(err => next(Error(err)))
})

router.put('/log', (req, res, next) => {
  if (!req.userId) {
    next(Error('No userid provided.'))
    return
  }

  if (!req.body || !req.body.event || !req.body.meta) {
    next(Error('Invalid body in log request'))
    return
  }

  let level = 'info'
  if (req.body.level) {
    level = req.body.level
    delete req.body['level']
  }

  logging.log(
    level,
    `Event '${req.body.event} for user '${req.headers['x-user']}`,
    req.headers['x-user'],
    req.body.event,
    req.body.meta
  )

  res.json({ user: req.headers['x-user'] })
})

module.exports = router

