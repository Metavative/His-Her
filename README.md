# His & Her Med Spa + Academy — Website

A hand-built static website. No frameworks, no build step, no dependencies.
Open `index.html` in a browser and it runs.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, philosophy, signature treatments, process, academy teaser, testimonials, locations |
| `services.html` | All 14 treatments, filterable by category, with FAQ |
| `academy.html` | 6 certification programs, what's included, enrolment form |
| `team.html` | Practitioners, values, careers |
| `contact.html` | Contact form, both locations with maps, hours, FAQ |
| `404.html` | Not-found page |

Supporting files: `robots.txt`, `sitemap.xml`.

## Structure

```
assets/
  css/style.css      ← the entire design system, one file
  js/main.js         ← all interactions, one file, no libraries
  favicon.png
  img/
    logo-mark.png            two-figure mark, transparent
    logo-lockup.png          full logo, dark wordmark (light backgrounds)
    logo-lockup-light.png    full logo, cream wordmark (dark backgrounds)
    apple-touch-icon.png
    hero.jpg, service-break.jpg, academy-*.jpg, contact-side.jpg, storefront-mississauga.jpg
    services/*.jpg           one photo per treatment
```

The three logo files were extracted from `Logo (9).pdf` at 600 dpi with the white
background removed, so they sit cleanly on any colour.

---

## Deploying

Everything is relative paths, so it works anywhere:

- **Netlify / Vercel / Cloudflare Pages** — drag the folder onto the dashboard. Done.
- **Any web host** — upload the folder contents to the web root via FTP.
- **GitHub Pages** — push to a repo, enable Pages on the branch root.

If your host supports pretty URLs (Netlify does by default), `/services` will
resolve to `services.html` automatically. The `<link rel="canonical">` tags and
`sitemap.xml` currently use the `.html` form — if you switch to pretty URLs,
drop the `.html` from those two places.

---

## Things you should replace before going live

1. **Team photos.** `team.html` uses elegant monogram cards (MR / CP) because no
   photographs were available. To swap in real portraits, add the image inside the
   portrait div and delete the monogram span:
   ```html
   <div class="person-portrait">
     <img src="assets/img/team/mariyam.jpg" alt="Mariyam Rasoli">
   </div>
   ```
2. **Team bios.** The two bios are written from the roles and languages listed on
   the current site. Replace with the practitioners' own words.
3. **Mississauga booking link.** Only the Whitby Fresha link was available, so the
   Mississauga card uses a phone CTA. If Mississauga has its own Fresha page,
   search `tel:6475135749` in `contact.html` and `index.html` and swap the link.
4. **Review count.** The JSON-LD in `index.html` claims `"ratingCount": "120"` —
   set this to the real Google review count or remove the `aggregateRating` block.
   (The 4.8 rating itself came from the current site.)
5. **Testimonials.** Only one is a real, attributed Google review (Ben Hoang). The
   other two are marked "Verified Client" and are placeholders — replace them with
   real reviews or delete them.
6. **Missing services.** The Whitby storefront sign lists **Dysport**,
   **Skin Rejuvenation** and **Weight Management**, which don't appear on the
   current website's service menu, so they aren't on this one either. If you offer
   them, add cards to `services.html` following the existing pattern.
7. **Pricing.** The FAQ says pricing is quoted at consultation. If you want prices
   on the page, add a `<p class="mono">From $X</p>` inside each `.card-body`.

---

## The contact forms

Both forms (contact and academy enrolment) currently open the visitor's email app
with the fields pre-filled — no server required, and nothing is stored on the site.

