# EMERALD BAY LAB V3 — RELEASE / QUALITY ACCEPTANCE MATRIX

**Edition:** 2026-10-15 production-candidate checklist
**Owner:** Eko Prasetyo Pratomo
**Scope:** `v3` only. No production/main deployment or merge.

## Evidence rules

A GitHub push, TypeScript build, synthetic scene, or Vercel READY status is not visual sign-off. A static image concept is not actual browser evidence. The 3D Game Rooms skill requires separate explicit **Function → Form → Runtime** approvals; no approval may be inferred from this user's general approval to implement.

Review **in actual application**, at representative 1440×900 desktop and portrait/landscape Android/iOS. Check Low, Medium and High. Include GPU screenshot, screen recording of traversal, FPS/calls/triangles, and timestamps. To expose live frame counters add `?perf=1` to the branch preview URL.

## Environment identity

- [ ] Default exploration stays Tropical Daylight; real reflective turquoise sea and clear atmosphere
- [ ] Golden Hour appears only during optional arrival and reverts when skipped/completed
- [ ] Curved glass, believable material thickness, limestone/forest-green material language
- [ ] Sky, palm crowns, reef/coast contour, foundations, deck heights, doorways, props are physically grounded
- [ ] One clear architectural hero per composition; no floating rooftops, blocked doors or duplicate false arches
- [ ] No obvious clipping, z-fighting, texture seams or objects popping at any quality tier
- [ ] A distant vista, natural walking-height approach, entry view, 120° oblique, front/back, and upward ceiling view recorded per zone

## Eight zones / content evidence

| Zone | Required role | Verification |
| --- | --- | --- |
| Arrival Pier | first playable step, safe spawn, 10s skip-able boat cinematic | [ ] |
| Bay Plaza | world gateway, connected wayfinding to other zones | [ ] |
| Origins Terrace | operations → engineering → product → AI/leadership timeline | [ ] |
| BUILD Studio | SaaS, engineering workstation, server and real product case studies | [ ] |
| AUTOMATE Lab | daycare/agent/n8n workflow imagery; no private clinical or child data | [ ] |
| LEAD Center | project roadmap and coordinated teams; never fabricate performance statistics | [ ] |
| Recognition Gallery | sourced awards, publications, certificates; infinite expansion via catalog data | [ ] |
| Horizon Contact Deck | meaningful conclusion and verified contact links | [ ] |

## Controls and movement

- [ ] WASD/arrows movement follows orbit camera; no click-to-move is required
- [ ] Shift / mobile RUN / gamepad right trigger speeds up with controlled acceleration
- [ ] E / mobile Interact / controller A activates closest real exhibit
- [ ] M/map navigation and R/reset camera work after panels close
- [ ] Drag orbit and wheel/pinch zoom are stable, with near/far clamp
- [ ] No walking through water, display tables, transparent walls, plinths, or world perimeter
- [ ] Both primary and secondary pavilion entrances have actual openings and clear routes
- [ ] Portrait joystick respects device safe areas; buttons receive proper pointercancel/release
- [ ] Pause, app blur, tab switch, route panels, and loss of focus always halt movement
- [ ] Restored saved state never spawns Emm in water or behind walls

## Profession, content, accessibility

- [ ] BUILD · AUTOMATE · LEAD identity correct on all surfaces
- [ ] Both active roles correct: AI Engineer PT Pertamina Bina Medika IHC / Project Manager ReCreate Academy
- [ ] No invented projects, awards, titles, client names, business numbers or employee data
- [ ] Experience, projects, certificates and papers display properly when a new record is appended, with no world geometry changes
- [ ] Keyboard-only access to panel navigation, contact, settings, intro skip and reading-mode fallback
- [ ] Reduced-motion option honors device preference and disables distracting perpetual motion
- [ ] No autoplay sound; own procedural ambience may be muted and suspends in background
- [ ] No external service required for currently committed assets; Meshy credits were not used

## Engineering diagnostics

Capture `?perf=1` metrics for 2–3 minutes each tier after completing loading/arrival. Aim for **30+ FPS mobile Low**, **45+ desktop Medium** and **55+ desktop High** on explicitly stated target devices; these are review targets, not claims already achieved. Record hardware, browser, resolution, operating system, worst sustained FPS, p95 frame time, peak VRAM when available, draw calls, triangle count and Long Tasks.

Automated commands:
- `pnpm run check:content` — factual identity and original career invariants
- `pnpm run test:v3` — routing, spatial topology, controlling Emm, direct movement and interactive catalog assertions
- `pnpm run build` — above gates plus TypeScript + Vite

## Mandatory final sign-off

| Gate | Status | Blocking evidence |
| --- | --- | --- |
| Requirements / narrative | Approved direction, implementation subject to review | User's earlier decisions |
| Function | Pending | Review accurate engineering room plan, circulation and all actual doorway schedules |
| Form | Pending | Multi-angle material/geometry/ceiling renders, contact/clearance and BVH audits |
| Runtime | Pending | Browser screenshots, real device QA and measured frame telemetry |
| Release to `main` | Not authorized | Explicit owner approval after all gate results |

**Important:** The active repo contains original in-code 3D meshes and authored parametric scenery, not the complete Blender/Meshy-authored GLB library envisioned in the inspiration. The avatar uses an articulated part rig, not full facial/skeletal mocap. If final-quality comparison requires hand-modeled GLB art, perform the asset authoring/review first; no unapproved paid asset call. This is a truthful capability statement and release blocker—not an automatic guarantee of matching the inspiration photograph.

## Owner review procedure

1. Open the branch Vercel preview on desktop and phone, preferably using `?perf=1`.
2. Inspect Arrival, Bay Plaza and each of the six themed buildings from outside, inside and behind Emm.
3. Open every panel and verify career facts, certification listings and URLs.
4. Report screenshots/videos with exact issue, device, URL and which zone/camera perspective failed.
5. Approve Form and Runtime explicitly only after correction and retest; do not merge `main` otherwise.
