const config = require('../services/configurator').getConfig().pl_generator

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
 * Filter candidates
 */

/*
 * Filter out all songs that are present in the user's past playlist
 */
const filterSongNorepeat = (candidates, played, settings) => {
  const playedIds = played.map(x => x.id)
  return candidates.filter(x => playedIds.indexOf(x.id) === -1)
}

// filter_artist_no_repeat
const filterArtistNorepeat = (candidates, played, settings) => {
  const playedArtists = played.slice(-config.artist_no_repeat).map(x => x.artist)
  return candidates.filter(x => playedArtists.indexOf(x.artist) === -1)
}

/*
 * Balance genres
 * - all genres should have equal probability regardless of catalog genre distribution
 */
const filterGenreBalance = (candidates, played, settings) => {
  // Choose a genre
  const genre = config.genres[randIntInc(0, config.genres.length - 1)]
  return candidates.filter(x => x.genre === genre)
}

// filter_epoch
const filterEpochBalance = (candidates, played, settings) => {
  // Get different decades

  const getSongEpoch = s => Math.floor(s.year / 10) * 10
  const ds = new Set(candidates.map(getSongEpoch))

  // Remove last song epoch: don't repeat songs from same epoch in a row
  if (played.length) {
    ds.delete(getSongEpoch(played[played.length - 1]))
  }

  const epoch = [...ds][randIntInc(0, ds.size - 1)]

  return candidates.filter(x => getSongEpoch(x) === epoch)
}

/**
 * Generate new songs to append to playlist from context.
 *
 * @param {array[Song]} playedSongs - Ordered list of song model objects, in played order.
 *                                    Should NOT already be truncated for amnesia
 * @param {array[Song]} songCatalog - All available song model objects.
 * @param {object} settings - user specific settings
 * @param {number} n - number of new songs to generate.
 * @return {array[Song]} Ordered list of song model objects.
 */
module.exports.generate = (playedSongs, songCatalog, settings, n) => {
  const candidateFilters = [
    filterSongNorepeat,
    filterArtistNorepeat,
    filterGenreBalance,
    filterEpochBalance
  ]

  const applyFilter = (songs, filter) => {
    const filteredSongs = filter(songs, played, settings)

    // If after filtering there are no songs to choose from, ignore this filter
    if (!filteredSongs.length) {
      console.log('Filter ', filter.name, ' emptied the candidate list. Ignoring ... ')
      return songs
    }

    return filteredSongs
  }

  const played = playedSongs.slice(-config.played_amnesia)
  const ret = []

  for (let v, candidates, i = 0; i < n; i++) {
    // Reduce candidate song listing using the filters
    candidates = candidateFilters.reduce(applyFilter, songCatalog)

    // Random choose one song from remaining candidates
    v = randIntInc(0, candidates.length - 1)
    ret.push(candidates[v])

    // Update the played list
    played.push(candidates[v])
    if (played.length > config.played_amnesia) played.shift()
  }

  return ret
}

