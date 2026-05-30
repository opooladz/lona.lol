# lona.lol

Static marketing site for DAT Masters — live, small-group DAT prep coaching with Lona Tehrani.

## Stack

Plain HTML, CSS, and vanilla JS. No build step, no dependencies.

## Local preview

```bash
cd docs
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Auto-deploys to GitHub Pages on push to `main` from the `/docs` folder.

Live URL: https://opooladz.github.io/lona.lol/

## Structure

```
docs/
├── index.html
├── css/
│   ├── styles.css
│   └── tokens.css
├── js/
│   └── main.js
└── images/
    ├── logo.svg
    ├── logo-dark.svg
    ├── mark.svg
    ├── favicon.svg
    ├── og-image.svg
    ├── portrait-placeholder.svg
    └── portrait-about-placeholder.svg
```
