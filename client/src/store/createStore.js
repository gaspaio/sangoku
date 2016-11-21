import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import persistState from 'redux-localstorage'
import makeRootReducer from './reducers'
import { loggerMiddleware } from './middlewares'
import { updateLocation } from './location'
import { toJS as playerStateToJS, fromJS as playerStateFromJS } from '../modules/player/reducer'
import { fromJS as userStateFromJS } from '../modules/user/reducer'

const stateSerializer = (state) => {
  if (state === null) return null

  return JSON.stringify({
    ...state,
    player: playerStateToJS(state.player)
  })
}

const stateDeserializer = (str) => {
  if (str == null) return null

  const state = JSON.parse(str)
  return {
    ...state,
    player: playerStateFromJS(state.player),
    user: userStateFromJS(state.user)
  }
}

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, loggerMiddleware]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [
    // TODO: Put this persistance logic in modules/user/???
    persistState(
      [ 'user', 'player' ],
      { serialize: stateSerializer, deserialize: stateDeserializer }
    )
  ]
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
