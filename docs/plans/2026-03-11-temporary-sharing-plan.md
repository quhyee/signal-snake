# Temporary Sharing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate a temporary public URL so another person can access the Snake game remotely.

**Architecture:** Run the existing static game locally with a lightweight file server, then expose that local port through a temporary HTTPS tunnel. Verify both the local server and the public URL before handing the link to the user.

**Tech Stack:** `npx serve`, temporary tunnel tool (`cloudflared` preferred, fallback to `localtunnel`)

---

### Task 1: Check local tunnel tooling

**Files:**
- Verify only

**Step 1: Detect available tunnel commands**

Run checks for `cloudflared`, `lt`, and `ngrok`.

**Step 2: Pick the lightest working option**

Prefer `cloudflared` for a quick HTTPS tunnel.

### Task 2: Start the local static server

**Files:**
- Verify only

**Step 1: Start serving `D:\snake-game` locally**

Run a local static server on a fixed port.

**Step 2: Verify the local page loads**

Check the local HTTP endpoint before opening the tunnel.

### Task 3: Open and verify the public tunnel

**Files:**
- Verify only

**Step 1: Start the tunnel**

Expose the local static server over HTTPS.

**Step 2: Capture the public URL**

Extract the generated public address from the tunnel output.

**Step 3: Verify the public URL responds**

Fetch the public page and confirm an HTTP 200-style success before sharing it.
