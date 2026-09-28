# PRODUCT REQUIREMENTS DOCUMENT
# PORTFOLIO WEBSITE — HERITAGE GREEN V2

**Version:** V2  
**Product Owner:** Eko Prasetyo Pratomo  
**Product Type:** Personal Portfolio Website  
**Primary Identity:** Full-Stack Developer · AI Engineer · Project Manager  
**Core Message:** BUILD · AUTOMATE · LEAD  
**Status:** FINAL / LOCKED PRODUCT & REBUILD SPECIFICATION

This document is the implementation source of truth for Heritage Green V2. It supersedes any older prompt, mockup, implementation note, or exploratory concept that conflicts with the locked decisions below.

---

## 1. Product Overview

Heritage Green V2 is a complete rebuild of Eko Prasetyo Pratomo's portfolio. It is not a conventional digital CV, generic developer template, corporate landing page, SaaS dashboard, cyberpunk UI, gaming interface, or neon-heavy portfolio.

The website is a personal digital experience combining:

- Software Engineering
- Artificial Intelligence
- Business Automation
- Project Management
- Technology Leadership
- Product Thinking
- Research
- Professional Credentials
- Professional Recognition

Visitors should quickly understand who Eko is, what he does, what he builds, how his professional journey has developed, what capabilities he has, what evidence supports the work, and how to contact or collaborate with him.

---

## 2. Product Positioning

Primary professional positioning:

**Full-Stack Developer · AI Engineer · Project Manager**

Core identity:

**BUILD · AUTOMATE · LEAD**

### BUILD
Represents building web applications, backend systems, APIs, mobile applications, business platforms, internal systems, SaaS products, digital products, and data-driven applications.

### AUTOMATE
Represents artificial intelligence, AI automation, AI agents, RAG, LLM integration, n8n workflows, business-process automation, data automation, API integration, and intelligent workflows.

### LEAD
Represents project management, project leadership, technology leadership, cross-functional collaboration, product thinking, technology planning, architecture decisions, and business/technology alignment.

`Product & Technology Lead` may remain where it is a factual historical role, such as the Klik Kelontong Experience entry, but it must not be used as the primary V2 professional identity.

---

## 3. Target Audience

Primary audience:

- Recruiters
- Hiring Managers
- Engineering Managers
- Technology Leads
- CTOs
- Product Leads
- Startup Founders
- Business Owners
- Potential Clients
- Professional Collaborators

Secondary audience:

- Software Engineers
- AI Engineers
- Project Managers
- Researchers
- University Networks
- Professional Networks
- Technology Communities

---

## 4. Experience & Visual Principle

The site must feel:

- Premium
- Calm
- Modern
- Technical
- Architectural
- Editorial
- Mature
- Interactive
- Nature-inspired
- Sophisticated

Primary design philosophy: **ORGANIC PRECISION**.

The organic side comes from forest tones, natural materials, soft texture, warm neutral surfaces, and organic forms. The precision side comes from architectural grids, strong typography, controlled spacing, structured hierarchy, precise interaction, and clean information architecture.

Avoid generic dashboard cards, excessive glassmorphism, giant shadows, random gradients, neon color systems, gaming visuals, excessive parallax, particles, cursor trails, constant floating motion, and decorative movement without purpose.

---

## 5. Information Architecture

Heritage Green V2 uses a **Multi-Page SPA Experience**, not one giant scrolling page.

Primary pages and locked order:

1. Home
2. About
3. Experience
4. Recognition
5. Contact

Routes:

- `/`
- `/about`
- `/experience`
- `/recognition`
- `/contact`
- `/projects/:slug`

Navigation must use client-side routing with no full browser reload. The persistent bottom dock remains in place while route content transitions.

Browser back/forward must remain predictable. Opening a new route should normally return to the top of the page. Internal anchors may use smooth scrolling. Do not hijack scrolling.

---

## 6. Page Transition

Primary page transitions should be restrained:

- current page: subtle fade out and slight translation
- next page: fade in with subtle vertical reveal
- target duration: approximately 300–700ms

Avoid white flashes, long blank states, full reloads, aggressive zoom, or theatrical transitions that distract from content.

---

## 7. Primary Navigation

Use a **persistent Floating Bottom Navigation Dock** on desktop and mobile.

Locked navigation:

**Home → About → Experience → Recognition → Contact**

Requirements:

- no top navigation as the primary navigation
- no hamburger menu
- icon + label for every item
- active route state
- compact rounded capsule
- subtle border/depth
- only restrained backdrop blur
- comfortable minimum interaction target

