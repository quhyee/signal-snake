import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAnnouncement,
  formatOverlayScore,
  getOverlayCopy,
  getStatusLabel,
} from '../src/ui-text.js';

test('getStatusLabel returns Chinese labels for known game states', () => {
  assert.equal(getStatusLabel('running'), '进行中');
  assert.equal(getStatusLabel('paused'), '暂停中');
  assert.equal(getStatusLabel('won'), '已通关');
  assert.equal(getStatusLabel('gameover'), '已撞毁');
  assert.equal(getStatusLabel('idle'), '待命');
});

test('buildAnnouncement returns a localized screen-reader message', () => {
  const message = buildAnnouncement('gameover', 20, 80);

  assert.equal(message, '状态：已撞毁。按“重新开始”或按 R 立刻再来一局。当前分数 20，最高分 80。');
});

test('buildAnnouncement includes the start guidance when the game is idle', () => {
  const message = buildAnnouncement('idle', 0, 80);

  assert.equal(
    message,
    '状态：待命。点击“开始游戏”，按 Enter / Space，或使用方向键 / WASD 直接开局。当前分数 0，最高分 80。',
  );
});

test('buildAnnouncement includes paused guidance when the game is paused', () => {
  const message = buildAnnouncement('paused', 20, 80);

  assert.equal(
    message,
    '状态：暂停中。点击“继续”恢复游戏，或按“重新开始”立即开新局。当前分数 20，最高分 80。',
  );
});

test('getOverlayCopy returns Chinese overlay text for each visible state', () => {
  assert.deepEqual(getOverlayCopy('idle'), {
    title: '准备开始',
    subtitle: '点击“开始游戏”，按 Enter / Space，或使用方向键 / WASD 直接开局',
  });

  assert.deepEqual(getOverlayCopy('paused'), {
    title: '游戏暂停',
    subtitle: '点击“继续”恢复游戏，或按“重新开始”立即开新局',
  });

  assert.deepEqual(getOverlayCopy('won'), {
    title: '清空棋盘',
    subtitle: '完美通关，按“重新开始”或按 R 再来一局',
  });
});

test('formatOverlayScore keeps the retro padded score format with Chinese copy', () => {
  assert.equal(formatOverlayScore(7), '分数 007');
});
