# Portfolio V3 — Emerald Bay Lab

Status: scope locked by Eko Prasetyo Pratomo, 8 October 2026 (Asia/Jakarta). Implementation decisions below operationalize the approved conversation. Repository: Da-Rookie/Da-Rookie. Delivery branch: v3. Merge to main requires Eko's separate approval.

## Authority and persona

Explicit owner corrections > verified professional persona > this V3 PRD > visual concept > historical V2 presentation. Creative decisions never create new career facts. Source modules in src/data retain the eight existing experiences, their dates, employment types and descriptions, except the explicitly requested AI employer correction and Laravel/LLM/n8n wording. Do not infer client counts, revenue, performance gains, credentials or delivery status. Missing evidence links remain absent.

Identity: **Full-Stack Developer · AI Engineer · Project Manager**. Core brand: **BUILD · AUTOMATE · LEAD**. Respectively these mean Full-Stack Developer, AI Engineer, Project Manager. “Data & Business Automation” is prohibited as headline, tagline, supporting identity or primary positioning.

Two current positions: AI Engineer — PT Pertamina Bina Medika IHC; Project Manager — ReCreate Academy. Eight professional experiences total, not eight years. The existing repository is the detailed factual source. Historical V2 navigation/typography rules are superseded by this spatial presentation. Do not invent a ninth experience. Creative lab architecture is a portfolio metaphor, not a claim of owning a physical laboratory.

## Objective

Create a memorable, explorable real-time Three.js portfolio on desktop and mobile. Within the opening, visitors identify the owner and all three professional identities. The environment attracts attention; projects, experience and recognition provide substance; contact is always accessible. No registration, game score, forced quest completion or linear content gates.

## World and art direction

One coherent coastal island around an emerald/turquoise bay. Open forest-green landscape, coastal stone, trees and lawns; not a dense jungle. Glass and metal research architecture with warm interiors. Restrained Tokyo-inspired cyan and violet neon. Blue-hour atmosphere with warm horizon and water reflections. Physical mesh geometry, movable camera and animated explorer. The supplied Emerald Bay Lab concept art establishes the visual ambition; it is not an actual benchmark or a substitute background for real 3D.

Areas: arrival pier with small boat and welcome terminal; bay plaza; project laboratory with workbench objects; open career terrace; recognition pavilion; conversation deck. Connect these through a walkable waterfront loop and short bridges. BUILD/AUTOMATE/LEAD are an identity, not three disconnected islands. Character: stylized modern explorer wearing a forest-green jacket and small illuminated equipment detail, with idle and walking motion. No claim to reproduce Eko's real face.

## Opening and state flow

1. Initial loading status with readable identity and access to the portfolio index even if 3D fails.
2. Welcome view frames the bay. Primary action begins an optional approximately 10-second arrival sequence; a skip action is continuously available during it. Returning visitors may enter directly. Reduced-motion preference bypasses the cinematic.
3. Boat glides toward the pier; camera travels above water. Titles: “Welcome to Emerald Bay Lab”, “Built by Eko Prasetyo Pratomo”, then “BUILD · AUTOMATE · LEAD”; professional identity remains readable. Supporting line: “Arrive. Activate. Explore.”
4. At the pier, one interaction activates the terminal. Lights and visual accents wake up; controls and suggested next destination appear. No portfolio content is locked before activation; quick access can bypass it.
5. Explore freely. A suggested route moves through lab → terrace → gallery → contact. Visitors may choose any location at any time.

States: loading → welcome → arriving → terminal → exploring. Content panels, map and settings overlay these states. Opening an overlay pauses locomotion and camera input; closing restores the same location. A render failure presents a readable content alternative without requiring a reload. Explicit re-entry can retry 3D.

## Content and interactions

| Place | Spatial interaction | Information and behavior |
|---|---|---|
| Pier | Activate luminous terminal | Welcome, brand, short movement instructions; island illumination responds |
| Lab | Approach workbench / select its marker | Project index; select a project to read context, role, technologies, features and architecture; related experience link |
| Career terrace | Interact with archive console | Brief introduction, two current roles, all eight experience entries with dates and full supplied contributions; education and skill groups |
| Gallery | Interact with illuminated displays | Awards, two publications and certifications; evidence links only where verified and available |
| Conversation deck | Select communication beacon | Working email, LinkedIn and GitHub links from persona; copy email with explicit feedback; no fake message form |

