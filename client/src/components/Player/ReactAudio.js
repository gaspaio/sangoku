import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'

export default class ReactAudio extends React.Component {
  static propTypes = {
    source: React.PropTypes.string.isRequired,
    onTimeupdate: React.PropTypes.func.isRequired,
    onCanplay: React.PropTypes.func.isRequired,
    onEnded: React.PropTypes.func.isRequired,
    onLoadedmetadata: React.PropTypes.func.isRequired,
    onPlay: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
      listeners: []
    }
  }

  get audioNode () {
    return ReactDOM.findDOMNode(this.refs.audioNode)
  }

  get volume () {
    return this.audioNode.volume
  }

  set volume (vol) {
    this.audioNode.volume = vol
  }

  get position () {
    if (isNaN(this.audioNode.currentTime) || isNaN(this.audioNode.duration)) {
      return 0
    }

    return this.audioNode.currentTime / this.audioNode.duration
  }

  set position (pos) {
    this.audioNode.currentTime = pos * this.audioNode.duration
  }

  get duration () {
    return isNaN(this.audioNode.duration) ? 0 : this.audioNode.duration
  }

  get isPlaying () {
    return !this.audioNode.paused
  }

  play () {
    this.audioNode.play()
  }

  pause () {
    this.audioNode.pause()
  }

  addListener (event, func) {
    this.audioNode.addEventListener(event, func)
    this.state.listeners.push({ event, func })
  }

  removeAllListeners () {
    this.state.listeners.forEach((obj) => {
      this.audioNode.removeEventListener(obj.event, obj.func)
    }, this)
  }

  componentDidMount () {
    this.addListener('timeupdate', this.props.onTimeupdate)
    this.addListener('loadedmetadata', this.props.onLoadedmetadata)
    // this.addListener('error', this.props.onError)
    this.addListener('ended', this.props.onEnded)
    this.addListener('canplay', this.props.onCanplay)
    this.addListener('play', this.props.onPlay)
  }

  componentWillUnmount () {
    this.removeAllListeners()
  }

  render () {
    return (
      <audio
        ref='audioNode'
        controls={false}
        crossOrigin='anonymous'
        autoPlay={false}
        loop={false}
        src={this.props.source} />
    )
  }

}
