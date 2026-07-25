# Kerala 2026 — Trip Companion 🛕✈️

A mobile-first, **offline**, installable personal companion for the 21-day Kerala
family trip (**27 Jul – 17 Aug 2026**, 13 travellers). All facts
are extracted from the tickets/vouchers in the parent folder and baked in; everything
you add or edit is saved on your phone.

> **No build step. No backend. No login.** It's plain HTML/CSS/JS — open it and it works.

## What's inside (7 tabs)
- **🏠 Home** — countdown, live flags (FCDO/insurance, school-friends, leave-Kollur), today's fixed items, all reminders.
- **🗓️ Plan** — day-by-day 27 Jul→17 Aug. Fixed anchors (flights/trains/Homa/hotel) are **🔒 locked** and visually distinct; tap **+ Add** on any day to drop in your own plans.
- **✓ Tasks** — four grouped sections: **🔎 Verification** (insurance/Worldwide cover, post-advisory FCDO check, Gulf-airspace check before the return, Homa entry & ages, hotel occupancy, kids' passport re-issue), **🧳 Pre-trip packing**, **🩺 Health & monsoon precautions** (safe water/food, dengue/mosquito, pre-travel vaccinations), and **🛂 Kids' passport re-issue** — a 5-step mini-list (apply → PSK appointment → attend → Speed Post → update UKVI eVisa). Below the tasks, **📋 Document checklists & processes** hold per-task document packs you can tick off, add to and edit — seeded with **Mum's UK visitor visa** (apply from India; eVisa, no passport surrender), the **kids' passport document pack**, and **kids' check-up & vaccinations**.
- **🥂 Social** — Trivandrum catch-ups with **scheduling intelligence** (weekday/Sunday/anchor-clash warnings) and a **transport rule engine** (drinks → Taxi only; self-drive locked).
- **🛕 Visits** — temple/relatives + a **gifts** planner; the Kottarakkara + Mathoor circuit recommends **full-day car + driver**. Includes the self-drive opt-in card.
- **💷 Budget** — planned vs actual, **dual currency ₹/£** with an editable rate, per-line bars and roll-up totals, plus financial-admin tasks.
- **📄 Docs** — booking ref, all 6 PNRs, seats, Homa/hotel/insurance numbers, tappable contacts, **links to every source document**, ready-to-send **draft emails**, and **Export / Import / Reset**.

### Document links & offline copies
The Docs tab lists every source PDF (tickets, ERS, hotel, Homa, insurance). Each row has two
independent ways to reach the file:

- **📎 Add offline copy** — pick the PDF once and it's saved *on this device* (in IndexedDB,
  never uploaded, never in the backup or repo). It then **opens with no internet** — the point
  of the **🛂 Airport offline pack** card at the top of Docs, which gathers the airport-critical
  documents (boarding passes, Air Suvidha self-declarations, passports + UK visas, e-tickets,
  insurance) so you can show them at the gate / immigration even with no airport signal.
- **link** — paste that file's Google Drive *Share → Copy link* URL to also open it online from
  any device. Optional, and needs internet.

Offline copies live only in the browser that saved them, so add them on the phone you'll carry,
and keep the same PDFs marked *Available offline* in the Google Drive/Files app as a backup.

### Draft emails
The Docs tab also holds ready drafts for the open verification items — **insurance
Worldwide-cover / DXB transit check**, **Homa group entry & ages**, **hotel 13-guest
occupancy**, plus an **Annexure-D parental-consent** sheet for the kids' passport
re-issue (not an email — **Copy**, paste, print, both parents sign). Each has **Copy**
and **Open in mail** buttons, and all are editable. The first three have also been
created as **Gmail drafts** (addressed to you for review — set the real recipient before
sending; the intended recipient is noted at the top of each).

### Travel-conditions & passport updates (Jun 2026)
- **FCDO / UAE:** the all-but-essential warning was **lifted 18 Jun 2026** (reversible),
  so the insurance items now ask the insurer for **Worldwide cover** and the position if
  the advisory is **reinstated mid-trip**, rather than airside-transit cover.
- **Gulf airspace:** an alert tracks the US–Iran ceasefire window (~16 Aug) against the
  **17 Aug Dubai-transit return** — re-check the advisory and Emirates ops before flying.
- **Monsoon:** a warning covers flood/landslide risk on the **2–5 Aug Kollur leg**
  (build extra road-time buffer); plus the **Health** tasks above.
- **Kids' passports:** both children's Indian passports expire **27 Jul 2027** — eligible
  to re-issue from ~27 Jul 2026 and far cheaper in India. The **Passport** task list and
  Annexure-D draft walk through doing it at **PSK Trivandrum on Tatkal**, with the
  must-not-miss step of **re-linking the new passport numbers to the UKVI eVisa**.

