# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`ohm-index-front` is the Angular 21 web frontend for the OHM bibliography/index API (`ohmi`, see `/srv/ohm/CLAUDE.md`). It is the user-facing single-page app served at `index.openhistorymap.org` and consumes the JSON API at `https://api.index.openhistorymap.org`. Output is a static bundle built into `dist/index/browser/` and served by nginx in the production image.

This sub-project sits inside `/srv/ohm/ohmi_f/` next to (a future home for?) the `ohmi` API. Treat it as a standalone Angular app, not part of a larger monorepo.

## Commands

- `npm start` (or `ng serve`) — dev server on `http://localhost:4200`, talks directly to the production API at `https://api.index.openhistorymap.org`.
- `npm run build` — production build into `dist/index/browser/` via `@angular/build:application` (esbuild). Add `--configuration development` for an unminified build.
- `npm run watch` — incremental development build.
- `ng generate component foo` — schematics use SCSS and emit standalone components by default.

There is no `test`, `lint`, or `e2e` script — Karma stubs, TSLint, and Protractor were dropped during the v21 migration. If you need tests, pick a runner (`@web/test-runner`, Vitest, Jest) and wire it explicitly.

### Docker

`Dockerfile` is a two-stage build: `node:22-alpine` builds the bundle into `/app/dist/index/browser/`, then `nginx:alpine` serves it. Build with `docker build .` from this directory. The image listens on port 80 and falls back to `index.html` for unknown paths via `nginx.conf`'s `try_files` (SPA fallback).

### `docker-entrypoint.sh` and runtime env

`docker-entrypoint.sh` dumps the container's full environment to `./assets/env.json` at startup (using `apk add jq`, then removing it). The script's working directory is `/usr/share/nginx/html/`, so it lands in the served `assets/` folder. **Nothing in the current source actually reads `assets/env.json`** — `OhmIndexService` reads the build-time `environment.baseUrl` constant. If you add runtime-configurable settings, you'll need to fetch `assets/env.json` from the app yourself; the entrypoint is half a feature.

## Architecture

The app is fully **standalone** (no `NgModule`s anywhere). Bootstrapping flows:

`src/main.ts` → `bootstrapApplication(AppComponent, appConfig)` → `app.config.ts` (providers: router, http, async animations) → `app.routes.ts` (top-level routes).

### Routes

`src/app/app.routes.ts`:

- `''` → `IntroComponent`
- `methodology` → `MethodologyComponent`
- `index` → `IndexComponent` (tree-of-topics view)
- `add` → `AddComponent`
- `sources` → lazy `SOURCE_ROUTES` from `source/source.routes.ts`
- `datasets` → lazy `DATASET_ROUTES` from `dataset/dataset.routes.ts`

Lazy chunks are loaded with `loadChildren: () => import(...).then(m => m.SOURCE_ROUTES)` — the modern equivalent of the old `loadChildren` string syntax. Each feature has its own `add` / `detail` / `list` triplet.

`SOURCE_ROUTES` nests `dataset/DetailComponent` (aliased as `DDetailComponent`) under `sources/:id/:id` to render a dataset within a source. The cross-feature import is intentional — both components are standalone, so importing one from the other's routing file is fine.

### Single API service

`OhmIndexService` in `src/app/ohm-index.service.ts` is the only place the API URL is referenced. It exposes `getIndex`, `getIndices`, `getDatasets`, `getSources`, `getDimensions`, plus an `iconFor()` helper that maps OHM topic / source-type strings to Font Awesome icon names. The icon table is the canonical mapping for what topics and source types the UI knows how to render — keep it in sync with the API's taxonomy if you add new types.

`getIndices()` caches its result on the service instance for the lifetime of the page.

A second `OhmIndexTimeTagService` is declared in the same file but is empty / a placeholder.

### Tree view (`IndexComponent`)

`src/app/index/index.component.ts` implements the topic tree using Angular Material's `MatTreeFlattener` + `FlatTreeControl` + a custom `TopicTreeDatabase` (lifted from the Material docs example, renamed from the original `ChecklistDatabase` / `TodoItemNode` boilerplate). It feeds on `indices.trees` returned by the API and joins with `getIndex()` results filtered by `interval` + `topic`. Multi-select drives `applySpaceFilter()`, which re-queries `/index?ohm:area__in=<ids joined by |>`.

`FlatTreeControl` is deprecated in current Material — works fine, but if you rewrite this view, prefer the new `childrenAccessor` API.

### Templates use the new control flow

Templates use `@if` / `@for` / `@switch` (Angular 17+) rather than `*ngIf` / `*ngFor`. Keep new code in the same style.

### Shared `TreelabelPipe`

A single standalone `TreelabelPipe` lives at `src/app/shared/treelabel.pipe.ts`. It is imported directly by the components that use it (`IndexComponent`, both `ListComponent`s, source `DetailComponent`). There is no `SharedModule` — standalone pipes are imported per-component.