Mobile must account for `env(safe-area-inset-bottom)`, remain usable at 320px width, and keep touch targets around 44px or larger.

When viewing `/projects/:slug`, no primary navigation item needs to appear active unless contextually appropriate.

---

## 8. Splash Screen

Splash appears only on the initial hard load and is not a page.

Recommended sequence:

1. `P`
2. `PRASETYO`
3. `BUILD / AUTOMATE / LEAD`
4. transition into Home Hero

Target: approximately 1.5–2.5 seconds.

Do not replay splash when navigating between SPA routes.

For `prefers-reduced-motion: reduce`, significantly shorten or skip the splash. It must never become a blocking loading screen.

---

## 9. Home Page

Home provides immediate positioning and should not duplicate the entire portfolio.

Home includes:

1. Hero
2. Brief professional positioning
3. Selected Work
4. Optional selected professional highlights
5. Closing CTA to About or Contact

Experience, Recognition, and Contact remain dedicated routes.

---

## 10. Hero — Locked Core Experience

Hero uses approximately the full viewport (`100svh` recommended) and is typography-first.

It must not use the conventional developer layout of biography on the left and terminal/profile visual on the right.

Primary headline:

- BUILD.
- AUTOMATE.
- LEAD.

Suggested scale:

- Desktop: approximately `clamp(72px, 11vw, 180px)`
- Mobile: approximately `clamp(52px, 17vw, 96px)`

Supporting identity:

**Full-Stack Developer · AI Engineer · Project Manager**

Supporting-copy direction:

> Building digital products, intelligent systems, automation, and technology projects for real operational needs.

Primary CTA: `Explore Selected Work`  
Secondary CTA: `Start a Conversation`

Optional metadata can include `P / PRASETYO` and `Jakarta · Indonesia`, but metadata must remain secondary.

---

## 11. Hero — Correct 3D/WebGL Model

This is a **CRITICAL LOCKED REQUIREMENT**.

The final Hero interaction is:

**FLAT TYPOGRAPHY BASE → WEBGL DIMENSIONAL / INFLATED VERSION OF THE SAME TYPOGRAPHY → ORGANIC SHADER / MASK REVEAL**

Meaning:

- BUILD. / AUTOMATE. / LEAD. exists as stable readable flat typography.
- During interaction, the same word is represented as dimensional, inflated, balloon-like typography.
- The 3D subject is the typography itself.
- The 3D subject is not a separate decorative model.
- The dimensional typography is revealed through an organic/irregular realtime mask or shader interaction.
- Noth.in is a technical/interaction reference, not a visual template to copy.

A duplicated rendering may be used internally for compositing, but a `TEXT → RANDOM BLOB → DUPLICATED TEXT` composition is **not** the intended product concept.

---

## 12. Hero Idle State

Before genuine interaction:

- flat typography remains fully visible
- interactive dimensional typography is concealed
- no 3D placeholder is visible
- no static preview is visible
- no silhouette or ghost object is visible
- no glow exposing the hidden 3D is visible
- no automatic standalone 3D motion is visible

The WebGL resources may be technically loaded in memory so first interaction is immediate, but they must be visually hidden until interaction.

---

## 13. Hero Desktop Interaction

Desktop uses mouse/pointer interaction.

When the pointer enters and moves through the Hero:

- activate the reveal
- reveal the WebGL dimensional version of the same word
- let reveal position follow the pointer
- use interpolation rather than raw 1:1 pointer movement
- allow subtle deformation/swelling/bending while keeping the word identifiable
- use smoothing, easing, light inertia, and controlled momentum
- organic reveal can resemble liquid, ink, brush, or irregular soft masking

When the pointer stops, a subtle settle is allowed.

When the pointer leaves the interactive Hero region:

- close the reveal smoothly
- hide dimensional typography again
- restore the clean flat-typography idle state

The Hero must not behave like a 3D model viewer.

---

## 14. Hero Mobile Interaction

Mobile uses **Touch / Drag / Swipe Reveal**.

Before touch interaction, no dimensional typography is visible.

When the user intentionally drags/swipes in the Hero:

- reveal activates
- touch position controls reveal position/direction
- dimensional typography becomes visible
- deformation may respond to gesture direction/velocity

When the gesture ends, a brief settle is allowed before returning to the concealed idle state.

Interaction must distinguish intentional Hero gestures from normal vertical page scrolling. Vertical scrolling must remain usable and must not be hijacked.

---

## 15. Hero Material Direction

