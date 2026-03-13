import { DEFAULT_CONFIG } from './config.js';
import { createInitialState, pauseGame, queueDirection, resumeGame, stepGame } from './game.js';
import { getGameAreaScrollBehavior, getPauseButtonState, shouldAutoScrollToGameArea } from './game-ui.js';
import { bindInput } from './input.js';
import { drawGame } from './renderer.js';
import { buildAnnouncement, formatSpeedLabel, getStatusLabel } from './ui-text.js';

const BEST_SCORE_KEY = 'signal-snake-best-score';

const canvas = document.getElementById('game-board');
const scoreValue = document.getElementById('score-value');
const bestValue = document.getElementById('best-value');
const speedValue = document.getElementById('speed-value');
const statusValue = document.getElementById('status-value');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gamePanel = document.getElementById('game-panel');
const gameActions = document.querySelector('.game-actions');
const gameRestartButton = document.getElementById('game-restart-button');
const pauseButton = document.getElementById('pause-button');
const touchButtons = document.querySelectorAll('[data-direction]');
const liveRegion = document.getElementById('live-region');

const context = canvas.getContext('2d');

canvas.width = DEFAULT_CONFIG.columns * DEFAULT_CONFIG.cellSize;
canvas.height = DEFAULT_CONFIG.rows * DEFAULT_CONFIG.cellSize;

let storedBestScore = readBestScore();
let state = createInitialState(DEFAULT_CONFIG, storedBestScore);
let accumulator = 0;
let lastTimestamp = 0;
let lastAnnouncement = '';

function readBestScore() {
  try {
    const value = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10);
    return Number.isNaN(value) ? 0 : value;
  } catch {
    return 0;
  }
}

function writeBestScore(score) {
  storedBestScore = Math.max(storedBestScore, score);

  try {
    localStorage.setItem(BEST_SCORE_KEY, String(storedBestScore));
  } catch {
    // Ignore storage failures in local-only mode.
  }
}

function formatScore(value) {
  return String(value).padStart(3, '0');
}

function focusGameArea() {
  if (!shouldAutoScrollToGameArea(window.innerWidth) || !gamePanel) {
    return;
  }

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  requestAnimationFrame(() => {
    gamePanel.scrollIntoView({
      behavior: getGameAreaScrollBehavior(prefersReducedMotion),
      block: 'start',
    });
  });
}

function syncHud() {
  scoreValue.textContent = formatScore(state.score);
  bestValue.textContent = formatScore(Math.max(storedBestScore, state.bestScore));
  speedValue.textContent = formatSpeedLabel(state.speed);
  statusValue.textContent = getStatusLabel(state.status);

  startButton.disabled = state.status === 'running' || state.status === 'paused';
  restartButton.disabled = false;

  const pauseButtonState = getPauseButtonState(state.status);
  pauseButton.textContent = pauseButtonState.label;
  pauseButton.hidden = pauseButtonState.hidden;
  pauseButton.disabled = pauseButtonState.hidden;
  gameActions.classList.toggle('game-actions-single', pauseButtonState.hidden);
  gameRestartButton.disabled = false;

  const announcement = buildAnnouncement(
    state.status,
    state.score,
    Math.max(storedBestScore, state.bestScore),
  );

  if (announcement !== lastAnnouncement) {
    liveRegion.textContent = announcement;
    lastAnnouncement = announcement;
  }
}

function render() {
  drawGame(context, state, DEFAULT_CONFIG);
}

function createFreshState(status = 'idle') {
  return {
    ...createInitialState(DEFAULT_CONFIG, storedBestScore),
    status,
  };
}

function startGame() {
  state = createFreshState('running');
  accumulator = 0;
  syncHud();
  render();
  focusGameArea();
}

function restartGame() {
  startGame();
}

function togglePause() {
  if (state.status === 'running') {
    state = pauseGame(state);
  } else if (state.status === 'paused') {
    state = resumeGame(state);
  } else {
    return;
  }

  syncHud();
  render();
}

function handleDirection(directionName) {
  if (state.status === 'idle') {
    startGame();
  }

  if (state.status !== 'running') {
    return;
  }

  state = queueDirection(state, directionName);
}

function stepFrame() {
  state = stepGame(state, DEFAULT_CONFIG, Math.random);

  if (state.bestScore > storedBestScore) {
    writeBestScore(state.bestScore);
  }

  syncHud();
}

function loop(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  const delta = Math.min(timestamp - lastTimestamp, 250);
  lastTimestamp = timestamp;

  if (state.status === 'running') {
    accumulator = Math.min(accumulator + delta, state.speed * 3);

    while (state.status === 'running') {
      const tickLength = state.speed;

      if (accumulator < tickLength) {
        break;
      }

      accumulator -= tickLength;
      stepFrame();
    }
  }

  render();
  requestAnimationFrame(loop);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
gameRestartButton.addEventListener('click', restartGame);
pauseButton.addEventListener('click', togglePause);

bindInput(window, {
  onDirection: handleDirection,
  onRestart: restartGame,
  onStart: () => {
    if (state.status === 'idle' || state.status === 'gameover' || state.status === 'won') {
      startGame();
    }
  },
});

touchButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    handleDirection(button.dataset.direction);
  });
});

syncHud();
render();
requestAnimationFrame(loop);
