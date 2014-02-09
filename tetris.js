function Tetris(config) {

  var canvas = {},
      ctx = {},
      scoreBlock,
      pauseBlock,
      settings = {
        width: config.width || 10, // number of columns
        height: config.height || 20, // number of rows
        blockSize: config.blockSize || 30,
        interval: config.interval || 100,
        autostart: (typeof config.autostart != 'undefined') ? config.autostart : true,
      },
      game = {
        width: settings.width * settings.blockSize,
        height: settings.height * settings.blockSize,
        score: 0,
        curBlock: {},
        grid: [],
        interval: 0,
        timer: 0,
        createGrid: function(r, c) {
          var grid = [];
          for (var i = 0; i < c; i++) {
            grid[i] = [];
            for (var j = 0; j < r; j++) {
              grid[i].push('');
            }
          };
          return grid;
        },
        add: function(block) {
          for (var r = 0; r < block.matrix.length; r++) {
            for (var c = 0; c < block.matrix[r].length; c++) {
              if (block.matrix[r][c]) {
                game.grid[r + block.y][c + block.x] = block.color;
              }
            }
          }
        },
        deleteRow: function(row) {
          for (var c = 0; c < game.grid[row].length; c++) {
            game.grid[row][c] = '';
          }
        },
        shiftRows: function(row) {
          for (var r = row; r > 0; r--) {
            for (var c = 0; c < game.grid[r].length; c++) {
              game.grid[r][c] =  game.grid[r - 1][c];
            }
          }
        },
        checkRow: function() {
          for (var r = game.grid.length - 1; r >= 0; r--) {
            var delRow = true;
            for (var c = 0; c < game.grid[r].length; c++) {
              if (game.grid[r][c] == '') {
                delRow = false;
              }
            }
            if (delRow) {
              game.deleteRow(r);
              game.shiftRows(r);
              game.score += 40;
              r++;
            }
          }
        },
        newBlock: function() {
          game.curBlock = new Block();
          if (!game.check(game.curBlock)) {
            clearInterval(game.interval);
            trigger('gameover');
          }
        },
        moveBlock: function() {
          var block = clone(game.curBlock);
          block.y += 1;
          if (game.check(block)) {
            game.curBlock.y += 1;
          }
          else {
            game.add(game.curBlock);
            game.checkRow();
            game.newBlock();
          }
        },
        draw: function() {
          ctx.clearRect(0, 0, game.width, game.height);

          ctx.fillStyle = '#F2F2F2';
          ctx.beginPath();
          ctx.rect(0, 0, game.width, game.height);
          ctx.closePath();
          ctx.fill();

          if (game.timer >= settings.interval) {
            game.moveBlock();
            game.timer = 0;
          }

          // draw current block
          var block = game.curBlock;
          for (var r = 0; r < block.matrix.length; r++) {
            for (var c = 0; c < block.matrix[r].length; c++) {
              if (block.matrix[r][c]) {
                ctx.fillStyle = block.color;
                ctx.beginPath();
                var x = (block.x + c) * settings.blockSize;
                var y = (block.y + r) * settings.blockSize;
                ctx.rect(x, y, settings.blockSize, settings.blockSize);
                ctx.closePath();
                ctx.fill();
              }
            }
          }

          // draw existing blocks
          for (var r = 0; r < game.grid.length; r++) {
            for (var c = 0; c < game.grid[r].length; c++) {
              if (game.grid[r][c] != '') {
                ctx.fillStyle = game.grid[r][c];
                ctx.beginPath();
                var x = c * settings.blockSize;
                var y = r * settings.blockSize;
                ctx.rect(x, y, settings.blockSize, settings.blockSize);
                ctx.closePath();
                ctx.fill();
              }
            }
          }

          // update score
          scoreBlock.innerHTML = game.score;

          trigger('draw');

          game.timer += 10;
        },
        check: function(block) {
          for (var r = 0; r < block.matrix.length; r++) {
            for (var c = 0; c < block.matrix[r].length; c++) {
              if (block.matrix[r][c]) {
                if (block.y + r >= settings.height) {
                  return false;
                }
                if (block.x + c < 0) {
                  return false;
                }
                if (block.x + c >= game.width) {
                  return false;
                }
                if (game.grid[block.y + r][block.x + c] != '') {
                    return false;
                }
              }
            }
          }
          return true;
        },
      },
      reset = function() {
        if (gameOver && gameOver.style)
          gameOver.style.display = "none";
        game.grid = game.createGrid(settings.width, settings.height);

        trigger('reset');
        trigger('resume');
      },
      pause = function() {
        if (game.interval == 0) {
          game.interval = setInterval(game.draw, settings.interval);
          if (pauseBlock && pauseBlock.style) {
            pauseBlock.style.display = "none";
          }
          trigger('resume');
        } 
        else {
          clearInterval(game.interval);
          game.interval = 0;
          if (pauseBlock && pauseBlock.style)
            pauseBlock.style.display = "block";
          trigger('pause');
        }
      },
      keyBindings = function(e) {
        var block,
            key = e.which,
            matchedKey = false;
        switch (key) {
          case 37:  // Left
            block = clone(game.curBlock);
            block.x -= 1;
            if (game.check(block))
              game.curBlock.x -= 1;
            matchedKey = true;
            break;
          case 39:  // Right
            block = clone(game.curBlock);
            block.x += 1;
            if (game.check(block))
              game.curBlock.x += 1;
            matchedKey = true;
            break;
          case 40:  // Drop
            game.curBlock.y += 1;
            if (!game.check(game.curBlock))
              game.curBlock.y -= 1;
            matchedKey = true;
            break;
          case 38:  // Rotate
            game.curBlock.rotate();
            if (!game.check(game.curBlock))
              game.curBlock.rotate(-1);
            matchedKey = true;
            break;
          case 27:  // Esc
            Tetris.pause();
            matchedKey = true;
            break;
        }
        if (matchedKey) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      },
      init = function() {
        game.curBlock = new Block();

        config.gameBoard.width = game.width;
        config.gameBoard.height = game.height;

        canvas = config.gameBoard;
        ctx = canvas.getContext('2d');

        scoreBlock = config.scoreBlock;
        gameOver = config.gameOver;
        pauseBlock = config.pauseBlock;

        document.onkeydown = function(e) {
          keyBindings(e);
        };

        reset();

        game.interval = setInterval(game.draw, settings.interval);

        trigger('newgame');
      }


  // Event Methods
  var events = {};
  var on = function(id, callback, once) {
    if (!callback)
      return;

    if (!events[id])
      events[id] = [];

    once = once || false;

    events[id].push({callback: callback, once: once});
  }
  var once = function(id, callback) {
    this.on(id, callback, true);
  }
  var off = function(id, callback) {
    var newEvents = [];
    
    if (!events[id])
      return;

    if (!callback) {
      events[id] = [];
      return;
    }

    for (var i = 0; i < events[id].length; i++) {
      if (events[id][i].callback.toString() != callback.toString())
        newEvents.push(events[id][i]);
    }
    events[id] = newEvents;
  }
  var trigger = function(id, args) {
    if (!events[id])
      return;
    for (var i = 0; i < events[id].length; i++) {
      events[id][i].callback(args);
    }
  }




  // Helper methods
  function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (typeof obj == 'array')
      return obj.slice(0);
 
    var temp = obj.constructor();
    for (var key in obj) {
        temp[key] = clone(obj[key]);
    }
 
    return temp;
  }


  // Blocks and block functions
  function Block()  {
    var r = Math.floor((Math.random() * blocks.length)),
        matrix = clone(blocks[r].matrix),
        color = blocks[r].color,
        x = Math.round(settings.width/2),
        y = 0,
        rotate = function(dir) {
          dir = dir || 1;
          var m = clone(matrix);

          for (var i = 3; i >= 0; i--) {
            for (var j = 0; j < 4; j++) {
              if (dir == -1)
                matrix[j][3 - i] = m[i][j];
              else
                matrix[3 - j][i] = m[i][j];
            }
          }
        };

    return {
      x: x,
      y: y,
      matrix: matrix,
      rotate: rotate,
      color: color
    };
  }


  var blocks = [{
      matrix: [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
      ],
      color: '#326773'
    }, {
      matrix: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ],
      color: '#568C87'
    }, {
      matrix: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      color : '#F2EEB3'
    }, {
      matrix: [
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
      ],
      color : '#D9B18F'
    }, {
      matrix: [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#A67C6D'
    }, {
      matrix: [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#788880'
    }, {
      matrix: [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#FFC045'
    }
  ];

    // init
    if (settings.autostart)
      init();


  return {
    init: init,
    reset: reset,
    pause: pause,
    events: {
      on: on,
      off: off,
      once: once,
      trigger: trigger
    }
  }
}
