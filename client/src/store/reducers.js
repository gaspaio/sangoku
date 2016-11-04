import { combineReducers } from 'redux'
import locationReducer from './location'
import playerReducer from '../modules/player/reducer'
import userReducer from '../modules/user/reducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    player: playerReducer,
    user: userReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
