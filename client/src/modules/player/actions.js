import config from '../../config/development.json'
import qs from 'qs'

export const PLAYER_INIT = 'PLAYER_INIT'
export const PLAYER_RELOAD = 'PLAYER_RELOAD'
export const PLAYER_SKIP = 'PLAYER_SKIP'
export const PLAYER_ENDED = 'PLAYER_ENDED'
export const PLAYER_PLAY = 'PLAYER_PLAY'
export const PLAYER_UPDATE_PLAYLIST = 'PLAYER_UPDATE_PLAYLIST'

export const onSkip = () => { return onNextSong({ type: PLAYER_SKIP }) }
export const onEnded = () => { return onNextSong({ type: PLAYER_ENDED }) }
export const onPlay = key => { return { type: PLAYER_PLAY, payload: key } }

export const initPlayer = (user, playerState) => {
  // We already have a playlist in store
  if (playerState.playlist.size > 0) {
    return { type: PLAYER_RELOAD }
  }

  // Update playlist
  return dispatch => getPlaylist(
      { user: user, startIndex: 0 },
      json => dispatch({
        type: PLAYER_INIT,
        payload: { user: json.user, startIndex: json.startIndex, songs: json.songs }
      })
    )
}

function onNextSong (playerAction) {
  return (dispatch, getState) => {
    // Dispatch main action
    dispatch(playerAction)
    const state = getState()
    const lastIndex = state.player.playlist.keyOf(state.player.playlist.last())

    // If necessary, update playlist
    if (lastIndex - state.player.current > config.request_songs_at) return

    getPlaylist(
      { user: state.user.id, startIndex: lastIndex + 1 },
      json => dispatch({
        type: PLAYER_UPDATE_PLAYLIST,
        payload: { user: json.user, startIndex: json.startIndex, songs: json.songs }
      })
    )
  }
}

function getPlaylist (queryparams, cb) {
  const url = `${config.playlist_url}?${qs.stringify(queryparams)}`
  return fetch(url)
    .then(res => res.json())
    .then(cb)
    .catch(err => console.error(err))
}

