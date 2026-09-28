# Heritage Green V2 — Product Requirements Document

## Status
LOCKED — implementation source of truth for Heritage Green V2.

This document supersedes any earlier hero/3D concept that conflicts with the specification below.

---

# 1. Core Visual Direction

Heritage Green V2 keeps the portfolio identity centered on:

- BUILD. AUTOMATE. LEAD.
- Heritage green / editorial / premium digital aesthetic
- Strong typography as the primary visual anchor
- Refined motion and depth, not decorative 3D for its own sake
- Interaction inspired by the *mechanism and feel* of Noth.in, without copying its branding, composition, typography, colors, or exact visual assets

The hero must remain typography-first.

---

# 2. Hero — Locked Interaction Concept

## 2.1 Idle State

Before the user interacts with the hero:

- The main flat typography is fully visible and readable.
- No standalone 3D object is visible.
- No botanical model, leaf model, floating artifact, decorative orb, or rotating centerpiece is visible.
- The interactive 3D typography layer remains concealed until interaction.
- The hero should feel clean, intentional, and calm.

Primary typography:

- BUILD.
- AUTOMATE.
- LEAD.

## 2.2 Correct Layering Model

The hero interaction is NOT:

`TEXT → RANDOM 3D BLOB → DUPLICATED TEXT`

The locked interaction model is:

`FLAT TYPOGRAPHY BASE → WEBGL 3D/INFLATED VERSION OF THE SAME WORD → SHADER/MASK REVEAL`

Meaning:

- BUILD. / AUTOMATE. / LEAD. exists as the readable base typography.
- During interaction, the same word is represented as a dimensional, inflated/balloon-like 3D typographic form.
- The 3D form is not a separate decorative object. The typography itself becomes the 3D visual subject.
- The 3D typography is revealed through an organic/irregular shader or mask region that responds to pointer or touch movement.
- A secondary duplicate-text layer is NOT a required visual concept. Any duplicated rendering used internally for compositing must not change the intended visual model above.

## 2.3 Desktop Interaction

Desktop behavior:

- Pointer entering and moving across the interactive hero activates the reveal.
- The reveal follows cursor movement smoothly with interpolation/easing.
- The active region exposes the WebGL-rendered inflated/metallic version of the same hero word.
- The reveal region may have an irregular liquid / ink / brush-like silhouette rather than a perfect circular mask.
- The 3D typography can appear to distort, swell, bend, or shift subtly as part of the shader interaction, while the word remains visually identifiable.
- The effect should feel spatial and dimensional rather than like a CSS text hover.
- When the pointer leaves the interactive hero area, the WebGL reveal closes and the hero returns to the clean flat-typography idle state.

The interaction must NOT behave like a standalone 3D model viewer.

## 2.4 Mobile Interaction

Mobile behavior:

- Touch / drag / swipe activates the same reveal mechanism.
- Gesture position controls the reveal area and/or deformation response.
- The user should feel that the inflated 3D typography is being uncovered or disturbed through touch.
- Ending the interaction returns the hero to the clean idle state.
- Mobile must not depend on hover.

---

# 3. 3D Typography / Material Direction

The hero 3D element is the typography itself.

Locked form direction:

- inflated / balloon-like letterforms
- dimensional typography derived from BUILD. / AUTOMATE. / LEAD.
- soft sculptural volume
- polished metallic or reflective surface

Allowed material directions:

- chrome / silver metallic
- heritage-green metallic
- smoked / dark reflective material
- subtle iridescent treatment
- translucent/glass-like treatment only when readability and performance remain strong

Material variation may shift subtly during interaction, but it must stay within the Heritage Green visual system.

The result should feel premium, sculptural, responsive, and contemporary — not cartoonish and not like a generic 3D logo spinner.

---

# 4. Explicitly Rejected / Removed Concepts

The following concepts are NOT part of Heritage Green V2 and must not be implemented:

