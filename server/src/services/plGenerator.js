const config = require('../../config/config.json').pl_generator

// On renvoie un entier aléatoire entre une valeur min (incluse)
// et une valeur max (incluse).
// Attention : si on utilisait Math.round(), on aurait une distribution
// non uniforme !
function randIntInc (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function drawNUniformWoReplacement (samples, n) {
  // Shallow copy arg, since we'll be slicing it.
  let data = samples.slice()
  const ret = []

  for (let v, i = 0; i < n; i++) {
    if (!data.length) return ret
    v = randIntInc(0, data.length - 1)
    ret.push(data[v])
    data.slice(v, 1)
  }

  return ret
}

function randomGen (songs, qty) {
  const ids = songs.map(song => song.id)
  return drawNUniformWoReplacement(ids, qty)
}

module.exports.create = (user, songs) => {
  return randomGen(songs, 20)
}

/*
 * Dirty version ...
 */
module.exports.generate = (currentPlaylist, catalog, n) => {
  const played = currentPlaylist.slice(-config.song_no_repeat)
  let candidates = catalog.map(x => x.id)
  const ret = []

  for (let v, itCandidates, i = 0; i < n; i++) {
    if (played.length > config.song_no_repeat) played.shift()

    // Remove played samples from candidates
    itCandidates = candidates.filter(x => played.indexOf(x) === -1)

    // If there are not enough samples, return what we can draw.
    if (!itCandidates.length) break

    v = randIntInc(0, itCandidates.length - 1)
    ret.push(itCandidates[v])

    // Recompute the played list
    played.push(itCandidates[v])
  }

  return ret
}

