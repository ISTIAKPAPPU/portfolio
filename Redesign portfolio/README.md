# Istiak Ahmed — portfolio

Static site. No build step: open `index.html` or serve the folder.

## Files

    index.html              markup + content
    assets/css/styles.css   Industry design system: tokens, layout, responsive, motion
    assets/js/main.js       scroll reveal, mobile nav, video modal
    assets/js/image-slot.js drag-and-drop placeholder for the two empty project cards
    assets/img/             project thumbnails and portrait
    istiak-ahmed-cv.pdf     CV linked from the nav and footer

## Still to add

- `assets/img/wynn.png` — Wynn Slots screenshot, then swap the `<image-slot id="wynn">`
  in `index.html` for `<img src="assets/img/wynn.png" alt="Wynn Slots">`
- `assets/img/adversarialvr.png` — same swap for `<image-slot id="advr">`
- `istiak-ahmed-cv.pdf` — export the CV and drop it at the repo root

## Responsive breakpoints

    < 640px    single-column cards, 2-up archive, stacked stats
    640–780px  3-up archive, burger nav
    780–900px  full nav, 2-up cards
    > 900px    200px section-label column beside content
    > 1000px   4-up archive

Motion is CSS-driven and respects `prefers-reduced-motion`.

Three images are referenced from the live site at `istiakpappu.github.io`
(hajj, 21Feb, tigerRun, FootBall Challenge) because they exceed the size
limit of the design tool — they already exist in this repo under `assets/img/`,
so no action needed once this folder replaces the repo root.
