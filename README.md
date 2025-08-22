# wakefulblock262.github.io

Modern developer portfolio for Evrett with animations, dark/light theme, GitHub repos feed, and TypeScript setup.

## Features

- Animated sections with IntersectionObserver reveals
- Particle canvas background responsive to theme
- Dark/Light theme toggle with persistence
- Projects grid auto-fetched from GitHub (`/users/<username>/repos`)
- Accessible, responsive layout and semantic HTML
- TypeScript source mirroring runtime JS

## Project Structure

```
.
├── assets/
│   ├── css/
│   │   └── style.css          # Styles, themes, animations
│   └── js/
│       └── main.js            # Runtime JS (prefilled)
├── src/
│   └── main.ts                # TypeScript source mirroring main.js
├── index.html                 # Site markup
├── tsconfig.json              # TS compiler config (outputs to assets/js)
└── package.json               # Optional scripts for building TS
```

## Run locally (no install required)

Any static file server works. Examples:

- Python
  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```
- VS Code Live Server extension

## TypeScript

Runtime uses `assets/js/main.js` which is already present. If you want to modify TypeScript instead:

1. Install TypeScript (one-time):
   ```bash
   npm i -D typescript
   ```
2. Build once:
   ```bash
   npm run build
   ```
3. Or watch for changes:
   ```bash
   npm run watch
   ```

This compiles `src/main.ts` to `assets/js/main.js` per `tsconfig.json`.

## Configuration

- Update GitHub username in `assets/js/main.js` and `src/main.ts` (variable `username`) to change the repos feed.
- Update email/social links in `index.html` hero and contact sections.

## Deploy to GitHub Pages

This repo is already structured for Pages (static site at root). Push to `main` and enable GitHub Pages:

1. Settings → Pages → Build and deployment
2. Source: Deploy from a branch → Branch: `main` (root)
3. Save — your site will be available at `https://<username>.github.io/`

No build step is required unless you’re editing TypeScript, in which case commit the compiled `assets/js/main.js`.

## License

MIT