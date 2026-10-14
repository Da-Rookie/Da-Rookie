# Emerald Bay Lab V3 — World/Room Architecture and Asset Register

**Production frame:** all positions use metres. `src/emerald/topology.ts` owns X/Z positions, `heights` owns platform floors and deck interpolation, `finalWorld.ts` owns actual mesh construction, `zoneDressing.ts` owns meaningful interiors, `architectureLandmarks.ts` owns building silhouettes, `characterArt.ts` owns Emm's extra physical details. It is forbidden to update one independently without reconciling the others.

## World coordinate schedule

| Place | Node | X | Y | Z | Clear entrance | Hero function |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Arrival Pier | 0 | 0 | 1.1 | -50 | Open-air dock | Boat landing and first interactive step |
| Bay Plaza | 20 | 0 | 4 | 0 | Open-air hub | Sculpture and navigation |
| Origins Terrace | 4 | -32 | 4.5 | -10 | Open-air colonnade | Career timeline and shaded pergola |
| BUILD Studio | 6 | -29 | 6.5 | 18 | 3.2 m front/rear | Engineering center, workstations, racks |
| AUTOMATE Lab | 10 | 28 | 6.5 | 18 | 3.2 m front/rear | Intelligent-workflow nodes and AI tower |
| LEAD Center | 8 | 0 | 10.5 | 40 | 3.2 m front/rear | Strategy wall, four-division coordination |
| Recognition Gallery | 12 | 36 | 4.5 | -10 | 3.2 m front/rear | Awards, publications, credentials |
| Horizon Contact Deck | 14 | 53 | 3 | -30 | Open ocean-facing deck | Telescope, seating, contact |

**Layout contract:** a single connected island, explicit elevated walking routes (nominal 4.6 m width), terraced surfaces and free movement. No separate floating islands. No accidental crossing of non-walkable ocean. Interior approach faces the nearest declared path. Geometric openings must agree with player and camera collision. All critical gameplay functions also have an accessible DOM interface, so no portfolio information is gated by walking distance.

## Six distinct architectural signatures

| Building | Defining form | Meaningful interior props | Material hero |
| --- | --- | --- | --- |
| Origins | Shaded botanical colonnade and chronological gallery | Grounded timeline pedestals, real planters, landmark plaques | limestone and timber |
| BUILD | Curved transparent roof + framed entrance + supported roof garden | Engineering desks, screens, server rack, product architecture sculpture | forest green frame + warm natural stone |
| AUTOMATE | Twin structural glass towers, sky connection, shaded pavilion | Data integration podiums, network pathways, AI core | sea-glass cyan and illuminated nodes |
| LEAD | Supported axial entrance and horizontal fins | Roadmap dashboard, four division panels, planning desks | warm brass, ceramic limestone |
| Recognition | Distinct circular oculus under high glass pavilion | Award cases, certificates and publication displays | champagne brass and glass |
| Horizon | Fully open coastal trellis and natural observation zone | Telescope, lounge seating, horticulture and contact display | timber, glass and neutral stone |

Do not substitute decorative faux door/arch cutouts for traversable openings. Curved ceiling glass should follow actual structural ribs, not be a flat roof photograph.

## Avatar / animation

Emm is an original articulated explorer (not an implied true facial portrait). Layered forest-green jacket, footwear, utility pack, identity hardware, hair, nose/eyes and wrists are actual Three.js meshes. Existing joint groups are driven by gait-cycle with smooth acceleration/deceleration, sprint cadence and idle. Fully skinned Blender/GLB avatar, facial expressions and mocap remain separately scoped art-production improvements subject to **Form** review. No GLB delivery is implied by a runnable procedural rig.

## Art palette / atmosphere

Bright midday is the baseline. Golden Hour may be used for the **optional** arrival cinematic only and must revert. At distance, the eye should read as a tropical eco-futuristic coastal research campus, not generic game cubes: transparent façades, green roofs, open-water vistas, supportive organic stone, palms, shaded promenades and inhabited interiors.

- Forest green foundations / frames: `#254B42`, `#286C57`
- Daylight cyan glass and sea: `#9CDDD8`, `#1A9D9F`
- Sandstone, limestone and warm natural white: `#E7D4B0`, `#ECE7D7`
- Restrained brass accent: `#D2B379`
- Avoid heavy neon across the walking path; accent light is for context-sensitive nodes only

## Geometry/texture/runtime budgets

| Tier | DPR max | Shadow map | Water reflection | Instanced trees | Instanced grass | Intended use |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Low | 1 | off | off | 32 | 0 | lower-end phones, accessibility |
| Medium | 1.5 | 1024 | 256 | 85 | 1,400 | normal mobile/laptops |
| High | 2 | 2048 | 512 | 145 | 3,200 | capable desktops |

These are code parameters, not proven performance claims. Check real device FPS, WebGL resource allocation and frame stability using `?perf=1`. The enhanced props are procedural; no Meshy service was called, no assets were exported from Blender, and no paid external data was transmitted.

## Function / Form / Runtime evidence contract

- **Function:** user confirms spatial plan, every real doorway, scene purpose, spawn, primary circulation, room Hero, content truthfulness.
- **Form:** review corners, both doors, material seam shots, props against support, ceiling center-up + opposed obliques, sculpt/art silhouette and shadows.
- **Runtime:** actual production-camera walkthrough + FPS and memory on desktop, Android and iOS, all three graphic tiers; clickable panels, fallback, sound, controls, no clipping.
- **Final release:** only after recorded user approval of the three gates; never infer sign-off from CI or Vercel READY.

## Next immutable asset intake

If custom hand-modeled GLBs later replace procedural hero props, require: stable asset ID, semantic front, source/license/provenance, dimensions in metres, triangle budget, PBR texture formats/resolution, normal orientation, collider class, file checksum and per-tier render approvals. Meshy requires separate explicit paid-credit authorization and does not run automatically. All replacements must preserve walkability and HTML content independence.
