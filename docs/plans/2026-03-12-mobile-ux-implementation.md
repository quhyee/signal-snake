# Signal Snake Mobile UX Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve mobile gameplay flow by scrolling players into the board after start or restart and adding a formal pause/resume control.

**Architecture:** Extend the existing status-driven game loop with a `paused` state, then add a game-area action row and narrow-screen auto-scroll behavior in `src/main.js`. Keep the current module boundaries: `src/game.js` owns state transitions, `src/ui-text.js` owns Chinese text, `src/renderer.js` owns overlay copy, and the HTML/CSS layer handles the mobile-first control placement.

**Tech Stack:** HTML, CSS, JavaScript modules, Canvas, Node test runner

---

### Task 1: Add paused-state behavior to the game engine

**Files:**
- Modify: `src/game.js`
- Test: `tests/game.test.js`

**Step 1: Write the failing tests**

Add tests for:

- a helper or transition path that changes `running` to `paused`
- a helper or transition path that changes `paused` back to `running`
- `stepGame()` returning the same state when status is `paused`

**Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/game.test.js
```

Expected: FAIL because pause support does not exist yet.

**Step 3: Write minimal implementation**

Implement the smallest engine-level pause support needed by the tests. Keep the existing loop model where only `running` advances the game.

**Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/game.test.js
```

Expected: PASS for the new pause behavior and all existing game-engine tests.

### Task 2: Add localized paused-state labels and overlay text

**Files:**
- Modify: `src/ui-text.js`
- Modify: `src/renderer.js`
- Test: `tests/ui-text.test.js`

**Step 1: Write the failing tests**

Add tests for:

- `getStatusLabel('paused')`
- pause announcement copy
- paused overlay copy

**Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/ui-text.test.js
```

Expected: FAIL because the paused copy is missing.

**Step 3: Write minimal implementation**

Add the paused label and announcement text in `src/ui-text.js`, then make `src/renderer.js` treat paused state as an overlay-visible state.

**Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/ui-text.test.js
```

Expected: PASS for the new paused-state text behavior.

### Task 3: Add game-area action controls and pause wiring

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/input.js`

**Step 1: Write the failing test or minimal verification target**

Because the current test suite is engine- and text-focused, add the smallest safe coverage that verifies pause wiring where practical. If direct DOM testing is too heavy for this repo, keep automated coverage in engine/text tests and use this task for controlled UI wiring.

**Step 2: Run the relevant focused tests**

Run:

```bash
node --test tests/game.test.js tests/ui-text.test.js
```

Expected: PASS before UI wiring, confirming the state/text layer is stable.

**Step 3: Write minimal implementation**

Implement:

- a game-panel action row
- a pause/resume button
- button state synchronization in `src/main.js`
- optional keyboard pause support if it can be added cleanly without disturbing the existing shortcuts

Keep the hero start/restart buttons in place.

**Step 4: Run verification**

Run:

```bash
node --test tests/game.test.js tests/ui-text.test.js
```

Expected: PASS, confirming UI wiring did not break state logic.

### Task 4: Add narrow-screen auto-scroll and mobile layout adjustments

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `src/main.js`

**Step 1: Write the smallest failing or targetable check**

If no stable DOM automation is added, define this task through manual acceptance criteria and keep automated regression coverage in the earlier tasks.

**Step 2: Implement the mobile-first behavior**

Implement:

- a reliable game-area scroll target
- smooth scroll on start and restart for narrow screens only
- a mobile layout that prioritizes HUD, game actions, board, then touch controls

**Step 3: Verify manually**

Check on a phone-sized viewport:

- tap `开始游戏` and confirm the game area enters view without manual scrolling
- tap `重新开始` and confirm the view remains gameplay-first
- verify pause/resume stays visible near the HUD

### Task 5: Final verification

**Files:**
- Verify only

**Step 1: Run the full automated test suite**

Run:

```bash
npm test
```

Expected: all tests pass.

**Step 2: Run the build pipeline**

Run:

```bash
npm run build
```

Expected: build succeeds and `dist/` is generated.

**Step 3: Manually verify the core UX goals**

Confirm:

- mobile start scrolls to the game area
- mobile restart keeps the player in the game area
- pause stops movement and continue resumes the same run
- desktop keyboard flow still works
