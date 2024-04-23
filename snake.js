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
    maxCells: 4,
    color: 'green'
};

var apple = {
    x: getRandomInt(0, 25) * grid,
    y: getRandomInt(0, 25) * grid
};

var mainMenu = document.getElementById('main-menu');
var gameCanvas = document.getElementById('game');
var gameOverScreen = document.getElementById('game-over');
var score = 0;
var scoreElement = document.getElementById('score-value');
var scoreDiv = document.getElementById('score');
var difficulty = 'medium'; // default difficulty
var backgroundMusic = document.getElementById('backgroundMusic');
var appleSound = new Audio('apple.mp3'); // Create new audio element for apple sound
var loseSound = new Audio('lose.mp3'); // Create new audio element for lose sound

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function selectDifficulty(level) {
    difficulty = level;
    document.getElementById('easy').classList.remove('selected');
    document.getElementById('medium').classList.remove('selected');
    document.getElementById('hard').classList.remove('selected');
    document.getElementById(level).classList.add('selected');
}

function selectColor(color) {
    snake.color = color;
    var colorButtons = document.querySelectorAll('.color-button');
    colorButtons.forEach(button => button.classList.remove('selected'));
    document.getElementById(color).classList.add('selected');
}

function getSpeed() {
    switch (difficulty) {
        case 'easy':
            return grid * 1.5; // slower speed
        case 'medium':
            return grid; // normal speed
        case 'hard':
            return grid * 0.5; // faster speed
        default:
            return grid;
    }
}

function startGame() {
    mainMenu.style.display = 'none';
    gameCanvas.style.display = 'block';
    scoreDiv.style.display = 'block';
    score = 0;
    scoreElement.textContent = score;
    playBackgroundMusic();
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

    score = 0;
    scoreElement.textContent = score;

    mainMenu.style.display = 'none';
    gameCanvas.style.display = 'block';
    gameOverScreen.style.display = 'none';

    pauseLoseSound();
    playBackgroundMusic();
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
    scoreDiv.style.display = 'none';

    pauseLoseSound();
    pauseBackgroundMusic();
}

function pauseLoseSound() {
    loseSound.pause();
}

function playBackgroundMusic() {
    backgroundMusic.play();
}

function pauseBackgroundMusic() {
    backgroundMusic.pause();
}

function playAppleSound() {
    appleSound.currentTime = 0; // Reset the sound to the beginning
    appleSound.play();
}

function playLoseSound() {
    loseSound.currentTime = 0; // Reset the sound to the beginning
    loseSound.play();
}

function gameLoop() {
    if (gameOver) {
        pauseBackgroundMusic();
        playLoseSound(); // Play lose sound effect
        return;
    }

    requestAnimationFrame(gameLoop);

    if (++count < getSpeed()) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        gameOver = true;
        gameOverScreen.style.display = 'block';
        return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = snake.color;
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;

            // Increment score and update display
            score++;
            scoreElement.textContent = score;

            // Play apple sound effect
            playAppleSound();
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

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});
