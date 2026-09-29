# Heritage Green V2 — implementation

This rebuild follows `HERITAGE_GREEN_V2_PRD.md` and the owner's final rebuild specification. It replaces the previous presentation while retaining all professional data.

## Experience and content

- The seven V1 experience entries are unchanged from commit `87e1578` (including wording, dates, roles, companies and supporting metadata).
- AI Engineer — PT Pertamedika appears first, August 2026–Present, On-site. ReCreate Academy remains a concurrent current position.
- Recognition contains achievements, publications and professional certificates. KMI Expo Finalist is absent.
- Existing automation work remains explicitly described as a concept; no shipped outcomes or metrics are invented.
- No child identities, parent messages, employee data, credentials or private system screenshots are included.

Run `npm run check:content` to check the locked experience data.

## Visual and interaction architecture

- Self-hosted variable Manrope with the original SIL OFL license.
- Warm White, Forest Green, Deep Navy, Mist, Sage and Warm Beige surfaces.
- Five client-side routes and persistent floating dock, with project detail routes.
- Initial splash is an overlay over already rendered content. It is skipped on reduced motion and direct secondary-route entry.
- Hero's accessible flat text is always in the DOM. Three.js is a separate lazy chunk protected by an error boundary.
- Actual inflated glyph geometry comes from the same Manrope 800 outlines. It uses a continuous rounded depth profile, metal materials, an environment reflection map, and an organic fragment mask shared with the underlay.
- Pointer coordinates are interpolated. A stationary pointer stops the render loop after settling. Pointer exit, touch end/cancel, off-screen and document visibility reset the effect. The GPU is idle when concealed.
- Horizontal touch motion reveals the typography; vertical motion remains native scrolling (`touch-action: pan-y`).
- DPR is capped and reduced for mobile/software rendering. Reduced motion and failed WebGL retain the complete text-and-CTA hero.
- Both automatically decoded gzip responses and raw gzip assets are supported for the precomputed mesh.
- Browser history preserves scroll, new routes reset to top, deep links target the relevant section, and route metadata updates to the current content.

## Assets

`public/images/klik-kelontong.webp` and `public/images/integrated-hris.webp` are original AI-generated conceptual cover artwork, visibly labelled as such. They are not application screenshots or representations of actual internal systems. Built-in image generation was used.

Cover briefs:

1. Modular forest-green frosted-glass storefront-inspired architecture on cream stone; stepped composition, soft daylight, restrained architectural still life; no text, logo, screen or UI.
2. Offset warm-white stone plates with a forest-green glass layer and silver connector against deep navy; directional studio lighting; no text, logo, screen or UI.

The original Manrope font is licensed under SIL OFL 1.1 (see `public/fonts/OFL-Manrope.txt`). `scripts/build-hero-font.py` derives only the required outlines from the installed font package (requires Python fonttools and brotli). `npm run build:hero` creates the compressed meshes from those outlines. Neither script is needed for a normal deploy; the generated assets are committed.

## Local development and GitHub delivery

```sh
npm ci
npm run dev
npm run check:content
npm run build
```

`npm run build` runs TypeScript before Vite. Both repository lockfiles are updated. The existing Vercel configuration and project connection are preserved. Release consists only of updating the existing GitHub `main` branch; Vercel's existing integration handles deployment.

The old disconnected V1 section components and obsolete style sheets were removed. The profile README and professional data files remain intact. Formatter now uses Prettier because the old formatter removed required separators from inline TypeScript types during verification.

## Verification — 29 September 2026

- Production TypeScript/Vite build and the locked-content check pass.
- Chromium production-browser verification passes for all dock routes, persistent document identity (no reload), active navigation, browser Back/Forward, project metadata, scroll restoration and direct Recognition anchors.
- All six page types were checked at 320, 375, 390, 768, 1280, 1440 and 2560px: no horizontal overflow, dock stays within the viewport and project cover images load.
- WebGL starts concealed, reveals under pointer interaction and clears after exit. Emulated mobile horizontal touch reveals the words, release clears them, and vertical swipes scroll naturally.
- Reduced motion skips the splash and WebGL. Forced WebGL failure and disabled JavaScript retain readable hero content and a working contact link.
- No console errors or uncaught page errors occurred in the primary browser flow.
- Native Firefox, Safari and physical iOS/Android devices were not available in this environment; their compatibility is not claimed as independently tested.

The optional Three.js chunk is loaded separately from the initial application. Vite reports its standard 500 kB raw-chunk advisory (approximately 137 kB gzipped); the production build succeeds.

The four small production binary assets have explicit Git attributes to remain ordinary Git blobs. Deployment does not depend on downloading these files from Git LFS.
