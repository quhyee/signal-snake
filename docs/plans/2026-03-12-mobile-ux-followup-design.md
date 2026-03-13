# Signal Snake Mobile UX Follow-Up Design

**Date:** 2026-03-12

## Purpose

Refine the first mobile UX pass after real-device feedback.

## Feedback Addressed

1. After tapping `开始游戏` or `重新开始`, the page scrolls to the board area, but the touch-direction controls may still remain below the fold.
2. The pause button is too far from the thumb interaction zone during active play.

## Updated Interaction Direction

### Scroll target

On narrow screens, start and restart should focus the lower gameplay area instead of the top of the game panel.

- The scroll target should prioritize bringing the touch controls into view.
- The board should remain visible at the same time.
- The implementation should prefer a target near `touch-controls`, not the top of the panel.

### Pause interaction

On narrow screens, tapping the canvas should toggle pause and resume.

- `running -> paused` when the player taps the board
- `paused -> running` when the player taps the board again
- This board-tap pause behavior should be mobile-first and should not interfere with desktop keyboard play

### Pause affordance on mobile

Because board tap becomes the primary pause interaction on phones, the explicit pause button should no longer be the main mobile control.

- Keep restart visible in the game area
- Hide or de-emphasize the pause button on narrow screens
- Update paused copy so it tells the player to tap the board to continue

## Text Changes

Paused messaging should match the interaction model:

- overlay copy should say the board can be tapped to continue
- announcement copy should no longer imply that a dedicated `继续` button is required on mobile

## Acceptance Criteria

1. On narrow screens, start and restart bring the touch controls into view without manual scrolling.
2. On narrow screens, tapping the board pauses the game.
3. On narrow screens, tapping the paused board resumes the game.
4. The game can still be restarted from the in-panel controls.
5. Existing desktop behavior remains stable.
