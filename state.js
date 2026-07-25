/* ============================================================================
 * Store — localStorage persistence, seed merge, export/import, currency.
 * window.Store holds the live `data` object and a render() callback.
 *
 * Data model note: `seed.js` is the SCRUBBED public baseline (placeholders).
 * Once you Import your private backup (or make edits), that saved data becomes
 * the source of truth and is preserved across reloads — the scrubbed seed never
 * overwrites it. New seed-only items (e.g. a future task) are still merged in.
 * ==========================================================================*/
(function () {
  const KEY = "kerala2026.v1";
  const subscribers = [];
  // collections the user edits / that a backup fully owns
  const EDITABLE = ["checklist", "social", "visits", "gifts", "budget", "finAdmin", "alerts", "contacts", "documents", "emails", "nriAccounts", "docPackets"];

  // Retired seed items to actively REMOVE from saved/imported data. forwardMerge
  // only adds by default, so obsolete items (e.g. a draft email whose task is
  // done) would otherwise linger in a device's localStorage forever. Listed by
  // collection → ids. em_cover: insurance DXB-transit cover confirmed 29 Jun 2026.
  const RETIRED = { emails: ["em_cover"] };

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  // Take a saved/imported dataset as the base and layer on any *new* seed items
  // without ever clobbering the saved (real) data. Used on reload and on import.
  function forwardMerge(saved) {
    const data = clone(saved);
    // forward-compat: add any brand-new top-level keys the backup predates
    Object.keys(window.SEED).forEach((k) => { if (!(k in data)) data[k] = clone(window.SEED[k]); });
    // for editable collections, append seed items whose id isn't already present
    EDITABLE.forEach((k) => {
      if (!Array.isArray(data[k])) data[k] = [];
      const have = new Set(data[k].map((it) => it && it.id));
      (window.SEED[k] || []).forEach((it) => { if (!have.has(it.id)) data[k].push(clone(it)); });
    });
    if (!data.meta) data.meta = clone(window.SEED.meta);
    if (!data.selfDrive) data.selfDrive = clone(window.SEED.selfDrive);
    // drop retired items so obsolete entries can't linger in a device's storage
    Object.keys(RETIRED).forEach((k) => {
      if (Array.isArray(data[k])) data[k] = data[k].filter((it) => !(it && RETIRED[k].includes(it.id)));
    });
    return data;
  }

  function load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { saved = null; }
    return saved ? forwardMerge(saved) : clone(window.SEED);
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(Store.data)); }
    catch (e) { console.warn("Save failed", e); }
  }

  function commit() { save(); subscribers.forEach((fn) => fn()); }

  function reset() {
    if (!confirm("Reset ALL data back to the built-in baseline? Your edits and any imported trip data on this device will be lost.")) return;
    localStorage.removeItem(KEY);
    Store.data = load();
    commit();
  }

  function exportJSON() {
    // record the backup date so the Home screen can nudge when it's stale
    Store.data.meta.lastBackup = Engine.todayIso();
    commit();
    const blob = new Blob([JSON.stringify(Store.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kerala2026-backup-${Engine.todayIso()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  // A backup is a COMPLETE export, so it becomes the base (real flights/trains/
  // PII included); we only forward-merge any newer seed-only items on top.
  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(reader.result);
        Store.data = forwardMerge(incoming);
        commit();
        alert("Backup imported — your trip data is now on this device.");
      } catch (e) { alert("Could not read that file: " + e.message); }
    };
    reader.readAsText(file);
  }

  // ---- currency helpers ----
  function rate() { return Number(Store.data.meta.exchangeRateGBPtoINR) || 0; }
  function inrToGbp(inr) { const r = rate(); return r ? inr / r : 0; }
  function gbpToInr(gbp) { return gbp * rate(); }
  function fmtINR(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function fmtGBP(n) { return "£" + (Math.round(n * 100) / 100).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  // Normalise a budget line to INR and GBP regardless of how it was entered.
  function lineToBoth(line, field /* 'planned' | 'actual' */) {
    if (line.currency === "GBP") {
      const gbp = Number(line[field + "GBP"]) || 0;
      return { inr: gbpToInr(gbp), gbp };
    }
    const inr = Number(line[field + "INR"]) || 0;
    return { inr, gbp: inrToGbp(inr) };
  }

  window.Store = {
    data: load(),
    subscribe(fn) { subscribers.push(fn); },
    commit, save, reset, exportJSON, importJSON,
    rate, inrToGbp, gbpToInr, fmtINR, fmtGBP, lineToBoth, clone,
  };
})();
