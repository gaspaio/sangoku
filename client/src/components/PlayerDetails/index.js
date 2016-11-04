import React from 'react'
import { Media } from 'react-bootstrap'
import SongInfoLine from '../SongInfoLine'
import './PlayerDetails.scss'

/* eslint-disable react/prop-types */
const SongInfo = props => {
  if (props.song === null) {
    return <Media.Body><p className='no-song'>No song loaded ...</p></Media.Body>
  }

  let infos = [props.song.artist, props.song.album, props.song.year]

  return (
    <Media.Body>
      <p className='title'><strong>{props.song.title}</strong></p>
      <p className='song-infos'>by: <SongInfoLine infos={infos} /></p>
    </Media.Body>
  )
}
/* eslint-enable react/prop-types */

export const PlayerDetails = props => {
  let cover = require('raw!../../assets/default_cover.txt')
  if (props.currentSong !== null && props.currentSong.cover !== null) {
    cover = props.currentSong.cover
  }

  return (
    <Media id='player-details'>
      <Media.Left align='top'><img className='cover' src={cover} /></Media.Left>
      <SongInfo song={props.currentSong} />
    </Media>
  )
}

PlayerDetails.defaultProps = {
  currentSong: null,
  isFavorite: false
}

PlayerDetails.propTypes = {
  currentSong: React.PropTypes.shape({
    title: React.PropTypes.string,
    artist: React.PropTypes.string,
    album: React.PropTypes.string,
    cover: React.PropTypes.string,
    year: React.PropTypes.number
  }),
  isFavorite: React.PropTypes.bool
}

export default PlayerDetails

