import { Block, Blocks, BlockQueue, TetrisGameState, TetrisConfig, TetrisGrid, BlockWithPosition } from './models'

export function gameTick(oldGame: TetrisGameState, config: TetrisConfig): TetrisGameState {
    let game: TetrisGameState = {
        ...oldGame,
        grid: cloneGrid(oldGame.grid, config)
    }
    // check if the current block can move. if it can't set it on the grid.
    if (game.currentBlock) {
        const tmpBlock: BlockWithPosition = {
            ...game.currentBlock,
            position: {
                ...game.currentBlock.position,
                x: game.currentBlock.position.x + 1
            }
        }
        if (!validPosition(tmpBlock, game.grid)) {
            game.grid = addBlock(game.currentBlock, game.grid, config)
            game.currentBlock = undefined
        } else {
            game.currentBlock = tmpBlock
        }
    }
    // remove any rows that are empty
    game.grid = removeEmptyRows(game.grid, config)
    // todo(amk): calculate score
    // fill in missing rows back in at the top
    for (let i = 0; i < config.rows - game.grid.length; i++) {
        game.grid.unshift(Array(config.columns).fill(''))
    }
    // get a new block from the queue if there isnt' one
    game.blockQueue = getAndPopulateBlockQueue(game.blockQueue, config)
    if (!game.currentBlock) {
        game.currentBlock = game.blockQueue.pop()
    }
    game.lastUpdate = new Date().getTime()
    return game
}

export function cloneGrid(grid: TetrisGrid, config: TetrisConfig): TetrisGrid {
    const newGrid = [...Array(config.rows).keys()].map(i => Array(config.columns).fill(''))
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            newGrid[i][j] = grid[i][j]
        }
    }
    return newGrid
}

// shift all grid blocks and current block down
function removeEmptyRows(grid: TetrisGrid, config: TetrisConfig): TetrisGrid {
    const newGrid = cloneGrid(grid, config)
    // check if the current block can be shifted. if it can't unset it and add it to the grid
    // check which rows should be removed
    for (let r = grid.length - 1; r >= 0; r--) {
        let delRow = true
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] == '') {
                delRow = false
                break
            }
        }
        if (delRow) {
            newGrid.splice(r, 1)
        }
    }
    return newGrid
}

function validPosition(statefulBlock: BlockWithPosition, grid: TetrisGrid): boolean {
    const { block, position } = statefulBlock
    if (position.x + block.matrix.length > grid.length) {
        return false
    }
    if (position.y + block.matrix[0].length > grid[0].length) {
        return false
    }
    return true
}

// copy over from the existing queue and populate empty items
function getAndPopulateBlockQueue(queue: BlockQueue, config: TetrisConfig): BlockQueue {
    const newQueue: BlockQueue = []
    for (let i = 0; i < config.queueLength; i++) {
        if (queue[i]) {
            newQueue.push(queue[i])
        } else {
            const keys = Object.keys(Blocks)
            newQueue[i] = {
                block: Blocks[keys[keys.length * Math.random() << 0]],
                position: {
                    x: 0,
                    y: Math.floor(config.columns/2),
                }
            }
        }
    }
    return newQueue
}

export function addBlock(statefulBlock: BlockWithPosition, grid: TetrisGrid, config: TetrisConfig): TetrisGrid {
    if (!config.rows || !config.columns) {
        return { ...grid }
    }
    const { block, position } = statefulBlock
    const newGrid = cloneGrid(grid, config)
    // write new block to grid
    for (let i = 0; i < block.matrix.length; i++) {
        for (let j = 0; j < block.matrix[i].length; j++) {
            if (block.matrix[i][j]) {
                // todo(amk): check bounds
                newGrid[i + position.x][Math.floor(grid[0].length / 2) + j] = config.colors[block.name]
            }
        }
    }
    return newGrid
}