import { connect } from 'react-redux'
import PlaylistViewer from '../components/PlaylistViewer'

const mapStateToProps = state => ({
  current: state.player.current,
  playlist: state.player.playlist
})

export default connect(mapStateToProps)(PlaylistViewer)
