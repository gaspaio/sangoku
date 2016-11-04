import React from 'react'
// import { IndexLink, Link } from 'react-router'
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap'
import Player from '../../containers/PlayerContainer'
import './Header.scss'

export const Header = () => (
  <div id='header'>
    <Grid>
      <Row>
        <Col id='header-col-sangoku' sm={2}><h3>Sangoku</h3></Col>
        <Col id='header-col-player' sm={8}><Player /></Col>
        <Col id='header-col-settings' sm={2}><Glyphicon glyph='user' /></Col>
      </Row>
    </Grid>
  </div>
)

export default Header
