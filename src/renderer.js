import { formatOverlayScore, getOverlayCopy } from './ui-text.js';

function withAlpha(hexColor, alpha) {
  if (!hexColor.startsWith('#') || (hexColor.length !== 7 && hexColor.length !== 4)) {
    return hexColor;
  }

  const fullHex =
    hexColor.length === 4
      ? `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`
      : hexColor;

  const red = Number.parseInt(fullHex.slice(1, 3), 16);
  const green = Number.parseInt(fullHex.slice(3, 5), 16);
  const blue = Number.parseInt(fullHex.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function drawGrid(ctx, width, height, cellSize, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (let x = cellSize; x < width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = cellSize; y < height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawFood(ctx, food, cellSize, color) {
  if (!food) {
    return;
  }

  const centerX = food.x * cellSize + cellSize / 2;
  const centerY = food.y * cellSize + cellSize / 2;
  const radius = cellSize * 0.24;

  ctx.save();
  ctx.shadowColor = withAlpha(color, 0.45);
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#fff3df';
  ctx.beginPath();
  ctx.arc(centerX - radius * 0.38, centerY - radius * 0.38, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSnake(ctx, snake, cellSize, headColor, bodyColor) {
  snake.forEach((segment, index) => {
    const inset = index === 0 ? 2 : 3.5;
    const x = segment.x * cellSize + inset;
    const y = segment.y * cellSize + inset;
    const size = cellSize - inset * 2;
    const fill = index === 0 ? headColor : bodyColor;

    ctx.save();
    ctx.shadowColor = withAlpha(fill, index === 0 ? 0.42 : 0.22);
    ctx.shadowBlur = index === 0 ? 24 : 16;
    roundedRectPath(ctx, x, y, size, size, index === 0 ? 9 : 7);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = index === 0 ? '#fff3df' : withAlpha('#ffffff', 0.15);
    roundedRectPath(ctx, x + size * 0.16, y + size * 0.16, size * 0.4, size * 0.2, 4);
    ctx.fill();
    ctx.restore();
  });
}

function wrapTextLines(ctx, text, maxWidth) {
  const tokens = text.match(/[A-Za-z0-9/]+|\s+|./gu) ?? [];
  const lines = [];
  let currentLine = '';

  for (const token of tokens) {
    const nextLine = currentLine + token;

    if (!currentLine.trim()) {
      currentLine = token.trimStart();
      continue;
    }

    if (currentLine && ctx.measureText(nextLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = token.trimStart();
      continue;
    }

    currentLine = nextLine;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function drawCenteredWrappedText(ctx, lines, centerX, startY, lineHeight) {
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });

  return lines.length;
}

function drawOverlay(ctx, width, height, state, config, options) {
  if (state.status === 'running') {
    return;
  }

  const { title, subtitle } = getOverlayCopy(state.status, options);

  const cardWidth = Math.min(360, width - 48);
  const subtitleFont = '14px "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif';

  ctx.save();
  ctx.font = subtitleFont;
  const subtitleLines = wrapTextLines(ctx, subtitle, cardWidth - 48);
  ctx.restore();

  const cardHeight = 118 + subtitleLines.length * 24;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  ctx.save();
  ctx.fillStyle = 'rgba(10, 8, 9, 0.62)';
  ctx.fillRect(0, 0, width, height);

  roundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, 22);
  ctx.fillStyle = withAlpha(config.panelColor, 0.96);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff3df';
  ctx.font = '700 24px "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif';
  ctx.fillText(title, width / 2, cardY + 44);

  ctx.font = subtitleFont;
  ctx.fillStyle = config.textColor;
  const subtitleLineCount = drawCenteredWrappedText(
    ctx,
    subtitleLines,
    width / 2,
    cardY + 78,
    22,
  );

  ctx.font = '700 14px "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif';
  ctx.fillStyle = config.accentColor;
  ctx.fillText(formatOverlayScore(state.score), width / 2, cardY + 88 + subtitleLineCount * 22);
  ctx.restore();
}

export function drawGame(ctx, state, config, options = {}) {
  const width = config.columns * config.cellSize;
  const height = config.rows * config.cellSize;

  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#161113');
  background.addColorStop(1, config.backgroundColor);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.fillRect(10, 10, width - 20, height - 20);
  ctx.restore();

  drawGrid(ctx, width, height, config.cellSize, config.gridColor);
  drawFood(ctx, state.food, config.cellSize, config.foodColor);
  drawSnake(ctx, state.snake, config.cellSize, config.snakeHeadColor, config.snakeBodyColor);
  drawOverlay(ctx, width, height, state, config, options);
}
