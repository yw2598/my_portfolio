# my_portfolio

Yichen Wang’s portfolio: GameBuddy, Wall-E Companion Robot, and HashLand.

A static HTML, CSS, JavaScript, and SVG site with Python generators. It includes the full project pages, images, system animation, and pointer and keyboard interactions.

## Build

Requires Python 3; no third-party Python packages are needed.

```sh
python3 make-system-graphic.py
python3 generate.py
python3 scripts/build_pages.py --base-path /my_portfolio
python3 scripts/check_pages.py --base-path /my_portfolio
```

`dist/` is the root-hosted site. `_site/` is the GitHub Pages export with repository-prefixed links, images, CSS URLs, and dynamic JavaScript paths.

For a custom domain served at its root, build with `--base-path ""`.

## Publish

In this repository’s **Settings → Pages**, select **GitHub Actions** as the build source. A push to `main` runs the checked-in workflow and deploys the site.

Expected address after the first successful deployment:
https://yw2598.github.io/my_portfolio/

The repository includes the original editable HTML fragments, `generate.py`, `interaction_components.py`, the SVG generator, and all exported static assets.
