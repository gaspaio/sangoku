import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import { Table } from 'react-bootstrap'
import './PlayedViewer.scss'

const getRows = (played) => {
  if (!played.size) {
    return <tr className='no-songs'><td colSpan={5}>No songs played yet ...</td></tr>
  }

  // TODO: convert to array before mapping
  return played.toArray().map((v, k) => (
    <tr key={k}>
      <td>{v.title}</td><td>{v.artist}</td><td>{v.album}</td><td>{v.year}</td><td>{v.genre}</td>
    </tr>
  ))
}

export const PlayedViewer = props => {
  return (
    <Table condensed id='played-viewer'>
      <thead><tr>
        <th className='song-title'>Song</th>
        <th className='song-artist'>Artist</th>
        <th className='song-album'>Album</th>
        <th className='song-year'>Year</th>
        <th className='song-genre'>Genre</th></tr></thead>
      <tbody>{getRows(props.played)}</tbody>
    </Table>
  )
}

PlayedViewer.defaultProps = {
  played: Immutable.List()
}

PlayedViewer.propTypes = {
  played: ImmutablePropTypes.list.isRequired
}

export default PlayedViewer
