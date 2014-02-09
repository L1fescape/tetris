# HTML5 Tetris
> Tetris in the browser! 


## Usage

```
var options = { 
  gameBoard: document.getElementById('gameBoard'), 
  scoreBlock: document.getElementById('score'), 
  gameOver: document.getElementById('gameOver'), 
  pauseBlock: document.getElementById('pauseBlock') 
};
document.onkeydown = function(e) {
  Tetris.keyBindings(e.which, e);
}
var game = Tetris.init(options);
```

## Available Events

* `newgame` — triggers when new game started; 
* `gameover` — triggers when game is over, also, the score is passed in data param; 
* `pause` — triggers when the game is paused; 
* `resume` — triggers when the game is resumed after pause; 

## Useful Methods

* `keyBindings(keyCode, event)` — handler of the game keyboard input; 
