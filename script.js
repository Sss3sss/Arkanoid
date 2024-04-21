//variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 5; // Radio de la bola
var x = canvas.width / 2; // Posición inicial de la bola en el eje x
var y = canvas.height - 30; // Posición inicial de la bola en el eje y
var dx = 2; // Velocidad de desplazamiento en el eje x
var dy = -2; // Velocidad de desplazamiento en el eje y
var paddleHeight = 5; // Altura de la barra
var paddleWidth = 50; // Ancho de la barra
var paddleX = (canvas.width - paddleWidth) / 2; // Posición inicial de la barra en el eje x
var rightPressed = false; // Variable para verificar si se está presionando la tecla derecha
var leftPressed = false; // Variable para verificar si se está presionando la tecla izquierda
var gameOverConfirmationShown = false; // Variable para verificar si se ha mostrado la confirmación de fin de juego
//score
var score = 0; // Puntuación inicial
//colores aleatorios
var brickColors = [
  "#FF5733",
  "#FFBD33",
  "#33FF57",
  "#33C7FF",
  "#5733FF",
  "#FF33E6",
  "#FFE833",
  "#33FFD9",
  "#FF335E",
  "#6B33FF",
];
//muro de bloques
var brickRowCount = 15; // Número de filas de bloques
var brickColumnCount = 20; // Número de columnas de bloques
var brickWidth = 20; // Ancho de cada bloque
var brickHeight = 5; // Altura de cada bloque
var brickPadding = 1; // Espaciado entre los bloques
var brickOffsetTop = 30; // Espacio desde la parte superior del lienzo hasta el primer bloque
var brickOffsetLeft = 30; // Espacio desde el borde izquierdo del lienzo hasta el primer bloque
var gameover = false; // Variable para verificar si el juego ha terminado
var bricks = [];
// Inicialización de la matriz de ladrillos
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // Cada ladrillo tiene una posición y estado inicial
  }
}

// Event listeners para detectar teclas presionadas y liberadas, tambien escucha el movimiento del raton
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Función para manejar el evento de tecla presionada
function keyDownHandler(e) {
  if (e.keyCode == 68 || e.keyCode == 39) {
    rightPressed = true; // Si se presiona la tecla derecha, establece rightPressed en verdadero
  } else if (e.keyCode == 65 || e.keyCode == 37) {
    leftPressed = true; // Si se presiona la tecla izquierda, establece leftPressed en verdadero
  }
}

// Función para manejar el evento de tecla liberada
function keyUpHandler(e) {
  if (e.keyCode == 68 || e.keyCode == 39) {
    rightPressed = false; // Si se libera la tecla derecha, establece rightPressed en falso
  } else if (e.keyCode == 65 || e.keyCode == 37) {
    leftPressed = false; // Si se libera la tecla izquierda, establece leftPressed en falso
  }
}

// Función para dibujar la bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red"; // Color de la bola (en este caso, rojo)
  ctx.fill();
  ctx.closePath();
}

// Función para dibujar la barra del jugador
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "rgb(255, 0, 200)"; // Color de la barra (en este caso, un tono de rosa)
  ShadowRoot = "rgb(255, 0, 200)"; // ¿Esto debería ser algo diferente?
  ctx.fill();
  ctx.closePath();
}

// Función principal de dibujo que se ejecuta repetidamente
function draw() {
  // Limpia el lienzo para dibujar nuevos elementos en cada fotograma
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Dibuja los bloques, la bola, la barra y la puntuación
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection(); // Comprueba si la bola colisiona con algún bloque

  // Controla el rebote de la bola en los bordes del lienzo
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // Reproduce el sonido antes de mostrar el aviso de "GAME OVER"
      document.getElementById("Mario").play();

      // Retrasa la aparición del aviso de "GAME OVER" durante 500 milisegundos
      setTimeout(function () {
        if (!gameOverConfirmationShown) {
          var restartConfirmation = confirm(
            "GAME OVER. ¿Quieres jugar de nuevo?"
          );
          if (restartConfirmation) {
            document.location.reload();
          }
          gameover = true;
          gameOverConfirmationShown = true;
        }
      }, 500); // 500 milisegundos (0.5 segundos)
    }
  }

  // Controla el movimiento horizontal de la barra
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 4; // Incrementa la posición x de la barra hacia la derecha
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 4; // Decrementa la posición x de la barra hacia la izquierda
  }

  // Actualiza la posición de la bola en cada fotograma
  x += dx;
  y += dy;
}

// Reinicia el juego cuando se hace clic en el lienzo después de que termine el juego
canvas.addEventListener("click", function () {
  if (gameover) {
    document.location.reload();
  }
});

// Llama a la función draw repetidamente para animar el juego
setInterval(draw, 10);

// Función para dibujar los bloques en el lienzo
function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        // Calcula un índice basado en la posición de la columna y la fila
        var colorIndex = (c * brickRowCount + r) % brickColors.length;
        // Asigna un color diferente a cada ladrillo
        ctx.fillStyle = brickColors[colorIndex];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Función para detectar colisiones entre la bola y los bloques
function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          //integrar sonido en la rotura de bloques, primero pauso el anterior sonid, luego vuelvo a reproducirlo
          document.getElementById("bloqueroto").pause();
          document.getElementById("bloqueroto").currentTime = 0;
          document.getElementById("bloqueroto").play(); // Reproduce el sonido
          if (score == brickRowCount * brickColumnCount) {
            alert("GANASTE!!, FELICIDADES, - 10 MIN DE TU VIDA!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Función para dibujar la puntuación en el lienzo
function drawScore() {
  ctx.font = "20px 'pixel-regular', Arial, sans-serif";
  ctx.fillStyle = "green";
  ctx.fillText("Score: " + score, 8, 20);
}
//movimento del raton
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}