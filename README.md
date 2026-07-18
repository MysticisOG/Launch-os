# Launch-os

A simple web-based desktop experience that shows a digital clock and a list of featured launches around the world.

## Files

- index.html — the main page structure
- styles.css — the visual styling and layout
- app.js — clock logic and launch list rendering
- .github/workflows/deploy.yml — GitHub Pages deployment workflow
- .nojekyll — prevents GitHub Pages from processing the site with Jekyll

## Run locally

From the project folder, start a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

## Deploy to GitHub Pages

1. Make sure all files are committed and pushed to GitHub.
2. In GitHub, open your repository and go to Settings → Pages.
3. Under Source, select GitHub Actions.
4. Push to the main branch and wait for the workflow to finish.
5. Your site will be available at:

```text
https://<your-username>.github.io/<repo-name>/
```

Example:

```text
https://mysticisog.github.io/Launch-os/
```

## Commit and push

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```