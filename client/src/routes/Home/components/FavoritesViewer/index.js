import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import { Table, Glyphicon, Button } from 'react-bootstrap'
import moment from 'moment'
import './FavoritesViewer.scss'

const getRows = (faves, unfave) => {
  if (!faves.size) {
    return <tr className='no-songs'><td colSpan={5}>No songs faved yet ...</td></tr>
  }

  return faves.reverse().toArray().map((v, k) => (
    <tr key={k}>
      <td>
        <Button onClick={() => unfave(v.song.id)}>
          <Glyphicon glyph='heart' />
        </Button>
      </td>
      <td>{v.song.title}</td>
      <td>{v.song.artist}</td>
      <td>{v.song.album}</td>
      <td>{moment(v.time).fromNow()}</td>
    </tr>
  ))
}

export const FavoritesViewer = props => {
  return (
    <Table condensed id='favorites-viewer'>
      <thead><tr>
        <th className='heart' />
        <th className='song-title'>Song</th>
        <th className='song-artist'>Artist</th>
        <th className='song-album'>Album</th>
        <th className='fave-time'><Glyphicon glyph='calendar' /></th>
      </tr></thead>
      <tbody>{getRows(props.favorites, props.unfave)}</tbody>
    </Table>
  )
}

FavoritesViewer.defaultProps = {
  favorites: Immutable.OrderedMap()
}

FavoritesViewer.propTypes = {
  favorites: ImmutablePropTypes.orderedMap.isRequired,
  unfave: React.PropTypes.func.isRequired
}

export default FavoritesViewer

