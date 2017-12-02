import * as React from 'react'
import { Blocks, TetrisConfig, TetrisGameState, MoveDirection } from './models'
import { addBlock, cloneGrid, gameTick, moveCurrentPiece } from './helpers'
import { defaults } from 'lodash'

const defaultConfig: TetrisConfig = {
  rows: 20,
  columns: 10,
  autostart: false,
  queueLength: 4,
  fps: 60,
  updateInterval: 0.5 * 1000,
  colors: {
    i: '#568C87',
    o: '#F2EEB3',
    t: '#E1B753',
    s: '#326773',
    z: '#6D7D6B',
    j: '#A67C6D',
    l: '#D9B18F',
  }
}

const defaultGameState: TetrisGameState = {
  grid: [],
  currentBlock: undefined,
  blockQueue: [],
  lastUpdate: 0,
}

export interface Props {
  config?: Partial<TetrisConfig>
  width?: number
  height?: number
}

export interface State {
  config: TetrisConfig
  game: TetrisGameState
}

export class Tetris extends React.Component<Props, State> {
  gameCanvas: HTMLCanvasElement | null

  constructor(props) {
    super(props)
    const config = { ...defaultConfig, ...this.props.config }
    this.state = {
      ...this.state,
      game: {
        ...defaultGameState,
        grid: cloneGrid([], config),
      },
      config,
    }
  }

  // todo(amk): make cancellable
  private loop = () => {
    const { config, game } = this.state
    const promises: Promise<void>[] = []
    if (!game.lastUpdate || game.lastUpdate + config.updateInterval < new Date().getTime()) {
      promises.push(new Promise(resolve => {
        this.setState({
          game: gameTick(game, config)
        }, resolve)
      }))
    }
    return Promise.all(promises).then(() => {
      requestAnimationFrame(this.draw)
      setTimeout(this.loop, Math.round(1000 / config.fps))
    })
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    this.loop()
  }

  private handleKeyDown = (e) => {
    const { config, game } = this.state
    if (!game.currentBlock) {
      return
    }
    const keyMap = {
      38: MoveDirection.Rotate,
      37: MoveDirection.Left,
      39: MoveDirection.Right,
      40: MoveDirection.Down,
    }
    const direction = keyMap[e.which]
    if (direction) {
      this.setState({
        game: {
          ...game,
          currentBlock: moveCurrentPiece(direction, game.currentBlock, game.grid, config),
        }
      })
    }
  }

  public render() {
    return (
      <canvas
        width={this.props.width || 150}
        height={this.props.height || 300}
        ref={(ref) => this.gameCanvas = ref}
      />
    )
  }

  private draw = () => {
    if (!this.gameCanvas) return
    const ctx = this.gameCanvas.getContext('2d')
    if (!ctx) return

    const { config, game } = this.state
    let newGrid = [...game.grid] // todo(amk): y
    // add the current block to the grid so it can be rendered
    if (game.currentBlock) {
        newGrid = addBlock(game.currentBlock, newGrid, config)
    }
    // clear screen
    const { clientWidth, clientHeight } = this.gameCanvas
    const blockSize = {
      width: clientWidth / config.columns,
      height: clientHeight / config.rows,
    }
    ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
    // draw game state
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length; c++) {
        if (newGrid[r][c] !== '') {
          ctx.fillStyle = newGrid[r][c]
          ctx.beginPath()
          var x = c * blockSize.width
          var y = r * blockSize.height
          ctx.rect(x, y, Math.round(blockSize.width), Math.round(blockSize.height))
          ctx.closePath()
          ctx.fill()
        }
      }
    }
  }
}