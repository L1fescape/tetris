export interface TetrisConfig {
  rows: number
  columns: number
  width: number
  height: number
  blockSize: number
  autostart: boolean
}

export interface TetrisGameState {
  grid: any
}

export interface Block {
  name: string
  matrix: number[][]
}

export const Blocks: Block[] = [{
  name: 'i',
  matrix: [
    [1, 1, 1, 1],
  ],
}, {
  name: 'o',
  matrix: [
    [1, 1],
    [1, 1],
  ],
}, {
  name: 't',
  matrix: [
    [0, 1, 0],
    [1, 1, 1],
  ],
}, {
  name: 's',
  matrix: [
    [0, 1, 1],
    [1, 1, 0],
  ],
}, {
  name: 'z',
  matrix: [
    [1, 1, 0],
    [0, 1, 1],
  ],
}, {
  name: 'j',
  matrix: [
    [1, 0, 0],
    [1, 1, 1],
  ],
}, {
  name: 'l',
  matrix: [
    [0, 0, 1],
    [1, 1, 1],
  ],
}]