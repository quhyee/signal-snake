const STATUS_LABELS = {
  running: '进行中',
  paused: '暂停中',
  won: '已通关',
  gameover: '已撞毁',
  idle: '待命',
};

const OVERLAY_COPY = {
  idle: {
    title: '准备开始',
    subtitle: '点击“开始游戏”，按 Enter / Space，或使用方向键 / WASD 直接开局',
  },
  gameover: {
    title: '信号中断',
    subtitle: '按“重新开始”或按 R 立刻再来一局',
  },
  paused: {
    title: '游戏暂停',
    subtitle: '点击“继续”恢复游戏，或按“重新开始”立即开新局',
  },
  won: {
    title: '清空棋盘',
    subtitle: '完美通关，按“重新开始”或按 R 再来一局',
  },
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? STATUS_LABELS.idle;
}

export function buildAnnouncement(status, score, bestScore) {
  const prefix = `状态：${getStatusLabel(status)}。`;

  if (status === 'idle') {
    return `${prefix}${OVERLAY_COPY.idle.subtitle}。当前分数 ${score}，最高分 ${bestScore}。`;
  }

  if (status === 'gameover') {
    return `${prefix}${OVERLAY_COPY.gameover.subtitle}。当前分数 ${score}，最高分 ${bestScore}。`;
  }

  if (status === 'paused') {
    return `${prefix}${OVERLAY_COPY.paused.subtitle}。当前分数 ${score}，最高分 ${bestScore}。`;
  }

  if (status === 'won') {
    return `${prefix}${OVERLAY_COPY.won.subtitle}。当前分数 ${score}，最高分 ${bestScore}。`;
  }

  return `${prefix}当前分数 ${score}，最高分 ${bestScore}。`;
}

export function getOverlayCopy(status) {
  return OVERLAY_COPY[status] ?? OVERLAY_COPY.idle;
}

export function formatOverlayScore(score) {
  return `分数 ${String(score).padStart(3, '0')}`;
}

export function formatSpeedLabel(speed) {
  return `${speed} 毫秒`;
}