Dimensional typography should feel:

- inflated / balloon-like
- sculptural
- dimensional
- polished
- premium
- reflective
- soft
- contemporary

Allowed material directions:

- chrome / silver metallic
- Heritage Green metallic
- smoked / dark reflective
- subtle iridescent
- controlled translucent/glass-like treatment

Avoid cartoon styling, neon/rainbow materials, game-like chrome, or generic logo-spinner aesthetics.

---

## 16. Hero — Explicitly Rejected Concepts

The following are removed and must not be implemented:

- Heritage Botanical Artifact
- leaf sculpture
- botanical 3D centerpiece
- rotating leaves
- independent leaf layers
- botanical object viewer
- standalone chrome orb
- standalone metallic ribbon
- floating sculpture
- unrelated metallic blob
- decorative 3D model beside the headline
- draggable standalone model
- mouse-controlled rotating object
- continuous idle 3D rotation
- autonomous floating 3D
- visible 3D before interaction
- random 3D placeholder
- `TEXT → RANDOM BLOB → TEXT`
- CSS-only duplicated text used as a substitute for the realtime dimensional typography effect

Any older concept matching these items is superseded by this PRD.

---

## 17. Noth.in Reference Boundary

Noth.in may inspire:

- flat typography as stable base
- realtime WebGL dimensional/inflated typography
- shader-driven reveal/deformation
- organic reveal silhouettes
- pointer fluidity
- touch responsiveness
- smooth inertia/easing
- metallic/inflated depth

Do **not** copy:

- NOTHIN' wordmark
- branding
- font
- layout
- composition
- colors
- exact mesh
- exact shader parameters
- exact animation timing
- exact assets

The output must remain recognizably Heritage Green V2.

---

## 18. Hero Fallback & Reduced Motion

The Hero must remain complete without WebGL.

If WebGL, JS, interaction, or hardware capability fails, preserve:

- BUILD / AUTOMATE / LEAD
- primary positioning
- supporting statement
- CTA
- layout hierarchy

Do not insert a random fallback 3D asset.

For reduced motion:

- reduce/disable complex shader deformation
- hide or simplify the WebGL layer
- shorten/skip splash
- remove parallax
- use simple route fades
- never hide factual content

---

## 19. Visual Design System

Palette:

- Deep Navy — `#152A38`
- Forest Green — `#2F5241`
- Sage — `#4A5B52`
- Warm White — `#FAF8F2`
- Mist — `#E4E5DB`
- Warm Beige — `#D6CFB9`

Deep Navy: primary typography and strong contrast.  
Forest Green: active state, accent, interaction.  
Sage: secondary text and metadata.  
Warm White: primary canvas.  
Mist: alternate surface.  
Warm Beige: limited supporting natural tone.

Do not introduce random accent colors such as neon purple, bright cyan, electric blue, strong magenta, gaming neon, or rainbow gradients.

Depth should primarily come from lighting, opacity, layers, surface contrast, material, texture, typography, and spacing.

---

## 20. Typography

Primary typeface: **Manrope**.

Use typography to create hierarchy through size, weight, spacing, alignment, and opacity. Avoid unnecessary font families.

The desired character is modern, clean, architectural, technical, mature, and highly readable.

---

## 21. Selected Work

Projects are not primary navigation items. Home contains an editorial `SELECTED WORK` section rather than a generic equal-card grid.

A project may show only fields that actually exist:

- Project Name
- Category
- Period
- Role
- Short Description
- Key Technology
- Project Visual
- External Link
- Repository Link
- Detail Page Link

Never fabricate missing fields.

Validated existing project pool may include:

- Integrated HRIS
- Klik Kelontong
- AI / Business Automation
- Data Analytics projects
- Portfolio Website
- AI-related development
- Infrastructure / Redis experimentation
- other projects genuinely owned by Eko

Desktop project interaction may use subtle scale, image reveal/shift, text movement, arrow movement, and surface changes. Avoid excessive card tilt.

---

## 22. Project Detail

Project detail may use `/projects/:slug`.

Possible factual sections:

- Project Overview
- Problem / Context
- Role
- Solution
- Architecture
- Technology
- Implementation
- Outcome
- Gallery
- Repository / Demo

If factual information is unavailable, omit the section. Never invent outcomes, metrics, repository links, or architecture claims.

---

## 23. About Page

About is editorial, not a long biography.

It includes:

- Professional Identity
- Professional Philosophy
- Capabilities
- Skills
- Education

Achievements live in Recognition, not as the primary About recognition section.

