/* ============================================================================
 * Engine — dates, weekdays, anchor-conflict detection, transport rule engine.
 * Pure helpers on window.Engine. No DOM here.
 * ==========================================================================*/
(function () {
  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DAYFULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Parse 'YYYY-MM-DD' as a LOCAL date (avoids UTC off-by-one).
  function parse(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function weekdayIdx(iso) { const dt = parse(iso); return dt ? dt.getDay() : -1; }
  function weekday(iso) { const i = weekdayIdx(iso); return i < 0 ? "" : DAY[i]; }
  function weekdayFull(iso) { const i = weekdayIdx(iso); return i < 0 ? "" : DAYFULL[i]; }
  function isSunday(iso) { return weekdayIdx(iso) === 0; }
  function isWeekday(iso) { const i = weekdayIdx(iso); return i >= 1 && i <= 5; }
  function fmt(iso) { const dt = parse(iso); return dt ? `${DAY[dt.getDay()]} ${dt.getDate()} ${MON[dt.getMonth()]}` : ""; }
  function fmtLong(iso) { const dt = parse(iso); return dt ? `${DAYFULL[dt.getDay()]} ${dt.getDate()} ${MON[dt.getMonth()]} ${dt.getFullYear()}` : ""; }

  function daysBetween(aIso, bIso) {
    const a = parse(aIso), b = parse(bIso);
    return Math.round((b - a) / 86400000);
  }
  function eachDay(startIso, endIso) {
    const out = [];
    const start = parse(startIso), end = parse(endIso);
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      out.push(iso);
    }
    return out;
  }
  function addDays(iso, n) {
    const dt = parse(iso); dt.setDate(dt.getDate() + n);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }
  function todayIso() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  /* ---- Transport rule engine (Step 5) ----
   * Returns { mode, locked, reason } — `locked` true means user may not pick self-drive. */
  function recommendTransport(ev, data) {
    if (ev.hasDrinks) {
      return { mode: "Taxi", locked: true, reason: "Drinks expected — no driving after drinks. Self-drive locked out." };
    }
    if (ev.type === "airport" || ev.kind === "airport") {
      return { mode: "Taxi (MPV/large, 4 pax + luggage)", locked: true, reason: "Airport transfer with luggage." };
    }
    if (ev.circuit) {
      return { mode: "Full-day car + driver", locked: false,
        reason: "Out-of-town multi-stop circuit (rural, 65km+, elderly + young child) — better with a driver." };
    }
    // Local TVM, daytime, no drinks → on-demand taxi; self-drive only if a rental block is active.
    const rentalActive = isSelfDriveActive(ev.date, data);
    return { mode: "Taxi (on-demand)", locked: !rentalActive,
      reason: rentalActive
        ? "Local daytime, no drinks — on-demand taxi, or self-drive (rental active this date)."
        : "Local daytime, no drinks — on-demand taxi. (Self-drive available only on active rental days.)" };
  }

  function isSelfDriveActive(iso, data) {
    const sd = data && data.selfDrive;
    if (!sd || !sd.optedIn || !iso) return false;
    return iso >= sd.startDate && iso <= sd.endDate;
  }

  /* ---- Anchor / conflict detection ---- */
  function anchorsOn(iso, data) {
    return (data.anchors || []).filter((a) => a.date === iso);
  }
  // Warnings for a scheduled social/visit event.
  function eventWarnings(ev, data) {
    const w = [];
    if (!ev.date) return w;
    const sameDayAnchors = anchorsOn(ev.date, data);
    if (sameDayAnchors.length) {
      w.push({ level: "warn", text: `Clashes with a fixed anchor: ${sameDayAnchors.map((a) => a.title).join("; ")}` });
    }
    // School-friends time-critical window
    if (ev.timeCritical) {
      if (ev.date > "2026-07-31") {
        w.push({ level: "danger", text: "After 31 Jul — classmates may already have left TVM." });
      }
    }
    // Football: prefer Sundays
    if (ev.id === "s_football" && ev.date && !isSunday(ev.date)) {
      w.push({ level: "warn", text: "Not a Sunday — football is a Sunday game." });
    }
    if (ev.id === "s_football" && ev.date === "2026-08-16") {
      w.push({ level: "warn", text: "16 Aug is pre-departure / baggage day." });
    }
    // Office colleagues: weekday only
    if (ev.id === "s_office" && ev.date && !isWeekday(ev.date)) {
      w.push({ level: "warn", text: "Technopark colleagues — pick a weekday." });
    }
    return w;
  }

  /* ---- Derived alerts (computed against saved data + today) ---- */
  function computeFlags(data) {
    const flags = [];
    // School-friends unscheduled by 31 Jul
    const school = (data.social || []).find((s) => s.id === "s_school");
    if (school && !school.date) {
      flags.push({ level: "danger", text: "School-friends catch-up is UNSCHEDULED — must be slotted 29–31 Jul (they leave TVM end of July)." });
    } else if (school && school.date > "2026-07-31") {
      flags.push({ level: "danger", text: "School-friends catch-up is set after 31 Jul — likely too late." });
    }
    // 5 Aug leave-Kollur
    flags.push({ level: "warn", text: "5 Aug: leave Kollur by 10:00 (10:30 latest) for the 14:30 Kasaragod train — ~160 km / 3.5–4h." });
    // FCDO open
    const fcdo = (data.checklist || []).find((c) => c.id === "v_fcdo");
    if (fcdo && fcdo.status !== "done") {
      flags.push({ level: "danger", text: "OPEN: get WRITTEN insurer confirmation that airside DXB transit is covered under the FCDO advisory." });
    }
    return flags;
  }

  window.Engine = {
    DAY, DAYFULL, MON, parse, weekday, weekdayFull, weekdayIdx, isSunday, isWeekday,
    fmt, fmtLong, daysBetween, eachDay, addDays, todayIso,
    recommendTransport, isSelfDriveActive, anchorsOn, eventWarnings, computeFlags,
  };
})();
