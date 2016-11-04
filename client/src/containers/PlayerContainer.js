import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Player from '../components/Player'
import * as PlayerActions from '../modules/player/actions'
import * as UserActions from '../modules/user/actions'

const mapStateToProps = state => {
  let currentSong
  if (state.player.current === null) {
    currentSong = null
  } else {
    currentSong = state.player.playlist.get(state.player.current, null)
  }

  return {
    'isFavorite': currentSong && state.user.favorites.has(currentSong.id),
    'song': currentSong,
    'songIndex': state.player.current
  }
}

const mapDispatchToProps = dispatch => Object.assign(
  bindActionCreators(PlayerActions, dispatch),
  bindActionCreators(UserActions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Player)