Narrative direction:

**Engineering, automation, and project leadership — in one practice.**

Identity pillars:

- Engineering
- AI
- Automation
- Project Management
- Leadership

Capability highlights:

- Digital Products
- AI Systems
- Business Automation
- Data-driven Solutions
- Internal Business Systems
- API-driven Platforms

---

## 24. Skills

Do not use a logo wall. Group skills by capability.

Recommended validated group structure:

### Engineering
React, TypeScript, Laravel, PHP, FastAPI, Python, Flutter, REST API, and other genuinely used engineering tools.

### AI
LLM, RAG, LangChain, AI Agent, OpenAI, Ollama, and validated AI/ML skills.

### Automation
n8n, Webhook, REST Integration, Workflow Automation, Business Process Automation, AI/Data Automation.

### Data
Pandas, Scikit-learn, RFM, Time Series, Power BI, and validated data tooling.

### Infrastructure
PostgreSQL, MySQL, Redis, Docker, Git, GitHub, and validated infrastructure tooling.

### Project & Leadership
Project Management, Project Monitoring, Timeline/Milestone Tracking, Cross-functional Coordination, Stakeholder Management, Technology Planning, Product Thinking, and validated delivery practices.

---

## 25. Education

Education is compact and readable.

Format:

- Institution
- Program
- Period / Status
- optional factual supporting field such as GPA when already present in existing portfolio data

Avoid giant education cards.

---

## 26. Experience Page — Content Lock

Experience has a dedicated editorial career-journey page.

**CRITICAL REQUIREMENT:** every Experience entry already present in Portfolio V1 is locked factual content.

Do not rewrite, paraphrase, shorten, expand, reinterpret, change dates, change roles, change companies, or change meaning for existing V1 entries.

V2 may change only layout, typography, visual hierarchy, timeline presentation, animation, and responsive representation.

The system must support multiple simultaneous `Present` roles.

---

## 27. New Experience — AI Engineer

Add:

- **Role:** AI Engineer
- **Company:** PT Pertamedika
- **Period:** August 2026 — Present
- **Work Arrangement:** On-site

Responsibility meaning must include:

- Building the Daycare Module
- Integrating AI Automation into the Daycare system
- Developing automation for child-information workflows
- Integrating parent communication through WhatsApp
- Automating delivery of daycare child updates/information to parents
- Reducing manual communication processes
- Connecting application modules and automation workflows

English grammar can be polished, but meaning must not change.

Do not expose sensitive child/patient identity, internal credentials, confidential architecture, or private company data.

The current Project Manager role already present in V1 remains `Present`, so at least two concurrent current roles must be shown correctly.

---

## 28. Recognition Page

`Recognition` replaces the previous `Research` primary-navigation concept.

Recognition is one umbrella page containing, in this order:

1. Achievements
2. Publications
3. Professional Certificates

Preferred presentation is cohesive editorial vertical sections. Optional tabs/segmented controls are allowed only if they improve usability. Deep links such as `/recognition#achievements`, `/recognition#publications`, and `/recognition#certificates` are desirable.

### Achievements
Known validated items include:

- Gold Medal — Pekan Inovasi 2025
- P2MW 2025 Funding Recipient / Grant Recipient

**KMI Expo Finalist is removed and must not be displayed anywhere in Heritage Green V2.**

Do not invent rankings, metrics, awards, or impact claims.

### Publications
Publication entries may show title, journal/publisher, publication date, accreditation, author/co-author information when available, keywords, and external link when available.

Use validated existing publication data. Presentation should feel academic/editorial, not like project cards.

### Professional Certificates
Certificate entries may show certification name, issuer, year/date if known, domain, credential link, and credential ID if genuinely available.

Known certificate content may include IBM SkillsBuild `AI Agent for Programming` and validated Codecademy Career Path credentials already owned by Eko. Do not invent missing dates, IDs, or links.

---

## 29. Contact Page

Contact has a dedicated route and acts as the closing experience.

Headline direction:

**LET'S BUILD  
SOMETHING  
USEFUL.**

Supporting intent may reference product collaboration, AI systems, automation, software projects, technical collaboration, project collaboration, and professional opportunities.

Primary channels:

- Email
- LinkedIn
- GitHub

Optional channels only if actually used:

- CV
- WhatsApp

External links should clearly behave as external destinations.

An oversized `P` or `PRASETYO` may be used as subtle background typography without reducing readability.

---

## 30. Material, Cards, Borders & Shadows

Material inspiration:

