# EMERALD BAY LAB V3 — MASTER OVERHAUL SOURCE OF TRUTH

**Date:** 15 October 2026 · **Owner:** Eko Prasetyo Pratomo · **Repo:** `Da-Rookie/Da-Rookie` · **Branch:** `v3`.

This source-of-truth is an implementation register. The complete 18-document Master Blueprint pack was prepared separately for owner review. The playable code changes on this branch do not mean the entire visual/art-production standard has passed acceptance.

## Decision hierarchy

1. Explicit factual corrections and approved portfolio persona.
2. Approved creative scope: complete rebuild allowed, one walkable Emerald Bay island, BUILD · AUTOMATE · LEAD, playable Emm, Tropical Daylight default, Golden Hour only for cinematics, expandable career data, `v3` only.
3. Approved content fields in `src/data` and the verified baseline.
4. This blueprint, technical acceptance criteria, and measured browser evidence.
5. Inspiration images; these are references, not final render evidence.

Never fabricate credentials, business metrics, job titles, or deployed capabilities. Do not use private clinical/employee data in the public portfolio.

## Desired visitor response

**Wonder → Agency → Discovery → Credibility → Contact.**
Visitors first see an extraordinary tropical eco-futuristic island, then learn Emm can be moved freely, discover meaningful exhibits, understand real engineering/AI/leadership work, and have a clear way to make contact. No quests, locked content, leaderboards, or forced cinematic sequences.

## Role-to-place mapping

| Place | Narrative | Source of truth |
| --- | --- | --- |
| Arrival Pier | Introduction and optional cinematic | Profile and identity |
| Bay Plaza | Orientation and exploration | Main portfolio index |
| Origins Terrace | From operations into technology | Education + career chronology |
| BUILD Studio | Engineering, architecture, SaaS | Klik Kelontong, HRIS, selected projects |
| AUTOMATE Lab | Intelligent systems and workflows | AI Engineer role, internal daycare work; anonymized conceptual demo only |
| LEAD Center | Decisions, people, execution | ReCreate four-division coordination and product leadership |
| Recognition Gallery | Recognition supported by evidence | Awards, two publications, certifications |
| Horizon Deck | Dialogue and next chapter | Authentic LinkedIn, GitHub, mailto |

Current identity: **Full-Stack Developer · AI Engineer · Project Manager**. Two concurrent current roles: AI Engineer at PT Pertamina Bina Medika IHC; Project Manager at ReCreate Academy. Future Product Manager career goals are not present-day job claims.

## World rules

- One coherent island with ocean, coast, landmarks, connected boardwalk and optional fast-travel map.
- North-star architecture: transparent curved glass, limestone, grounded stone bases, botanical green roofs, sculptural organic framing; furniture must show genuine function.
- One visual hero per camera view. No props clip walking surfaces or doors; verify every threshold and camera line of sight in a live browser.
- High-fidelity stylized realism: detailed materials, contact shadows, variation, layered depth, selective particles, restrained modern UI and sound.
- Tropical Daylight for open exploration. Golden Hour is temporary and must restore bright daylight on skip/end.
- The owner-supplied reference is inspiration, not a 2D backdrop to fake a 3D scene.

## Input contract

Desktop: WASD/arrows direct locomotion; hold Shift to run; E interact; drag orbit; wheel zoom; Esc closes dialog; Tab remains native focus. Mobile: bottom-left analog joystick, bottom-right interact + run; touch swipe camera; pinch zoom. All must release movement when dialogs open, blur, orientation changes, or input canceled. No compulsory jump or click-to-move.

## Expandable content

Canonical factual source is `src/data/*.ts`; `src/data/portfolioRegistry.ts` enforces stable IDs and paginated fixed-host exhibit capacity. New experiences, awards, papers and certifications belong in data files, not in level geometry. Evidence links are optional, not invented. The Recognition Gallery never grows uncontrolled GLB count when new certificates appear.

## Art and performance contract

Three.js renders mesh geometry (not raster painting). Quality presets Low/Medium/High retain the same factual content. Prefer instancing and shared PBR materials, lazy loading and local assets; measure draw calls, JS CPU and GPU frame time. Set no unrealistic universal FPS guarantee. The live browser and actual phone are authoritative for success.

## Build/change register

- Baseline audit commit `a503d387` had working Three.js free exploration, boat arrival, five mapped destinations, text-mode fallback, three graphics presets and correct existing persona, but visual/device validation remained unperformed.
- This overhaul adds Tropical Daylight/Golden Hour direction, organic pavilion art, palm/scenic layers, eight themed destinations, direct mobile analog movement, run and interact buttons, desktop E/Shift, and a canonical portfolio registry.
- The 144×116m world layout now drives actual meshes, walking surfaces, heights, destination mapping and the minimap. Distinct exterior landmarks and indoor technical exhibits are procedural Three.js assets. Emm has an articulated explorer rig with additional original detailing, but this is not a Blender-skinned/GLB character. Independent human visual/physical-device sign-off and premium authored model intake remain necessary.
- Original V2 editorial files remain for preservation; no changes are made to `main`.

## Verification & milestones

1. **Engineering:** TypeScript, production build, content regression, world path tests, mobile input unit tests.
2. **Function gate:** approve revised ground plan, open door schedule, player capsule envelope, guaranteed route and hero shot.
3. **Form gate:** review geometry from multiple angles, real openings, no floating/clipping props, materials, ceiling geometry and production camera; explicit visual sign-off.
4. **Runtime gate:** inspect deployed WebGL scene desktop and Android/iPhone, portrait/landscape, Low/Medium/High, screen-reader reading path, keyboard navigation and real FPS metrics. Explicit sign-off.
5. **Release:** send preview for owner approval. Merge to main only on new permission; Meshy paid work also requires separate explicit spend approval.

## Current production documents

- [World and room asset register](WORLD_ASSET_REGISTER.md): dimensions, named zones, architectural signatures, original materials, traversal and three graphics tiers
- [Quality acceptance](QUALITY_ACCEPTANCE.md): Function, Form and Runtime gate checklist plus live \u201c?perf=1\u201d diagnostic procedure
- [Delivery status](DELIVERY_STATUS.md): delivered features, automated QA and explicit known gaps
- [Original baseline](../PRD.md): history only when superseded by approved overhaul decisions

## Outstanding (cannot silently claim complete)

Production-level Blender assets and Meshy generation are not run. Build success alone does not prove benchmark-image likeness, real mobile feel, collider correctness, immersive audio, GPU performance or finalized full-world room design. Before the project is called final, complete these gates with evidence and owner review.
