const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  file: { type: String, required: true },
  cover: { type: String },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2020
  }
}, {
  _id: false,
  minimize: false
})

if (!schema.options.toJSON) schema.options.toJSON = {}
schema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id
  delete ret._id
  return ret
}

module.exports = mongoose.model('Song', schema)

