document.addEventListener('DOMContentLoaded', () => {
    let playerName = localStorage.getItem('playerName') || "";

    const backgroundMusic = new Audio('../../backsound/backsound-game2.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

    backgroundMusic.addEventListener('error', (e) => {
        console.log('Error loading audio:', e);
    });

    document.addEventListener('click', function initAudio() {
        backgroundMusic.play().catch(e => console.error('Audio play failed:', e));
        document.removeEventListener('click', initAudio);
    }, { once: true });

    const trashBin = document.getElementById('trash-bin');
    const gameArea = document.getElementById('game-area');

    let score = 0;
    let lives = 3;
    let timer = 15;
    let gameInterval;
    let isGameRunning = false;
    let gameInitialized = false;
    let spawnInterval;

    function initGame() {
        if (!gameInitialized) {
            score = 0;
            lives = 3;
            timer = 15;
            isGameRunning = true;
            updateUI();
            startTimer();

            spawnInterval = setInterval(() => {
                if (isGameRunning) spawnTrash();
            }, 1000);

            gameInitialized = true;
        }
    }

    function updateUI() {
        document.getElementById('score').textContent = score;
        document.getElementById('lives').textContent = lives;
        document.getElementById('timer').textContent = timer;
    }

    function startTimer() {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            if (isGameRunning) {
                if (timer > 0) {
                    timer--;
                    updateUI();

                    if (timer === 0 && lives > 0) {
                        endGame('victory');
                    }
                } else {
                    clearInterval(gameInterval);
                }
            }
        }, 1000);
    }

    function endGame(reason) {
        isGameRunning = false;
        clearInterval(gameInterval);

        if (reason === 'victory' && lives > 0) {
            showVictoryPopup();
        } else if (reason === 'lives') {
            showGameOverPopup();
        }
    }

    function saveToLeaderboard(score, game) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const newEntry = {
            name: playerName || "Guest",
            score,
            game,
            date: new Date().toISOString()
        };
        leaderboard.push(newEntry);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    function showVictoryPopup() {
        document.getElementById('final-score').textContent = score;
        document.getElementById('victory-popup').classList.remove('hidden');
        saveToLeaderboard(score, 'Menangkap Sampah');
    }

    function showGameOverPopup() {
        document.getElementById('final-score-lose').textContent = score;
        document.getElementById('gameover-popup').classList.remove('hidden');
        saveToLeaderboard(score, 'Menangkap Sampah');
    }

    function resetGame() {
        if (spawnInterval) clearInterval(spawnInterval);

        score = 0;
        lives = 3;
        timer = 15;
        isGameRunning = true;

        document.querySelectorAll('.trash').forEach(trash => trash.remove());

        document.getElementById('victory-popup').classList.add('hidden');
        document.getElementById('gameover-popup').classList.add('hidden');

        updateUI();
        startTimer();

        spawnInterval = setInterval(() => {
            if (isGameRunning) spawnTrash();
        }, 1000);
    }

    // Event listeners popup akhir game
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('back-to-menu').addEventListener('click', () => {
        window.location.href = '../PilihPermainan/PilihPermainan.html';
    });
    document.getElementById('play-again-lose').addEventListener('click', resetGame);
    document.getElementById('back-to-menu-lose').addEventListener('click', () => {
        window.location.href = '../PilihPermainan/PilihPermainan.html';
    });
    document.getElementById('leaderboard').addEventListener('click', () => {
        window.location.href = '../LeaderboardPermainan/Leaderboard.html';
    });
    document.getElementById('leader-board').addEventListener('click', () => {
        window.location.href = '../LeaderboardPermainan/Leaderboard.html';
    });

    function decreaseLives() {
        lives--;
        updateUI();
        if (lives <= 0) {
            endGame('lives');
        }
    }

    let trashBinX = gameArea.clientWidth / 2;
    const trashBinSpeed = 20;

    function getGameWidth() {
        return gameArea.clientWidth;
    }

    // Control pakai mouse
    gameArea.addEventListener('mousemove', (e) => {
        if (!isGameRunning) return;

        const rect = gameArea.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const newPosition = mouseX - (trashBin.offsetWidth / 2);

        trashBinX = Math.max(0, Math.min(newPosition, gameArea.offsetWidth - trashBin.offsetWidth));
        trashBin.style.left = `${trashBinX}px`;
    });

    // Control pakai keyboard
    document.addEventListener('keydown', (e) => {
        if (!isGameRunning) return;

        const gameWidth = getGameWidth();
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
            trashBinX = Math.max(0, trashBinX - trashBinSpeed);
        } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
            trashBinX = Math.min(gameWidth - trashBin.clientWidth, trashBinX + trashBinSpeed);
        }
        trashBin.style.left = `${trashBinX}px`;
    });

    // Control pakai touch
    gameArea.addEventListener('touchmove', (e) => {
        if (!isGameRunning) return;

        const rect = gameArea.getBoundingClientRect();
        let touchX = e.touches[0].clientX - rect.left - trashBin.clientWidth / 2;

        trashBinX = Math.max(0, Math.min(touchX, rect.width - trashBin.clientWidth));
        trashBin.style.left = `${trashBinX}px`;
        e.preventDefault();
    });

    function spawnTrash() {
        if (!isGameRunning) return;

        const trash = document.createElement('img');
        trash.src = `../../Asset/Sampah${Math.floor(Math.random() * 4) + 1}.jpg`;
        trash.className = 'trash';

        const minX = 0;
        const maxX = getGameWidth() - 50;
        const randomX = Math.random() * (maxX - minX) + minX;

        trash.style.left = `${randomX}px`;
        trash.style.top = '-50px';
        gameArea.appendChild(trash);

        let pos = -50;
        const fall = setInterval(() => {
            if (!isGameRunning) {
                clearInterval(fall);
                trash.remove();
                return;
            }

            pos += 5;
            trash.style.top = `${pos}px`;

            const trashRect = trash.getBoundingClientRect();
            const binRect = trashBin.getBoundingClientRect();
            const gameAreaRect = gameArea.getBoundingClientRect();

            if (
                trashRect.bottom >= binRect.top &&
                trashRect.top <= binRect.bottom &&
                trashRect.left < binRect.right &&
                trashRect.right > binRect.left
            ) {
                score += 10;
                updateUI();
                trash.remove();
                clearInterval(fall);
            } else if (pos > gameAreaRect.height) {
                decreaseLives();
                trash.remove();
                clearInterval(fall);
            }
        }, 50);
    }

    // 🔹 Popup Input Nama
    const namePopup = document.getElementById('name-popup');
    const startGameBtn = document.getElementById('start-game-btn');
    const nameInput = document.getElementById('player-name-input');

    namePopup.classList.remove('hidden'); // tampilkan popup saat load

    startGameBtn.addEventListener('click', () => {
        const inputName = nameInput.value.trim();
        if (inputName !== "") {
            playerName = inputName;
            localStorage.setItem('playerName', playerName);
        } else {
            playerName = "Guest";
        }
        namePopup.classList.add('hidden');
        initGame();
    });
});
