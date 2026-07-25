# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A mobile-first, offline, installable **PWA** that acts as a personal companion for a 21-day
Kerala family trip (27 Jul – 17 Aug 2026, 13 travellers). It is a **zero-build** app:
plain HTML + hand-written CSS + vanilla JS loaded as **classic scripts** (no ES modules, no
bundler, no backend, no login). This deliberate choice is documented in `BUILD_REPORT.md §0`
— the machine has no Node toolchain and the folder lives in Google Drive sync, so a `node_modules`
build would be slow/fragile. Do **not** introduce a build step, framework, or npm dependency
without explicit instruction.

## Running & testing

There is no build, lint, or test suite. To preview:

```bash
# Double-clicking index.html works too (file://), but the service worker and
# "install to phone" only activate when SERVED over http/localhost.
python -m http.server 8000        # → http://localhost:8000
```

Verify changes by loading the page and exercising the affected tab. Because scripts are
classic (not modules), load order in `index.html` matters: `seed.js` → `engine.js` →
`state.js` → `docstore.js` → `app.js`. Each attaches a single global (`window.SEED`,
`window.Engine`, `window.Store`, `window.DocStore`, and the app IIFE).

**After changing any shell file** (`index.html`, `styles.css`, `seed.js`, `engine.js`,
`state.js`, `docstore.js`, `app.js`, manifest, icons), bump `CACHE` in `sw.js` (e.g. `kerala2026-v7` → `v8`)
and add/remove the file in the `SHELL` array — otherwise installed PWAs keep serving the old
cached version. This is the single most common footgun in this repo (see commit history).

## Architecture

Four globals, loaded in order, no framework:

- **`seed.js`** (`window.SEED`, `window.SEED_VERSION`) — the single source of all baked-in
  data as one large object literal: `meta`, `passengers`, `flights`, `trains`, `anchors`,
  `checklist`, `social`, `visits`, `gifts`, `budget`, `finAdmin`, `nriAccounts`, `docPackets`,
  `alerts`, `contacts`, `documents`, `emails`, `selfDrive`. **This file is SCRUBBED** — it holds
  only placeholders (no real names, PNRs, PAN, phone numbers, or document links). Real data
  lives only in `my-trip-data.private.json` (git-ignored), imported at runtime.
- **`engine.js`** (`window.Engine`) — pure, DOM-free helpers: local-date parsing (avoids UTC
  off-by-one), weekday math, plus the two rule engines: `recommendTransport()` (drinks → Taxi
  locked, airport → MPV, out-of-town circuit → driver, else on-demand taxi / self-drive only on
  active rental days), `eventWarnings()` / `computeFlags()` (anchor clashes, the school-friends
  "leave TVM by 31 Jul" deadline, football-is-Sunday, weekday-only office meetups, open FCDO
  insurance check).
- **`docstore.js`** (`window.DocStore`) — an IndexedDB wrapper (`kerala2026-docs` DB) that
  holds **offline copies of PDFs/images** keyed by a `documents[].id`. Deliberately separate
  from `state.js`: files are large (a passport scan ~7 MB, past the ~5 MB localStorage cap) and
  must **never** ride along in the exported JSON backup or the public repo — they stay on the
  device only. A synchronous `DocStore.keys` Set mirrors which ids are stored so `render()` can
  paint "offline ✓" badges without awaiting IndexedDB; it's populated by `DocStore.ready()` at
  boot (which then triggers one re-render). The Docs tab's **Airport offline pack** card uses
  this so boarding passes / Air Suvidha / passports open with no signal at the airport.
- **`state.js`** (`window.Store`) — localStorage persistence under key `kerala2026.v1`,
  currency helpers (₹/£ with editable rate), and export/import. The **merge model is the core
  concept**: saved/imported data is always the base of truth; `forwardMerge()` only *adds*
  new seed-only items (by `id`) on top and never clobbers saved data. Items in the `EDITABLE`
  list are backup-owned collections. To retire an obsolete seed item from every device's
  storage, add its id to the `RETIRED` map — plain additive merge would otherwise let it linger
  forever. `Store.commit()` = save + notify subscribers.
- **`app.js`** — the entire UI in one IIFE. Plain DOM, no virtual DOM: `render()` replaces
  `#app`'s innerHTML with the active tab's HTML string and re-runs on every `Store.commit()`.
  Tabs are the `TABS` array (home/plan/tasks/social/visits/budget/docs), each a `render*()`
  function returning an HTML string. Editing is centralized through `openForm(title, fields,
  values, onSave, onDelete)` which builds a modal from a field spec. Events use a single
  delegated click handler that dispatches on `data-*` attributes.

`index.html` is just the shell (header, `<main id="app">`, tab bar) + the four script tags.
`sw.js` caches the shell (cache-first, revalidate online). `styles.css` is the maroon/gold
mobile-first theme.

## Conventions & gotchas

- **Privacy is load-bearing.** Never put real personal data (names, PNRs, PAN, phone numbers,
  ages, document URLs) into `seed.js` or any committed file — it belongs only in the git-ignored
  `my-trip-data.private.json`. The `.private.json` and `*.pdf` patterns in `.gitignore` are the
  safety gate; confirm `git status` is clean of them before committing.
- Dates are ISO `YYYY-MM-DD` strings throughout; always parse via `Engine.parse()` (local time),
  never `new Date(iso)` (UTC).
- New user-editable items get ids via `uid(prefix)` in `app.js`; seed items have stable
  hand-written ids that the merge logic depends on — don't rename them. Passenger ids are the
  neutral `p_t1`..`p_t4` (UK travellers) and `p_r1`..`p_r9` (relatives) — deliberately name-free
  so nothing personal lives in the public code. (They were once first-name slugs; the private
  import file was converted to the new ids in step with the rename, so there is no migration
  shim in the code.)
- Business rules (transport locking, scheduling warnings, derived flags) live in `engine.js`,
  not scattered in the UI. Add new rules there.
- `BUILD_REPORT.md` documents data provenance and known ticket/document mismatches;
  `TRIP_CONTEXT.md` holds the fuller trip brief.
