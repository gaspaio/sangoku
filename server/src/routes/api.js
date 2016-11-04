const express = require('express')
const router = express.Router()
const Song = require('../models/Song')  // eslint-disable-line no-unused-vars
const Playlist = require('../models/Playlist')
const plGenerator = require('../services/plGenerator')
const config = require('../../config/config.json').app

function generatePlaylist (userPlaylist, n) {
  return Song
    .find({})
    .then(songCatalog => plGenerator.generate(userPlaylist.songs, songCatalog, n))
}

router.get('/playlist', (req, res, next) => {
  // Get queryparams
  let { user, startIndex } = req.query
  if (!user) {
    next(Error('No userid provided for playlist request'))
    return
  }
  startIndex = parseInt(startIndex) || 0

  let userPlaylist, realStartIndex

  Playlist
    .findOne({ user })
    .then(plist => {
      userPlaylist = plist || new Playlist({ user })

      // generate N songs from context (current playlist) - IDs only
      return generatePlaylist(userPlaylist, config.playlist_step)
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
    .then(plist => plist.populate('songs').execPopulate())
    .then(plist => res.json({ startIndex, user, songs: plist.songs.slice(realStartIndex) }))
    .catch(err => next(Error(err)))
})

module.exports = router

