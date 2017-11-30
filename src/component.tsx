import * as React from 'react'
import { Blocks, TetrisConfig, TetrisGameState } from './models'
import { defaults } from 'lodash'

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
  game: TetrisGameState
}

export class Tetris extends React.Component<Props> {
  gameCanvas: HTMLCanvasElement | null
  state: State = {
    config: defaultConfig,
    game: {
      grid: null,
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      config: {
        ...this.state.config,
        ...this.props.config, 
      }
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

    const { config, game } = this.state

    // clear screen
    ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
    //
    ctx.fillStyle = 'blue'
    ctx.beginPath()
    ctx.rect(0, 0, config.width, config.height)
    ctx.closePath()
    ctx.fill()

    for (var r = 0; r < game.grid.length; r++) {
      for (var c = 0; c < game.grid[r].length; c++) {
        if (game.grid[r][c] != '') {
          ctx.fillStyle = game.grid[r][c]
          ctx.beginPath()
          var x = c * config.blockSize
          var y = r * config.blockSize
          ctx.rect(x, y, config.blockSize, config.blockSize)
          ctx.closePath()
          ctx.fill()
        }
      }
    }
  }
}