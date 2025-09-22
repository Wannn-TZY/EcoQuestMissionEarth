document.addEventListener('DOMContentLoaded', () => {
    let playerName = localStorage.getItem('playerName') || "Guest";

    const backgroundMusic = new Audio('../../backsound/backsound-game2.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

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

            spawnTrash();

            spawnInterval = setInterval(() => {
                if (isGameRunning) spawnTrash();
            }, 700);

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
        leaderboard.push({
            name: playerName || "Guest",
            score,
            game,
            date: new Date().toISOString()
        });
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

        spawnTrash();

        spawnInterval = setInterval(() => {
            if (isGameRunning) spawnTrash();
        }, 700);
    }

    // tombol popup
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('back-to-menu').addEventListener('click', () => {
        // Only update progress if game was won (timer reached 0 with lives remaining)
        if (timer === 0 && lives > 0) {  // Victory condition
            const gameProgress = JSON.parse(localStorage.getItem('gameProgress')) || {
                bersihkanSungai: false,
                tangkapSampah: false,
                pilahSampah: false
            };
            
            // Keep first game progress and mark second game as completed
            gameProgress.tangkapSampah = true;
            
            // Save progress
            localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
        }
        
        // Return to menu
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

    gameArea.addEventListener('mousemove', (e) => {
        if (!isGameRunning) return;

        const rect = gameArea.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const newPosition = mouseX - (trashBin.offsetWidth / 2);

        trashBinX = Math.max(0, Math.min(newPosition, gameArea.offsetWidth - trashBin.offsetWidth));
        trashBin.style.left = `${trashBinX}px`;
    });

    document.addEventListener('keydown', (e) => {
        if (!isGameRunning) return;

        const gameWidth = gameArea.clientWidth;
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
            trashBinX = Math.max(0, trashBinX - trashBinSpeed);
        } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
            trashBinX = Math.min(gameWidth - trashBin.clientWidth, trashBinX + trashBinSpeed);
        }
        trashBin.style.left = `${trashBinX}px`;
    });

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
        const trashImages = [
            '../../Asset/sampah/amplas.png',
            '../../Asset/sampah/flashdisk.png',
            '../../Asset/sampah/kayu.png',
            '../../Asset/sampah/cpu.png',
            '../../Asset/sampah/batako.png',
            '../../Asset/sampah/sampahteknik.png',
            '../../Asset/sampah/kaset.png',
            '../../Asset/sampah/pc2.png',
            '../../Asset/sampah/tang.png'
        ];

        const randomIndex = Math.floor(Math.random() * trashImages.length);
        trash.src = trashImages[randomIndex];
        trash.className = 'trash';

        const viewportWidth = window.innerWidth;
        const trashWidth = 80;
        const padding = 20;

        const minX = padding;
        const maxX = viewportWidth - trashWidth - padding;
        const randomX = Math.random() * (maxX - minX) + minX;

        trash.style.left = `${randomX}px`;
        trash.style.top = '-50px';
        trash.style.width = "80px";
        trash.style.height = "80px";
        trash.style.position = "absolute";

        gameArea.appendChild(trash);

        let pos = -50;
        let caught = false;
        let speed = 8;

        const fall = setInterval(() => {
            if (!isGameRunning) {
                clearInterval(fall);
                if (gameArea.contains(trash)) {
                    trash.remove();
                }
                return;
            }

            pos += speed;
            trash.style.top = `${pos}px`;

            const trashRect = trash.getBoundingClientRect();
            const binRect = trashBin.getBoundingClientRect();

            if (!caught && 
                trashRect.bottom >= binRect.top &&
                trashRect.top <= binRect.bottom &&
                trashRect.left < binRect.right &&
                trashRect.right > binRect.left
            ) {
                caught = true;
                score += 10;
                updateUI();
                if (gameArea.contains(trash)) {
                    trash.remove();
                }
                clearInterval(fall);
            } else if (!caught && pos > window.innerHeight - trash.offsetHeight) {
                if (!caught) {
                    decreaseLives();
                }
                if (gameArea.contains(trash)) {
                    trash.remove();
                }
                clearInterval(fall);
            }
        }, 30);
    }

    initGame();
});
