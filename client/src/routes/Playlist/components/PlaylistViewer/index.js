import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import { Table } from 'react-bootstrap'
import config from '../../../../config/development'
import './PlaylistViewer.scss'

const VIEW_BEFORE = config.playlist_viewer.show_before_current

const getRows = (playlist, current) => {
  if (!playlist.size) {
    return <tr className='no-songs'><td colSpan={5}>No songs in the playlist ...</td></tr>
  }

  // TODO: convert to array before mapping
  return playlist.skipUntil((val, key) => key > (current - VIEW_BEFORE)).map((v, k) => (
    <tr className={k === current ? 'current' : 'not-current'} key={k}>
      <td>{v.title}</td><td>{v.artist}</td><td>{v.album}</td><td>{v.year}</td><td>{v.genre}</td>
    </tr>
  )).toArray()
}

export const PlaylistViewer = props => {
  return (
    <Table condensed id='playlist-viewer'>
      <thead><tr>
        <th className='song-title'>Song</th>
        <th className='song-artist'>Artist</th>
        <th className='song-album'>Album</th>
        <th className='song-year'>Year</th>
        <th className='song-genre'>Genre</th></tr></thead>
      <tbody>{getRows(props.playlist, props.current)}</tbody>
    </Table>
  )
}

PlaylistViewer.defaultProps = {
  playlist: Immutable.OrderedMap(),
  current: null
}

PlaylistViewer.propTypes = {
  current: React.PropTypes.number,
  playlist: ImmutablePropTypes.orderedMap.isRequired
}

export default PlaylistViewer
