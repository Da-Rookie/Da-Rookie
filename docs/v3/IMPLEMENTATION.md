# Emerald Bay Lab — implementation

## Structure

- `src/App.tsx`: app states, native dialog, quick-access routes, settings, optional generated ambient tone and identity.
- `src/emerald/World.tsx`: React/Three lifecycle boundary, lazy import, quality replacement, render-error fallback.
- `src/emerald/engine.ts`: rendering, camera, pointer/pinch/wheel input, keyboard movement, arrival sequence, world-state snapshots and cleanup.
- `src/emerald/environment.ts`: locally authored coastal geometry, architectural meshes, glass/materials, vegetation instances, articulated explorer, boat, planar reflected water, sky and environment light.
- `src/emerald/materials.ts`: deterministic authored surface maps, ripple normal map and architectural signage.
- `src/emerald/topology.ts`: connected waterfront graph, interior floor regions, safe click-routing and graphics budgets.
- `src/emerald/Content.tsx`: readable works/about/experience/recognition/contact, map, settings and help.
- `src/data/*`: existing factual content, reused across the presentation. Seven prior career entries remain identical; AI Engineer receives only the owner's exact employer and Laravel/LLM/n8n corrections.

## Experience

Welcome → 10-second boat arrival (skippable) → pier terminal → free exploration. A returning browser can enter directly. The introduction shows the owner, BUILD/AUTOMATE/LEAD, and all three professional identities. The explorer is visible aboard the boat and then on the pier.

Click/tap requests a valid ground destination. Routes connect through the walkable graph, including lab, gallery and terrace interior floors. A 6px gesture threshold distinguishes a tap from orbiting. WASD/arrows are relative to camera orientation. A two-pointer pinch changes distance. Camera pitch/distance are bounded and reset is available.

Spatial markers open stories; the map travels to a destination. All professional content is available immediately through quick access, even before terminal activation. Closing a native dialog restores focus and resumes the world. Existing `/about`, `/experience`, `/recognition`, `/contact`, `/projects`, and `/projects/:id` routes open corresponding reading panels. SPA rewrites remain unchanged.

## Graphics and runtime

Low / Medium / High change pixel ratio caps, generated surface-map resolution (256 / 512 / 2048), vegetation density, shadows, reflected-water resolution and High bloom. Medium and High use Three's Water planar-reflection pass; High uses an EffectComposer with bloom and an output pass. Environment illumination is generated from the physical sky rather than a remote HDR dependency. Geometry, character and textures are authored procedurally, not a raster backdrop.

Manual quality preference persists; no hidden downgrade. Rebuilding the renderer for a preset preserves character position, camera and activation state. Reduced motion skips arrival motion and reduces decorative animation. Optional ambient sound is locally synthesized and starts only after a user action; no third-party music or unlicensed audio. The scene/audio pause in background tabs. Reading panels pause locomotion, hide spatial markers, and stop ongoing render scheduling until resumed. Unmount removes listeners, stops frames, disposes geometry/materials/textures/postprocessing and destroys the WebGL context.

3D initialization/context failure opens a reading-mode alternative, retaining every professional panel and contact link. Local-storage and clipboard failures are handled independently. No analytics, accounts, server, private data or message submission endpoint added.

## Scope and visual caveat

The supplied cinematic concept art is an artistic reference. This implementation uses procedural modeling and surface maps, not a photogrammetry/Blender asset production pipeline. High is materially more demanding and detailed than the other presets, but AAA/Unreal parity is not claimed. In-browser art review and measured physical-device performance remain required before approving a production merge.

The historical V2 files remain in the repository for traceability but are no longer imported by the active app entry. Git history and profile README content are retained. No merge to main is performed.
