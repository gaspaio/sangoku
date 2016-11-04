import { connect } from 'react-redux'
import PlaylistShortViewer from '../components/PlaylistShortViewer'

const mapStateToProps = state => {
  return {
    'current': state.player.current,
    'playlist': state.player.playlist
  }
}

export default connect(mapStateToProps)(PlaylistShortViewer)

