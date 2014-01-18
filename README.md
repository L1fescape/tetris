HTML5-Tetris-2
==============


HTML5 based Tetris (Canvas etc.)


== Usage == 

var options = { 
  gameBoard: $('#gameBoard'), 
  scoreBlock: $('#scoreBlock'), 
  gameOver: $('#gameOver'), 
  pauseBlock: $('#pauseBlock') 
}; 

var game = Tetris.init(options); 


== Available events == 

* tetris.newgame — triggers when new game started; 
* tetris.gameover — triggers when game is over, also, the score is passed in data param; 
* tetris.pause — triggers when the game is paused; 
* tetris.resume — triggers when the game is resumed after pause; 


== Useful methods == 

* keyBindings(e, data) — handler of the game keyboard input; 
