import { initUser } from '../user/actions'
import { initPlayer } from '../player/actions'

export const initApp = () => {
  return (dispatch, getState) => {
    dispatch(initUser())
    const state = getState()
    dispatch(initPlayer(state.user.id, state.player))
  }
}

