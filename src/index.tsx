import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Controls from './components/Controls'
import Layout from './components/Layout'
import createTime from './utils/time'

const UNKNOWN_WIDTH = -1

interface ScaleProps {
  start: Date
  end: Date
  zoom: number
  zoomMin?: number
  zoomMax?: number
  minWidth?: number
}

interface TimelineProps {
  scale: ScaleProps
  timebar: any
  tracks: object[]
  isOpen?: boolean
  toggleOpen?: () => void
  zoomIn?: () => void
  zoomOut?: () => void
  clickElement?: () => void
  clickTrackButton?: () => void
  now?: Date
  toggleTrackOpen: (track: any) => void
  enableSticky?: boolean
  scrollToNow?: boolean
}

interface TimelineState {
  timelineViewportWidth: number
  sidebarWidth: number
  time: any
}

class Timeline extends Component<TimelineProps, TimelineState> {
  public static propTypes = {
    scale: PropTypes.shape({
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired,
      zoom: PropTypes.number.isRequired,
      zoomMin: PropTypes.number,
      zoomMax: PropTypes.number,
      minWidth: PropTypes.number,
    }),
    isOpen: PropTypes.bool,
    toggleOpen: PropTypes.func,
    zoomIn: PropTypes.func,
    zoomOut: PropTypes.func,
    clickElement: PropTypes.func,
    clickTrackButton: PropTypes.func,
    timebar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    tracks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    now: PropTypes.instanceOf(Date),
    toggleTrackOpen: PropTypes.func,
    enableSticky: PropTypes.bool,
    scrollToNow: PropTypes.bool,
  }

  constructor(props: TimelineProps) {
    super(props)
    const timelineViewportWidth = UNKNOWN_WIDTH
    const sidebarWidth = UNKNOWN_WIDTH
    this.state = {
      timelineViewportWidth,
      sidebarWidth,
      time: createTime({ ...props.scale, viewportWidth: timelineViewportWidth }),
    }
  }

  public componentWillReceiveProps(nextProps: TimelineProps) {
    const { scale } = this.props
    const { timelineViewportWidth } = this.state

    if (nextProps.scale !== scale) {
      const time = createTime({
        ...nextProps.scale,
        viewportWidth: timelineViewportWidth,
      })
      this.setState({ time })
    }
  }

  public handleLayoutChange = (
    { timelineViewportWidth, sidebarWidth }: { timelineViewportWidth: number; sidebarWidth: number },
    cb?: () => void
  ) => {
    const { scale } = this.props
    const time = createTime({
      ...scale,
      viewportWidth: timelineViewportWidth,
    })
    this.setState(
      {
        time,
        timelineViewportWidth,
        sidebarWidth,
      },
      cb
    )
  }

  public render() {
    const {
      isOpen = true,
      toggleOpen,
      zoomIn,
      zoomOut,
      scale: { zoom, zoomMin, zoomMax },
      tracks,
      now,
      timebar,
      toggleTrackOpen,
      enableSticky = false,
      scrollToNow,
    } = this.props

    const { time, timelineViewportWidth, sidebarWidth } = this.state

    const { clickElement, clickTrackButton } = this.props

    return (
      <div className="rt">
        <Controls
          isOpen={isOpen}
          toggleOpen={toggleOpen}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoom={zoom}
          zoomMin={zoomMin}
          zoomMax={zoomMax}
        />
        <Layout
          enableSticky={enableSticky}
          now={now}
          tracks={tracks}
          timebar={timebar}
          toggleTrackOpen={toggleTrackOpen}
          scrollToNow={scrollToNow}
          time={time}
          isOpen={isOpen}
          onLayoutChange={this.handleLayoutChange}
          timelineViewportWidth={timelineViewportWidth}
          sidebarWidth={sidebarWidth}
          clickElement={clickElement}
          clickTrackButton={clickTrackButton}
        />
      </div>
    )
  }
}

export default Timeline
export { TimelineProps, ScaleProps }
