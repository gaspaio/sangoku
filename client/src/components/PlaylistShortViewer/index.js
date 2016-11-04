import React from 'react'
import { Media } from 'react-bootstrap'
import ImmutablePropTypes from 'react-immutable-proptypes'
import SongInfoLine from '../SongInfoLine'
import './PlaylistShortViewer.scss'

const getViewedRows = (playlist, current) => {
  if (!playlist.size) {
    return <p>No songs played yet ...</p>
  }

  const defaultCover = require('raw!../../assets/default_cover.txt')

  return playlist
    .skipUntil((v, k) => k >= (current - 3))
    .takeUntil((v, k) => k === current)
    .reverse()
    .toArray()
    .map((v, i) => (
      <Media key={i} className='song-display'>
        <Media.Left>
          <img className='cover' src={v.cover || defaultCover} />
        </Media.Left>
        <Media.Body>
          <p className='song-title'>{v.title}</p>
          <p className='song-infos'><SongInfoLine infos={[v.artist, v.album, v.year]} /></p>
        </Media.Body>
      </Media>
    )
  )
}

export const PlaylistShortViewer = props => {
  if (!props.current) {
    return <div id='playlist-short-viewer'></div>
  }

  return (
    <div id='playlist-short-viewer'>
      <h3>Last played</h3>
      {getViewedRows(props.playlist, props.current)}
    </div>
  )
}

PlaylistShortViewer.propTypes = {
  current: React.PropTypes.number,
  playlist: ImmutablePropTypes.orderedMap.isRequired
}

export default PlaylistShortViewer
