import uuid from 'uuid'
import Immutable from 'immutable'
import * as Actions from './actions'

const initialState = {
  id: null,
  favorites: Immutable.OrderedMap()
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case Actions.USER_INIT:
      if (state.id !== null) return state
      return { ...state, id: uuid.v4() }

    case Actions.USER_FAVE:
      if (state.favorites.has(action.payload.id)) return state

      return {
        ...state,
        favorites: state.favorites.set(
          action.payload.song.id,
          { time: action.payload.time, song: action.payload.song }
        )
      }

    case Actions.USER_UNFAVE:
      if (!state.favorites.has(action.payload)) return state
      return { ...state, favorites: state.favorites.delete(action.payload) }

    default:
      return state
  }
}

export function fromJS (stateJS) {
  if (stateJS === null) return stateJS
  return { ...stateJS, favorites: Immutable.OrderedMap(stateJS.favorites) }
}
