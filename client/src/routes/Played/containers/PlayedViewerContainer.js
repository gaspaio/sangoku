import { connect } from 'react-redux'
import PlayedViewer from '../components/PlayedViewer'

const mapStateToProps = state => ({
  played: state.player.played.reverse()
})

export default connect(mapStateToProps)(PlayedViewer)
