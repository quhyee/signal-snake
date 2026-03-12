# Snake-like Game Design

## Goal

Build a browser-based Snake-like game that runs locally from VS Code and feels like a polished retro arcade toy instead of a bare demo.

## Product Direction

- Use `HTML + CSS + JavaScript + Canvas` so the project is easy to open, inspect, and extend inside VS Code.
- Aim for a playful retro-arcade look with bold typography, warm neon accents, and a responsive single-page layout.
- Keep the first version focused on a solid core loop: move, eat, grow, score, lose, restart.

## Architecture

- `index.html` provides the shell, the canvas, and the control panel.
- `style.css` handles the visual direction and responsive layout.
- `src/config.js` stores shared constants.
- `src/game.js` manages state transitions such as movement, food placement, scoring, and collisions.
- `src/renderer.js` draws the board, snake, food, and overlays.
- `src/input.js` manages keyboard controls and safe direction changes.
- `src/main.js` wires everything together, runs the loop, and updates the UI.

## Success Criteria

- The page opens in a browser from VS Code and starts cleanly.
- Arrow keys and `WASD` control the snake.
- Eating food increases score and snake length.
- Food never spawns inside the snake.
- Wall collision and self-collision end the run.
- Restarting creates a fresh game.
- Highest score persists between refreshes.
