const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const timeLeftEl = document.querySelector('.time-left');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// Game variables
let score = 0;
let timeLeft = 30;
const targetScore = 100;
let countdownInterval = null;
const sound = new Audio('assets/smash.mp3');

startGame();

function run() {
  if (timeLeft <= 0) return;

  const i = Math.floor(Math.random() * holes.length);
  const hole = holes[i];
  let timer = null;

  const img = document.createElement('img');
  img.classList.add('mole');
  img.src = 'assets/mole.png';

  img.addEventListener('click', () => {
    score += 10;
    sound.play();
    scoreEl.textContent = score;
    img.src = 'assets/mole-whacked.png';
    clearTimeout(timer);

    if (score >= targetScore) {
      endGame(true);
      return;
    }

    setTimeout(() => {
      hole.removeChild(img);
      run();
    }, 500);
  });

  hole.appendChild(img);

  timer = setTimeout(() => {
    if (hole.contains(img)) {
      hole.removeChild(img);
    }
    run();
  }, 1100);
}

function startTimer() {
  timeLeft = 30;
  timeLeftEl.textContent = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  tryAgainBtn.style.display = 'none';

  startTimer();
  run();
}

function endGame(isWin) {
  clearInterval(countdownInterval);

  holes.forEach(hole => {
    const mole = hole.querySelector('.mole');
    if (mole) {
      hole.removeChild(mole);
    }
  });

  if (isWin) {
    alert(`You reached ${score} points and won!`);
  } else {
    alert(`Time's up! Your final score is ${score}.`);
  }

  tryAgainBtn.style.display = 'block';
}

// "Try Again" button
tryAgainBtn.addEventListener('click', () => {
  startGame();
});

// Mouse events: remap coordinates after 90° rotation around center
window.addEventListener('mousemove', (e) => {
  // This is the basic formula for 90° clockwise rotation
  const rotatedX = e.clientY;
  const rotatedY = window.innerWidth - e.clientX;

  cursor.style.left = rotatedX + 'px';
  cursor.style.top = rotatedY + 'px';
});

window.addEventListener('mousedown', () => {
  cursor.classList.add('active');
});
window.addEventListener('mouseup', () => {
  cursor.classList.remove('active');
});
