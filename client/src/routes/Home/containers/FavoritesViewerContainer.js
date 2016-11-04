import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FavoritesViewer from '../components/FavoritesViewer'
import * as UserActions from '../../../modules/user/actions'

const mapStateToProps = state => ({
  favorites: state.user.favorites
})

const mapDispatchToProps = dispatch => bindActionCreators(UserActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesViewer)