To receive submissions properly instead, the easiest upgrade is
[Formspree](https://formspree.io) — free tier is plenty:

```html
<!-- replace this -->
<form class="form" data-mailto="hisandhermedspa@gmail.com" data-subject="Website enquiry">

<!-- with this -->
<form class="form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

Then delete the `.form-msg` div and the `form-note` paragraph. On Netlify, use
`<form name="contact" method="POST" data-netlify="true">` instead.

---

## Customising

**Colours** — all in one block at the top of `assets/css/style.css`:

The theme is **Pure Serenity & Derm-Grade Trust**. These eight names are the
public API — every other token in the file is an alias pointing at one of them,
so changing a value here moves the whole site:

```css
/* Canvas — 60% */
--bg-main:          #FAFCFC;   /* Ice White        */
--bg-card:          #EAEFF2;   /* Soft Cloud Gray  */

/* Structure & branding — 30% */
--color-navy:       #1E2A38;   /* Deep Navy        */
--color-slate-blue: #7A8B99;   /* Dusty Slate Blue */
--text-muted:       #4A5568;

/* Action & conversion — 10% */
--cta-bg:           var(--color-navy);
--cta-hover:        #5C6B78;
--cta-accent:       var(--color-slate-blue);
```

**No pure black anywhere.** The darkest value on the site is `--color-navy`,
including on `html` itself so nothing falls back to the UA default.

**Why `--cta-hover` is not `#7A8B99`.** The Dusty Slate Blue is a mid-tone. As a
button fill it leaves a white label at 3.4:1 and a navy label at 4.1:1 — both
below AA for text that size — and as body text it is 3.0:1 on Cloud Gray. So it
keeps every job where nothing has to be read (underlines, rules, borders,
highlight accents) and two darker relatives carry the rest:

```css
--slate-dk: #5C6B78;   /* slate text on light, and the CTA fill — 5.3:1 / 4.7:1 */
--slate-lt: #8595A1;   /* slate text on navy — 4.7:1                            */
```

On a navy section the solid button inverts to an Ice White fill with a navy
label, filling to `--slate-lt` on hover, which is the one slate light enough to
keep that label at 4.7:1.

The site is light-first: Ice White and Cloud Gray alternate, and navy is used
deliberately for only two moments per page (the academy band and the closing
CTA). If you add a dark section, give it `class="section on-dark"` and every
nested component adapts automatically.

Any colour used at partial opacity reads its channels from the four `*-rgb`
tokens sitting just below the hex list:

```css
--bg-rgb:     250 252 252;   /* ice white  */
--navy-rgb:   30 42 56;      /* deep navy  */
--accent-rgb: 122 139 153;   /* slate blue */
--inv-rgb:    250 252 252;   /* ice white  */
```

They exist because CSS can't take an alpha of a hex variable — every
`rgb(var(--accent-rgb) / .3)` in the file goes through these. **If you change a
hex above, change its `-rgb` twin to match**, or translucent rules will keep the
old colour while solid ones move.

Every text colour clears WCAG AA against the ground it actually sits on: body
text 14:1, muted text 6.5:1, links 4.7:1. If you lighten `--slate-dk`, recheck
it against `--bg-card` — that's the tightest pairing on the site and the one
that forced its value.

**Photography** — the source photos were shot under warm studio light, which
fights a cool palette badly. Each page carries a small inline
`<svg class="filter-defs">` right after the skip link defining `#duo-cool`, a
colour matrix that eases red back and lifts blue. CSS applies it through two
tokens:

```css
--duo:      url(#duo-cool) saturate(.54) contrast(1.06) brightness(1.05);
--duo-soft: url(#duo-cool) saturate(.68) contrast(1.05) brightness(1.04);
```

A white balance shift rather than a `hue-rotate()`, which turns faces olive, and
stopped short of the point where skin goes grey — that limit matters more here
than anywhere. Two consequences worth knowing:

- The SVG must live **in the same document** as the elements using it — that's
  why it's inlined in all six pages rather than kept in the stylesheet.
- A `filter` list containing `url()` cannot be interpolated, so **never put
  `--duo` on a `transition`** — it would snap instead of fading. The image hover
  animates the tint overlay's `opacity` instead, which is why the photos lighten
  rather than jumping to full colour.

**The logo.** The mark is warm camel (`#C09C84`) and reads as the one warm object
on a cool page. Slate-blue recolours are generated and ready to swap in —
`logo-mark-cool.png`, `logo-lockup-cool.png` and their WebP variants — but the
live pages still use the real artwork, because recolouring a brand mark is the
client's decision. To switch, point the `<picture>` sources in the header,
curtain and footer at the `-cool` files.

**Fonts** — Bodoni Moda (headings, a high-contrast didone) and Jost (everything
else, a geometric sans), loaded from Google Fonts. Change the `<link>` in each
page head and the `--display` / `--sans` variables.

One thing to know before you touch the type: `body` pins the optical size with

```css
font-optical-sizing: none;
font-variation-settings: "opsz" 10;
```

Bodoni Moda is optical-size aware, and left on `auto` its display master thins the
hairline strokes to near-invisible at headline sizes — the headings look spidery.
Pinning a text-weight optical size keeps the thin strokes solid at every scale.
Headings then sit at weight 700 and body text at 400. If you swap the display
face for one without an `opsz` axis, these two lines become harmless and can go.

**Header** — transparent at the top of the page, frosted glass past 50px. JS only
toggles `.is-stuck` on `.hdr`; both states are painted in CSS, so the whole
behaviour is one rule to change. There's an `@supports not (backdrop-filter)`
fallback to a near-opaque bar, because without it the nav text would sit over
unblurred content on browsers that lack the filter.

**Motion** — all of it is CSS transitions driven by class toggles, no library:

| Effect | Where |
|---|---|
| Fade + rise on scroll (`translateY(20px)` → `0`) | `[data-rv]`, fired by IntersectionObserver |
| Staggered grid entrances, 100ms apart | `data-stagger` on the parent; JS writes `--d` per child |
| Parallax | `data-parallax="<px>"` on a container with an `<img>` |
| Magnetic + `scale(1.03)` CTA | `data-magnetic` on the button |
| Card lift + shadow, image zoom to 1.05 | `.card` / `.card-media` |

Two things to know before editing motion:

- The magnetic pull and the hover scale are composed into **one** transform in
  JS, because the inline style it writes would override any CSS `:hover` rule.
- `.hero-media img` has no ken-burns keyframe. A keyframe and the parallax would
  both be writing `transform` and the animation would win, so the scale it needs
  is passed via `data-parallax-scale` and JS composes both into one value.

Everything is disabled under `prefers-reduced-motion: reduce`.

**Sections** — every page is a stack of `<section>` blocks with a comment banner
above each one. Copy a block, change the text, done.

---

## What's in the build

- Split editorial hero — type panel on bone, full-bleed image panel bleeding off
  the right edge, dropped clear of the header so the nav stays legible
- Line-by-line masked headline reveal; everything else rises out of a soft blur
- Horizontal curtain wipe between pages, carrying the logo lockup
- Custom cursor that swells over interactive elements (desktop, pointer-fine only)
- Staggered card grid — even columns drop 3.2rem for an asymmetric rhythm
- Camel-graded photography that lightens as the tint overlay lifts on hover
- Ghost numerals (outlined Bodoni) behind the numbered cards
- Hover-follow image preview on the homepage treatment index
- Filterable service grid, accordions, testimonial rotator, animated counters
- Live "open now / closed" indicator computed from the posted hours
- Full-screen mobile menu with staggered links

**Accessibility & performance:** semantic landmarks, skip link, visible focus rings,
`aria-expanded` on every toggle, alt text on every image, `prefers-reduced-motion`
disables all animation, images lazy-loaded below the fold, print stylesheet.
No JavaScript libraries — total JS is one ~9 KB file.

**SEO:** per-page titles and descriptions, canonical tags, Open Graph and Twitter
cards, `LocalBusiness`/`MedicalSpa` JSON-LD for both locations including opening
hours, plus `sitemap.xml` and `robots.txt`.
