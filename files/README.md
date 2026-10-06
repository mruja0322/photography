# Mruja — Photography

Static portfolio site. No build step.

## Add your photos
1. Copy images into the `images/` folder (JPG, ~1600px wide, under 500 KB each).
2. Add them to the `photos` list in `script.js`.

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
