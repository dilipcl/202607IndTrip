/* ============================================================================
 * Kerala 2026 Trip Companion — UI / app shell.
 * Plain DOM, no framework. Re-renders the active tab on every commit.
 * ==========================================================================*/
(function () {
  const D = () => Store.data;
  const E = Engine;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const root = $("#app");

  const App = { tab: "home", socialFilter: "all" };

  /* ---------- escaping & tiny templating ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function nl2br(s) { return esc(s).replace(/\n/g, "<br>"); }

  /* ---------- modal form builder ---------- */
  // fields: [{key,label,type,options?,placeholder?,full?}]  type: text|textarea|date|time|number|select|checkbox
  function openForm(title, fields, values, onSave, onDelete) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(40,20,15,.45);z-index:60;display:flex;align-items:flex-end;justify-content:center";
    const sheet = document.createElement("div");
    sheet.style.cssText = "background:#fff;width:100%;max-width:680px;max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom));box-shadow:0 -4px 20px rgba(0,0,0,.2)";
    const v = Object.assign({}, values);
    let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h2 style="font-size:1.05rem;color:var(--maroon-dark);margin:0">${esc(title)}</h2>
        <button data-x style="background:none;border:none;font-size:1.4rem;color:#9a8c7e;padding:4px 8px">×</button></div>`;
    fields.forEach((f) => {
      const id = "fld_" + f.key;
      const val = v[f.key] != null ? v[f.key] : "";
      html += `<div class="field${f.full ? "" : ""}"><label class="lbl" for="${id}">${esc(f.label)}</label>`;
      if (f.type === "textarea") html += `<textarea id="${id}" data-k="${f.key}" placeholder="${esc(f.placeholder || "")}">${esc(val)}</textarea>`;
      else if (f.type === "select") html += `<select id="${id}" data-k="${f.key}">${f.options.map((o) => `<option value="${esc(o)}"${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
      else if (f.type === "checkbox") html += `<div class="inline"><input type="checkbox" id="${id}" data-k="${f.key}" style="width:26px;height:26px;min-height:26px"${val ? " checked" : ""}><span class="small">${esc(f.placeholder || "")}</span></div>`;
      else html += `<input id="${id}" data-k="${f.key}" type="${f.type || "text"}" value="${esc(val)}" placeholder="${esc(f.placeholder || "")}">`;
      html += `</div>`;
    });
    html += `<div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn primary grow" data-save style="flex:1">Save</button>
        ${onDelete ? '<button class="btn ghost" data-del style="border-color:var(--danger);color:var(--danger)">Delete</button>' : ""}
      </div>`;
    sheet.innerHTML = html;
    overlay.appendChild(sheet);
    document.body.appendChild(overlay);
    function close() { overlay.remove(); }
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    sheet.querySelector("[data-x]").onclick = close;
    sheet.querySelector("[data-save]").onclick = () => {
      sheet.querySelectorAll("[data-k]").forEach((inp) => {
        const k = inp.getAttribute("data-k");
        v[k] = inp.type === "checkbox" ? inp.checked : (inp.type === "number" ? Number(inp.value) : inp.value);
      });
      close(); onSave(v);
    };
    if (onDelete) sheet.querySelector("[data-del]").onclick = () => { if (confirm("Delete this item?")) { close(); onDelete(); } };
  }

  function uid(prefix) { return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  /* ============================================================ HOME / ALERTS */
  function renderHome() {
    const m = D().meta;
    const today = E.todayIso();
    const dleft = E.daysBetween(today, m.tripStart);
    const inTrip = today >= m.tripStart && today <= m.tripEnd;
    let countdown;
    if (today > m.tripEnd) countdown = "Trip complete 🙏";
    else if (inTrip) countdown = `Day ${E.daysBetween(m.tripStart, today) + 1} of ${E.daysBetween(m.tripStart, m.tripEnd) + 1} · in Kerala`;
    else countdown = `${dleft} day${dleft === 1 ? "" : "s"} to departure`;

    const flags = E.computeFlags(D());
    const todaysAnchors = E.anchorsOn(today, D());

    let h = `<div class="card" style="background:linear-gradient(135deg,#fff,#fff8ee);border-left:4px solid var(--gold)">
        <div class="tiny muted">27 Jul – 17 Aug 2026 · 13 travellers · ${esc(m.bookingRef)}</div>
        <div style="font-size:1.5rem;font-weight:800;color:var(--maroon);margin-top:2px">${esc(countdown)}</div>
      </div>`;

    // backup nudge — localStorage is per-device, so encourage exports
    const lb = m.lastBackup;
    const days = lb ? E.daysBetween(lb, today) : null;
    if (!lb || days >= 3) {
      const msg = lb ? `Last backup was ${days} day${days === 1 ? "" : "s"} ago.` : "Your data isn't backed up yet — it lives only on this device.";
      h += `<div class="alert ${lb ? "warn" : "danger"}"><span class="ic">💾</span><div style="flex:1">${esc(msg)} <button class="linkbtn" data-export style="padding:2px 0;font-weight:700">Export backup now →</button></div></div>`;
    }

    h += `<div class="section-title">Open flags</div>`;
    if (!flags.length) h += `<div class="alert ok"><span class="ic">✓</span><div>Nothing flagged right now.</div></div>`;
    flags.forEach((f) => {
      h += `<div class="alert ${f.level === "danger" ? "danger" : "warn"}"><span class="ic">${f.level === "danger" ? "▲" : "•"}</span><div>${esc(f.text)}</div></div>`;
    });

    if (todaysAnchors.length) {
      h += `<div class="section-title">Today</div>`;
      todaysAnchors.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      todaysAnchors.forEach((a) => {
        h += `<div class="card"><div class="inline" style="justify-content:space-between"><b>${esc(a.title)}</b><span class="chip ${esc(a.kind)}">${a.time || "—"}</span></div><div class="small muted" style="margin-top:4px">${esc(a.detail)}</div></div>`;
      });
    }

    h += `<div class="section-title">Reminders</div><div class="card">`;
    const alerts = D().alerts.slice().sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    alerts.forEach((a) => {
      const overdue = a.due && a.due < today && !a.done;
      h += `<div class="li">
          <span class="check ${a.done ? "on" : ""}" data-toggle-alert="${esc(a.id)}">${a.done ? "✓" : ""}</span>
          <div class="grow" data-edit-alert="${esc(a.id)}"><div class="ttl">${esc(a.title)}</div>
          <div class="meta">${a.due ? E.fmt(a.due) + (overdue ? " · <span class='note-warn'>due</span>" : "") : ""}${a.note ? " · " + esc(a.note) : ""}</div></div>
        </div>`;
    });
    h += `</div>`;
    return `<section>${h}</section>`;
  }

  /* ============================================================ ITINERARY */
  function renderItinerary() {
    const m = D().meta;
    const days = E.eachDay(m.tripStart, m.tripEnd);
    const phaseFor = (iso) => {
      if (iso <= "2026-07-28") return "Arrival";
      if (iso <= "2026-08-01") return "Trivandrum";
      if (iso <= "2026-08-05") return "Northern loop · Kollur";
      if (iso >= "2026-08-16") return "Departure";
      return "Trivandrum";
    };
    const toggle = `<div class="pill-tabs">
        <button class="${App.planView !== "cal" ? "on" : ""}" data-planview="list">🗓 List</button>
        <button class="${App.planView === "cal" ? "on" : ""}" data-planview="cal">▦ Calendar</button>
      </div>`;
    if (App.planView === "cal") return `<section>${toggle}${renderCalendar()}</section>`;
    let h = toggle + `<div class="section-title">Day-by-day · 27 Jul → 17 Aug</div>`;
    days.forEach((iso) => {
      const anchors = E.anchorsOn(iso, D()).slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      const userEv = []
        .concat(D().social.filter((s) => s.date === iso).map((s) => ({ ...s, _t: "social" })))
        .concat(D().visits.filter((vv) => vv.date === iso).map((vv) => ({ ...vv, _t: "visit" })))
        .concat(D().finAdmin.filter((f) => f.date === iso).map((f) => ({ ...f, _t: "fin" })));
      const dt = E.parse(iso);
      const hasAnchor = anchors.length > 0;
      h += `<div class="card day" id="day-${iso}">
        <div class="day-head ${hasAnchor ? "has-anchor" : ""}">
          <div class="day-date"><span class="dow">${E.weekday(iso)}</span><span class="num">${dt.getDate()}</span><span class="mon">${E.MON[dt.getMonth()]}</span></div>
          <div class="day-meta"><div class="phase">${esc(phaseFor(iso))}</div>
            <div class="summary">${anchors.length ? esc(anchors.map((a) => a.title).join(" · ")) : '<span class="muted">No fixed plans</span>'}</div></div>
          <button class="btn gold sm" data-add-day="${iso}">+ Add</button>
        </div>`;
      if (anchors.length || userEv.length) {
        h += `<div class="day-body">`;
        anchors.forEach((a) => {
          h += `<div class="event"><div class="time">${a.time || "—"}</div><div class="body">
            <div class="ttl">${esc(a.title)} <span class="chip lock">🔒 fixed</span></div>
            <div class="det">${esc(a.detail)}${a.transport ? ` · <b>${esc(a.transport)}</b>` : ""}</div></div></div>`;
        });
        userEv.forEach((ev) => {
          if (ev._t === "fin") {
            h += `<div class="event user"><div class="time">—</div><div class="body"><div class="ttl">${esc(ev.title)}</div><div class="det">Financial admin</div></div></div>`;
          } else {
            const rec = E.recommendTransport(ev, D());
            h += `<div class="event user" data-edit-${ev._t}="${esc(ev.id)}"><div class="time">${esc(ev.time || "—")}</div><div class="body">
              <div class="ttl">${esc(ev.title || ev.household)}</div>
              <div class="det">${esc(ev.location || ev.gifts || "")} · 🚗 ${esc(ev.transport || rec.mode)}</div></div></div>`;
          }
        });
        h += `</div>`;
      }
      h += `</div>`;
    });
    return `<section>${h}</section>`;
  }

  const KIND_COLOR = { flight: "#3a6ea5", train: "#2e7d4f", temple: "#a5562e", hotel: "#6a4aa5", homa: "#a5562e", medical: "#5a6570", admin: "#8a7d72", warning: "#b9770a" };

  function renderCalendar() {
    const m = D().meta;
    const start = m.tripStart, end = m.tripEnd;
    const total = E.daysBetween(start, end) + 1;
    const today = E.todayIso();

    // overall progress
    let pct, label;
    if (today < start) { pct = 0; const dleft = E.daysBetween(today, start); label = `Not started — ${dleft} day${dleft === 1 ? "" : "s"} to go`; }
    else if (today > end) { pct = 100; label = "Trip complete 🙏"; }
    else { const idx = E.daysBetween(start, today) + 1; pct = Math.round((idx / total) * 100); label = `Day ${idx} of ${total} · ${pct}% through`; }

    let h = `<div class="card">
      <div class="inline" style="justify-content:space-between"><b>Trip progress</b><span class="small muted">${total} days</span></div>
      <div class="small" style="margin:4px 0 6px">${esc(label)}</div>
      <div class="prog"><span style="width:${pct}%"></span></div>
    </div>`;

    // grid bounds: Monday on/before start → Sunday on/after end
    const gridStart = E.addDays(start, -((E.weekdayIdx(start) + 6) % 7));
    const gridEnd = E.addDays(end, (7 - E.weekdayIdx(end)) % 7);
    const cells = E.eachDay(gridStart, gridEnd);
    const heads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    h += `<div class="card"><div class="cal-grid">`;
    heads.forEach((d, i) => { h += `<div class="cal-h ${i >= 5 ? "we" : ""}">${d}</div>`; });
    cells.forEach((iso) => {
      const inTrip = iso >= start && iso <= end;
      const dt = E.parse(iso);
      const anchors = inTrip ? E.anchorsOn(iso, D()) : [];
      const userCount = inTrip
        ? D().social.filter((s) => s.date === iso).length + D().visits.filter((v) => v.date === iso).length
        : 0;
      const idx = inTrip ? E.daysBetween(start, iso) + 1 : 0;
      const dpct = inTrip ? Math.round((idx / total) * 100) : 0;
      const kinds = [...new Set(anchors.map((a) => a.kind))];
      let dots = kinds.slice(0, 4).map((k) => `<span class="cal-dot" style="background:${KIND_COLOR[k] || "#999"}"></span>`).join("");
      if (userCount) dots += `<span class="cal-dot" style="background:var(--gold)"></span>`;
      const cls = ["cal-cell"];
      if (!inTrip) cls.push("out");
      if (iso === today) cls.push("today");
      if (inTrip && (anchors.length || userCount)) cls.push("has");
      h += `<div class="${cls.join(" ")}" ${inTrip ? `data-calday="${iso}"` : ""}>
        <div class="d">${dt.getDate()}</div>
        ${dt.getDate() === 1 || iso === gridStart ? `<div class="mon">${E.MON[dt.getMonth()]}</div>` : ""}
        ${inTrip ? `<div class="pct">${dpct}%</div>` : ""}
        <div class="cal-dots">${dots}</div>
      </div>`;
    });
    h += `</div>`;
    h += `<div class="cal-leg">
      <span><span class="cal-dot" style="background:${KIND_COLOR.flight}"></span>Flight</span>
      <span><span class="cal-dot" style="background:${KIND_COLOR.train}"></span>Train</span>
      <span><span class="cal-dot" style="background:${KIND_COLOR.temple}"></span>Temple</span>
      <span><span class="cal-dot" style="background:${KIND_COLOR.hotel}"></span>Hotel</span>
      <span><span class="cal-dot" style="background:${KIND_COLOR.warning}"></span>Watch-out</span>
      <span><span class="cal-dot" style="background:var(--gold)"></span>Your plans</span>
    </div><div class="tiny muted" style="margin-top:8px">Tap a day to jump to it in the list. The % is how far that day is through the 21-day trip.</div></div>`;
    return h;
  }

  /* ============================================================ TASKS / CHECKLIST */
  function renderTasks() {
    const cats = ["Verify", "Pack", "Health", "Passport"];
    const catTitles = {
      Verify: "🔎 Verification tasks (OPEN)",
      Pack: "🧳 Pre-trip packing & prep",
      Health: "🩺 Health & monsoon precautions",
      Passport: "🛂 Kids' passport re-issue (step by step)",
    };
    let h = `<div class="section-title">Must-do checklist & verification</div>`;
    const open = D().checklist.filter((c) => c.status !== "done").length;
    h += `<div class="small muted" style="margin:0 2px 10px">${open} open of ${D().checklist.length}</div>`;
    cats.forEach((cat) => {
      const items = D().checklist.filter((c) => c.cat === cat);
      if (!items.length) return;
      h += `<div class="card"><h3>${catTitles[cat] || cat}</h3>`;
      items.sort((a, b) => (a.priority === "high" ? -1 : 1) - (b.priority === "high" ? -1 : 1));
      items.forEach((c) => {
        h += `<div class="li">
          <span class="check ${c.status === "done" ? "on" : ""}" data-toggle-task="${esc(c.id)}">${c.status === "done" ? "✓" : ""}</span>
          <div class="grow" data-edit-task="${esc(c.id)}">
            <div class="ttl">${esc(c.title)} ${c.priority === "high" ? '<span class="badge high">priority</span>' : ""}</div>
            ${c.note ? `<div class="meta">${nl2br(c.note)}</div>` : ""}
          </div></div>`;
      });
      h += `</div>`;
    });
    h += `<button class="btn ghost full" data-add-task>+ Add task</button>`;
    return `<section>${h}</section>`;
  }

  /* ============================================================ SOCIAL */
  function renderSocial() {
    let h = `<div class="section-title">Social & activities (Trivandrum)</div>`;
    h += `<div class="small muted" style="margin:0 2px 10px">Drinks events auto-recommend Taxi and lock out self-drive. Weekdays are computed so Sunday football & weekday meets land right.</div>`;
    D().social.forEach((s) => {
      const rec = E.recommendTransport(s, D());
      const warns = E.eventWarnings(s, D());
      h += `<div class="card" data-edit-social="${esc(s.id)}">
        <div class="inline" style="justify-content:space-between">
          <h3 style="margin:0">${esc(s.title)} ${s.hasDrinks ? "🥂" : ""}</h3>
          ${s.timeCritical ? '<span class="badge high">time-critical</span>' : ""}
        </div>
        <div class="small muted" style="margin-top:3px">
          ${s.date ? `<b>${E.fmtLong(s.date)}</b>` : '<span class="note-warn">Unscheduled</span>'} ${s.time ? "· " + esc(s.time) : ""}
          ${s.window ? `<br><span class="tiny">Window: ${esc(s.window)}</span>` : ""}
        </div>
        ${s.location ? `<div class="small" style="margin-top:3px">📍 ${esc(s.location)}</div>` : ""}
        ${s.attendees ? `<div class="small">👥 ${esc(s.attendees)}</div>` : ""}
        <div class="rec ${rec.locked ? "locked" : ""}">🚗 <b>${esc(s.transport || rec.mode)}</b> — ${esc(rec.reason)}</div>
        ${warns.map((w) => `<div class="flag" style="${w.level === "danger" ? "color:var(--danger);background:var(--danger-bg);border-color:#f2c4c0" : ""}">⚠ ${esc(w.text)}</div>`).join("")}
        ${Number(s.costINR) ? `<div class="small muted" style="margin-top:5px">Est. cost: ${Store.fmtINR(s.costINR)}</div>` : ""}
      </div>`;
    });
    h += `<button class="btn ghost full" data-add-social>+ Add event</button>`;
    return `<section>${h}</section>`;
  }

  /* ============================================================ VISITS + GIFTS + TRANSPORT */
  function renderVisits() {
    let h = `<div class="pill-tabs">
        <button class="${App.visitsTab !== "gifts" ? "on" : ""}" data-vtab="visits">Temple & relatives</button>
        <button class="${App.visitsTab === "gifts" ? "on" : ""}" data-vtab="gifts">Gifts</button>
      </div>`;
    if (App.visitsTab === "gifts") return `<section>${h}${renderGifts()}</section>`;

    // Self-drive summary card (default: not recommended)
    const sd = D().selfDrive;
    h += `<div class="card locked">
      <h3>🚗 Transport strategy</h3>
      <div class="small" style="margin-top:4px">Self-drive rental is <b>${sd.optedIn ? "ACTIVE" : "NOT recommended"}</b> by default. Drinks days need taxis; the out-of-town circuit is better with a driver; on-demand taxis cover short local hops cheaply.</div>
      <div class="rec" style="margin-top:8px">Rule: any drinks event forces <b>Taxi</b> even on an active self-drive day. Airport transfers → MPV taxi. Kottarakkara/Mathoor circuit → <b>full-day car + driver</b>.</div>
      <button class="btn ${sd.optedIn ? "ghost" : "gold"} sm" data-selfdrive style="margin-top:8px">${sd.optedIn ? `Active ${E.fmt(sd.startDate)}–${E.fmt(sd.endDate)} · ₹${sd.dayRateINR}/day — edit` : "Opt in to a self-drive block"}</button>
    </div>`;

    h += `<div class="section-title">Temple & relatives visits</div>`;
    h += `<div class="small muted" style="margin:0 2px 10px">Kottarakkara + nearby relative + the 3 Mathoor houses are one editable out-of-town circuit (→ full-day car + driver). Confirm Mathoor's distance to decide one day-trip or two.</div>`;
    D().visits.forEach((vv) => {
      const rec = E.recommendTransport(vv, D());
      h += `<div class="card" data-edit-visit="${esc(vv.id)}">
        <div class="inline" style="justify-content:space-between">
          <h3 style="margin:0">${esc(vv.household)}</h3>
          <span class="check ${vv.visited ? "on" : ""}" data-toggle-visit="${esc(vv.id)}">${vv.visited ? "✓" : ""}</span>
        </div>
        <div class="small muted" style="margin-top:3px">📍 ${esc(vv.location)}${vv.circuit ? ' · <span class="chip">circuit</span>' : ""}</div>
        <div class="small">${vv.date ? "📅 " + E.fmtLong(vv.date) : '<span class="muted">No date set</span>'}</div>
        ${vv.gifts ? `<div class="small">🎁 ${esc(vv.gifts)}</div>` : ""}
        <div class="rec ${rec.locked ? "locked" : ""}">🚗 <b>${esc(vv.transport || rec.mode)}</b> — ${esc(rec.reason)}</div>
        ${vv.notes ? `<div class="tiny muted" style="margin-top:5px">${esc(vv.notes)}</div>` : ""}
      </div>`;
    });
    h += `<button class="btn ghost full" data-add-visit>+ Add household</button>`;
    return `<section>${h}</section>`;
  }

  function renderGifts() {
    let h = `<div class="section-title">Gifts planner</div>`;
    let totalUK = 0, totalIN = 0;
    D().gifts.forEach((g) => { (g.source === "Buy in UK" ? (totalUK += Number(g.budgetINR) || 0) : (totalIN += Number(g.budgetINR) || 0)); });
    D().gifts.forEach((g) => {
      h += `<div class="card" data-edit-gift="${esc(g.id)}">
        <div class="inline" style="justify-content:space-between">
          <h3 style="margin:0">${esc(g.item)}</h3>
          <span class="chip">${esc(g.source)}</span>
        </div>
        <div class="small muted" style="margin-top:3px">${g.recipient ? "→ " + esc(g.recipient) : '<span class="note-warn">no recipient</span>'} · ${Store.fmtINR(g.budgetINR || 0)}</div>
        <div class="inline small" style="margin-top:6px;gap:14px">
          <span class="check ${g.purchased ? "on" : ""}" data-toggle-gift-p="${esc(g.id)}" style="width:22px;height:22px;min-width:22px">${g.purchased ? "✓" : ""}</span> bought
          <span class="check ${g.packed ? "on" : ""}" data-toggle-gift-k="${esc(g.id)}" style="width:22px;height:22px;min-width:22px">${g.packed ? "✓" : ""}</span> packed
        </div>
      </div>`;
    });
    h += `<div class="card"><div class="kv"><span class="k">Buy in UK</span><span class="v">${Store.fmtINR(totalUK)}</span></div>
      <div class="kv"><span class="k">Buy in India</span><span class="v">${Store.fmtINR(totalIN)}</span></div>
      <div class="bud-tot"><b>Total gifts</b><b>${Store.fmtINR(totalUK + totalIN)}</b></div>
      <div class="tiny muted">Rolls into Budget · Gifts.</div></div>`;
    h += `<button class="btn ghost full" data-add-gift>+ Add gift</button>`;
    return h;
  }

  /* ============================================================ BUDGET */
  function giftsTotalINR() { return D().gifts.reduce((s, g) => s + (Number(g.budgetINR) || 0), 0); }

  function renderBudget() {
    const m = D().meta;
    let h = `<div class="card">
      <div class="inline" style="justify-content:space-between">
        <h3 style="margin:0">💱 Exchange rate</h3>
        <button class="linkbtn" data-rate>edit</button>
      </div>
      <div class="small" style="margin-top:4px">£1 = ${Store.fmtINR(Store.rate())} ${m.exchangeRateIsPlaceholder ? '<span class="note-warn">(placeholder — set your own)</span>' : ""}</div>
    </div>`;

    let plInr = 0, acInr = 0;
    h += `<div class="section-title">Budget · planned vs actual</div>`;
    D().budget.forEach((b) => {
      // gifts category mirrors the gifts planner total for planned
      const planned = b.id === "b_gifts" ? { inr: giftsTotalINR(), gbp: Store.inrToGbp(giftsTotalINR()) } : Store.lineToBoth(b, "planned");
      const actual = Store.lineToBoth(b, "actual");
      plInr += planned.inr; acInr += actual.inr;
      const pct = planned.inr ? Math.min(100, Math.round((actual.inr / planned.inr) * 100)) : 0;
      h += `<div class="card" data-edit-budget="${esc(b.id)}">
        <div class="inline" style="justify-content:space-between">
          <b style="font-size:.9rem">${esc(b.cat)}</b>
          <span class="badge ${b.paid ? "done" : "open"}">${b.paid ? "paid" : "planned"}</span>
        </div>
        <div class="kv"><span class="k">Planned</span><span class="v">${Store.fmtINR(planned.inr)} · ${Store.fmtGBP(planned.gbp)}</span></div>
        <div class="kv"><span class="k">Actual</span><span class="v">${Store.fmtINR(actual.inr)} · ${Store.fmtGBP(actual.gbp)}</span></div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        ${b.note ? `<div class="tiny muted" style="margin-top:5px">${esc(b.note)}</div>` : ""}
      </div>`;
    });
    h += `<div class="card" style="background:#fff8ee;border-left:4px solid var(--gold)">
      <div class="bud-tot" style="border:none"><b>Total planned</b><b>${Store.fmtINR(plInr)} · ${Store.fmtGBP(Store.inrToGbp(plInr))}</b></div>
      <div class="bud-tot"><b>Total actual</b><b>${Store.fmtINR(acInr)} · ${Store.fmtGBP(Store.inrToGbp(acInr))}</b></div>
    </div>`;

    // Financial admin tasks (not spend)
    h += `<div class="section-title">Financial admin (not spend)</div><div class="card">`;
    D().finAdmin.forEach((f) => {
      h += `<div class="li"><span class="check ${f.done ? "on" : ""}" data-toggle-fin="${esc(f.id)}">${f.done ? "✓" : ""}</span>
        <div class="grow"><div class="ttl">${esc(f.title)}</div><div class="meta">${f.date ? E.fmtLong(f.date) : ""}</div></div></div>`;
    });
    h += `</div>`;
    h += `<button class="btn ghost full" data-add-budget>+ Add budget line</button>`;
    return `<section>${h}</section>`;
  }

  /* ============================================================ DOCS */
  function renderDocs() {
    const d = D();
    const docRow = (k, v) => v ? `<div class="doc-row"><span class="k">${esc(k)}</span><span class="v">${v}</span></div>` : "";
    let h = `<div class="section-title">Documents quick-reference</div>`;

    h += `<div class="card"><h3>✈ Flights · ${esc(d.meta.bookingRef)}</h3>`;
    d.flightTickets.forEach((t) => {
      const p = d.passengers.find((x) => x.id === t.passenger);
      h += docRow(p ? p.name : t.passenger, `${esc(t.ticket)}<br><span class="seat-tag">${esc(t.outSeats)}</span>`);
    });
    h += `<div class="tiny muted" style="margin-top:6px">${esc(d.flightRules.baggageCabinIndiaNote)}</div></div>`;

    h += `<div class="card"><h3>🚆 Train PNRs</h3>`;
    d.trains.forEach((tr) => {
      h += `<div class="small" style="margin:6px 0 2px"><b>${esc(tr.direction)}</b> · ${esc(tr.train)} · ${E.fmt(tr.date)} · coach ${esc(tr.coach)}</div>`;
      tr.pnrs.forEach((p) => h += docRow("PNR " + p.pnr, `<span class="seat-tag">${esc(p.board)}</span>`));
    });
    h += `</div>`;

    h += `<div class="card"><h3>🛕 Homa & 🏨 Hotel</h3>
      ${docRow("Homa ticket", esc(d.homa.ticketNo))}
      ${docRow("Homa date", E.fmtLong(d.homa.date) + " " + esc(d.homa.time))}
      ${docRow("Devotee ID", esc(d.homa.devotees.join(", ")))}
      ${docRow("Hotel reservation", esc(d.hotel.reservationNo))}
      ${docRow("Hotel guest", esc(d.hotel.guestName))}
      ${docRow("Hotel dates", E.fmt(d.hotel.checkIn) + " → " + E.fmt(d.hotel.checkOut) + " (" + d.hotel.nights + " nights)")}
    </div>`;

    h += `<div class="card"><h3>🛡 Insurance</h3>
      ${docRow("Policy", esc(d.insurance.policyNo))}
      ${docRow("Insurer", esc(d.insurance.insurer))}
      ${docRow("Admin", esc(d.insurance.administrator))}
      ${docRow("Covers", esc(d.insurance.coversWho))}
      ${docRow("Geographical", esc(d.insurance.geographical))}
      <div class="flag" style="margin-top:8px">${esc(d.insurance.fcdoExclusion)}</div>
    </div>`;

    h += `<div class="card"><h3>📞 Key contacts</h3>`;
    d.contacts.forEach((c) => {
      const v = c.value || '<span class="note-warn">add number</span>';
      const tel = c.value && /[0-9]/.test(c.value) && !/^http/.test(c.value) ? `<a class="callbtn" href="tel:${esc(c.value.replace(/[^+0-9]/g, ""))}">📞</a>` : "";
      const link = /^http/.test(c.value || "") ? `<a href="${esc(c.value)}" target="_blank" rel="noopener">open ↗</a>` : v;
      h += `<div class="doc-row" data-edit-contact="${esc(c.id)}"><span class="k">${esc(c.label)}</span><span class="v">${/^http/.test(c.value || "") ? link : v} ${tel}</span></div>`;
    });
    h += `<div class="tiny muted" style="margin-top:6px">Tap a contact to add/edit its number. The Cega 24h assistance line is on your insurance certificate.</div></div>`;

    // ---- Source documents ----
    h += `<div class="card"><h3>🗂 Source documents</h3>
      <a class="btn ghost sm" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener" style="margin:2px 0 8px">📂 Open Google Drive</a>`;
    const groups = {};
    d.documents.forEach((doc) => { (groups[doc.group] = groups[doc.group] || []).push(doc); });
    Object.keys(groups).forEach((g) => {
      h += `<div class="small" style="margin:8px 0 2px"><b>${esc(g)}</b></div>`;
      groups[g].forEach((doc) => {
        const href = doc.driveLink || doc.localLink;
        h += `<div class="doc-row">
          <span class="k" style="flex:1">${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(doc.label)} ↗</a>` : esc(doc.label)}
            ${doc.driveLink ? '<span class="chip" style="margin-left:6px">Drive</span>' : '<span class="tiny muted">local</span>'}</span>
          <button class="linkbtn" data-edit-doc="${esc(doc.id)}">link</button></div>`;
      });
    });
    h += `<div class="tiny muted" style="margin-top:8px">Tap <b>📂 Open Google Drive</b>, find a file, do <b>Share → Copy link</b>, then tap <b>link</b> on that row and paste it (a full URL or just the file ID both work). It then opens on your phone too.</div></div>`;

    // ---- Draft emails ----
    h += `<div class="section-title">Emails to send</div>`;
    d.emails.forEach((em) => {
      const to = em.to || "";
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(em.subject)}&body=${encodeURIComponent(em.body)}`;
      h += `<div class="card">
        <div class="inline" style="justify-content:space-between">
          <h3 style="margin:0">✉️ ${esc(em.title)}</h3>
          <button class="linkbtn" data-edit-email="${esc(em.id)}">edit</button>
        </div>
        <div class="tiny muted" style="margin-top:2px">To: ${to ? esc(to) : '<span class="note-warn">' + esc(em.toHint || "add recipient") + "</span>"}</div>
        <div class="small" style="margin-top:4px"><b>${esc(em.subject)}</b></div>
        <div class="small" style="white-space:pre-wrap;margin-top:6px;color:#4a4039;max-height:120px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:8px;background:#fcfaf6">${esc(em.body)}</div>
        <div class="inline" style="gap:8px;margin-top:8px;flex-wrap:wrap">
          <button class="btn gold sm" data-copy-email="${esc(em.id)}">📋 Copy</button>
          <a class="btn ghost sm" href="${esc(mailto)}">✉️ Open in mail</a>
        </div>
      </div>`;
    });

    h += `<div class="card"><h3>⚙ Data</h3>
      <div class="inline" style="gap:8px;flex-wrap:wrap">
        <button class="btn gold sm" data-export>⬇ Export backup</button>
        <button class="btn ghost sm" data-import>⬆ Import backup</button>
        <button class="btn ghost sm" data-reset style="border-color:var(--danger);color:var(--danger)">↺ Reset to trip facts</button>
      </div>
      <input type="file" id="importFile" accept="application/json" style="display:none">
      <div class="tiny muted" style="margin-top:8px">All data is stored on this device only. Export regularly to back up.</div>
    </div>`;
    return `<section>${h}</section>`;
  }

  /* ============================================================ RENDER DISPATCH */
  const TABS = [
    { id: "home", ic: "🏠", label: "Home", fn: renderHome },
    { id: "plan", ic: "🗓", label: "Plan", fn: renderItinerary },
    { id: "tasks", ic: "✓", label: "Tasks", fn: renderTasks },
    { id: "social", ic: "🥂", label: "Social", fn: renderSocial },
    { id: "visits", ic: "🛕", label: "Visits", fn: renderVisits },
    { id: "budget", ic: "💷", label: "Budget", fn: renderBudget },
    { id: "docs", ic: "📄", label: "Docs", fn: renderDocs },
  ];

  function render() {
    const tab = TABS.find((t) => t.id === App.tab) || TABS[0];
    root.innerHTML = tab.fn();
    document.querySelectorAll(".tabbar button").forEach((b) =>
      b.classList.toggle("active", b.getAttribute("data-tab") === App.tab));
    const refEl = document.getElementById("bookingRef");
    if (refEl) { const r = D().meta.bookingRef || ""; refEl.textContent = r; refEl.style.display = r ? "" : "none"; }
    if (App.scrollToDay) {
      const el = document.getElementById("day-" + App.scrollToDay);
      App.scrollToDay = null;
      if (el) { el.scrollIntoView({ block: "center" }); el.style.transition = "box-shadow .3s"; el.style.boxShadow = "0 0 0 3px rgba(201,162,39,.6)"; setTimeout(() => (el.style.boxShadow = ""), 1400); return; }
    }
    window.scrollTo({ top: 0 });
  }
  Store.subscribe(render);

  /* ============================================================ EVENT WIRING */
  function find(coll, id) { return D()[coll].find((x) => x.id === id); }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab],[data-vtab],[data-planview],[data-calday],[data-toggle-task],[data-edit-task],[data-add-task],"
      + "[data-toggle-alert],[data-edit-alert],[data-add-day],[data-edit-social],[data-add-social],"
      + "[data-edit-visit],[data-add-visit],[data-toggle-visit],[data-edit-gift],[data-add-gift],"
      + "[data-toggle-gift-p],[data-toggle-gift-k],[data-edit-budget],[data-add-budget],[data-toggle-fin],"
      + "[data-rate],[data-selfdrive],[data-edit-contact],[data-edit-doc],[data-edit-email],[data-copy-email],"
      + "[data-export],[data-import],[data-reset]");
    if (!t) return;
    const A = (k) => t.getAttribute(k);

    // tab switch
    if (A("data-tab")) { App.tab = A("data-tab"); render(); return; }
    if (A("data-vtab")) { App.visitsTab = A("data-vtab"); render(); return; }
    if (A("data-planview")) { App.planView = A("data-planview"); render(); return; }
    if (A("data-calday")) { App.planView = "list"; App.scrollToDay = A("data-calday"); render(); return; }

    // ---- tasks ----
    if (A("data-toggle-task")) { const c = find("checklist", A("data-toggle-task")); c.status = c.status === "done" ? "open" : "done"; Store.commit(); return; }
    if (A("data-edit-task")) { editTask(find("checklist", A("data-edit-task"))); return; }
    if (A("data-add-task") != null && t.hasAttribute("data-add-task")) { editTask(null); return; }

    // ---- alerts ----
    if (A("data-toggle-alert")) { const a = find("alerts", A("data-toggle-alert")); a.done = !a.done; Store.commit(); return; }
    if (A("data-edit-alert")) { editAlert(find("alerts", A("data-edit-alert"))); return; }

    // ---- itinerary add ----
    if (A("data-add-day")) { addOnDay(A("data-add-day")); return; }

    // ---- social ----
    if (A("data-edit-social")) { editSocial(find("social", A("data-edit-social"))); return; }
    if (t.hasAttribute("data-add-social")) { editSocial(null); return; }

    // ---- visits ----
    if (A("data-toggle-visit")) { const v = find("visits", A("data-toggle-visit")); v.visited = !v.visited; Store.commit(); return; }
    if (A("data-edit-visit")) { editVisit(find("visits", A("data-edit-visit"))); return; }
    if (t.hasAttribute("data-add-visit")) { editVisit(null); return; }

    // ---- gifts ----
    if (A("data-toggle-gift-p")) { const g = find("gifts", A("data-toggle-gift-p")); g.purchased = !g.purchased; Store.commit(); return; }
    if (A("data-toggle-gift-k")) { const g = find("gifts", A("data-toggle-gift-k")); g.packed = !g.packed; Store.commit(); return; }
    if (A("data-edit-gift")) { editGift(find("gifts", A("data-edit-gift"))); return; }
    if (t.hasAttribute("data-add-gift")) { editGift(null); return; }

    // ---- budget ----
    if (A("data-edit-budget")) { editBudget(find("budget", A("data-edit-budget"))); return; }
    if (t.hasAttribute("data-add-budget")) { editBudget(null); return; }
    if (A("data-toggle-fin")) { const f = find("finAdmin", A("data-toggle-fin")); f.done = !f.done; Store.commit(); return; }
    if (t.hasAttribute("data-rate")) { editRate(); return; }

    // ---- self drive ----
    if (t.hasAttribute("data-selfdrive")) { editSelfDrive(); return; }

    // ---- contacts ----
    if (A("data-edit-contact")) { editContact(find("contacts", A("data-edit-contact"))); return; }

    // ---- documents & emails ----
    if (A("data-edit-doc")) { editDoc(find("documents", A("data-edit-doc"))); return; }
    if (A("data-edit-email")) { editEmail(find("emails", A("data-edit-email"))); return; }
    if (A("data-copy-email")) {
      const em = find("emails", A("data-copy-email"));
      const text = `To: ${em.to || em.toHint || ""}\nSubject: ${em.subject}\n\n${em.body}`;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast("Email copied")).catch(() => fallbackCopy(text));
      else fallbackCopy(text);
      return;
    }

    // ---- data ----
    if (t.hasAttribute("data-export")) { Store.exportJSON(); return; }
    if (t.hasAttribute("data-import")) { const f = $("#importFile"); f.onchange = () => f.files[0] && Store.importJSON(f.files[0]); f.click(); return; }
    if (t.hasAttribute("data-reset")) { Store.reset(); return; }
  });

  /* ---------- editors ---------- */
  function editTask(c) {
    const isNew = !c;
    openForm(isNew ? "Add task" : "Edit task",
      [{ key: "title", label: "Task", type: "text" },
       { key: "note", label: "Notes", type: "textarea" },
       { key: "cat", label: "Group", type: "select", options: ["Verify", "Pack", "Health", "Passport"] },
       { key: "priority", label: "Priority", type: "select", options: ["normal", "high"] }],
      c || { cat: "Pack", priority: "normal" },
      (v) => { if (isNew) { v.id = uid("c"); v.status = "open"; D().checklist.push(v); } else Object.assign(c, v); Store.commit(); },
      isNew ? null : () => { D().checklist = D().checklist.filter((x) => x !== c); Store.commit(); });
  }
  function editAlert(a) {
    openForm("Edit reminder",
      [{ key: "title", label: "Reminder", type: "text" }, { key: "due", label: "Due date", type: "date" }, { key: "note", label: "Note", type: "textarea" }],
      a, (v) => { Object.assign(a, v); Store.commit(); });
  }
  function socialFields() {
    return [{ key: "title", label: "Title", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "time", label: "Time", type: "text", placeholder: "evening / 19:00" },
      { key: "location", label: "Location", type: "text" },
      { key: "attendees", label: "Attendees", type: "text" },
      { key: "costINR", label: "Est. cost (₹)", type: "number" },
      { key: "hasDrinks", label: "Drinks expected?", type: "checkbox", placeholder: "Locks transport to Taxi" },
      { key: "transport", label: "Transport (override)", type: "select", options: ["", "Taxi", "Taxi (on-demand)", "Taxi (MPV/large, 4 pax + luggage)", "Full-day car + driver", "Self-drive"] },
      { key: "notes", label: "Notes", type: "textarea" }];
  }
  function editSocial(s) {
    const isNew = !s;
    openForm(isNew ? "Add social event" : "Edit event", socialFields(),
      s || { hasDrinks: false, time: "evening" },
      (v) => { if (isNew) { v.id = uid("s"); v.status = "open"; D().social.push(v); } else Object.assign(s, v); Store.commit(); },
      isNew ? null : () => { D().social = D().social.filter((x) => x !== s); Store.commit(); });
  }
  function editVisit(v0) {
    const isNew = !v0;
    openForm(isNew ? "Add household" : "Edit household",
      [{ key: "household", label: "Household / place", type: "text" },
       { key: "location", label: "Location", type: "text" },
       { key: "date", label: "Planned date", type: "date" },
       { key: "gifts", label: "Gift(s)", type: "text" },
       { key: "circuit", label: "Part of out-of-town circuit?", type: "checkbox", placeholder: "→ full-day car + driver" },
       { key: "transport", label: "Transport (override)", type: "select", options: ["", "Taxi (on-demand)", "Full-day car + driver", "Self-drive", "Taxi"] },
       { key: "notes", label: "Notes", type: "textarea" }],
      v0 || { circuit: false },
      (v) => { if (isNew) { v.id = uid("vis"); v.visited = false; D().visits.push(v); } else Object.assign(v0, v); Store.commit(); },
      isNew ? null : () => { D().visits = D().visits.filter((x) => x !== v0); Store.commit(); });
  }
  function editGift(g) {
    const isNew = !g;
    openForm(isNew ? "Add gift" : "Edit gift",
      [{ key: "item", label: "Gift", type: "text" },
       { key: "recipient", label: "Recipient / household", type: "text" },
       { key: "source", label: "Source", type: "select", options: ["Buy in UK", "Buy in India"] },
       { key: "budgetINR", label: "Budget (₹)", type: "number" }],
      g || { source: "Buy in UK", budgetINR: 0 },
      (v) => { if (isNew) { v.id = uid("g"); v.purchased = false; v.packed = false; D().gifts.push(v); } else Object.assign(g, v); Store.commit(); },
      isNew ? null : () => { D().gifts = D().gifts.filter((x) => x !== g); Store.commit(); });
  }
  function editBudget(b) {
    const isNew = !b;
    const cur = (b && b.currency) || "INR";
    openForm(isNew ? "Add budget line" : "Edit budget line",
      [{ key: "cat", label: "Category", type: "text" },
       { key: "currency", label: "Currency", type: "select", options: ["INR", "GBP"] },
       { key: cur === "GBP" ? "plannedGBP" : "plannedINR", label: "Planned (" + cur + ")", type: "number" },
       { key: cur === "GBP" ? "actualGBP" : "actualINR", label: "Actual (" + cur + ")", type: "number" },
       { key: "paid", label: "Paid?", type: "checkbox" },
       { key: "note", label: "Note", type: "textarea" }],
      b || { currency: "INR", plannedINR: 0, actualINR: 0, paid: false },
      (v) => { if (isNew) { v.id = uid("b"); D().budget.push(v); } else Object.assign(b, v); Store.commit(); },
      isNew ? null : () => { D().budget = D().budget.filter((x) => x !== b); Store.commit(); });
  }
  function editRate() {
    openForm("Exchange rate",
      [{ key: "exchangeRateGBPtoINR", label: "₹ per £1", type: "number" }],
      { exchangeRateGBPtoINR: D().meta.exchangeRateGBPtoINR },
      (v) => { D().meta.exchangeRateGBPtoINR = Number(v.exchangeRateGBPtoINR) || D().meta.exchangeRateGBPtoINR; D().meta.exchangeRateIsPlaceholder = false; Store.commit(); });
  }
  function editSelfDrive() {
    const sd = D().selfDrive;
    openForm("Self-drive rental",
      [{ key: "optedIn", label: "Opt in to a self-drive block?", type: "checkbox", placeholder: "Drinks days still force Taxi" },
       { key: "startDate", label: "Start", type: "date" },
       { key: "endDate", label: "End", type: "date" },
       { key: "dayRateINR", label: "Day rate (₹)", type: "number" }],
      sd, (v) => { Object.assign(sd, v); Store.commit(); });
  }
  function editContact(c) {
    openForm("Edit contact",
      [{ key: "label", label: "Label", type: "text" }, { key: "value", label: "Number / URL", type: "text" }],
      c, (v) => { Object.assign(c, v); Store.commit(); });
  }
  function normalizeDriveLink(s) {
    s = (s || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;                       // already a URL
    if (/^[A-Za-z0-9_-]{15,}$/.test(s))                          // a bare Drive file ID
      return "https://drive.google.com/file/d/" + s + "/view?usp=sharing";
    return s;
  }
  function editDoc(doc) {
    openForm("Document link",
      [{ key: "label", label: "Label", type: "text" },
       { key: "driveLink", label: "Google Drive link or file ID", type: "text", placeholder: "paste Share→Copy link, or the file ID" },
       { key: "localLink", label: "Local path (fallback)", type: "text" }],
      doc, (v) => { v.driveLink = normalizeDriveLink(v.driveLink); Object.assign(doc, v); Store.commit(); });
  }
  function editEmail(em) {
    openForm("Edit draft email",
      [{ key: "to", label: "To", type: "text", placeholder: em.toHint || "" },
       { key: "subject", label: "Subject", type: "text" },
       { key: "body", label: "Body", type: "textarea" }],
      em, (v) => { Object.assign(em, v); Store.commit(); });
  }

  // tiny toast + clipboard fallback
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:var(--maroon-dark);color:#fff;padding:9px 16px;border-radius:20px;font-size:.85rem;z-index:80;box-shadow:0 2px 10px rgba(0,0,0,.25)";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1600);
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Email copied"); } catch (e) { alert(text); }
    ta.remove();
  }

  // "Add" from an itinerary day → choose social or visit, prefilled with that date.
  function addOnDay(iso) {
    openForm("Add to " + E.fmtLong(iso),
      [{ key: "kind", label: "What kind?", type: "select", options: ["Social event", "Relative/temple visit"] },
       { key: "title", label: "Title", type: "text" }],
      { kind: "Social event" },
      (v) => {
        if (v.kind === "Social event") { D().social.push({ id: uid("s"), title: v.title || "New event", date: iso, time: "evening", location: "", attendees: "", status: "open", costINR: 0, hasDrinks: false }); }
        else { D().visits.push({ id: uid("vis"), household: v.title || "New visit", location: "", date: iso, gifts: "", transport: "Taxi (on-demand)", visited: false, circuit: false, notes: "" }); }
        Store.commit();
      });
  }

  /* ---------- boot ---------- */
  if (!App.visitsTab) App.visitsTab = "visits";
  render();

  // ask the browser to keep our localStorage durable (reduces eviction, esp. iOS)
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted().then((p) => { if (!p) navigator.storage.persist().catch(() => {}); }).catch(() => {});
  }

  // service worker (enhancement; only over http/https)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
})();