Current daycare work may be shown with its existing AI Engineer contributions; the seller automation item must remain explicitly labeled a concept. Project outcomes are described only through supplied facts; do not invent KPIs. Leadership is evidenced through the ReCreate four-division coordination and Klik Kelontong product/technology role.

Hover/focus highlights interactive markers. Clicking a marker offers a clear content action; the map offers travel to the matching location. First visit guidance explains gestures once and is available from Help afterward. Visited places are remembered for the session; this is optional orientation, not a completion requirement.

## Controls

Desktop: click walkable ground to move, WASD/arrows as an alternative; drag to orbit, wheel to zoom. Mobile: tap ground to move, one-finger drag to orbit, two-finger pinch to zoom. Distinguish taps from drags with a movement threshold. Constrain movement to paths and platforms; no walking through water or structures. Use shortest-path routes for click movement. Camera follows smoothly, respects a comfortable pitch and zoom range; reset framing is always available. Escape closes overlays. Keyboard interaction with interface does not move the character.

Quick access: Works, About, Experience, Recognition, Contact can be opened directly without walking. A labeled island map also lets visitors travel. Mobile controls have at least 44px targets and respect safe areas. Readable responsive panels use native scrolling; close control remains available. Focus is trapped inside dialogs and returned to the trigger; reduced motion and keyboard-only access are supported.

## Graphics settings

Exactly three manually selectable presets, remembered locally. Medium is default; High remains selectable on mobile. Do not silently downgrade an explicitly selected preset. A readable fallback is available for unsupported WebGL or context loss.

| Setting | Low | Medium | High |
|---|---|---|---|
| Pixel ratio cap | 1 | 1.5 | 2 |
| Procedural material texture resolution | 256 | 512 | 2048 |
| Shadow map | Disabled | 1024 | 2048 |
| Water | Animated, simplified surface | Planar reflected water | Higher-resolution planar reflection |
| Vegetation | Sparse | Fuller | Dense grass and canopy details |
| Post processing | None | None | Bloom + output transform |

High pursues richly detailed surfaces, cinematic light and convincing water. AAA/Unreal is an art ambition, not a parity claim. Texture resolution alone is insufficient. The first implementation uses authored procedural geometry and surface maps; replacing these with individually sculpted hero assets remains an art-production option and must be disclosed if visual parity is not attained. Feature/content parity across all presets is mandatory.

Performance targets for later real-device QA: Medium 45–60 fps on a contemporary desktop GPU and 30 fps on a capable mobile device, measured after warmup; High is intentionally demanding. These are targets, not verified results. Avoid per-frame React updates, reuse resources, pause on background tabs and release GPU resources on unmount. Keep asset loading local and split the 3D engine into a lazy chunk.

## Engineering and delivery

Use existing React + TypeScript + Vite, Three.js. Separate authoritative content, world topology, rendering/interaction engine and React interface. No backend or secret keys required. Preserve Vercel SPA rewrite behavior and existing routes as direct content entry points. Local preferences are optional and storage failure must not block access. WebGL failure must not hide professional content.

Deliver PRD, implementation, content/topology verification, build result and a precise QA report on v3. No automatic merge to main. Report limitations without claiming tests not run.

## Acceptance criteria

- Real 3D world and explorer with orbit/zoom, arrival, terminal activation, all six places and connected paths.
- Opening prominently presents exact owner/brand/identity; skip and direct content access work.
- All eight experiences and two current roles remain available, including full descriptions.
- Work, recognition, education, skills and real contact actions are readable independently of 3D.
- Presets actually change texture resolution, vegetation, shadow, reflection and postprocessing budgets; selection persists.
- Mobile and desktop controls, gesture discrimination, camera reset, map, keyboard navigation and reduced-motion paths implemented.
- TypeScript and production build succeed; content facts and route reachability checked. Interactive visual and physical-device validation recorded separately.
