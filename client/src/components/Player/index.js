import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Grid, Row, Col, Glyphicon, Button } from 'react-bootstrap'
import Rcslider from 'rc-slider'
import styles from 'rc-slider/assets/index.css'      // eslint-disable-line no-unused-vars
import ReactAudio from './ReactAudio'
import './Player.scss'

export default class Player extends React.Component {

  static propTypes = {
    isFavorite: React.PropTypes.bool,
    song: React.PropTypes.any,
    songIndex: React.PropTypes.number,
    onPlay: React.PropTypes.func.isRequired,
    onSkip: React.PropTypes.func.isRequired,
    onEnded: React.PropTypes.func.isRequired,
    onTimeUpdate: React.PropTypes.func.isRequired,
    fave: React.PropTypes.func.isRequired,
    unfave: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    source: null,
    isFavorite: false,
    songIndex: null
  }

  constructor () {
    super()

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.state = {
      isPlaying: false,
      position: 0,
      volume: 0.8,
      duration: 0
    }

    this.data = {
      lastPlayed: ''
    }
  }

  /*
   * Lifecycle
   */
  componentDidMount () {
    // This will render the component twice on mount.
    // Its at this point a necessary evil. On the mounted audio component can update the position/duration/volume
    // by default.
    if (this.props.song) {
      this.setState({
        ...this.state,
        position: this.refs.audio.position,
        volume: this.refs.audio.volume,
        duration: this.refs.audio.duration
      })
      this.props.onTimeUpdate(this.refs.audio.position * this.refs.audio.duration)
    }
  }

  componentWillReceiveProps (nextProps) {
    // Handle playlist end
    if (!nextProps.song) {
      this.reset()
    }
  }

  /*
   * Helpers
   */
  time2string (secs) {
    const d = new Date(null)
    d.setSeconds(secs)
    let offset = 0
    if (d.getHours() > 1) offset = d.getHours() > 9 ? 3 : 2
    return d.toISOString().substr(14 - offset, 5 + offset)
  }

  setPlay = () => {
    this.refs.audio.play()
    this.setState({ ...this.state, isPlaying: true })
  }

  setPause = () => {
    this.refs.audio.pause()
    this.setState({ ...this.state, isPlaying: false })
  }

  updatePositionState = (pos) => {
    this.setState({ ...this.state, position: pos })
    this.props.onTimeUpdate(pos * this.refs.audio.duration)
  }

  reset = () => {
    this.setState({ ...this.state, position: 0, duration: 0, isPlaying: false })
  }

  /*
   * User event handlers
   */
  handleClickFave = () => {
    // Toggle fave
    if (this.props.isFavorite) this.props.unfave(this.props.song.id)
    else this.props.fave(this.props.song)
  }

  handleUpdateVolume = vol => {
    this.refs.audio.volume = vol / 100
    this.setState({ ...this.state, volume: this.refs.audio.volume })
  }

  handleUpdatePosition = pos => {
    this.refs.audio.position = pos / 100
    this.updatePositionState(this.refs.audio.position)
  }

  /*
   * Audio event handlers
   */
  handleAudioTimeupdate = () => {
    this.updatePositionState(this.refs.audio.position)
  }

  handleAudioLoadedmetadata = () => {
    this.setState({ ...this.state, duration: this.refs.audio.duration })
  }

  handleAudioCanplay = () => {
    if (this.state.isPlaying) {
      this.setPlay()
    }
  }

  handleAudioPlay = () => {
    if (this.data.lastPlayed === this.props.song.id) return
    this.data.lastPlayed = this.props.song.id
    this.props.onPlay(this.props.songIndex)
  }

  render () {
    const playerDisabled = !this.props.song

    const faveClass = this.props.isFavorite ? 'faved' : 'not-faved'

    return (
      <div id='player-component'>
        <ReactAudio
          ref='audio'
          source={this.props.song ? this.props.song.source : ''}
          onTimeupdate={this.handleAudioTimeupdate}
          onLoadedmetadata={this.handleAudioLoadedmetadata}
          onCanplay={this.handleAudioCanplay}
          onEnded={this.props.onEnded}
          onPlay={this.handleAudioPlay}
        />
        <Grid>
          <Row className='actions-row'>
            <Col sm={2} smOffset={1} className='fave'>
              <Button onClick={this.handleClickFave} disabled={playerDisabled} className={faveClass}>
                <Glyphicon glyph='heart' />
              </Button>
            </Col>
            <Col sm={2} className='playpause'>
              <Button
                onClick={() => this.state.isPlaying ? this.setPause() : this.setPlay()}
                disabled={playerDisabled}>
                <Glyphicon glyph={this.state.isPlaying ? 'pause' : 'play'} />
              </Button>
            </Col>
            <Col sm={2} className='skip' >
              <Button onClick={this.props.onSkip} disabled={playerDisabled}>
                <Glyphicon glyph='step-forward' />
              </Button>
            </Col>
            <Col sm={5} className='volume' >
              <Glyphicon glyph='volume-down' />
              <div className='slider'>
                <Rcslider
                  min={0}
                  max={100}
                  defaultValue={this.state.volume * 100}
                  tipFormatter={null}
                  onChange={this.handleUpdateVolume} />
              </div>
            </Col>
          </Row>
          <Row className='slidertrack-row row-no-padding'>
            <Col sm={2} className='current'>
              {this.time2string(this.state.position * this.state.duration)}
            </Col>
            <Col sm={8} className='slider'>
              <div className='slider-container'>
                <Rcslider
                  min={0}
                  step={0.1}
                  max={100}
                  value={this.state.position * 100}
                  tipFormatter={null}
                  onChange={this.handleUpdatePosition}
                  disabled={playerDisabled} />
              </div>
            </Col>
            <Col sm={2} className='total'>
              {this.time2string(this.state.duration)}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

