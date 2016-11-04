// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import Home from './Home'
import PlayedRoute from './Played'
import PlaylistRoute from './Playlist'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : Home(store),
  childRoutes : [
    PlayedRoute(store),
    PlaylistRoute(store)
  ]
})

export default createRoutes