- Natural Landscape
- Architectural Concrete
- Glass
- Wood
- Metal
- Stone
- Matte Paper
- Forest Surface

Nature influence comes primarily from palette, texture, surface, form, and composition rather than filling the site with tree photography.

Cards should be flatter and editorial with generous internal spacing, intentional hierarchy, minimal shadow, and subtle borders. Suggested border opacity is roughly 8–15% Navy/Forest. Shadows are used sparingly.

---

## 31. Motion System

Three levels:

1. **Micro Interaction:** 150–300ms — buttons, links, navigation, arrows, small hover.
2. **Content Reveal:** 400–800ms — headings, timeline, cards, page content, image reveal.
3. **Cinematic:** 800–1600ms — splash, Hero, major visual transition.

Motion must serve hierarchy, feedback, storytelling, transition, or spatial continuity.

---

## 32. Responsive & Accessibility Requirements

Support from **320px mobile through ultrawide desktop**.

Mobile:

- single-column structure where appropriate
- persistent bottom dock
- compact but readable spacing
- responsive oversized typography
- touch-driven Hero reveal
- no horizontal overflow

Tablet: balanced mixed grids and whitespace.  
Desktop: larger editorial typography, richer layout, pointer interaction, and full Hero composition.

Accessibility requirements:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible button/navigation labels
- alt text where images exist
- sufficient contrast
- logical heading hierarchy
- screen-reader-friendly document structure
- reduced-motion support
- WebGL cannot be the sole source of information

---

## 33. Performance & Technical Direction

Priority order:

1. Content readability
2. Fast interaction
3. Responsive layout
4. Smooth motion
5. Visual fidelity
6. Decorative effects

The final Hero is different from the older pre-rendered-standalone-object proposal. Because the locked interaction is realtime dimensional typography plus shader reveal, **WebGL is allowed and expected where appropriate**.

Preferred Hero implementation:

- native WebGL, Three.js, or equivalent lightweight approach
- custom shader/material if needed
- GPU-friendly transforms/uniforms
- pointer/touch interpolation
- efficient geometry/text texture
- responsive device pixel ratio
- quality reduction on weaker mobile hardware
- render throttling/pausing when off-screen or inactive when practical

Do not maximize polygon count or add unnecessary particles/post-processing/heavy shadows.

Critical assets may preload for immediate first interaction, but preloading must not make hidden dimensional typography visible before interaction. Below-the-fold media should lazy-load.

---

## 34. Content & Component Architecture

Professional content should live as structured data, for example:

```text
src/
  components/
    navigation/
    hero/
    motion/
    projects/
    experience/
    recognition/
    ui/
  pages/
    Home
    About
    Experience
    Recognition
    Contact
    ProjectDetail
  data/
    profile
    projects
    experience
    achievements
    publications
    certifications
    skills
    education
  hooks/
  lib/
  styles/
```

Do not hardcode all professional facts into one large page component.

---

## 35. Content Accuracy

Never invent:

- Employment
- Job descriptions
- Dates
- Companies
- Projects
- Technologies
- Project results
- Awards
- Publications
- Certifications
- Metrics
- Repository links
- Achievements

If information is not available, omit it.

Microcopy should be concise, professional, confident, technical, human, and mature. Avoid exaggerated marketing claims.

Examples:

- `Systems with a reason to exist.`
- `Engineering, automation, and project leadership — in one practice.`
- `Building useful technology for real operational problems.`

---

## 36. SEO & Metadata

Recommended titles:

- Home: `Eko Prasetyo Pratomo — Full-Stack Developer, AI Engineer & Project Manager`
- About: `About — Eko Prasetyo Pratomo`
- Experience: `Experience — Eko Prasetyo Pratomo`
- Recognition: `Recognition — Eko Prasetyo Pratomo`
- Contact: `Contact — Eko Prasetyo Pratomo`
- Project: `[Project Name] — Eko Prasetyo Pratomo`

Every route should receive a relevant semantic description.

---

## 37. Browser & Fallback Targets

Target modern:

- Chrome
- Edge
- Firefox
- Safari
- Android Chrome
- iOS Safari

If Hero graphics fail, text remains visible. If animation fails, content remains readable. If images fail, layout should remain usable. Reduced-motion must not remove content.

---

## 38. QA Checklist — Navigation

Verify:

- `/` works
- `/about` works
- `/experience` works
- `/recognition` works
- `/contact` works
- `/projects/:slug` works for available projects
- no `Research` primary navigation item remains
- order is Home → About → Experience → Recognition → Contact
- no full reload on internal navigation
- back/forward work
- active dock state is correct
- mobile dock does not overflow

