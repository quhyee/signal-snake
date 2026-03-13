import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGameAreaScrollBehavior,
  getPauseButtonState,
  shouldAutoScrollToGameArea,
} from '../src/game-ui.js';

test('shouldAutoScrollToGameArea is enabled for narrow layouts only', () => {
  assert.equal(shouldAutoScrollToGameArea(480), true);
  assert.equal(shouldAutoScrollToGameArea(900), true);
  assert.equal(shouldAutoScrollToGameArea(901), false);
});

test('getPauseButtonState exposes pause action while running', () => {
  assert.deepEqual(getPauseButtonState('running'), {
    label: '暂停',
    hidden: false,
  });
});

test('getPauseButtonState exposes resume action while paused', () => {
  assert.deepEqual(getPauseButtonState('paused'), {
    label: '继续',
    hidden: false,
  });
});

test('getPauseButtonState hides the pause button for non-playable statuses', () => {
  assert.deepEqual(getPauseButtonState('idle'), {
    label: '暂停',
    hidden: true,
  });
});

test('getGameAreaScrollBehavior respects reduced-motion preferences', () => {
  assert.equal(getGameAreaScrollBehavior(false), 'smooth');
  assert.equal(getGameAreaScrollBehavior(true), 'auto');
});
