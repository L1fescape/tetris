import * as React from 'react'
import { defaults } from 'lodash'

export interface TetrisConfig {
  rows: number
  columns: number
  width: number
  height: number
  blockSize: number
  autostart: boolean
}

export interface Props {
  config?: Partial<TetrisConfig>
}

const defaultConfig: TetrisConfig = {
  rows: 20,
  columns: 10,
  width: 10,
  height: 20,
  blockSize: 30,
  autostart: false,
}

export interface State {
  config: TetrisConfig
}

export class Tetris extends React.Component<Props> {
  gameCanvas: HTMLCanvasElement | null
  state: State = {
    config: defaultConfig
  }

  constructor(props) {
    super(props)
    this.state = {
      config: defaults(this.props.config, this.state.config)
    }
  }

  componentDidMount() {
    requestAnimationFrame(this.draw)
  }

  public render() {
    return (
      <canvas ref={(ref) => this.gameCanvas = ref} />
    )
  }

  private draw = () => {
    console.log('draw')
    if (!this.gameCanvas) return
    const ctx = this.gameCanvas.getContext('2d')
    if (!ctx) return

    const { config } = this.state
    console.log(config)

    // clear screen
    ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
    //
    ctx.fillStyle = 'blue'
    ctx.beginPath()
    ctx.rect(0, 0, config.width, config.height)
    ctx.closePath()
    ctx.fill()
  }
}