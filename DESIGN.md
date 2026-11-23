# Portfolio design plan (2026-11-22)

Method: Anthropic `frontend-design` skill (two passes: plan, review against the brief, build, critique).

## Brief
- **Subject:** Istiak Ahmed, XR software engineer and Ph.D. researcher (real-time XR systems, Unity/C#, shipped games).
- **Audience:** recruiters and hiring managers for XR / Unity, game and research roles; research labs.
- **Primary job:** in 10 seconds, show "XR engineer who ships and publishes", then let people verify it: watch demos, open code and store pages, download the CV, email.
- **Direction (owner's choice):** formal, focused, research-engineer. Every project stays on the page (owner: no page limit).

## Tokens
**Colour**
- Paper `#FBFCFD`: cool near-white page
- Ink `#0F2238`: deep navy, headings and name
- Text `#33404F`: body copy
- Muted `#66717E`: context lines and dates
- Lens `#0E6B6B`: deep teal, links, focus ring, reticle. The one accent, taken from headset-lens coatings rather than a stock blue.
- Mist `#EEF2F5` (band) and Rule `#DCE2E8` (dividers)

**Type**
- Display: Source Serif 4 (600). Name, section titles, project titles. Formal, research register.
- Body: IBM Plex Sans (400/500). Engineering register, distinct from the serif.
- Scale: body 17/1.6 · small 14.5 · h3 21 · h2 30 · name clamp(40px, 6vw, 60px).
- Sentence case everywhere. Line length ≤ 72ch.

**Layout**
- Max width 1120. On desktop each section is a 2-column grid: a 220px rail with the section title, then the content. Left aligned. Single column on mobile.

```
+----------------------------------------------------------------+
| Istiak Ahmed                      Work Research Experience ... |
+----------------------------------------------------------------+
| (+) Istiak Ahmed                                   [portrait]  |
|     XR software engineer and Ph.D. researcher                  |
|     lede (2 sentences)                                         |
|     fact line: 5+ years · 9 papers · ISMAR Best Poster Award   |
|     [Download CV] [Email]  GitHub  Google Scholar  LinkedIn    |
+--------------+-------------------------------------------------+
| Selected     | XR systems and research                         |
| work         |  [img] Rubik's assistant   [img] Cooking asst.  |
|              |  [img] Adversarial VR                           |
|              | Shipped games                                   |
|              |  [img] Wynn Slots          [img] Air Hockey     |
|              | VR, Android and WebGL                           |
|              |  [img] Training sim  [img] Penalty  [img] ...   |
+--------------+-------------------------------------------------+
| More         | small thumbs, 4 per row, all 11 archive titles  |
+--------------+-------------------------------------------------+
| Research     | intro · award note · publications by year       |
| Experience   | role / org / dates · approved bullets           |
| Skills       | definition list                                 |
| Education    | degree / institution / dates                    |
| Contact      | email (primary) · links · location              |
+--------------+-------------------------------------------------+
```

**Principles**
1. **One memorable element:** a small calibration reticle, the cross-hair used to align XR headsets. It sits beside the name and is reused only as the focus ring and a section-title tick. Everything else stays quiet.
2. **Structure carries information:** projects are grouped by kind (XR systems, shipped games, VR/Android/WebGL) instead of numbered 01–11; publications are grouped by year.
3. **Proof over decoration:** every card ends in plain-text actions (Watch demo, View code, Google Play, App Store, Play in browser). No arrows.
4. **Motion (owner's request 2026-11-22: the page should feel alive, for every visitor).** Built with GSAP 3.15.1 + ScrollTrigger, following GreenSock's official gsap-* skills:
   - Section titles slide in and content fades up 24px with a stagger as you scroll (ScrollTrigger.batch, once). Nothing visible is ever re-hidden.
   - Cards lift and zoom on hover (CSS), with a play-button ping.
   - A faint perspective XR grid drifts behind the hero and fades with scroll (scrub).
   - A teal scroll-progress line runs along the top bar; the current section's link is underlined.
   - Transform and opacity only. **Motion runs even when the visitor's system asks for reduced motion** (owner's decision, accepted trade-off). The page works fully without JS or GSAP.
5. **Top bar (2026-11-22):** name with an "XR Software Engineer" line, muted links with a sliding teal underline, a solid navy "Download CV" button and a scroll-progress line. The reticle mark was removed at the owner's request.
5. **Quality floor:** responsive to 390px, visible keyboard focus (teal reticle ring), AA contrast, alt text.

## Self-review against the skill's templated looks (pass 2)
| Templated look | Old page | This plan |
|---|---|---|
| ALL-CAPS tracked eyebrows | everywhere | removed; sentence-case context lines |
| 01/02 numbering on non-sequences | cards, sections | removed; grouping by kind |
| "A · B" meta strings, "→" on links | kickers, links | context lines are short phrases; links have no arrows |
| Big number + small label stats band | hero stats | replaced by one plain fact sentence |
| Per-section fade/slide reveals, ticker | yes | removed; one hero moment |
| Identical rounded cards with grey shadow | boxed cards | borderless figures, 6px image radius, no shadows |
| Cream + serif + terracotta / dark + acid accent | n/a | cool white, navy, teal lens accent |
| Broadsheet hairlines, zero radius, dense columns | partly | generous spacing, one rule per section |

**Revisions made in this pass:**
- Dropped a second accent (amber for the award). The award now uses the teal accent plus the words "Best Poster Award".
- Replaced the dark research band with the light Mist band, to keep the page formal and one-toned.

## v2 (branch `v2-neon`, 2026-11-22): neon, toned for XR + research, dark/light

The owner asked for a second version inspired by a game-developer neon portfolio, with a dark/light toggle. It is NOT merged into `Portfolio_`; the live site keeps the design above.

- **Themes:** tokens on `:root[data-theme]`.
  - Dark is the default: near-black navy `#070B14`, cyan `#22D3EE`, violet `#A78BFA`, soft glows.
  - Light: `#F7F9FC` background, navy text, teal `#0E7490`, violet `#6D28D9`, shadows instead of glow.
  - Every text/background pair is at least 4.5:1 (checked).
  - An inline head script applies the saved theme before first paint. `localStorage` sits inside try/catch, so it works even when storage is blocked.
- **Type:** Space Grotesk (display), IBM Plex Sans (text).
- **Hero:**
  - A canvas particle network: at most 70 particles, linked lines, a gentle push away from the pointer, paused when off-screen or the tab is hidden, colours from the theme.
  - A glowing badge, the name in a slow-moving gradient, and counters (5+ years, 9 papers) plus the ISMAR 2025 award.
  - Angled (clip-path) buttons, the portrait in an angled gradient frame with a slow scan sweep, and a scroll cue.
- **Sections:** centred titles with a glowing bar; angled cards that lift and glow on hover; a glowing experience timeline; skills as chips with no levels or percentages (only approved facts); a slow rotating glow behind Contact.
- **Motion:** GSAP hero intro, scroll entrances (titles, items, chips), progress line, active-section underline, and canvas drift. Transform and opacity only; it runs for everyone (owner's decision).
- **Text:** identical to the live version (approved wording; 14 experience bullets equal CV claims).

### v2 update (2026-11-22, owner feedback)
- **Light is the default theme**; dark is one click away and remembered.
- **Glow in both themes:** teal and pink in light, cyan, violet and pink in dark.
- **Cards follow the reference style:** 16px rounded corners, a 3px cyan-violet-pink line along the top, a soft coloured glow at rest, and on hover a lift of 6px, a violet border and a stronger glow. Angled corners removed.
- **Card details:** the project context is a small uppercase tag. Card links are buttons: Google Play green, App Store dark, demos and other links in the accent gradient.
- **Skills:** one card per category with the plain approved text (no chips per item).
- **Contact:** action cards with icon boxes (Email, Download CV, LinkedIn, Google Scholar, GitHub last).
