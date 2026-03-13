import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_CONFIG } from '../src/config.js';
import {
  createFoodPosition,
  createInitialState,
  pauseGame,
  queueDirection,
  resumeGame,
  stepGame,
} from '../src/game.js';

test('createInitialState returns a running-ready board with a centered snake', () => {
  const state = createInitialState(DEFAULT_CONFIG);

  assert.equal(state.status, 'idle');
  assert.equal(state.score, 0);
  assert.deepEqual(state.direction, { x: 1, y: 0 });
  assert.equal(state.snake.length, 3);
  assert.deepEqual(state.snake[0], { x: 10, y: 10 });
});

test('queueDirection ignores an immediate reverse input', () => {
  const state = createInitialState(DEFAULT_CONFIG);

  const nextState = queueDirection(state, 'left');

  assert.deepEqual(nextState.nextDirection, { x: 1, y: 0 });
});

test('stepGame moves the snake one tile in the current direction', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'running',
  };

  const nextState = stepGame(state, DEFAULT_CONFIG, () => 0);

  assert.deepEqual(nextState.snake[0], { x: 11, y: 10 });
  assert.equal(nextState.snake.length, 3);
});

test('stepGame grows the snake and increments score when food is eaten', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'running',
    food: { x: 11, y: 10 },
  };

  const nextState = stepGame(state, DEFAULT_CONFIG, () => 0.9);

  assert.equal(nextState.score, DEFAULT_CONFIG.pointsPerFood);
  assert.equal(nextState.snake.length, 4);
  assert.notDeepEqual(nextState.food, { x: 11, y: 10 });
});

test('stepGame ends the game when the snake hits a wall', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'running',
    snake: [
      { x: DEFAULT_CONFIG.columns - 1, y: 10 },
      { x: DEFAULT_CONFIG.columns - 2, y: 10 },
      { x: DEFAULT_CONFIG.columns - 3, y: 10 },
    ],
  };

  const nextState = stepGame(state, DEFAULT_CONFIG, () => 0);

  assert.equal(nextState.status, 'gameover');
});

test('stepGame ends the game when the snake folds into itself', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'running',
    direction: { x: 1, y: 0 },
    nextDirection: { x: 0, y: -1 },
    snake: [
      { x: 6, y: 6 },
      { x: 6, y: 7 },
      { x: 5, y: 7 },
      { x: 5, y: 6 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
    ],
  };

  const nextState = stepGame(state, DEFAULT_CONFIG, () => 0);

  assert.equal(nextState.status, 'gameover');
});

test('stepGame increases the pace after the snake eats enough food', () => {
  let state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'running',
    food: { x: 11, y: 10 },
  };

  for (let index = 0; index < 3; index += 1) {
    state = stepGame(state, DEFAULT_CONFIG, () => 0.9);
    state = {
      ...state,
      status: 'running',
      food: { x: state.snake[0].x + 1, y: state.snake[0].y },
    };
  }

  assert.ok(state.speed < DEFAULT_CONFIG.initialSpeed);
});

test('stepGame marks the run as won when the final open tile is eaten', () => {
  const tinyConfig = {
    ...DEFAULT_CONFIG,
    columns: 2,
    rows: 2,
  };
  const state = {
    snake: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    direction: { x: 0, y: 1 },
    nextDirection: { x: 0, y: 1 },
    food: { x: 0, y: 1 },
    score: 0,
    bestScore: 0,
    speed: tinyConfig.initialSpeed,
    status: 'running',
  };

  const nextState = stepGame(state, tinyConfig, () => 0);

  assert.equal(nextState.status, 'won');
  assert.equal(nextState.food, null);
  assert.equal(nextState.snake.length, 4);
});

test('createFoodPosition never returns a tile already occupied by the snake', () => {
  const occupied = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const food = createFoodPosition(occupied, 4, 4, () => 0);

  assert.deepEqual(food, { x: 3, y: 0 });
});

test('pauseGame changes a running game to paused', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'running',
  };

  const nextState = pauseGame(state);

  assert.equal(nextState.status, 'paused');
});

test('resumeGame changes a paused game back to running', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'paused',
  };

  const nextState = resumeGame(state);

  assert.equal(nextState.status, 'running');
});

test('stepGame does not advance while the game is paused', () => {
  const state = {
    ...createInitialState(DEFAULT_CONFIG),
    status: 'paused',
  };

  const nextState = stepGame(state, DEFAULT_CONFIG, () => 0);

  assert.deepEqual(nextState, state);
});
