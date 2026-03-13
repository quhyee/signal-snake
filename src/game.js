import { DEFAULT_CONFIG, DIRECTION_VECTORS } from './config.js';

function sameTile(a, b) {
  return a.x === b.x && a.y === b.y;
}

function cloneSnake(snake) {
  return snake.map((segment) => ({ ...segment }));
}

function isReverseDirection(current, next) {
  return current.x + next.x === 0 && current.y + next.y === 0;
}

function calculateSpeed(score, config) {
  const foodsEaten = Math.floor(score / config.pointsPerFood);
  return Math.max(config.minSpeed, config.initialSpeed - foodsEaten * config.speedStep);
}

export function createFoodPosition(occupied, columns, rows, randomFn = Math.random) {
  const occupiedSet = new Set(occupied.map((tile) => `${tile.x},${tile.y}`));
  const availableTiles = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!occupiedSet.has(`${x},${y}`)) {
        availableTiles.push({ x, y });
      }
    }
  }

  if (availableTiles.length === 0) {
    return null;
  }

  const index = Math.floor(randomFn() * availableTiles.length);
  return availableTiles[index];
}

export function createInitialState(config = DEFAULT_CONFIG, bestScore = 0, randomFn = Math.random) {
  const centerX = Math.floor(config.columns / 2);
  const centerY = Math.floor(config.rows / 2);
  const snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
  const direction = { ...DIRECTION_VECTORS.right };

  return {
    snake,
    direction,
    nextDirection: { ...direction },
    food: createFoodPosition(snake, config.columns, config.rows, randomFn),
    score: 0,
    bestScore,
    speed: config.initialSpeed,
    status: 'idle',
  };
}

export function queueDirection(state, directionName) {
  const nextVector = DIRECTION_VECTORS[directionName];

  if (!nextVector || isReverseDirection(state.direction, nextVector)) {
    return {
      ...state,
      nextDirection: { ...state.nextDirection },
    };
  }

  return {
    ...state,
    nextDirection: { ...nextVector },
  };
}

export function pauseGame(state) {
  if (state.status !== 'running') {
    return state;
  }

  return {
    ...state,
    status: 'paused',
  };
}

export function resumeGame(state) {
  if (state.status !== 'paused') {
    return state;
  }

  return {
    ...state,
    status: 'running',
  };
}

export function stepGame(state, config = DEFAULT_CONFIG, randomFn = Math.random) {
  if (state.status !== 'running') {
    return state;
  }

  const direction = state.nextDirection ?? state.direction;
  const nextHead = {
    x: state.snake[0].x + direction.x,
    y: state.snake[0].y + direction.y,
  };

  const isOutsideBoard =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= config.columns ||
    nextHead.y >= config.rows;

  const ateFood = state.food ? sameTile(nextHead, state.food) : false;
  const nextSnake = [nextHead, ...cloneSnake(state.snake)];

  if (!ateFood) {
    nextSnake.pop();
  }

  const hitSelf = nextSnake.slice(1).some((segment) => sameTile(segment, nextHead));

  if (isOutsideBoard || hitSelf) {
    return {
      ...state,
      direction: { ...direction },
      nextDirection: { ...direction },
      bestScore: Math.max(state.bestScore, state.score),
      status: 'gameover',
    };
  }

  const nextScore = ateFood ? state.score + config.pointsPerFood : state.score;
  const bestScore = Math.max(state.bestScore, nextScore);

  const nextFood = ateFood
    ? createFoodPosition(nextSnake, config.columns, config.rows, randomFn)
    : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction: { ...direction },
    nextDirection: { ...direction },
    food: nextFood,
    score: nextScore,
    bestScore,
    speed: calculateSpeed(nextScore, config),
    status: ateFood && nextFood === null ? 'won' : state.status,
  };
}
