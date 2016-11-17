const express = require('express')
const router = express.Router()
const Song = require('../models/Song')  // eslint-disable-line no-unused-vars
const Playlist = require('../models/Playlist')
const plGenerator = require('../services/plGenerator')
const config = require('../services/configurator').getConfig().app

function generatePlaylist (playedSongs, n) {
  return Song
    .find({})
    .then(songCatalog => plGenerator.generate(playedSongs, songCatalog, {}, n))
}

router.get('/playlist', (req, res, next) => {
  // Get queryparams
  let { user, startIndex } = req.query
  if (!user) {
    next(Error('No userid provided for playlist request'))
    return
  }
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

      return userPlaylist.save()
    })
    .then(plist => res.json({ startIndex, user, songs: plist.songs.slice(realStartIndex) }))
    .catch(err => next(Error(err)))
})

module.exports = router