The pipe strips a `geonames:` prefix from the value and looks it up in the dictionary passed as the first arg (always `indices.areas` in current callers). On any miss, it returns the raw string.

### Configuration data

`src/assets/conf.json` declares the app's known dimensions (`timetags`, `culturetags`, `sourcetypes`, `datasettypes`) and elements (`sources`, `datasets`). `OhmIndexService.getConf()` fetches this — it's how the app discovers what filter axes exist without baking them into TypeScript. The other JSON files in `assets/` (`datasets.json`, `dimensions.json`, `structure.json`) are similarly static seed data.

### External assets loaded from CDN

`src/index.html` pulls Font Awesome 5.15.3, Roboto, and Material Icons from CDNs at runtime — they are not in `node_modules`. Offline development needs internet access for icons to render.

### Matomo analytics

`src/index.html` embeds a Matomo tracker pointing at `tracker.openhistorymap.org` (site id `3`). Don't strip it during edits to `index.html`.

### Material theming

`src/styles.scss` defines the M3 theme via `@include mat.theme(...)` with Indigo primary / Pink tertiary. The pre-v15 `prebuilt-themes/indigo-pink.css` no longer exists — if you need to retheme, edit the `mat.theme` call directly.

## Conventions and pitfalls

- **Two `environment.ts` files, one URL**: both `environment.ts` and `environment.prod.ts` hardcode `https://api.index.openhistorymap.org`. There is no separate dev/staging endpoint, so `ng serve` hits production. Be careful when wiring write endpoints.
- **No `localhost` dev API**: a developer wanting to point at a local `ohmi` will need to edit `environment.ts`.
- **Empty `README.md`**: don't expect upstream docs.
- **Stub `addDataset`** was removed during migration; the `add*` components are static "send us a mail" pages. Submission flows are not implemented.
- **Component prefix `app`** (see `angular.json`) — selectors are `app-*`. Two non-conforming legacy selectors (`ohm-areadisplay`, `ohm-areadetail`) are preserved.
- **Bundle budgets**: production build warns at 2MB initial / errors at 5MB; per-component-style warn at 6KB / error at 20KB.
- **Strict mode is off** in `tsconfig.json` (`strict: false`, `strictTemplates: false`). The legacy code uses a lot of implicit `any`; turning strict on would cascade. If you write new code, prefer typed signatures even though the compiler won't enforce them.
- **No tests**: assume nothing is covered. The `*.spec.ts` stubs were dropped because they only verified `expect(component).toBeTruthy()`.

## Design Context

The full design brief lives in `.impeccable.md` at the project root. Summary for day-to-day work:

### Users

Three audiences, all served at once: academic historians & researchers (citation-grade, reading-heavy), GIS / data professionals (schema-aware, dataset-focused), and the generally curious public (browse, not query). The shared job is **finding** — making discovery feel literate rather than transactional.

### Brand Personality

**Scholarly, civic, humanist.** Careful with names and dates; open-data manners (data is the subject, not the chrome); written by people for people, plain prose over jargon. Emotional goal: walking into a well-run public archive — quiet, generous, honest about what it knows.

### Aesthetic Direction

Anchor: **Pudding / NYT graphics** — editorial data journalism. Type does the hierarchy, generous whitespace, narrative flow over dashboard density. **Light and dark are both first-class** — respect `prefers-color-scheme` and expose a manual toggle; design dark as a sibling of light, not as light inverted.

Anti-references: not a dashboard, not a Material default, not a marketing site, not "AI tech" (no cyan-on-black, no purple→blue gradients, no neon).

### Design Principles

1. **Type is the chrome.** Hierarchy from a modular scale and weight contrast, not cards or shadows. No reflex fonts (Inter, Fraunces, Newsreader, IBM Plex, DM *, Instrument, Space *, Outfit, Plus Jakarta, Crimson, Cormorant, Playfair, Syne).
2. **Editorial pace.** Vary spacing; long-form max measure ~70ch; left-aligned and rhythmical, not centered.
3. **Provenance is part of the design.** Sources, dates, and methodology are always one click away — never hidden.
4. **Both themes designed honestly.** Light = warm paper. Dark = ink surface, not pure black, with raised line-height and reduced accent chroma. Tint neutrals toward the brand hue in both modes.
5. **Behavior over decoration.** Motion serves state changes, not ambient sparkle. Respect `prefers-reduced-motion`.
6. **Plain English, every label.** Replace Material's leftover `aria-label="Example icon-button …"` boilerplate.

### Implementation notes

- Material v21 is the behavior library only. Theme via `@include mat.theme(...)`; v21 does not ship `$indigo-palette` / `$pink-palette` — current theme uses `$violet-palette` / `$rose-palette` as substitutes pending a custom palette tuned to the brand hue.
- Don't claim a UI change works without running the dev server (or the Docker image) in a browser; there are no tests to back the claim.
