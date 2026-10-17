# Farman Shah — Portfolio Website

A full-stack portfolio website: **HTML/CSS/JavaScript frontend** + **Node.js/Express backend**.

🌐 **Live site:** https://greenpanda138.github.io/farman-shah-portfolio/

## What's inside

| Page | Purpose |
|---|---|
| `index.html` | Hero with typed animation, stats, services preview, featured work, process, testimonials |
| `services.html` | 8 detailed services: Shopify stores, Meta ads, custom code, e-commerce, portfolios, landing pages, branding, SEO |
| `work.html` | 6 case studies with category filters |
| `about.html` | Bio, animated skill bars, timeline, toolbox |
| `contact.html` | Contact form, direct email/Instagram cards, FAQ |

- `assets/css/style.css` — full design system (deep navy + amber)
- `assets/js/main.js` — mobile nav, scroll reveals, counters, typed effect, filters, testimonial slider, FAQ, smart contact form
- `backend/server.js` — Express server: serves the site + `POST /api/contact` (validated, stored in `backend/data/messages.json`)
- Contact form **gracefully falls back to the visitor's email app** when hosted statically (e.g. GitHub Pages)

## Run locally (frontend only)

Just open `index.html` in a browser — no build step needed.

## Run with backend

```bash
cd backend
npm install
npm start
# → http://localhost:3000
```

## Deploy

- **Frontend:** this repo is published with GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/ (root)`).
- **Backend:** deploy the `backend/` folder to Render, Railway, or any Node host. Set the frontend form's `fetch("/api/contact")` to your API URL if hosted separately.

## Contact

- ✉️ farman.shah.3211@gmail.com
- 📸 Instagram: [@_farmanshah_](https://instagram.com/_farmanshah_)
