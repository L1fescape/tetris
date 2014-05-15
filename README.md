# Tetris
> A zero-dependency implementation of Tetris in the browser

## Exampe Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tetris</title>
</head>
<body>
  <canvas id="gameBoard"></canvas>
</body>

<script>  
// create an instance of the game with options
var game = Tetris.init({ 
  gameBoard : document.getElementById('gameBoard'),
  autostart : false,
  eventListener : document.onkeydown
});
</script>
</html>
```

## Events

* `newgame` — triggers when new game started
* `gameover(score)` — triggers when game is over. `score` is passed with the event.
* `pause` — triggers when the game is paused
* `resume` — triggers when the game is resumed
