/**
 * HTML5 Tetris
 */


var Tetris = (function() {
    function Clone(s) {
        var p;
        for (p in s) {
            if (s.hasOwnProperty(p)) {
                this[p] = (typeof(s[p]) == 'object') ? new Clone(s[p]) : s[p];
            }
        }
    }


    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };


    function Block() {
        var r = Math.floor((Math.random() * Object.size(Blocks)));

        this.matrix = new Clone(Blocks[r].matrix);
        this.pivot = Blocks[r].pivot;
        this.color = Blocks[r].color;
        this.x = 4 * 30;
        this.y = 0;

        this.rotate = function() {
            var matrix = new Clone(this.matrix);

            for (var i = 3; i >= 0; i--) {
                for (var j = 0; j < 4; j++) {
                    this.matrix[3 - j][i] = matrix[i][j];
                }
            }
            // delete matrix;
        }
    }


    var Blocks = {
        0: {
            matrix: [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            pivot: [1, 1],
            color: '#174040'
        },
        1: {
            matrix: [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ],
            pivot : [1, 1],
            color: '#888c65'
        },
        2: {
            matrix: [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            pivot : [1, 1],
            color : '#d9cA9c'
        },
        3: {
            matrix: [
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            pivot : [1, 1],
            color : '#d98162'
        },
        4: {
            matrix: [
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            pivot : [1, 1],
            color: '#a65858'
        },
        5: {
            matrix: [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            pivot : [1, 1],
            color: '#788880'
        },
        6: {
            matrix: [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            pivot : [1, 1],
            color: '#79b7e7'
        }
    };


    var Tetris = {
        canvas : {},
        ctx: {},
        score: 0,
        interval: 0,
        settings: {
            width: 0,
            height: 0,
            block: 30,
            interval: 1000
        },
        scoreBlock: $,
        gameOver: $,
        pauseBlock: $,
        reset: function() {
            Tetris.gameOver.hide();
            Tetris.pauseBlock.hide();
            Tetris.board.matrix = [
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', '']
            ];
        },
        init : function(args) {
            Tetris.curBlock = new Block();

            Tetris.canvas = args.gameBoard;
            Tetris.ctx = Tetris.canvas[0].getContext('2d');

            Tetris.scoreBlock = args.scoreBlock;
            Tetris.gameOver = args.gameOver;
            Tetris.pauseBlock = args.pauseBlock;

            Tetris.settings.width = args.gameBoard.width();
            Tetris.settings.height = args.gameBoard.height();

            Tetris.reset();

            Tetris.interval = setInterval('Tetris.draw()', 10);
            Tetris.canvas.trigger('tetris.newgame');

            return Tetris;
        },
        curBlock: {},
        board: {
            add: function(block) {
                var row = parseInt(block.y / 30);
                var col = parseInt(block.x / 30);
                var r, c;
                for (r in block.matrix) {
                    if (!block.matrix.hasOwnProperty(r)) {
                        continue;
                    }
                    for (c in block.matrix) {  // TODO check if matrix[r]
                        if (!block.matrix.hasOwnProperty(c)) {
                            continue;
                        }
                        if (block.matrix[r][c]) {
                            Tetris.board.matrix[parseInt(r) + parseInt(row)][parseInt(c) + parseInt(col)] = block.color;
                        }
                    }
                }
            },
            matrix: [
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', '']
            ],
            deleteRow: function(row) {
                for (var c = 0; c < Tetris.board.matrix[row].length; c++) {
                    Tetris.board.matrix[row][c] = '';
                }
            },
            shiftRows: function(row) {
                for (var r = row; r > 0; r--) {
                    for (var c = 0; c < Tetris.board.matrix[r].length; c++) {
                        Tetris.board.matrix[r][c] =  Tetris.board.matrix[r - 1][c];
                    }
                }
            },
            checkRow: function() {
                for (var r = Tetris.board.matrix.length - 1; r >= 0; r--) {
                    var delRow = true;
                    for (var c = 0; c < Tetris.board.matrix[r].length; c++) {
                        if (Tetris.board.matrix[r][c] == '') {
                            delRow = false;
                        }
                    }
                    if (delRow) {
                        Tetris.board.deleteRow(r);
                        Tetris.board.shiftRows(r);
                        Tetris.score += 40;
                        r++;
                    }
                }
            }
        },
        newBlock: function() {
            Tetris.curBlock = new Block();
            if (!Tetris.check(Tetris.curBlock)) {
                clearInterval(Tetris.interval);
                Tetris.gameOver.show();
                Tetris.canvas.trigger('tetris.gameover');
            }
        },
        moveBlock: function() {
            var block = new Clone(Tetris.curBlock);
            block.y += 30;
            if (Tetris.check(block)) {
                Tetris.curBlock.y += 30;
            }
            else {
                Tetris.board.add(Tetris.curBlock);
                Tetris.board.checkRow();
                Tetris.newBlock();
            }
            Tetris.scoreBlock.html(Tetris.score);
        },
        timer: 0,
        draw: function() {
            Tetris.ctx.clearRect(0, 0, Tetris.settings.width, Tetris.settings.height);

            Tetris.ctx.fillStyle = '#ffffff';
            Tetris.ctx.beginPath();
            Tetris.ctx.rect(0, 0, Tetris.settings.width, Tetris.settings.height);
            Tetris.ctx.closePath();
            Tetris.ctx.fill();

            if (Tetris.timer == Tetris.settings.interval) {
                Tetris.moveBlock();
                Tetris.timer = 0;
            }

            var block = Tetris.curBlock;
            var r, c;
            for (r in block.matrix) {
                if (!block.matrix.hasOwnProperty(r)) {
                    continue;
                }
                for (c in block.matrix[r]) {
                    if (!block.matrix[r].hasOwnProperty(c)) {
                        continue;
                    }
                    if (block.matrix[r][c]) {
                        Tetris.ctx.fillStyle = block.color;
                        Tetris.ctx.beginPath();
                        Tetris.ctx.rect(block.x + c*30, block.y + r*30, Tetris.settings.block, Tetris.settings.block);
                        Tetris.ctx.closePath();
                        Tetris.ctx.fill();
                    }
                }
            }

            for (r in Tetris.board.matrix) {
                if (!Tetris.board.matrix.hasOwnProperty(r)) {
                    continue;
                }
                for (c in Tetris.board.matrix[r]) {
                    if (!Tetris.board.matrix[r].hasOwnProperty(c)) {
                        continue;
                    }
                    if (Tetris.board.matrix[r][c] != '') {
                        Tetris.ctx.fillStyle = Tetris.board.matrix[r][c];
                        Tetris.ctx.beginPath();
                        Tetris.ctx.rect(c * 30, r * 30, Tetris.settings.block, Tetris.settings.block);
                        Tetris.ctx.closePath();
                        Tetris.ctx.fill();
                    }
                }
            }

            Tetris.timer += 10;
        },
        check: function(block) {
            var newx = block.x;
            var newy = block.y;
            for (var r = 0; r < 4; r++) {
                for (var c = 0; c < 4; c++) {
                    var x = parseInt(eval((block.x / 30) + c));
                    var y = parseInt(eval((block.y / 30) + r));
                    if (block.matrix[r][c] && (block.y + r * 30 >= Tetris.settings.height)) {
                        return false;
                    }
                    if (block.matrix[r][c] && (newx + c * 30 < 0)) {
                        return false;
                    }
                    if (block.matrix[r][c] && (newx + c * 30 >= Tetris.settings.width)) {
                        return false;
                    }
                    if (block.matrix[r][c] && (Tetris.board.matrix[y][x] != '')) {
                        return false;
                    }
                }
            }
            return true;
        },
        pause: function() {
            if (Tetris.interval == 0) {
                if (Tetris && Tetris.pauseBlock && (typeof Tetris.pauseBlock.hide === 'function')) {
                    Tetris.pauseBlock.hide();
                }
                Tetris.interval = setInterval("Tetris.draw()", 10);
                Tetris.canvas.trigger('tetris.resume');
            } else {
                clearInterval(Tetris.interval);
                Tetris.canvas.trigger('tetris.pause');
                Tetris.interval = 0;
                if (Tetris && Tetris.pauseBlock && (typeof Tetris.pauseBlock.hide === 'function')) {
                    Tetris.pauseBlock.show();
                }
            }
        },
        keyBindings: function(key, e) {
            var block;
            switch (key) {
                case 37:  // Left
                    block = new Clone(Tetris.curBlock);
                    block.x -= 30;
                    if (Tetris.check(block))
                        Tetris.curBlock.x -= 30;
                    // delete block;
                    break;
                case 39:  // Right
                    block = new Clone(Tetris.curBlock);
                    block.x += 30;
                    if (Tetris.check(block))
                        Tetris.curBlock.x += 30;
                    // delete block;
                    break;
                case 40:  // Drop
                    block = new Clone(Tetris.curBlock);
                    block.y += 30;
                    if (Tetris.check(block))
                        Tetris.curBlock.y += 30;
                    // delete block;
                    break;
                case 38:  // Rotate
                    block = new Clone(Tetris.curBlock);
                    block.rotate();
                    if (Tetris.check(block))
                        Tetris.curBlock.rotate();
                    // delete block;
                    break;
                case 27:  // Esc
                    Tetris.pause();
                    break;
            }
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    };

    return Tetris;
})();
