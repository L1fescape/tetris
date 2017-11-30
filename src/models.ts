export interface TetrisConfig {
  rows: number
  columns: number
  autostart: boolean
  colors: {[key: string]: string}
  updateInterval: number
  queueLength: number
  fps: number
}

export type TetrisGrid = string[][]
 
export interface BlockWithPosition {
  position: {
    x: number
    y: number
  }
  block: Block
}

export type BlockQueue = BlockWithPosition[]

export interface TetrisGameState {
  grid: TetrisGrid
  lastUpdate: number
  currentBlock: BlockWithPosition | void
  blockQueue: BlockQueue
}

export interface Block {
  name: string
  matrix: number[][]
}

export const Blocks: {[key: string]: Block} = {
  i: {
    name: 'i',
    matrix: [
      [1, 1, 1, 1],
    ],
  },
  o: {
    name: 'o',
    matrix: [
      [1, 1],
      [1, 1],
    ],
  },
  t: {
    name: 't',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  s: {
    name: 's',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  z: {
    name: 'z',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  j: {
    name: 'j',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  l: {
    name: 'l',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
}