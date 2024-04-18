var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var gameOver = false;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

var apple = {
    x: getRandomInt(0, 25) * grid,
    y: getRandomInt(0, 25) * grid
};

var mainMenu = document.getElementById('main-menu');
var gameCanvas = document.getElementById('game');
var gameOverScreen = document.getElementById('game-over');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function startGame() {
    mainMenu.style.display = 'none';
    gameCanvas.style.display = 'block';
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    gameOver = false;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    mainMenu.style.display = 'none';
    gameCanvas.style.display = 'block';
    gameOverScreen.style.display = 'none';

    requestAnimationFrame(gameLoop);
}

function backToMainMenu() {
    gameOver = false;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    mainMenu.style.display = 'block';
    gameCanvas.style.display = 'none';
    gameOverScreen.style.display = 'none';
}

function gameLoop() {
    if (gameOver) {
        return;
    }

    requestAnimationFrame(gameLoop);

    if (++count < 10) {
        return;
    }

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        gameOver = true;
        gameOverScreen.style.display = 'block';
    }
    else if (snake.x >= canvas.width) {
        gameOver = true;
        gameOverScreen.style.display = 'block';
    }

    if (snake.y < 0) {
        gameOver = true;
        gameOverScreen.style.display = 'block';
    }
    else if (snake.y >= canvas.height) {
        gameOver = true;
        gameOverScreen.style.display = 'block';
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        checkCollision(cell, index);
    });
}

function checkCollision(cell, index) {
    for (var i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            gameOver = true;
            gameOverScreen.style.display = 'block';
            return;
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

