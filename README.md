# Mruja — Photography

Static photography portfolio with a small print shop. No build step, no dependencies —
just `index.html`, `style.css`, `script.js` and an `images/` folder.

## See it locally

Open `index.html` in a browser (works straight from disk).

Or serve it over http, which is closer to the live site:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
# then open http://127.0.0.1:8788/
```

Optional: pass a different port with `-Port 9000`.

## Add your photos

1. Put the images in `images/` (or a subfolder per genre, e.g. `images/sunset/`).
   Aim for ~1600px wide and under 500 KB each.
2. Add one line per photo to the `photos` list in `script.js`:

```js
{ category: "Sunset", src: "images/sunset/sunset-8.jpeg", title: "Sunset 8", alt: "Sunset over the sea" },
```

| field      | what it does                                                      |
| ---------- | ----------------------------------------------------------------- |
| `category` | the genre. Matches a name in `GENRES`, or invents a new genre.     |
| `src`      | path to the image                                                 |
| `title`    | caption shown on the tile and in the viewer                       |
| `alt`      | description for screen readers and search engines                 |
| `prices`   | optional price override, e.g. `{ digital: 599, A4: 1599 }`        |

Everything else — filter chips, genre sections, the shop picker, deep links — builds
itself from that list. Add 10 photos per genre and the layout just grows.

## Add or rename a genre

Edit `GENRES` near the top of `script.js`. The order there sets the chip order and the
order of the sections. Add a short `blurb` line for each one:

```js
{ name: "Street", blurb: "People and places in between." },
```

If you use a genre on a photo without listing it here, it still appears — just at the end.

## What's on the page

- **Work** — genre filter chips, live search, collapsible genre sections, and a
  full-screen viewer with arrow keys, swipe, next/prev, a counter, captions, zoom
  (click ＋ or drag to pan) and a Share button.
- **Shop** — pick a photo (filterable), choose digital or a framed print, choose a
  print size (A4/A3/A2), then buy immediately or add it to your shortlist. The
  shortlist survives a page reload and sends one combined WhatsApp message.
- **Work with me** — a booking/enquiry form that opens WhatsApp with the details filled in.
- **Follow / Contact** — Instagram strip and contact links.
- **Theme** — soft pastel light theme, a dark theme that follows the system, and a
  ◐ button in the nav to force either one (remembered per visitor).

## Edit prices

In `script.js`:

```js
const PRICES = {
  digital: 499,
  sizes: { A4: 1499, A3: 2499, A2: 3999 },
};
```

Per-photo overrides go in that photo's `prices: { … }`.

## Edit the rest

- **Testimonials** — the `<section id="testimonials">` block in `index.html`.
- **About text, email, WhatsApp number, Instagram** — `index.html`: the About and
  Contact sections, plus the `wa.me/…` links. The number is also in `SITE` in `script.js`.
- **Colours** — the `:root` variables at the top of `style.css`.

Orders and bookings are handled over WhatsApp (no backend, no payment gateway). Update
the number in `SITE.whatsapp` in `script.js` and the two `wa.me` links in `index.html`
if it ever changes.

## Publish with GitHub Pages

```bash
git init
git add .
git commit -m "Photography site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from branch → main / (root)**.
Site goes live at `https://<your-username>.github.io/<repo-name>/`.
Name the repo `<your-username>.github.io` to get the root URL.
