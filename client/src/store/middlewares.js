import * as playerActions from '../modules/player/actions'
import config from '../config/development.json'

export const loggerMiddleware = store => next => action => {
  const prevState = store.getState()
  const result = next(action)
  const nextState = store.getState()

  switch (action.type) {
    case playerActions.PLAYER_PLAY:
      logToServer(nextState.user.id, 'play', {
        index: nextState.player.current,
        song: nextState.player.playlist.get(nextState.player.current).id
      })
      break

    case playerActions.PLAYER_SKIP:
      logToServer(nextState.user.id, 'skip', {
        index: prevState.player.current,
        song: prevState.player.playlist.get(prevState.player.current).id,
        time: prevState.player.time
      })
      break
  }

  return result
}

function logToServer (user, event, meta) {
  fetch(`${config.server_url}/log`, {
    method: 'PUT',
    headers: { 'x-user': user, 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, timestamp: Date.now(), meta })
  }).then(res => {
    if (!res.ok) console.error('Log request response is not OK.')
  }).catch(err => {
    console.error('Something is wrong with the log request: ', err)
  })
}

