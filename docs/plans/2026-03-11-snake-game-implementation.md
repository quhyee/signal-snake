# Snake Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished browser Snake game that can be opened and run from VS Code.

**Architecture:** Use a static frontend with a Canvas game board and a small set of focused JavaScript modules. Keep the game engine pure enough to test with Node's built-in test runner, then layer the UI and rendering on top.

**Tech Stack:** HTML, CSS, JavaScript, Canvas 2D, Node test runner

---

### Task 1: Project foundation and engine tests

**Files:**
- Create: `package.json`
- Create: `tests/game.test.js`
- Create: `src/config.js`
- Create: `src/game.js`

**Steps:**
1. Write failing tests for initial state, movement, growth, collision, and food placement.
2. Run `npm test` and verify the tests fail because the engine does not exist yet.
3. Implement the minimum engine API to satisfy the tests.
4. Run `npm test` until all engine tests pass.

### Task 2: Browser shell and renderer

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `src/renderer.js`

**Steps:**
1. Build a responsive retro-arcade layout around a canvas.
2. Render the board, snake, food, score, and state overlays.
3. Keep colors, spacing, and type consistent through CSS variables.

### Task 3: Input and loop integration

**Files:**
- Create: `src/input.js`
- Create: `src/main.js`

**Steps:**
1. Wire keyboard controls for arrows and `WASD`.
2. Add a fixed-timestep loop for movement updates.
3. Support start, restart, score updates, and best-score persistence.

### Task 4: Documentation and verification

**Files:**
- Create: `README.md`

**Steps:**
1. Document how to run the project from VS Code.
2. Re-run `npm test`.
3. Open the game in a local browser and verify the main user flows.
