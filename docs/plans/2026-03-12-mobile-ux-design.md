# Signal Snake Mobile UX Design

**Date:** 2026-03-12

## Goal

Improve the phone-sized experience for `Signal Snake` so players can start or restart a run without manually scrolling to find the board, and can pause or resume a run from within the game area.

## Problems Observed

1. On narrow screens, the page stacks the hero content above the game panel.
2. The primary `开始游戏` and `重新开始` buttons live in the hero panel, so after tapping them on mobile, the player still has to scroll down to reach the board.
3. The game currently has no formal pause state or pause control.
4. Overlay messaging is drawn on the canvas, but there is no dedicated in-game action area for active play controls.

## Chosen UX Direction

Use an "enter gameplay first" mobile flow.

The page keeps the existing hero and game panels, but on phone-sized screens the experience changes once a run begins:

- tapping `开始游戏` or `重新开始` scrolls the player directly to the game area
- the game area becomes the primary interaction zone during play
- a visible in-game action row provides `暂停` and `继续`
- the snake can enter a real `paused` state instead of only `idle`, `running`, `gameover`, or `won`

This keeps the current layout recognizable on desktop while making mobile play more immediate.

## Interaction Design

### Start and restart behavior

- The existing hero buttons remain available as first-entry controls.
- On narrow screens, tapping `开始游戏` or `重新开始` smoothly scrolls to the game area.
- The scroll target should be the game panel or the top of the board area so the HUD, game controls, and board all enter view together.
- Desktop behavior should remain unchanged unless the implementation can improve it without altering the current feel.

### In-game controls

- Add a compact action row inside the game panel.
- The action row must contain a pause toggle that changes label between `暂停` and `继续`.
- The action row may also include `重新开始` if it improves mobile ergonomics, but pause/resume is the primary new control.
- While the game is running, players should not need to scroll back to the hero panel for core actions.

### Pause behavior

- Add a new game status: `paused`.
- `running -> paused` when the pause control is used.
- `paused -> running` when the same control is used again.
- `idle -> running` still works from start button, direction input, or keyboard start shortcuts.
- `restart` from any state begins a fresh running game.
- Direction input while paused should not silently resume play.

## Visual Design

### Mobile layout priority

For small screens, the visual order during active play should emphasize:

1. HUD
2. in-game action row
3. board
4. touch controls

The hero section remains on the page but stops being the primary active-play control surface once the user starts a run.

### Paused presentation

- The HUD state label should show `暂停中`.
- The canvas overlay should support a paused message so the stopped state is visually obvious.
- The pause overlay should not look like game over or win state.

## Accessibility and Text

- Add a Chinese status label for `paused`.
- Add localized screen-reader announcement text for pause and resume transitions.
- Add localized overlay copy for the paused state.
- Keep keyboard behavior understandable: start remains `Enter`/`Space`, restart remains `R`, and pause can use a visible button first, with keyboard support considered during implementation.

## Technical Approach

- Keep the existing game engine structure and build on the current `status` field.
- Reuse the existing main loop behavior where only `running` advances the game state.
- Extend text helpers and rendering helpers rather than introducing a second UI state system.
- Keep the change incremental: add pause support, add mobile focus behavior, then refine layout.

## Testing Strategy

### Automated

- Add game-state tests for pause and resume transitions.
- Verify paused games do not advance on tick.
- Add UI text tests for the new paused copy and state labels.

### Manual

- Verify that on phone-sized screens, tapping `开始游戏` scrolls the game into view.
- Verify that tapping `重新开始` also returns focus to the game area.
- Verify that the pause control is visible while running.
- Verify that pause stops movement and continue resumes the same run.
- Verify that touch controls remain visible and do not advance the game while paused.

## Acceptance Criteria

1. On narrow screens, `开始游戏` and `重新开始` bring the player directly to the game area.
2. A visible in-game pause/resume control exists near the HUD.
3. The game supports a formal `paused` state.
4. While paused, game steps stop and state text updates to `暂停中`.
5. Resume continues the current run instead of restarting it.
6. Existing desktop behavior remains stable.
