# His & Her Med Spa + Academy — Website

A hand-built static website. No frameworks, no build step, no dependencies.
Open `index.html` in a browser and it runs.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, philosophy, signature treatments, process, academy teaser, testimonials, location |
| `services.html` | All 14 treatments, filterable by category, with FAQ |
| `academy.html` | 6 certification programs, what's included, enrolment form |
| `team.html` | Practitioner, values, careers |
| `contact.html` | Contact form, the Whitby studio with map, hours, FAQ |
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
    hero.jpg, service-break.jpg, academy-*.jpg, contact-side.jpg
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

1. **Team photo.** `team.html` uses an elegant monogram card (MR) because no
   photograph was available. To swap in a real portrait, add the image inside the
   portrait div and delete the monogram span:
   ```html
   <div class="person-portrait">
     <img src="assets/img/team/mariyam.jpg" alt="Mariyam Rasoli">
   </div>
   ```
2. **Team bio.** The bio is written from the roles and languages listed on the
   current site. Replace with the practitioner's own words.
3. **Review count.** The JSON-LD in `index.html` claims `"ratingCount": "120"` —
   set this to the real Google review count or remove the `aggregateRating` block.
   (The 4.8 rating itself came from the current site.)
4. **Testimonials.** Only one is a real, attributed Google review (Ben Hoang). The
   other two are marked "Verified Client" and are placeholders — replace them with
   real reviews or delete them.
5. **Missing services.** The Whitby storefront sign lists **Dysport**,
   **Skin Rejuvenation** and **Weight Management**, which don't appear on the
   current website's service menu, so they aren't on this one either. If you offer
   them, add cards to `services.html` following the existing pattern.
6. **Pricing.** The FAQ says pricing is quoted at consultation. If you want prices
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

The palette is the logo's own. The three artwork colours were sampled directly
out of `logo-mark.png` / `logo-lockup.png` rather than matched by eye, so the
mark and the page are literally the same values:

```css
--camel:     #C09C84;   /* logo — the "his" figure         */
--camel-lt:  #F0D8CC;   /* logo — the "her" figure         */
--ink:       #483024;   /* logo — the wordmark brown, text */
```

The rest of the system is built out from those:

```css
--porcelain: #FAF6F3;   /* page background    */
--linen:     #F1E8E2;   /* alternating bands  */
--shell:     #E4D8CC;   /* image placeholders */
--camel-dk:  #855E44;   /* links, small caps  */
--espresso:  #241811;   /* the two dark bands */
```

The site is light-first: porcelain and linen alternate, and espresso is used
deliberately for only two moments per page (the academy band and the closing
CTA). If you add a dark section, give it `class="section on-dark"` and every
nested component adapts automatically.

Any colour used at partial opacity reads its channels from the four `*-rgb`
tokens sitting just below the hex list:

```css
--bg-rgb:     250 246 243;   /* porcelain */
--ink-rgb:    72 48 36;      /* ink       */
--accent-rgb: 192 156 132;   /* camel     */
--inv-rgb:    246 239 233;   /* cream     */
```

They exist because CSS can't take an alpha of a hex variable — every
`rgb(var(--accent-rgb) / .3)` in the file goes through these. **If you change a
hex above, change its `-rgb` twin to match**, or translucent rules will keep the
old colour while solid ones move.

Every text colour clears WCAG AA against the ground it actually sits on (body
text 11:1, links 5.3:1). Note that `--camel` itself is far too light for text —
2.1:1 on linen — which is why `--camel-dk` exists and why links use it. If you
lighten it, recheck against `--linen`: that's the tightest pairing on the site
and the one that forced the value.

**Photography** — the source photos are warm, which suits this palette, but they
drift across a range of tints. Each page carries a small inline
`<svg class="filter-defs">` right after the skip link defining `#duo-warm`, a
colour matrix that holds red, eases green back a touch and trims blue. CSS
applies it through two tokens:

```css
--duo:      url(#duo-warm) saturate(.7) contrast(1.05) brightness(1.03);
--duo-soft: url(#duo-warm) saturate(.85) contrast(1.04) brightness(1.02);
```

Deliberately gentle — enough to settle the whole set onto the logo's camel, not
enough to push skin orange, which matters more here than anywhere. Two
consequences worth knowing:

- The SVG must live **in the same document** as the elements using it — that's
  why it's inlined in all six pages rather than kept in the stylesheet.
- A `filter` list containing `url()` cannot be interpolated, so **never put
  `--duo` on a `transition`** — it would snap instead of fading. The image hover
  animates the tint overlay's `opacity` instead, which is why the photos lighten
  rather than jumping to full colour.

Both logo lockups sit in the palette without adjustment, since the page took its
colours from them rather than the other way round.

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
cards, `LocalBusiness`/`MedicalSpa` JSON-LD for the Whitby studio including
opening hours, plus `sitemap.xml` and `robots.txt`.
