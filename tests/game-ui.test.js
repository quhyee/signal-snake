import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGameAreaFocusTargetId,
  getPauseResumeMode,
  getGameAreaScrollBehavior,
  getPauseButtonState,
  shouldAutoScrollToGameArea,
  usesBoardTapPause,
} from '../src/game-ui.js';

test('shouldAutoScrollToGameArea is enabled for narrow layouts only', () => {
  assert.equal(shouldAutoScrollToGameArea(480), true);
  assert.equal(shouldAutoScrollToGameArea(900), true);
  assert.equal(shouldAutoScrollToGameArea(901), false);
});

test('getGameAreaFocusTargetId focuses touch controls on narrow layouts', () => {
  assert.equal(getGameAreaFocusTargetId(480), 'touch-controls');
  assert.equal(getGameAreaFocusTargetId(900), 'touch-controls');
  assert.equal(getGameAreaFocusTargetId(901), 'game-panel');
});

test('usesBoardTapPause is enabled for narrow layouts only', () => {
  assert.equal(usesBoardTapPause(480), true);
  assert.equal(usesBoardTapPause(900), true);
  assert.equal(usesBoardTapPause(901), false);
});

test('getPauseResumeMode switches between board and button hints', () => {
  assert.equal(getPauseResumeMode(480), 'board');
  assert.equal(getPauseResumeMode(900), 'board');
  assert.equal(getPauseResumeMode(901), 'button');
});

test('getPauseButtonState exposes pause action while running', () => {
  assert.deepEqual(getPauseButtonState('running', 901), {
    label: '暂停',
    hidden: false,
  });
});

test('getPauseButtonState exposes resume action while paused', () => {
  assert.deepEqual(getPauseButtonState('paused', 901), {
    label: '继续',
    hidden: false,
  });
});

test('getPauseButtonState hides the pause button for non-playable statuses', () => {
  assert.deepEqual(getPauseButtonState('idle', 901), {
    label: '暂停',
    hidden: true,
  });
});

test('getPauseButtonState hides the pause button on narrow layouts', () => {
  assert.deepEqual(getPauseButtonState('running', 480), {
    label: '暂停',
    hidden: true,
  });
});

test('getGameAreaScrollBehavior respects reduced-motion preferences', () => {
  assert.equal(getGameAreaScrollBehavior(false), 'smooth');
  assert.equal(getGameAreaScrollBehavior(true), 'auto');
});
