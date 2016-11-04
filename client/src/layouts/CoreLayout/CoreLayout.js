import React from 'react'
import { Nav, NavItem, Grid, Row, Col } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import Header from '../../components/Header'
import PlayerDetails from '../../containers/PlayerDetailsContainer'
import PlaylistShortViewer from '../../containers/PlaylistShortViewerContainer'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div id='core-layout'>
    <Header />
    <div id='player-details-container'>
      <Grid>
        <Row>
          <Col sm={8}>
            <PlayerDetails />
          </Col>
          <Col sm={4}>
            <PlaylistShortViewer />
          </Col>
        </Row>
      </Grid>
    </div>
    <div id='core-layout-content' className='container'>
      <Nav bsStyle='tabs'>
        <IndexLinkContainer to={{ pathname: '/' }}><NavItem>Favorites</NavItem></IndexLinkContainer>
        <LinkContainer to={{ pathname: '/played' }}><NavItem>Played songs</NavItem></LinkContainer>
        <LinkContainer to={{ pathname: '/playlist' }}><NavItem>Playlist</NavItem></LinkContainer>
      </Nav>
      <div id='core-layout-page'>{children}</div>
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
