export const DEFAULT_CONFIG = {
  columns: 20,
  rows: 20,
  cellSize: 24,
  initialSpeed: 180,
  minSpeed: 70,
  speedStep: 8,
  pointsPerFood: 10,
  backgroundColor: '#191516',
  panelColor: '#241d1f',
  gridColor: 'rgba(255, 255, 255, 0.06)',
  snakeHeadColor: '#f4a261',
  snakeBodyColor: '#2a9d8f',
  foodColor: '#e76f51',
  textColor: '#f8f5f2',
  accentColor: '#84dcc6',
};

export const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