## Run it on a computer (to preview)
Just double-click **`index.html`** — it opens in your browser and is fully usable
(saves to that browser's storage). *Note: the offline service worker and "install to
phone" only activate when the page is **served**, not from `file://`.*

To serve it locally (any one of these), then open the printed URL:
```
# Python (usually present on Windows/macOS):
python -m http.server 8000        # → http://localhost:8000

# OR VS Code: right-click index.html → "Open with Live Server"
```

## Install it on your phone (recommended)
The app must be reached over **https** (or `localhost`) for "Add to Home Screen".
Easiest options:
1. **Host the `KeralaTripApp` folder** on any static host you already use
   (e.g. Netlify drop, GitHub Pages, Cloudflare Pages, Firebase Hosting) — drag the
   folder in, open the URL on your phone.
2. **Same-Wi-Fi serve**: on your computer run `python -m http.server 8000`, find your
   computer's LAN IP, and open `http://<that-ip>:8000` on the phone (works for use,
   though some browsers want https for full install).

Then in the phone browser:
- **Android / Chrome**: ⋮ menu → **Add to Home screen / Install app**.
- **iPhone / Safari**: Share → **Add to Home Screen**.

It launches full-screen, works with no signal, and keeps your edits between sessions.

## Publishing it safely (public hosting + private data)

**The privacy model:** the files in this folder are *scrubbed* — `seed.js` carries only
placeholders (no names, ages, PAN, PNRs, ticket/policy/reservation numbers, phones, or
document links). Your **real data lives only in `my-trip-data.private.json`**, which is
**git-ignored** and which you **Import** on your own devices. So the public website never
holds anything sensitive; your data sits in your phone's local storage.

> ⚠️ **Your existing repo already had real data pushed to it.** Git history is permanent —
> making *that* repo public would expose the history even after deleting files. **Use a
> fresh repo** for the public site, and delete (or keep permanently private) the old one.

**Publish only this app folder to a NEW public repo** (run from inside `KeralaTripApp`):

```bash
cd "KeralaTripApp"
git init
git add .                      # .gitignore keeps the private JSON + PDFs out
git status                     # CONFIRM: my-trip-data.private.json is NOT listed
git commit -m "Kerala 2026 trip companion (scrubbed)"
git branch -M main
git remote add origin https://github.com/<you>/<new-repo>.git
git push -u origin main
```

Before pushing, the `git status` check is the safety gate — if `my-trip-data.private.json`
or any `*.pdf` shows up as staged, **stop** and fix `.gitignore` first.

**Turn on GitHub Pages:** repo **Settings → Pages → Source: Deploy from a branch →
`main` / root → Save**. After a minute your site is at
`https://<you>.github.io/<new-repo>/`.

**On your phone (one time):**
1. Open that Pages URL; tap **Install / Add to Home Screen**.
2. Put `my-trip-data.private.json` somewhere on the phone (e.g. Google Drive or Files) —
   **do not** add it to the repo.
3. In the app: **Docs → Data → ⬆ Import backup**, pick that file. Your real trip data now
   lives on the phone only. Repeat on any other device you want it on.
4. Optionally, in **Docs → Source documents**, paste each PDF's Google Drive
   *Share → Copy link* URL. Keep those links in your imported data, not in the repo —
   a “anyone with the link” URL is itself a key to the file.

**Want a private site instead of public?** A free GitHub Pages site is public even from a
private repo. If you'd rather gate access, host the same folder on **Cloudflare Pages** and
put **Cloudflare Access** (free Zero-Trust email login) in front of it — then you could even
keep real data in the app. Ask and I'll write those steps.

## Back up your data
Edits live in this device's local storage only. In **Docs → Data**:
- **⬇ Export backup** writes a dated `.json` file.
- **⬆ Import backup** restores it (merges over the baked-in facts).
- **↺ Reset** returns everything to the original ticket facts.

Back up after a big editing session, and before reinstalling/clearing the browser.

## Editing notes
- Tap any card to edit it; **+ Add** buttons create new items.
- **Drinks events** are forced to **Taxi** and self-drive is locked out — by design.
- The **exchange rate (₹112/£)** is a **placeholder** — set your own in Budget.
- The **Cega 24h assistance number** is blank — add it from your insurance certificate (Docs → contacts).

## Files
```
index.html              app shell + tab bar
styles.css              calm maroon/gold theme, mobile-first
seed.js                 all data extracted from the PDFs (the single source)
engine.js               dates/weekdays, anchor-conflict + transport rule engine
state.js                localStorage persistence, seed-merge, export/import, currency
app.js                  UI rendering + editing for all 7 modules
manifest.webmanifest    PWA manifest (installable)
sw.js                   service worker (offline cache of the app shell)
icon.svg / icon-maskable.svg   app icons
BUILD_REPORT.md         what was extracted, mismatches, open tasks, placeholders
```

See **BUILD_REPORT.md** for the data provenance, the mismatches found, and why this is
a zero-build PWA rather than a Vite project.