- Heritage Botanical Artifact
- leaf sculpture as the hero 3D model
- botanical 3D centerpiece
- rotating leaf layers
- leaves moving independently around the hero
- standalone 3D blob unrelated to the hero typography
- standalone 3D object placed beside the headline
- continuous autonomous 3D rotation
- idle floating 3D object
- visible decorative 3D model before interaction
- generic orb/object viewer controlled by drag
- replacing the typography-first hero with a separate 3D centerpiece
- treating the effect as only CSS text duplication
- treating the 3D layer as a random object inserted between two text layers

Any earlier suggestion matching the list above is superseded by this PRD.

---

# 5. Noth.in Reference Interpretation

Noth.in is used as a technical and interaction reference for the following ideas:

- flat typography as a stable base
- a WebGL-rendered dimensional/inflated typography layer
- the 3D typography being the same word/identity as the base typography
- shader-driven reveal/deformation
- organic or irregular reveal silhouettes
- cursor-following fluidity
- smooth inertia/easing
- metallic/inflated surface treatment

Do NOT copy:

- exact NOTHIN’ wordmark
- exact branding
- exact composition
- exact colors
- exact typography
- exact shader values
- exact mesh/object design
- exact animation timing

Heritage Green V2 must remain visually original and aligned with Eko's portfolio identity.

---

# 6. Technical / Performance Direction

The intended effect is a real-time interactive graphics layer, not merely a static image swap.

Preferred implementation direction:

- WebGL-based hero layer
- Three.js or an equivalent lightweight WebGL approach when appropriate
- custom shader/material work for mask/reveal/deformation
- GPU-friendly transforms and uniforms
- pointer/touch interpolation rather than layout-driven animation
- optimized geometry and textures
- responsive device-pixel-ratio handling
- graceful quality reduction on weaker mobile devices
- reduced-motion fallback for accessibility

Performance rules:

- do not maximize polygon count for visual quality
- keep geometry efficient
- avoid unnecessary post-processing passes
- avoid continuous heavy rendering when the hero is off-screen
- pause or reduce rendering when interaction is not active where practical
- preserve fast initial load and smooth scrolling

WebGL/Three.js is allowed and expected here when it is the correct implementation for this interaction.

---

# 7. Acceptance Criteria — Hero

The hero is considered correct only when all of the following are true:

- BUILD. / AUTOMATE. / LEAD. remains the primary hero identity.
- Idle state presents clean flat typography without a visible standalone 3D object.
- Interaction reveals a dimensional/inflated 3D version of the same word being presented.
- The 3D visual is typography itself, not a decorative blob or botanical model.
- The reveal is driven by a smooth cursor/touch-responsive mask or shader effect.
- The reveal silhouette can feel organic/irregular rather than mechanically circular.
- Desktop interaction follows pointer movement fluidly.
- Mobile interaction responds to touch/drag/swipe.
- Ending the interaction returns the hero to its clean idle state.
- No leaf/botanical artifact model appears anywhere in the hero.
- No standalone rotating 3D centerpiece is introduced.
- The effect does not reduce to simple CSS duplicate text.
- The final result is recognizably Heritage Green V2 rather than a copy of Noth.in.

---

# 8. Implementation Priority

For implementation, this specification overrides any conflicting hero description in older prompts, mockups, implementation notes, commits, or exploratory discussion.

If an older document describes any of the following, ignore that older description and follow this PRD instead:

- two-column hero as the primary identity
- terminal-first hero
- standalone abstract 3D object
- botanical object
- leaf artifact
- random metallic blob between text layers
- permanently visible 3D element
- simple duplicated-text hover used as a substitute for the WebGL inflated-typography interaction

The locked Heritage Green V2 hero direction is:

**Flat BUILD. / AUTOMATE. / LEAD. typography + interactive WebGL inflated typography of the same words + organic shader/mask reveal controlled by cursor or touch.**
