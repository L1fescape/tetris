import {
    Block,
    Blocks,
    BlockQueue,
    TetrisGameState,
    TetrisConfig,
    TetrisGrid,
    BlockWithPosition,
    MoveDirection,
} from './models'

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
                y: game.currentBlock.position.y + 1
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
    for (let y = 0; y < block.matrix.length; y++) {
        for (let x = 0; x < block.matrix[y].length; x++) {
            if (block.matrix[y][x]) {
                if (position.x < 0) {
                    return false
                }
                if (position.x + x >= grid[0].length) {
                    return false
                }
                if (position.y + y >= grid.length) {
                    return false
                }
                if (grid[position.y + y][position.x + x]) {
                    return false
                }
            }
        }
    }
    return true
}

function getRandomBlock(): Block {
    const keys = Object.keys(Blocks)
    return Blocks[keys[keys.length * Math.random() << 0]]
}

// copy over from the existing queue and populate empty items
function getAndPopulateBlockQueue(queue: BlockQueue, config: TetrisConfig): BlockQueue {
    const newQueue: BlockQueue = []
    for (let i = 0; i < config.queueLength; i++) {
        if (queue[i]) {
            newQueue.push(queue[i])
        } else {
            newQueue[i] = {
                block: getRandomBlock(),
                position: {
                    x: Math.floor(config.columns/2),
                    y: 0,
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
    for (let y = 0; y < block.matrix.length; y++) {
        for (let x = 0; x < block.matrix[y].length; x++) {
            if (block.matrix[y][x]) {
                // todo(amk): check bounds
                newGrid[position.y + y][position.x + x] = config.colors[block.name]
            }
        }
    }
    return newGrid
}

function rotateMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length
    const cols = matrix[0].length
    const newMatrix = [...Array(cols).keys()].map(i => Array(rows))
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newMatrix[c][rows - r] = matrix[r][c]
        }
    }
    return newMatrix
}

export function moveCurrentPiece(direction: MoveDirection, currentBlock: BlockWithPosition, grid: TetrisGrid, config: TetrisConfig): BlockWithPosition {
    if (direction === MoveDirection.Left) {
        const tmpBlock: BlockWithPosition = {
            ...currentBlock,
            position: {
                ...currentBlock.position,
                x: currentBlock.position.x - 1
            }
        }
        return validPosition(tmpBlock, grid) ? tmpBlock : currentBlock
    }
    if (direction === MoveDirection.Right) {
        const tmpBlock: BlockWithPosition = {
            ...currentBlock,
            position: {
                ...currentBlock.position,
                x: currentBlock.position.x + 1
            }
        }
        return validPosition(tmpBlock, grid) ? tmpBlock : currentBlock
    }
    if (direction === MoveDirection.Rotate) {
        const tmpBlock: BlockWithPosition = {
            ...currentBlock,
            block: {
                ...currentBlock.block,
                matrix: rotateMatrix(currentBlock.block.matrix),
            },
        }
        return validPosition(tmpBlock, grid) ? tmpBlock : currentBlock
    }
    if (direction === MoveDirection.Down) {
        const tmpBlock: BlockWithPosition = {
            ...currentBlock,
            position: {
                ...currentBlock.position,
                y: currentBlock.position.y + 1
            }
        }
        return validPosition(tmpBlock, grid) ? tmpBlock : currentBlock
    }
    return currentBlock
}