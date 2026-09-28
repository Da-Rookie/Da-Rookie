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
- Interaction inspired by the *feel* of Noth.in, without copying its layout or visual identity

The hero must remain typography-first.

---

# 2. Hero — Locked Interaction Concept

## 2.1 Idle State

Before the user interacts with the hero:

- The main typography is fully visible and readable.
- No 3D object is visible.
- No metallic blob/balloon is visible.
- No decorative 3D silhouette, placeholder, glow, floating artifact, leaf sculpture, or rotating object is visible.
- The hero should feel clean, intentional, and relatively calm.

Primary typography:

- BUILD.
- AUTOMATE.
- LEAD.

## 2.2 Interaction Layering

When the user interacts with the hero, the visual stack must be:

1. Foreground primary typography
2. Metallic / inflated / balloon-like 3D blob layer
3. Duplicated typography layer behind the 3D object

Conceptually:

`FOREGROUND TEXT → 3D METALLIC/BALLOON LAYER → DUPLICATED BACKGROUND TEXT`

The duplicated text is not a separate headline concept. It exists specifically to create the layered depth/reveal effect during interaction.

## 2.3 Desktop Interaction

Desktop behavior:

- Pointer entering and moving across the hero activates the reveal.
- The reveal follows cursor movement using a soft mask / sweep / localized reveal.
- The 3D metallic/blob layer appears only inside or around the active reveal region.
- The duplicated text behind the object becomes visible as part of the same layered reveal.
- Motion should interpolate smoothly rather than snapping directly to the pointer.
- A small amount of inertia/easing is allowed to give the interaction a premium feel.
- When the pointer leaves the interactive hero region, the reveal closes and the 3D/blob layer disappears again.

The interaction must NOT behave like a standalone object viewer.

## 2.4 Mobile Interaction

Mobile behavior:

- Touch / drag / swipe activates the same layered reveal concept.
- Gesture movement controls the reveal position/direction.
- Releasing/ending the interaction closes the reveal and returns the hero to the clean idle state.
- The interaction must not require hover.

---

# 3. 3D / Material Direction

The 3D element is a supporting interaction layer, not the hero subject itself.

Allowed direction:

- inflated balloon/blob form
- sculptural abstract form
- chrome / metallic material
- heritage-green metallic variation
- subtle translucent/glass or iridescent variation when appropriate

Material/color variation may change subtly during interaction, but it must stay within the Heritage Green visual system.

The 3D form should feel polished, soft, dimensional, and contemporary.

---

# 4. Explicitly Rejected / Removed Concepts

The following concepts are NOT part of Heritage Green V2 and must not be implemented:

- Heritage Botanical Artifact
- leaf sculpture as the hero 3D model
- botanical 3D centerpiece
- rotating leaf layers
- leaves moving independently around the hero
- a standalone 3D object placed beside the headline
- continuous autonomous 3D rotation
- an idle floating 3D object
- a visible 3D model before interaction
- a generic orb/object viewer controlled by drag
- replacing the typography-first hero with a 3D centerpiece

Any earlier suggestion matching the list above is superseded by this PRD.

---

# 5. Reference Interpretation

Noth.in is used only as an interaction-feel reference for:

- layered typography
- reveal behavior
- metallic/inflated visual depth
- cursor-following fluidity
- smooth inertia/easing

Do NOT copy:

- exact branding
- exact composition
- exact colors
- exact typography
- exact object design

Heritage Green V2 must remain visually original and aligned with the portfolio's own identity.

---

# 6. Performance Requirements

The effect must remain lightweight enough for a portfolio website.

Preferred approach:

- optimized/pre-rendered transparent 3D assets or similarly lightweight implementation
- GPU-friendly transforms/masks
- minimal layout thrashing
- graceful mobile fallback where necessary

Avoid heavy realtime WebGL/Three.js unless it is demonstrably necessary and still meets performance targets.

The interaction should prioritize smoothness and responsiveness over excessive geometry or effects.

---

# 7. Acceptance Criteria — Hero

The hero is considered correct only when all of the following are true:

- BUILD / AUTOMATE / LEAD remains the primary hero focus.
- Idle state shows no 3D/blob object.
- Interaction reveals the metallic/blob layer.
- A duplicated text layer is visible behind the 3D layer during the reveal.
- Desktop interaction follows cursor movement smoothly.
- Mobile interaction responds to touch/drag/swipe.
- Ending the interaction returns the hero to its clean idle state.
- No leaf/botanical artifact model appears anywhere in the hero.
- No standalone rotating 3D centerpiece is introduced.
- The final look is recognizably Heritage Green V2 rather than a copy of Noth.in.

---

# 8. Implementation Priority

For implementation, this specification overrides any conflicting hero description in older prompts, mockups, implementation notes, or exploratory discussion.

If an older document describes a two-column hero, terminal-first hero, standalone abstract 3D visual, botanical object, leaf artifact, or permanently visible 3D element, use this Heritage Green V2 PRD instead.
