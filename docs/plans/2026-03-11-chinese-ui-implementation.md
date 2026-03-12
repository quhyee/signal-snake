# Signal Snake Chinese UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Localize the Snake game's visible interface and README into Chinese without changing the gameplay logic.

**Architecture:** Keep static HTML copy in `index.html` and centralize runtime status and overlay strings in a dedicated module so `main.js` and `renderer.js` stay consistent. Update typography and spacing in CSS to support Chinese text cleanly.

**Tech Stack:** HTML, CSS, JavaScript, Canvas 2D, Node test runner

---

### Task 1: Document the approved localization design

**Files:**
- Create: `docs/plans/2026-03-11-chinese-ui-design.md`
- Create: `docs/plans/2026-03-11-chinese-ui-implementation.md`

**Step 1: Save the approved design**

Record the localization scope, typography approach, and file-level impact.

**Step 2: Save the execution plan**

Record the exact test-first sequence for the localization work.

### Task 2: Add test-first coverage for localized runtime copy

**Files:**
- Create: `tests/ui-text.test.js`
- Create: `src/ui-text.js`

**Step 1: Write the failing test**

Add tests for localized status labels, screen-reader announcements, and overlay text.

**Step 2: Run test to verify it fails**

Run: `node --test tests/ui-text.test.js`

Expected: FAIL because `src/ui-text.js` does not exist yet.

**Step 3: Write minimal implementation**

Create a small runtime copy module with Chinese mappings and formatting helpers.

**Step 4: Run test to verify it passes**

Run: `node --test tests/ui-text.test.js`

Expected: PASS

### Task 3: Wire runtime Chinese text into the game

**Files:**
- Modify: `src/main.js`
- Modify: `src/renderer.js`

**Step 1: Replace hard-coded English state strings**

Use the localized copy helpers for HUD state labels and live-region announcements.

**Step 2: Replace overlay copy**

Use the localized copy helpers for standby, win, and game-over overlays.

**Step 3: Verify syntax**

Run: `node --check "src\main.js" && node --check "src\renderer.js" && node --check "src\ui-text.js"`

Expected: PASS

### Task 4: Translate static UI and documentation

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `README.md`

**Step 1: Translate visible page copy**

Update metadata, labels, buttons, helper text, and accessibility labels.

**Step 2: Adjust Chinese typography**

Update font stacks, label spacing, and text width to fit Chinese naturally.

**Step 3: Translate the README**

Document the VS Code workflow, controls, testing, and file structure in Chinese.

### Task 5: Full verification

**Files:**
- Verify only

**Step 1: Run all automated tests**

Run: `npm test`

Expected: PASS

**Step 2: Parse all touched JavaScript**

Run: `node --check "src\main.js" && node --check "src\renderer.js" && node --check "src\input.js" && node --check "src\game.js" && node --check "src\ui-text.js"`

Expected: PASS

**Step 3: Review final output**

Check that no player-facing English text remains in the localized UI paths.
