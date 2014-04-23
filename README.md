# Tetris
> Tetris in the browser! 

## Installation

Clone this repo:

```
git clone https://github.com/akenn/HTML5-Tetris
```

## Running

Load `index.html` in the browser via your favorite web server.

I like to use python's built in one. 

If you're using python2, run:

```
python -m SimpleHTTPServer
```

If you're on python3:

```
python -m http.server
```

(you can check which version with `python --version`)

Then navigate to `http://localhost:8000/`

That'll start a web server on port 8000. If you'd like to choose another port, pass it in as an argument. For example:

```
python -m http.server 1337
```

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

## Todo

* Mobile bindings
