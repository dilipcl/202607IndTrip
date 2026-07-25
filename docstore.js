/* ============================================================================
 * DocStore — offline copies of PDFs/images, kept on THIS device in IndexedDB.
 *
 * Why IndexedDB and not localStorage or the service-worker cache:
 *   - Files (a passport scan alone is ~7 MB) blow past localStorage's ~5 MB cap,
 *     and they must NEVER ride along in the exported JSON backup or the public
 *     repo. IndexedDB holds large binaries and stays on the device only.
 *   - The SW shell cache is for the app's own code; these are personal documents
 *     the user attaches once and can open with no signal (e.g. at the airport).
 *
 * Blobs are keyed by the document row's id (see SEED.documents). A tiny in-memory
 * Set (`window.DocStore.keys`) mirrors which ids are stored, so the synchronous
 * render can show "offline ✓" badges without awaiting IndexedDB every paint.
 * ==========================================================================*/
(function () {
  const DB = "kerala2026-docs";
  const STORE = "files";
  const keys = new Set();          // ids that currently have an offline copy
  let dbp = null;                  // cached open-DB promise

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) { reject(new Error("IndexedDB unavailable")); return; }
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  function tx(mode) { return open().then((db) => db.transaction(STORE, mode).objectStore(STORE)); }
  function wrap(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Load the set of stored ids up front so the first render already knows them.
  function ready() {
    return tx("readonly").then((s) => wrap(s.getAllKeys())).then((ks) => {
      keys.clear(); ks.forEach((k) => keys.add(k)); return keys;
    }).catch(() => keys);
  }

  // Store a File/Blob under a document id, keeping its name + type for reopening.
  function put(id, file) {
    return tx("readwrite").then((s) => wrap(s.put({
      blob: file, name: file.name || (id + ".pdf"), type: file.type || "application/pdf",
      size: file.size || 0, savedAt: Date.now(),
    }, id))).then(() => { keys.add(id); return true; });
  }

  function get(id) { return tx("readonly").then((s) => wrap(s.get(id))); }

  function remove(id) {
    return tx("readwrite").then((s) => wrap(s.delete(id))).then(() => { keys.delete(id); return true; });
  }

  function has(id) { return keys.has(id); }

  window.DocStore = { ready, put, get, remove, has, keys, available: ("indexedDB" in window) };
})();
