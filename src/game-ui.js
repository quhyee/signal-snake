export const NARROW_LAYOUT_MAX_WIDTH = 900;

export function shouldAutoScrollToGameArea(viewportWidth) {
  return viewportWidth <= NARROW_LAYOUT_MAX_WIDTH;
}

export function getGameAreaScrollBehavior(prefersReducedMotion) {
  return prefersReducedMotion ? 'auto' : 'smooth';
}

export function getPauseButtonState(status) {
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
