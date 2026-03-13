export const NARROW_LAYOUT_MAX_WIDTH = 900;

export function shouldAutoScrollToGameArea(viewportWidth) {
  return viewportWidth <= NARROW_LAYOUT_MAX_WIDTH;
}

export function getGameAreaFocusTargetId(viewportWidth) {
  return shouldAutoScrollToGameArea(viewportWidth) ? 'touch-controls' : 'game-panel';
}

export function usesBoardTapPause(viewportWidth) {
  return shouldAutoScrollToGameArea(viewportWidth);
}

export function getPauseResumeMode(viewportWidth) {
  return usesBoardTapPause(viewportWidth) ? 'board' : 'button';
}

export function getGameAreaScrollBehavior(prefersReducedMotion) {
  return prefersReducedMotion ? 'auto' : 'smooth';
}

export function getPauseButtonState(status, viewportWidth) {
  if (getPauseResumeMode(viewportWidth) === 'board') {
    return {
      label: status === 'paused' ? '继续' : '暂停',
      hidden: true,
    };
  }

  if (status === 'running') {
    return {
      label: '暂停',
      hidden: false,
    };
  }

  if (status === 'paused') {
    return {
      label: '继续',
      hidden: false,
    };
  }

  return {
    label: '暂停',
    hidden: true,
  };
}
