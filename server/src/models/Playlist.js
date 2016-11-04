const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
  user: { type: String, required: true },
  songs: [{ type: String, default: [], ref: 'Song' }],
  firstIndex: { type: Number, default: 0 }
})

module.exports = mongoose.model('Playlist', playlistSchema)

