import Immutable from 'immutable'
import * as Actions from './actions.js'
import config from '../../config/development.json'

const initialState = {
  current: null,
  playlist: Immutable.OrderedMap(),
  played: Immutable.List()
}

function listToMap (startIndex, list) {
  return Immutable.OrderedMap(list.map((v, i) => [ startIndex + i, v ]))
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case Actions.PLAYER_RELOAD:
      return state

    case Actions.PLAYER_INIT:
      return {
        ...state,
        playlist: listToMap(action.payload.startIndex, action.payload.songs),
        current: 0
      }

    case Actions.PLAYER_PLAY:
      // Informative event: a new song is being player
      console.log('Play event', action.payload)
      return state

    case Actions.PLAYER_SKIP:
    case Actions.PLAYER_ENDED:
      const newCurrent = state.playlist.has(state.current + 1) ? state.current + 1 : null
      const newPlayed = state.played
        .push(state.playlist.get(state.current))
        .slice(-config.played_viewer.max_played)

      return { ...state, current: newCurrent, played: newPlayed }

    case Actions.PLAYER_UPDATE_PLAYLIST:
      const newPlaylist = state.playlist
        // Remove every song after startIndex - the concat point with the new songs
        .takeUntil((v, k) => k === action.payload.startIndex)
        // Add new songs to the end
        .concat(listToMap(action.payload.startIndex, action.payload.songs))
        // Remove old songs
        .skipUntil((v, k) => k >= state.current - 3)

      return { ...state, playlist: newPlaylist }

    default:
      return state
  }
}

export function toJS (state) {
  // Convert playlist to JS
  // Method OrderedMap.toJS converts int keys to strings ...
  // so we do the conversion manually.
  const arr = state.playlist.map((v, k) => [k, v]).toArray()
  return { ...state, playlist: arr }
}

export function fromJS (stateJS) {
  if (stateJS === null) return stateJS
  return {
    ...stateJS,
    playlist: Immutable.OrderedMap(stateJS.playlist),
    played: Immutable.List(stateJS.played)
  }
}