---

## 39. QA Checklist — Hero

Verify:

- splash only on initial load
- BUILD / AUTOMATE / LEAD is readable
- primary positioning is correct
- no 3D placeholder exists at idle
- no leaf/botanical/rotating standalone model exists
- desktop pointer interaction reveals dimensional typography
- revealed visual represents the same word as flat typography
- reveal is shader/mask driven and organic
- cursor movement is smooth and interpolated
- pointer leave returns to clean idle
- mobile touch/drag/swipe reveal works
- normal mobile vertical scrolling remains usable
- reduced-motion fallback works
- WebGL failure does not break Hero
- no horizontal overflow

---

## 40. QA Checklist — Experience & Recognition

Experience:

- V1 wording remains unchanged
- V1 dates remain unchanged
- V1 companies remain unchanged
- V1 roles remain unchanged
- AI Engineer — PT Pertamedika exists
- AI Engineer is August 2026 — Present
- AI Engineer is On-site
- Daycare Module context is correct
- AI Automation context is correct
- WhatsApp parent-update workflow meaning is correct
- multiple current roles display correctly
- current Project Manager remains Present

Recognition:

- dedicated Recognition page exists
- Achievements exists
- Publications exists
- Professional Certificates exists
- KMI Expo Finalist does not appear
- validated achievements/publications/certificates remain factual
- missing links/IDs/dates are omitted rather than fabricated

---

## 41. Definition of Done

Heritage Green V2 is done when:

1. Multi-page SPA architecture is active.
2. Locked navigation and order are implemented.
3. Persistent floating bottom dock works on desktop/mobile.
4. No hamburger navigation is used.
5. Routes change without full reload.
6. Splash is initial-load only.
7. Hero uses BUILD / AUTOMATE / LEAD.
8. Primary identity is Full-Stack Developer · AI Engineer · Project Manager.
9. Flat typography is the stable Hero base.
10. Realtime dimensional/inflated typography represents the same words.
11. Organic cursor/touch-driven mask/shader reveal is implemented.
12. Dimensional typography is hidden before interaction.
13. Standalone 3D/botanical/leaf/blob centerpiece concepts are absent.
14. Hero remains complete without WebGL.
15. Selected Work is on Home.
16. Project-detail routing is supported for available projects.
17. About includes identity, capabilities, skills, and education.
18. Experience is dedicated and V1 content remains locked.
19. AI Engineer — PT Pertamedika is added correctly.
20. Two concurrent current roles are supported.
21. Recognition contains Achievements, Publications, and Professional Certificates.
22. KMI Expo Finalist is removed.
23. Contact is a dedicated route.
24. Responsive behavior works from 320px to ultrawide.
25. Accessibility and reduced-motion requirements are satisfied.
26. Professional facts remain validated and no missing fact is fabricated.
27. The visual identity remains consistently Heritage Green V2.

---

## 42. Locked Product Decisions

Unless Eko Prasetyo Pratomo explicitly revises them, the following remain locked:

- Primary Identity: **Full-Stack Developer · AI Engineer · Project Manager**
- Core Message: **BUILD · AUTOMATE · LEAD**
- Primary Navigation: **Home · About · Experience · Recognition · Contact**
- Recognition replaces Research and contains Achievements, Publications, Professional Certificates
- KMI Expo Finalist is not displayed
- Existing V1 Experience content remains verbatim
- AI Engineer — PT Pertamedika, August 2026 — Present, On-site is added
- Daycare + AI Automation + WhatsApp parent-update context is represented without sensitive information
- Multiple concurrent current roles are supported
- Hero idle has no visible 3D placeholder
- Hero 3D subject is the typography itself
- Desktop reveal is pointer-driven
- Mobile reveal is touch/drag/swipe-driven
- Final Hero direction is **flat BUILD/AUTOMATE/LEAD + dimensional WebGL version of the same typography + organic shader/mask reveal**
- standalone leaf/botanical/orb/blob/rotating model concepts are rejected
- no professional fact may be invented

---

## 43. Final Creative Direction

> A calm, architectural, editorial, and interactive personal portfolio where engineering precision meets an organic visual language.
>
> The Hero begins with typography. Interaction reveals another dimension of that typography.
>
> Heritage Green V2 represents someone who **BUILDs** digital products, **AUTOMATEs** intelligent systems, and **LEADs** projects and technology toward useful outcomes.

---

**END OF PRD — HERITAGE GREEN V2**
