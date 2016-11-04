import React from 'react'

export const SongInfoLine = props => {
  const infos = props.infos.map(x => x === null ? null : String(x)).filter(x => x !== null && x.trim())

  return (
    <span className={props.className}>
      { infos.map((item, i, items) => {
        return (
          <span key={i}>
            <span className={props.className + '-item'}>{item}</span>
            { i < items.length - 1 && <span className={props.className + '-sep'}>•</span> }
          </span>
        )
      })}
    </span>
  )
}

SongInfoLine.defaultProps = {
  className: 'song-infoline'
}

SongInfoLine.propTypes = {
  className: React.PropTypes.string,
  infos: React.PropTypes.arrayOf(React.PropTypes.any).isRequired
}

export default SongInfoLine

