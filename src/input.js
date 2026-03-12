const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
  W: 'up',
  A: 'left',
  S: 'down',
  D: 'right',
};

export function bindInput(target, { onDirection, onRestart, onStart }) {
  function handleKeydown(event) {
    const tagName = event.target instanceof HTMLElement ? event.target.tagName : '';
    const isInteractiveTarget = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tagName);
    const direction = KEY_TO_DIRECTION[event.key];

    if (direction) {
      event.preventDefault();
      onDirection(direction);
      return;
    }

    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      onRestart();
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && !isInteractiveTarget) {
      event.preventDefault();
      onStart();
    }
  }

  target.addEventListener('keydown', handleKeydown);

  return () => {
    target.removeEventListener('keydown', handleKeydown);
  };
}
