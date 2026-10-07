# V3 verification report

Date: 8 October 2026 (Asia/Jakarta). Scope: implementation on branch `v3`.

## Passed

- `npm run check:content`: exactly eight experiences, exactly two current roles with approved employer names, all seven other career records unchanged, allowed AI wording changes only, professional identity preserved and prohibited positioning absent from active presentation.
- `npm run test:v3`: all graph origin/destination pairs reachable; 360 sampled walking routes remain inside valid surfaces; lab/terrace/gallery interior access; open-water destinations rejected.
- Same test: eight content panels render server-side; four project details render; experience entries and current roles appear; real email/LinkedIn/GitHub links and three quality choices are present.
- Same test: arrival → terminal → activation states; explorer visible on the boat; reduced-motion bypass; real-vector walking simulation to gallery; world-state preservation when replacing quality; pausing clears locomotion.
- `npm run build`: TypeScript and Vite production bundle successful.
- `git diff --check`: no whitespace errors.

## Build footprint

At verification: initial JavaScript approximately 243 kB (77 kB gzip), lazy-loaded 3D engine approximately 635 kB (164 kB gzip), CSS approximately 28 kB (7 kB gzip). Local font and existing project images are separate assets. Vite emits an advisory for the 3D chunk exceeding 500 kB; the engine already loads separately from the readable interface. The Node test harness emits Three's CJS deprecation warning; the actual application uses ESM.

## Not run / must not be inferred from the above

No browser visual inspection, GPU shader compilation check, screenshots, touch-device interaction test, Vercel preview visit or real-device FPS/memory benchmark was performed in this environment. The managed preview workflow requires the unavailable control-browser skill; no alternate browser runtime was installed. Server rendering verifies content, not layout, GPU rendering or gesture behavior in a browser.

The concept-art likeness, glass/transparency ordering, camera sightlines/occlusion, water reflections, mobile portrait/landscape layout, dialog focus/scroll behavior, actual pinch gestures, WebGL context-loss recovery and sustained High-mode thermals are pending direct review. These remain acceptance checks, not claimed passes. High mode is procedural real-time art, not guaranteed AAA visual parity.

## Device review before merge

1. Open on a desktop GPU browser and an Android/iOS browser; verify no shader or runtime errors and the bay renders behind the welcome copy.
2. Enter, skip, replay, activate; verify the explorer remains on surfaces and the boat reaches the pier.
3. Walk/click between every destination; inspect interiors and camera framing at minimum and maximum zoom.
4. Open all five portfolio destinations directly; scroll details, close with Escape/button, check returned focus; inspect exactly eight career entries.
5. Change Low/Medium/High while exploring; position and activation remain, settings persist after reload, no content disappears.
6. Test one-finger tap/drag, pinch, safe areas and both orientations. Verify all needed actions remain accessible.
7. Simulate blocked storage and WebGL/context loss. Confirm reading mode and contact remain available.
8. Measure FPS and memory after warmup, including High-mode use; record device and browser versions. Do not infer results from Node tests.

Merge to main still requires Eko's review and approval.
