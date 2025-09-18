document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = new Audio('../../backsound/backsound-game3.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

    document.addEventListener('click', function initAudio() {
        playBackgroundMusic();
        document.removeEventListener('click', initAudio);
    }, { once: true });

    const gameContainer = document.getElementById('gameContainer');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const timerElement = document.getElementById('timer');

    let score = 0;
    let lives = 3;
    let timeLeft = 60;
    let gameInterval;
    let timerInterval;
    let isGameActive = false;

    // pakai nama dari localStorage, kalau kosong → "Guest"
    let playerName = localStorage.getItem('playerName') || "Guest";

    const sampahImages = [
        '../../Asset/Sampah1.jpg',
        '../../Asset/Sampah2.jpg',
        '../../Asset/Sampah3.jpg',
        '../../Asset/Sampah4.jpg'
    ];

    function createSampah() {
        const sampah = document.createElement('img');
        sampah.className = 'sampah';
        sampah.src = sampahImages[Math.floor(Math.random() * sampahImages.length)];
        
        const riverHeight = window.innerHeight * 0.6;
        const padding = 50;
        const minY = window.innerHeight - riverHeight + padding;
        const maxY = window.innerHeight - padding;
        const yPos = minY + (Math.random() * (maxY - minY));
        
        sampah.style.top = `${yPos}px`;
        sampah.style.right = '-50px';
        sampah.style.left = 'auto';
        
        gameContainer.appendChild(sampah);

        sampah.addEventListener('click', () => {
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            gameContainer.removeChild(sampah);
        });

        let xPos = gameContainer.offsetWidth + 50;
        const speed = 5;
        
        const moveInterval = setInterval(() => {
            xPos -= speed;
            sampah.style.right = `${gameContainer.offsetWidth - xPos}px`;

            if (xPos < -50) {
                if (gameContainer.contains(sampah)) {
                    gameContainer.removeChild(sampah);
                    updateLives();
                }
                clearInterval(moveInterval);
            }
        }, 50);
    }

    function showVictoryPopup() {
        document.getElementById('final-score').textContent = score;
        document.getElementById('victory-popup').classList.remove('hidden');
        saveToLeaderboard(playerName, score, 'Bersihkan Sungai');
    }

    function showGameOverPopup() {
        document.getElementById('final-score-lose').textContent = score;
        document.getElementById('gameover-popup').classList.remove('hidden');
        saveToLeaderboard(playerName, score, 'Bersihkan Sungai');
    }

    function resetGame() {
        score = 0;
        lives = 3;
        timeLeft = 60;
        isGameActive = true;
        
        scoreElement.textContent = `Score: ${score}`;
        livesElement.textContent = `Lives: ${lives}`;
        timerElement.textContent = `Time: ${timeLeft}`;
        
        document.getElementById('victory-popup').classList.add('hidden');
        document.getElementById('gameover-popup').classList.add('hidden');
        
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        startGame();
    }

    // tombol popup
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('play-again-lose').addEventListener('click', resetGame);
    document.getElementById('back-to-menu').addEventListener('click', () => {
        window.location.href = '../PilihPermainan/PilihPermainan.html';
    });
    document.getElementById('back-to-menu-lose').addEventListener('click', () => {
        window.location.href = '../PilihPermainan/PilihPermainan.html';
    });
    document.getElementById('leaderboard').addEventListener('click', () => {
        window.location.href = '../LeaderboardPermainan/Leaderboard.html';
    });
    document.getElementById('leader-board').addEventListener('click', () => {
        window.location.href = '../LeaderboardPermainan/Leaderboard.html';
    });

    function updateLives() {
        lives--;
        livesElement.textContent = `Lives: ${lives}`;
        if (lives <= 0) {
            endGame();
            showGameOverPopup();
        }
    }

    function startGame() {
        score = 0;
        lives = 3;
        timeLeft = 60;
        isGameActive = true;
        
        scoreElement.textContent = `Score: ${score}`;
        livesElement.textContent = `Lives: ${lives}`;
        timerElement.textContent = `Time: ${timeLeft}`;
        
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        
        gameInterval = setInterval(createSampah, 2000);
        
        timerInterval = setInterval(() => {
            if (isGameActive) {
                timeLeft--;
                timerElement.textContent = `Time: ${timeLeft}`;
                
                if (timeLeft <= 0 && lives > 0) {
                    endGame();
                    showVictoryPopup();
                }
            }
        }, 1000);
    }

    function endGame() {
        isGameActive = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        
        const allSampah = document.querySelectorAll('.sampah');
        allSampah.forEach(sampah => sampah.remove());
    }

    function playBackgroundMusic() {
        backgroundMusic.play().catch(error => {
            console.log("Musik gagal diputar:", error);
        });
    }

    function saveToLeaderboard(name, score, game) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({
            name,
            score,
            game,
            date: new Date().toISOString()
        });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

   /* ====================== POPUP NAMA ====================== */
function showNamePopup() {
    if (document.querySelector('.popup-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
        <div class="name-popup">
            <h2>Selamat Datang di EcoQuest!</h2>
            <input type="text" id="player-name" placeholder="Masukkan nama kamu..." maxlength="15">
            <button id="start-btn" disabled>Mulai Bermain</button>
        </div>
    `;
    document.body.appendChild(overlay);

    const nameInput = overlay.querySelector('#player-name');
    const startBtn = overlay.querySelector('#start-btn');

    nameInput.addEventListener('input', () => {
        startBtn.disabled = nameInput.value.trim() === "";
    });

    startBtn.addEventListener('click', () => {
        playerName = nameInput.value.trim() || "Guest";
        localStorage.setItem('playerName', playerName);

        overlay.remove();
        startGame();
    });
}

// 🚀 tampilkan popup nama sebelum mulai
showNamePopup();

});
