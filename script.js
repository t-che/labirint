document.addEventListener('DOMContentLoaded', () => {
    const labyrinth = document.getElementById('labyrinth');
    const player = document.getElementById('player');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('reset-btn');
     const wallWidth = 10;
     const wallHeight = 10;
    const playerSize = 10; // Изменили размер игрока
    const labyrinthWidth = 400;
    const labyrinthHeight = 400;
    const cellSize = 10;  // Изменили размер клетки
    const stepSize = 5;
    let walls = [];
    let playerX = 0;
    let playerY = 0;
    let doorX;
    let doorY;
    let gameActive = true;

    // Функция для генерации случайного лабиринта (Recursive Backtracker)
    function generateLabyrinth() {
        const grid = [];
        const numRows = labyrinthHeight / cellSize;
        const numCols = labyrinthWidth / cellSize;
        for (let row = 0; row < numRows; row++) {
            grid.push(Array(numCols).fill(1));
        }
        const stack = [];
        let currentRow = 0;
        let currentCol = 0;
        grid[currentRow][currentCol] = 0;
        stack.push([currentRow, currentCol]);

        while (stack.length > 0) {
            [currentRow, currentCol] = stack.pop();
            const neighbors = [];
            if (currentRow > 1) neighbors.push([currentRow - 2, currentCol, 'up']);
            if (currentRow < numRows - 2) neighbors.push([currentRow + 2, currentCol, 'down']);
            if (currentCol > 1) neighbors.push([currentRow, currentCol - 2, 'left']);
            if (currentCol < numCols - 2) neighbors.push([currentRow, currentCol + 2, 'right']);


            const unvisitedNeighbors = neighbors.filter(([row, col]) => grid[row][col] === 1);
            if (unvisitedNeighbors.length > 0) {
                stack.push([currentRow, currentCol]);
                const [newRow, newCol, direction] = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
                grid[newRow][newCol] = 0;
                if (direction === 'up') grid[currentRow - 1][currentCol] = 0;
                if (direction === 'down') grid[currentRow + 1][currentCol] = 0;
                if (direction === 'left') grid[currentRow][currentCol - 1] = 0;
                if (direction === 'right') grid[currentRow][currentCol + 1] = 0;
                stack.push([newRow, newCol]);
            }
        }
        walls = [];
         labyrinth.querySelectorAll('.wall').forEach(wall => wall.remove());
         labyrinth.querySelectorAll('#door').forEach(door => door.remove());
         for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (grid[row][col] === 1) {
                    walls.push({
                        x: col * cellSize,
                        y: row * cellSize,
                        width: wallWidth,
                        height: wallHeight
                    });
                }
            }
        }
        walls.forEach(wall => {
            const wallDiv = document.createElement('div');
            wallDiv.classList.add('wall');
            wallDiv.style.left = `${wall.x}px`;
            wallDiv.style.top = `${wall.y}px`;
            wallDiv.style.width = `${wall.width}px`;
            wallDiv.style.height = `${wall.height}px`;
            labyrinth.appendChild(wallDiv);
        });


        // генерируем дверь
           let doorPosition;
        do{
            doorPosition = {
                x: Math.floor(Math.random() * numCols) * cellSize ,
                y: Math.floor(Math.random() * numRows) * cellSize
            };
        }
        while (grid[doorPosition.y / cellSize][doorPosition.x / cellSize] === 1 );

         doorX = doorPosition.x;
         doorY = doorPosition.y;

        const door = document.createElement('div');
        door.setAttribute('id', 'door');
        door.style.left = `${doorX}px`;
        door.style.top = `${doorY}px`;
        labyrinth.appendChild(door);

        playerX = 0;
        playerY = 0;
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
         gameActive = true;
        }


    // Функция для проверки столкновения
    function checkCollision(x, y) {
        for (const wall of walls) {
            if (
                x < wall.x + wall.width &&
                x + playerSize > wall.x &&
                y < wall.y + wall.height &&
                y + playerSize > wall.y
            ) {
                return true;
            }
        }
        return false;
    }

   // Функция для проверки победы
    function checkWin() {
        const dx = Math.abs(playerX - doorX);
        const dy = Math.abs(playerY - doorY);
       if (dx < 15 && dy < 15 && gameActive) {
            message.textContent = 'Победа!';
            message.style.color = 'lime';
            gameActive = false;
            return true;
        }
        return false;
    }
   // Функция для обработки движения
    function movePlayer(dx, dy) {
        if(!gameActive) return;
        let newX = playerX + dx;
        let newY = playerY + dy;

         if (newX < 0) {
            newX = 0;
        }
         if (newY < 0) {
            newY = 0;
        }
        if (newX + playerSize > labyrinthWidth) {
            newX = labyrinthWidth - playerSize;
        }
         if (newY + playerSize > labyrinthHeight) {
            newY = labyrinthHeight - playerSize;
        }

        if (!checkCollision(newX, newY)) {
           playerX = newX;
           playerY = newY;
            player.style.left = `${playerX}px`;
            player.style.top = `${playerY}px`;
            checkWin();
        }
    }

    // Обработка нажатия клавиш
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                movePlayer(0, -stepSize);
                break;
            case 'ArrowDown':
                movePlayer(0, stepSize);
                break;
            case 'ArrowLeft':
                movePlayer(-stepSize, 0);
                break;
            case 'ArrowRight':
                movePlayer(stepSize, 0);
                break;
        }
    });

    function resetGame() {
        generateLabyrinth();
        message.textContent = '';
        message.style.color = 'initial';
    }

    resetBtn.addEventListener('click', resetGame);
    resetGame();
});