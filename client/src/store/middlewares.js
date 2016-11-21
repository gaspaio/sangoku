import * as playerActions from '../modules/player/actions'

export const loggerMiddleware = store => next => action => {
  const prevState = store.getState()
  const result = next(action)
  const nextState = store.getState()

  let payload

  switch (action.type) {
    case playerActions.PLAYER_PLAY:
      payload = {
        event: 'play',
        timestamp: Date.now(),
        data: {
          index: nextState.player.current,
          song: nextState.player.playlist.get(nextState.player.current).id
        }
      }
      break

    case playerActions.PLAYER_SKIP:
      payload = {
        event: 'skip',
        timestamp: Date.now(),
        data: {
          index: prevState.player.current,
          song: prevState.player.playlist.get(prevState.player.current).id
        }
      }
      break

  }

  if (payload) console.log(action.type, payload)

  return result
}

// TODO crash reporter ...

