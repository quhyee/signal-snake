# Signal Snake Mobile UX Follow-Up Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adjust the mobile gameplay flow so start and restart reveal the touch controls and tapping the board toggles pause/resume.

**Architecture:** Reuse the existing mobile-specific helper layer in `src/game-ui.js` and update the narrow-screen focus target from the game panel to the touch-controls region. Keep the pause state in the engine, but move the primary mobile pause interaction into `src/main.js` by wiring board taps to the existing pause/resume transitions and updating localized paused copy.

**Tech Stack:** HTML, CSS, JavaScript modules, Canvas, Node test runner

---

### Task 1: Update helper and text tests first

**Files:**
- Modify: `tests/game-ui.test.js`
- Modify: `tests/ui-text.test.js`
- Modify: `src/game-ui.js`
- Modify: `src/ui-text.js`

**Step 1: Write the failing tests**

Add tests for:

- the new mobile scroll target helper behavior
- the updated paused Chinese copy that references tapping the board

**Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/game-ui.test.js tests/ui-text.test.js
```

Expected: FAIL because the helper and paused copy still reflect the old behavior.

**Step 3: Write minimal implementation**

Update helper output and localized copy only.

**Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/game-ui.test.js tests/ui-text.test.js
```

Expected: PASS.

### Task 2: Wire board-tap pause and revised focus target

**Files:**
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `style.css`

**Step 1: Write the smallest failing check**

Use helper-driven tests where practical and rely on final manual verification for actual scrolling and tap feel.

**Step 2: Implement minimal interaction changes**

Implement:

- narrow-screen focus targeting near `touch-controls`
- board tap toggling pause/resume on mobile
- mobile pause button de-emphasis or hiding

**Step 3: Run verification**

Run:

```bash
node --test tests/game-ui.test.js tests/game.test.js tests/ui-text.test.js
```

Expected: PASS.

### Task 3: Final verification and preview redeploy

**Files:**
- Verify only

**Step 1: Run the full suite**

```bash
npm test
npm run build
```

Expected: PASS.

**Step 2: Redeploy preview**

```bash
npx netlify deploy --build --alias mobile-ux
```

Expected: a live updated preview URL.
