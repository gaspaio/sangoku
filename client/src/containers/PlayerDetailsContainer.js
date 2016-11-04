import { connect } from 'react-redux'
import PlayerDetails from '../components/PlayerDetails'

const mapStateToProps = state => {
  let currentSong
  if (state.player.current === null) {
    currentSong = null
  } else {
    currentSong = state.player.playlist.get(state.player.current, null)
  }

  return {
    'currentSong': currentSong,
    'isFavorite': state.player.isFavorite
  }
}

export default connect(mapStateToProps)(PlayerDetails)

