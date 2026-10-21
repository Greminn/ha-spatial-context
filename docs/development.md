# Working on Spatial Context: how to run it, test it and release it

*The README says what Spatial Context is and how to use it; the [docs site](https://greminn.github.io/ha-spatial-context/) (source in `site/`) is the full guide. This file is the "how do I carry on" page.*

## 1. Where things are

| Path | What it is |
|---|---|
| `custom_components/spatial_context/` | The integration (domain `spatial_context`): `storage.py` (layouts), `websocket_api.py` (what the panel calls), `services.py` (`get_map`, `refresh_zigbee_mesh`), `export.py` (the map export), `zigbee_mesh.py` / `zha_mesh.py` / `wifi_mesh.py` / `bluetooth_mesh.py` (Connectivity Map sources), `frontend.py` (registers the panel), `www/spatial-context-panel.js` (the built panel, committed) |
| `frontend/` | The Lit + TypeScript panel (`src/`), rollup build, `scripts/dev/push.mjs` (rsync to a dev Home Assistant) |
| `tests/` | The Python tests, plus `run_all.sh` (the panel's own tests sit beside its source as `frontend/src/**/*.test.ts`) |
| `site/` | The documentation site (VitePress), published to GitHub Pages |
| `brand/` | The brand pack (SVG masters, favicons, avatars, social previews); the integration's own images are in `custom_components/spatial_context/brand/` |
| `docs/` | This file and the README screenshots |
| `.github/` | `workflows/validate.yml` (CI), `workflows/docs.yml` (publishes `site/`), issue templates |

## 2. Run it

```sh
cd frontend && npm install     # once
npm run check                  # typecheck, lint, format check, tests and build
npm test                       # just the panel tests (vitest)
npm run dev                    # build on save and rsync to your Home Assistant (needs frontend/.env)
./tests/run_all.sh             # the Python tests; prints fail=0 or the failures (pip install voluptuous first, or the save-limit tests are skipped)
```

- The build writes `www/spatial-context-panel.js`, `spatial-context-panel.build.json`, `mdi-index.json` and `map/`. They go together and are all committed.
- The tests stub Home Assistant, so no install and no private data. CI runs the same checks plus hassfest and HACS validation.
- `npm run push` needs `frontend/.env` (copy `.env.example`). A browser hard refresh picks up a new panel; changes to the Python files need a Home Assistant restart.

## 3. The docs site

```sh
cd site && npm install
npm run dev        # live preview
npm run build      # what CI runs
```

Pushing to `main` with changes under `site/` publishes to <https://greminn.github.io/ha-spatial-context/>. Pages are plain Markdown; add one to `site/.vitepress/config.mts` to put it in the sidebar. Screenshots live in `site/public/screenshots/`.

## 4. Releasing

A release that only fixes things bumps the PATCH number (1.0.0 to 1.0.1). A release that adds something bumps the MINOR number (1.0.0 to 1.1.0). A change that breaks existing layouts or the `get_map` data bumps the MAJOR number. Versions are compared part by part as numbers, so 1.10.0 is newer than 1.9.0.

The version lives in four places, and CI checks they agree:

- `custom_components/spatial_context/manifest.json`
- `frontend/package.json` and `frontend/package-lock.json`
- `custom_components/spatial_context/www/spatial-context-panel.build.json` (written by the build, so rebuild after bumping)

Then add a section to `CHANGELOG.md`, commit `vX.Y.Z`, fast-forward `main` to `dev`, and create a release with "Added" / "Changed" / "Fixed" notes. HACS only offers GitHub releases, so tag the release. Before every push, sweep the diff, the built bundle and the notes for secrets, LAN addresses or hostnames, IEEE addresses and personal device names.

## 5. Gotchas

- GitHub caches README images by filename. If a replaced screenshot looks old, rename it (the current ones carry a `-v2` suffix).
- The build id changes on every build, so a rebuilt bundle always differs from the committed one. That is expected.
- The panel must keep working with no build step on the user's side, which is why the built files are committed.
