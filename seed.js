/* ============================================================================
 * Kerala 2026 Trip Companion — SEED DATA (PUBLIC / SCRUBBED)
 *
 * This is the version that is safe to commit and host publicly. All personal
 * data (names, ages, PAN, PNRs, ticket/policy/reservation numbers, phones,
 * document links) has been replaced with placeholders.
 *
 * Your REAL trip data lives only in a private backup (my-trip-data.private.json,
 * git-ignored). On your own device, open the app once and use
 *   Docs → Data → Import backup
 * to load it; from then on it lives in this device's localStorage only and is
 * never sent to the server. Structure here is identical to the real data so the
 * app renders the same once you import.
 * ==========================================================================*/
window.SEED_VERSION = 2;

window.SEED = {
  meta: {
    title: "Kerala 2026",
    subtitle: "Family Trip Companion",
    bookingRef: "",
    tripStart: "2026-07-27",
    tripEnd: "2026-08-17",
    groupSize: 13,
    ukTravellers: 4,
    exchangeRateGBPtoINR: 112,
    exchangeRateIsPlaceholder: true,
  },

  /* ---- The 13 travellers (names/ages come from your private import) -------- */
  passengers: [
    { id: "p_dilip",   name: "Lead traveller", age: 0, gender: "M", group: "UK", role: "Lead", notes: "" },
    { id: "p_lekshmy", name: "Traveller 2",    age: 0, gender: "F", group: "UK", role: "Spouse" },
    { id: "p_tejas",   name: "Traveller 3",    age: 0, gender: "M", group: "UK", role: "Child" },
    { id: "p_saanvi",  name: "Traveller 4",    age: 0, gender: "F", group: "UK", role: "Child" },
    { id: "p_binoj",     name: "Relative 1", age: 0, gender: "M", group: "IN", role: "Relative" },
    { id: "p_leela",     name: "Relative 2", age: 0, gender: "F", group: "IN", role: "Elder" },
    { id: "p_sylaja",    name: "Relative 3", age: 0, gender: "F", group: "IN", role: "Elder" },
    { id: "p_lalitha",   name: "Relative 4", age: 0, gender: "F", group: "IN", role: "Elder" },
    { id: "p_renjith",   name: "Relative 5", age: 0, gender: "M", group: "IN", role: "Co-organiser" },
    { id: "p_divya",     name: "Relative 6", age: 0, gender: "F", group: "IN", role: "Relative" },
    { id: "p_sreedevi",  name: "Relative 7", age: 0, gender: "F", group: "IN", role: "Elder" },
    { id: "p_tanvi",     name: "Relative 8", age: 0, gender: "F", group: "IN", role: "Relative" },
    { id: "p_siddharth", name: "Relative 9", age: 0, gender: "M", group: "IN", role: "Relative" },
  ],

  /* ---- Flights (schedule is public; ticket numbers come from import) ------- */
  flights: [
    { id: "f_ek012", leg: 1, flight: "EK 012", from: "London Gatwick (LGW)", to: "Dubai (DXB)",
      depDate: "2026-07-27", depTime: "10:05", arrDate: "2026-07-27", arrTime: "20:00",
      checkInTime: "06:05", fromTerminal: "North Terminal", toTerminal: "Terminal 3",
      cabin: "Economy Flex", baggage: "30kg checked · 7kg cabin (55×38×22cm)" },
    { id: "f_ek522", leg: 2, flight: "EK 522", from: "Dubai (DXB)", to: "Thiruvananthapuram (TRV)",
      depDate: "2026-07-27", depTime: "21:25", arrDate: "2026-07-28", arrTime: "03:10",
      checkInTime: "18:25", fromTerminal: "Terminal 3", toTerminal: "Terminal 2",
      cabin: "Economy Flex", baggage: "30kg checked · 7kg cabin" },
    { id: "f_ek523", leg: 3, flight: "EK 523", from: "Thiruvananthapuram (TRV)", to: "Dubai (DXB)",
      depDate: "2026-08-17", depTime: "04:45", arrDate: "2026-08-17", arrTime: "07:15",
      checkInTime: "01:45", fromTerminal: "Terminal 2", toTerminal: "Terminal 3",
      cabin: "Economy Saver", baggage: "30kg checked · cabin 7kg AND ≤115cm linear (boarding India)" },
    { id: "f_ek029", leg: 4, flight: "EK 029", from: "Dubai (DXB)", to: "London Heathrow (LHR)",
      depDate: "2026-08-17", depTime: "09:40", arrDate: "2026-08-17", arrTime: "14:25",
      checkInTime: "06:40", fromTerminal: "Terminal 3", toTerminal: "Terminal 3",
      cabin: "Economy Saver", baggage: "30kg checked · cabin 7kg AND ≤115cm linear (boarding India)" },
  ],
  flightTickets: [
    { passenger: "p_dilip",   ticket: "", outSeats: "16K / 25K", totalGBP: 947.47 },
    { passenger: "p_lekshmy", ticket: "", outSeats: "16G / 25G", totalGBP: 947.47 },
    { passenger: "p_tejas",   ticket: "", outSeats: "16H / 25H", totalGBP: 845.47 },
    { passenger: "p_saanvi",  ticket: "", outSeats: "16J / 25J", totalGBP: 719.47 },
  ],
  flightRules: {
    changeFeesOutbound: "Flex (KHEESGB1): change USD 150 / cancel USD 225 (any time)",
    changeFeesReturn: "Saver (QHASPGB1): change USD 200 / cancel USD 300 · date change USD 25/pax",
    baggageCabinIndiaNote: "On the RETURN (boarding in India) cabin bag must be ≤115cm (L+W+H) as well as ≤7kg.",
    smartDelayURL: "https://csp.smartdelay.com/csp",
  },

  /* ---- Trains (schedule public; PNRs come from import) -------------------- */
  trains: [
    { id: "t_north", direction: "Northbound", train: "20632 / TVC MAQ Vande Bharat Exp",
      cls: "Chair Car (CC)", coach: "C10", date: "2026-08-02",
      from: "Trivandrum Cntl (TVC)", to: "Mangaluru Cntl (MAQ)",
      depTime: "16:05", arrDate: "2026-08-03", arrTime: "00:45",
      altBoarding: "Some board Ernakulam Jn (ERS) at 18:45",
      pnrs: [
        { pnr: "", board: "TVC 16:05", farINR: 6425.40,
          seats: [ { p: "p_dilip", s: "C10/20" }, { p: "p_leela", s: "C10/21" }, { p: "p_sylaja", s: "C10/22" }, { p: "p_tejas", s: "C10/23" } ] },
        { pnr: "", board: "TVC 16:05", farINR: 4824.95,
          seats: [ { p: "p_lekshmy", s: "C10/25" }, { p: "p_binoj", s: "C10/26" }, { p: "p_saanvi", s: "C10/27" } ] },
        { pnr: "", board: "ERS 18:45", farINR: 7256.30,
          seats: [ { p: "p_renjith", s: "C10/10" }, { p: "p_divya", s: "C10/11" }, { p: "p_sreedevi", s: "C10/12" }, { p: "p_tanvi", s: "C10/13" }, { p: "p_siddharth", s: "C10/14" }, { p: "p_lalitha", s: "C10/15" } ] },
      ] },
    { id: "t_south", direction: "Southbound", train: "20633 / TVC Vande Bharat",
      cls: "Chair Car (CC)", coach: "C7", date: "2026-08-05",
      from: "Kasaragod (KGQ)", to: "Trivandrum Cntl (TVC)",
      depTime: "14:30", arrDate: "2026-08-05", arrTime: "22:40",
      altBoarding: "Board Kasaragod (KGQ) 14:30 — leave Kollur by ~10:00",
      pnrs: [
        { pnr: "", board: "KGQ 14:30", farINR: 9266.30,
          seats: [ { p: "p_dilip", s: "C7/1 (window)" }, { p: "p_leela", s: "C7/2" }, { p: "p_lalitha", s: "C7/3" }, { p: "p_sylaja", s: "C7/4 (window)" }, { p: "p_saanvi", s: "C7/5 (window)" }, { p: "p_tejas", s: "C7/6" } ] },
        { pnr: "", board: "KGQ 14:30", farINR: 4644.95,
          seats: [ { p: "p_renjith", s: "C7/7" }, { p: "p_sreedevi", s: "C7/8" }, { p: "p_siddharth", s: "C7/9 (window)" } ] },
        { pnr: "", board: "KGQ 14:30", farINR: 6185.40,
          seats: [ { p: "p_binoj", s: "C7/16" }, { p: "p_lekshmy", s: "C7/17" }, { p: "p_divya", s: "C7/18" }, { p: "p_tanvi", s: "C7/19 (window)" } ] },
      ] },
  ],

  /* ---- Hotel (reservation no. & guest name come from import) -------------- */
  hotel: {
    name: "Hotel Mahalakshmi Residency",
    location: "Beside Sri Mookambika Temple, Kollur, Kundapur Tq, Udupi Dist – 576220",
    reservationNo: "",
    guestName: "",
    rooms: 5, roomType: "Premium", plan: "EP (room only)",
    checkIn: "2026-08-02", checkOut: "2026-08-05", nights: 3,
    tariffPerRoomPerDayINR: 4000, taxNote: "+ 12% GST (≈ ₹480/room/day)",
    paxOnVoucher: 10,
    phones: ["08254 258332", "08254 258333"],
    email: "reservation@mahalakshmiresidency.com",
    travelDesk: "Mahalakshmi Cabs (in-house)",
    note: "Check-in/out 12:00. 2 Aug paid intentionally so rooms are held for the ~3–4am walk-in on 3 Aug after the train.",
  },

  /* ---- Chandika Homa (ticket no. & devotee come from import) -------------- */
  homa: {
    name: "Chandika Homa",
    temple: "Sri Mookambika Temple, Car Street, Kolluru, Udupi – 576220",
    date: "2026-08-04", time: "08:30",
    ticketNo: "",
    amountINR: 15000, paid: true,
    devotees: [],
    dressCode: "Traditional only — Male: dhoti, shirt/kurta, pyjama/pant. Female: saree / half-saree / churidar with dupatta.",
    restrictionNote: "Ticket text (likely stale COVID-era) bars over-65s, under-10s and people with comorbidities. The group has four people 69–74 and a 6-year-old — confirm with the temple.",
  },

  /* ---- Insurance (policy no. comes from import) --------------------------- */
  insurance: {
    product: "Employee Benefit Travel Insurance (multi-trip leisure)",
    insurer: "Canopius Managing Agents Ltd (Lloyd's underwriters)",
    administrator: "Crispin Speers & Partners Ltd (CSP), FRN 311507",
    policyNo: "",
    coversWho: "The 4 UK travellers only — NOT the 9 India-based relatives.",
    geographical: "Worldwide OR European (must be Worldwide for India) — CONFIRM on the certificate.",
    assistanceProvider: "Cega (24h emergency assistance)",
    assistancePhone: "",
    fcdoExclusion: "No cover for travel to or within areas the FCDO advises against ‘all’ or ‘all but essential’ travel. UPDATE: the UAE all-but-essential warning was LIFTED on 18 Jun 2026 following the US–Iran ceasefire MoU — the Dubai-transit cover worry is largely eased, BUT it is reversible at short notice. Confirm Worldwide cover in writing and re-check the advisory before both the 27 Jul and 17 Aug legs.",
    pandemicNote: "Cancellation losses from an epidemic/pandemic are excluded, except a positive COVID-19 diagnosis within 14 days of travel.",
  },

  /* ---- Anchored itinerary events (fixed / locked) ------------------------- */
  anchors: [
    { id: "a_dep_lgw", date: "2026-07-27", time: "10:05", title: "Fly EK012 LGW → DXB", kind: "flight",
      detail: "Check-in 06:05 (LGW North T). Arrive DXB 20:00 (T3)." },
    { id: "a_dep_dxb", date: "2026-07-27", time: "21:25", title: "Fly EK522 DXB → TRV", kind: "flight",
      detail: "Dubai T3. Lands TRV 03:10 on 28 Jul (T2)." },
    { id: "a_arr_trv", date: "2026-07-28", time: "03:10", title: "Land Trivandrum (TRV)", kind: "flight",
      detail: "Airport pickup — taxi (MPV/large, 4 pax + luggage).", transport: "Taxi (MPV/large, 4 pax + luggage)" },
    { id: "a_ent",     date: "2026-07-29", time: "",      title: "ENT consultation", kind: "medical",
      detail: "Anchor appointment. Possible follow-up procedure (→ Budget · Medical)." },
    { id: "a_bank",    date: "2026-07-30", time: "",      title: "NRI bank / MF updates", kind: "admin",
      detail: "Financial admin task (not spend)." },
    { id: "a_ca",      date: "2026-07-31", time: "",      title: "CA — rental-income meeting", kind: "admin",
      detail: "Financial admin task. Also: SCHOOL-FRIENDS catch-up deadline (they leave TVM end of July)." },
    { id: "a_train_n", date: "2026-08-02", time: "16:05", title: "Train 20632 TVC → MAQ", kind: "train",
      detail: "Board TVC 16:05 (ERS group 18:45). Arrives MAQ 00:45 on 3 Aug. Coach C10." },
    { id: "a_hotel_in",date: "2026-08-02", time: "12:00", title: "Hotel check-in (Kollur)", kind: "hotel",
      detail: "Mahalakshmi Residency, 5 Premium rooms. 2 Aug paid so rooms are held for the ~3–4am walk-in on 3 Aug." },
    { id: "a_arr_maq", date: "2026-08-03", time: "00:45", title: "Arrive Mangaluru (MAQ) → Kollur", kind: "train",
      detail: "Drive MAQ → Kollur, walk into the held rooms ~3–4am. Mookambika darshan during the day." },
    { id: "a_homa",    date: "2026-08-04", time: "08:30", title: "Chandika Homa", kind: "temple",
      detail: "Sri Mookambika Temple. Traditional dress. Report together. (Ticket no. in your private import.)" },
    { id: "a_leave_kollur", date: "2026-08-05", time: "10:00", title: "Leave Kollur by 10:00", kind: "warning",
      detail: "Kollur → Kasaragod (KGQ) is ~160 km / 3.5–4h. The 14:30 train needs a 10:00 departure (10:30 latest)." },
    { id: "a_hotel_out",date: "2026-08-05", time: "12:00", title: "Hotel checkout (Kollur)", kind: "hotel",
      detail: "Checkout by 12:00." },
    { id: "a_train_s", date: "2026-08-05", time: "14:30", title: "Train 20633 KGQ → TVC", kind: "train",
      detail: "Board KGQ 14:30. Arrives TVC 22:40. Coach C7." },
    { id: "a_baggage", date: "2026-08-16", time: "",      title: "Baggage audit (pre-departure)", kind: "warning",
      detail: "Weigh everything: 30kg checked + cabin 7kg AND ≤115cm linear (boarding India). Buy nothing more." },
    { id: "a_drop_trv",date: "2026-08-17", time: "01:45", title: "Airport drop → TRV", kind: "flight",
      detail: "Leave for TRV airport ~01:45 — taxi (MPV/large).", transport: "Taxi (MPV/large, 4 pax + luggage)" },
    { id: "a_ret_523", date: "2026-08-17", time: "04:45", title: "Fly EK523 TRV → DXB", kind: "flight",
      detail: "Check-in 01:45 (TRV T2). Arrive DXB 07:15." },
    { id: "a_ret_029", date: "2026-08-17", time: "09:40", title: "Fly EK029 DXB → LHR", kind: "flight",
      detail: "Dubai T3. Lands London Heathrow 14:25 (T3)." },
  ],

  /* ---- Pre-trip checklist + OPEN verification tasks ----------------------- */
  checklist: [
    { id: "v_fcdo", cat: "Verify", priority: "high", status: "open",
      title: "Insurer confirmation: Worldwide cover + Dubai transit (post-advisory-lift)",
      note: "UPDATE: FCDO LIFTED the all-but-essential UAE warning on 18 Jun 2026, so the transit-cover worry is largely resolved — but it is reversible 'at short notice'. Get WRITTEN insurer confirmation that (a) cover is Worldwide for India and (b) cover (incl. Dubai airside transit) still holds if the UAE advisory is reinstated while you are mid-trip. Keep monitoring gov.uk/foreign-travel-advice/united-arab-emirates." },
    { id: "v_fcdo_monitor", cat: "Verify", priority: "high", status: "open",
      title: "Monitor FCDO UAE advisory before travel",
      note: "gov.uk/foreign-travel-advice/united-arab-emirates — re-check close to 27 Jul and 17 Aug." },
    { id: "v_homa_entry", cat: "Verify", priority: "high", status: "open",
      title: "Homa: can the other 12 enter on the sponsor ticket?",
      note: "Ticket names only ONE devotee. Confirm whether the other 12 can enter on the sponsor ticket or need separate darshan entries." },
    { id: "v_homa_age", cat: "Verify", priority: "high", status: "open",
      title: "Homa: elderly + young children permitted to attend?",
      note: "Ticket bars over-65s / under-10s / comorbidities (likely stale COVID text). Group has four people 69–74 + a 6-year-old. Confirm with the temple." },
    { id: "v_hotel_occ", cat: "Verify", priority: "high", status: "open",
      title: "Hotel: confirm 13 occupancy + extra bedding",
      note: "Voucher records 10 pax across 5 Premium rooms but the group is 13. Confirm 13 occupancy and extra mattresses." },
    { id: "v_geo", cat: "Verify", priority: "high", status: "open",
      title: "Insurance: confirm geographical cover = Worldwide",
      note: "India needs Worldwide (not European). Also note the policy covers only the 4 UK travellers." },
    { id: "v_airspace", cat: "Verify", priority: "high", status: "open",
      title: "Gulf airspace / ceasefire status before the 17 Aug return",
      note: "The US–Iran ceasefire MoU (signed 17 Jun 2026) runs ~60 days to ~16 Aug 2026 — the day before the Dubai-transit return. Region is calmer (UAE FCDO warning lifted 18 Jun) but 'could resume at short notice'. Re-check the UAE advisory + Emirates operations near 17 Aug, and know Emirates' rebooking/reroute policy. Return fares are Saver (date change ≈ USD 25/pax)." },
    { id: "v_passport", cat: "Verify", priority: "high", status: "open",
      title: "Re-issue kids' Indian passports in Trivandrum",
      note: "Both children's passports expire 27 Jul 2027 — eligible to re-issue from ~27 Jul 2026 (within 1 year) and far cheaper in India. Apply online at passportindia.gov.in on arrival, book the earliest PSK Trivandrum appointment, use TATKAL (dispatch 1–3 working days) so the new books arrive before the 17 Aug departure. Both parents attend + Annexure-D consent → usually NO police verification for minors. Old passport is returned cancelled — carry BOTH passports home (UK visa vignette is in the old one) and UPDATE the UKVI eVisa account with the new passport numbers before flying back." },
    { id: "c_attire", cat: "Pack", priority: "normal", status: "open", title: "Temple attire (Homa dress code)",
      note: "Male: dhoti + shirt/kurta. Female: saree / half-saree / churidar + dupatta. For all attending." },
    { id: "c_meds", cat: "Pack", priority: "normal", status: "open", title: "Medication with original labels/prescriptions",
      note: "Diabetic supplies for the two diabetic travellers. Keep meds in cabin bag." },
    { id: "c_adapters", cat: "Pack", priority: "normal", status: "open", title: "Plug adapters (UK → India type D/M)" },
    { id: "c_docs", cat: "Pack", priority: "normal", status: "open", title: "Physical document prints",
      note: "Print: e-tickets, all 6 train ERS, Homa ticket, hotel voucher, insurance certificate, passports/visas." },
    { id: "c_scale", cat: "Pack", priority: "normal", status: "open", title: "Portable baggage scale",
      note: "For the 16 Aug audit — 30kg checked + cabin 115cm linear on the India-boarding return." },
    { id: "c_ids", cat: "Pack", priority: "normal", status: "open", title: "Original photo ID for every train passenger",
      note: "IRCTC requires original ID (Aadhaar/passport/PAN/etc.) matching the ERS for all 13." },
    { id: "c_water", cat: "Health", priority: "normal", status: "open", title: "Monsoon health: safe water & food",
      note: "Peak SW monsoon = dengue, leptospirosis, hepatitis A, Shigella and a confirmed Nipah case active in Kerala in 2026. Bottled/boiled water only; hot freshly-cooked food; strict hand hygiene. Highest risk for the four elders, the youngest child and the two diabetic travellers." },
    { id: "c_mosquito", cat: "Health", priority: "normal", status: "open", title: "Mosquito repellent + dengue precautions",
      note: "DEET repellent, cover up at dawn/dusk, plug-in/coil at night. Dengue & chikungunya peak in the monsoon." },
    { id: "c_vax", cat: "Health", priority: "normal", status: "open", title: "Pre-travel vaccination check (4 UK travellers)",
      note: "Confirm Hepatitis A + typhoid (and routine boosters) before 27 Jul. Confirm the insurance includes medical evacuation — only the 4 UK travellers are covered, not the 9 India relatives." },
    { id: "pp1", cat: "Passport", priority: "high", status: "open", title: "1. Apply online — passportindia.gov.in",
      note: "Register, choose Re-issue → 'Validity expiring', fill ONE form per child, select TATKAL, pay. Do this in the first days (target ~28–29 Jul) so it clears before 17 Aug." },
    { id: "pp2", cat: "Passport", priority: "high", status: "open", title: "2. Book PSK Trivandrum appointment",
      note: "Book the earliest slot at PSK/RPO Thiruvananthapuram. Print the application receipt and the Annexure-D consent (see 'Emails to send' → Annexure-D), signed by both parents." },
    { id: "pp3", cat: "Passport", priority: "high", status: "open", title: "3. Attend PSK — both parents + originals",
      note: "Bring: both children's ORIGINAL passports; both parents' passports + self-attested copies; address proof (parent's Aadhaar/passport showing the India address); signed Annexure-D. Photos/biometrics taken on-site. Both parents present → usually no police verification for minors. Birth certificates NOT needed (children born before Oct 2023)." },
    { id: "pp4", cat: "Passport", priority: "normal", status: "open", title: "4. Receive new passports (Speed Post)",
      note: "Dispatched 1–3 working days after the appointment to the India address — NOT collected. Track on Passport Seva. FALLBACK: arrange a relative at that address to receive them (and courier to the UK) in case they arrive after 17 Aug." },
    { id: "pp5", cat: "Passport", priority: "high", status: "open", title: "5. Update UKVI eVisa + carry old passports home",
      note: "CRITICAL before flying 17 Aug: log into each child's UKVI account and update the passport number — the eVisa does NOT auto-transfer and airline/border checks match it. Carry BOTH passports (the old cancelled one holds the UK visa vignette)." },
  ],

  /* ---- Social & activities (TVM) ----------------------------------------- */
  social: [
    { id: "s_school", title: "School classmates catch-up", date: "", time: "evening",
      location: "TVM (placeholder)", attendees: "", status: "open", costINR: 0, hasDrinks: true,
      timeCritical: true, window: "29–31 Jul", notes: "TIME-CRITICAL: classmates leave TVM ~end of July. Must slot an evening 29–31 Jul. Flag fires if unscheduled by 31 Jul." },
    { id: "s_college", title: "College friends catch-up", date: "", time: "evening",
      location: "TVM (placeholder)", attendees: "", status: "open", costINR: 0, hasDrinks: true,
      window: "6–15 Aug", notes: "Flexible." },
    { id: "s_office", title: "Office colleagues @ Technopark", date: "", time: "evening",
      location: "Technopark, TVM", attendees: "", status: "open", costINR: 0, hasDrinks: true,
      window: "6–14 Aug (weekday)", notes: "Flexible weekday." },
    { id: "s_football", title: "Sunday football", date: "", time: "morning",
      location: "TVM (placeholder)", attendees: "", status: "open", costINR: 0, hasDrinks: false,
      window: "Sundays — best 9 Aug; 16 Aug is pre-departure/baggage day", notes: "Recurring; pick a Sunday." },
    { id: "s_cricket", title: "Cricket turf game", date: "", time: "evening",
      location: "Turf venue (placeholder — needs booking)", attendees: "", status: "open", costINR: 0, hasDrinks: true,
      window: "one evening", notes: "Needs a turf booking → Budget · Social events." },
    { id: "s_gettogether", title: "Friends get-together", date: "2026-08-11", time: "evening",
      location: "Premium TVM venue (placeholder)", attendees: "", status: "open", costINR: 0, hasDrinks: true,
      window: "currently 11 Aug", notes: "Premium venue — confirm and cost." },
  ],

  /* ---- Temple & relatives visits + gifts ---------------------------------- */
  visits: [
    { id: "vis_kottarakkara", household: "Kottarakkara temple + nearby relative", location: "Kottarakkara",
      date: "", gifts: "", transport: "Full-day car + driver", visited: false, circuit: true,
      notes: "Day trip: temple + the relative's house near it. Candidate stop on the out-of-town circuit." },
    { id: "vis_mathoor1", household: "Mathoor — household 1 (placeholder)", location: "Mathoor",
      date: "", gifts: "", transport: "Full-day car + driver", visited: false, circuit: true,
      notes: "One of 3 Mathoor households. CONFIRM Mathoor's distance from TVM to decide one day-trip or two." },
    { id: "vis_mathoor2", household: "Mathoor — household 2 (placeholder)", location: "Mathoor",
      date: "", gifts: "", transport: "Full-day car + driver", visited: false, circuit: true, notes: "" },
    { id: "vis_mathoor3", household: "Mathoor — household 3 (placeholder)", location: "Mathoor",
      date: "", gifts: "", transport: "Full-day car + driver", visited: false, circuit: true, notes: "" },
    { id: "vis_tvm1", household: "TVM relatives — household (placeholder)", location: "Trivandrum",
      date: "", gifts: "", transport: "Taxi (on-demand)", visited: false, circuit: false,
      notes: "Add more TVM households as needed." },
  ],

  /* ---- Gifts planner ------------------------------------------------------ */
  gifts: [
    { id: "g1", item: "(add a gift)", recipient: "", source: "Buy in UK", budgetINR: 0, purchased: false, packed: false },
  ],

  /* ---- Budget (planned vs actual; INR unless noted) ----------------------- */
  budget: [
    { id: "b_flights", cat: "Flights", plannedGBP: 3459.88, actualGBP: 3459.88, currency: "GBP", paid: true,
      note: "4 Emirates tickets (947.47 + 947.47 + 845.47 + 719.47)." },
    { id: "b_trains", cat: "Trains", plannedINR: 38603.30, actualINR: 38603.30, currency: "INR", paid: true,
      note: "6 PNRs: north 18,506.65 + south 20,096.65." },
    { id: "b_hotel", cat: "Hotel Kollur", plannedINR: 67200, actualINR: 0, currency: "INR", paid: false,
      note: "5 rooms × 3 nights × ₹4000 + 12% GST. Confirm on checkout." },
    { id: "b_homa", cat: "Homa", plannedINR: 15000, actualINR: 15000, currency: "INR", paid: true, note: "Chandika Homa (paid)." },
    { id: "b_taxi", cat: "Local transport — on-demand taxis", plannedINR: 0, actualINR: 0, currency: "INR", paid: false, note: "Short local TVM hops." },
    { id: "b_driver", cat: "Local transport — full-day car + driver", plannedINR: 0, actualINR: 0, currency: "INR", paid: false, note: "Out-of-town circuit (Kottarakkara/Mathoor)." },
    { id: "b_selfdrive", cat: "Local transport — self-drive rental (optional)", plannedINR: 0, actualINR: 0, currency: "INR", paid: false, note: "NOT recommended by default — see Transport card." },
    { id: "b_tempo", cat: "Tempo Traveller (north loop)", plannedINR: 0, actualINR: 0, currency: "INR", paid: false, note: "MAQ ↔ Kollur and around, if hired." },
    { id: "b_social", cat: "Social events (venue/turf/football)", plannedINR: 0, actualINR: 0, currency: "INR", paid: false },
    { id: "b_dining", cat: "Dining", plannedINR: 0, actualINR: 0, currency: "INR", paid: false },
    { id: "b_gifts", cat: "Gifts", plannedINR: 0, actualINR: 0, currency: "INR", paid: false, note: "Rolls up from the Gifts planner." },
    { id: "b_shopping", cat: "UK-return shopping", plannedINR: 0, actualINR: 0, currency: "INR", paid: false },
    { id: "b_medical", cat: "Medical (ENT + possible procedure)", plannedINR: 0, actualINR: 0, currency: "INR", paid: false },
    { id: "b_misc", cat: "Misc", plannedINR: 0, actualINR: 0, currency: "INR", paid: false },
  ],

  /* ---- Financial admin tasks (not spend) ---------------------------------- */
  finAdmin: [
    { id: "fa_bank", date: "2026-07-30", title: "NRI bank / MF updates", done: false },
    { id: "fa_ca", date: "2026-07-31", title: "CA meeting — rental income", done: false },
    { id: "fa_ais", date: "", title: "Discovery: download AIS + Form 26AS (both PANs)", done: false },
    { id: "fa_mfcentral", date: "", title: "Discovery: MF Central consolidated statement (by PAN)", done: false },
    { id: "fa_cas", date: "", title: "Discovery: NSDL/CDSL demat CAS (shares/bonds)", done: false },
    { id: "fa_credit", date: "", title: "Discovery: credit report — loans & cards (both)", done: false },
  ],

  /* ---- NRI status — account conversion tracker ---------------------------- */
  /* Starter rows carry the NRI action per asset TYPE. Edit/duplicate them into
     one row per real account once the discovery reports are in. */
  nriAccounts: [
    { id: "nri_sav", holder: "", kind: "Savings/Current", institution: "", ref: "", status: "To review", done: false,
      action: "Redesignate to NRO (or close); open NRE for UK income. Mandatory under FEMA.", notes: "" },
    { id: "nri_fd", holder: "", kind: "FD", institution: "", ref: "", status: "To review", done: false,
      action: "Convert resident FD → NRO FD (rate usually honoured to maturity), or break & reinvest as NRE/FCNR.", notes: "" },
    { id: "nri_mf", holder: "", kind: "Mutual Fund", institution: "", ref: "", status: "To review", done: false,
      action: "Keep units; update KYC to NRI + redo FATCA; switch bank mandate to NRO/NRE. Use MF Central to list all.", notes: "" },
    { id: "nri_dmt", holder: "", kind: "Shares/Demat", institution: "", ref: "", status: "To review", done: false,
      action: "Close resident demat; open NRO (+NRE/PIS) demat; transfer holdings; update PAN status.", notes: "" },
    { id: "nri_bond", holder: "", kind: "Bond/SGB", institution: "", ref: "", status: "To review", done: false,
      action: "Move to the NRI demat; SGBs can be held to maturity.", notes: "" },
    { id: "nri_loan", holder: "", kind: "Loan", institution: "", ref: "", status: "To review", done: false,
      action: "Inform lender; usually continues, serviced from NRO.", notes: "" },
    { id: "nri_card", holder: "", kind: "Credit Card", institution: "", ref: "", status: "To review", done: false,
      action: "Inform issuer; continue or convert to NRI/secured variant.", notes: "" },
    { id: "nri_ppf", holder: "", kind: "PPF", institution: "", ref: "", status: "To review", done: false,
      action: "Runs to maturity on existing terms — no extension/new deposits; cannot open a new one.", notes: "" },
    { id: "nri_post", holder: "", kind: "Post Office", institution: "", ref: "", status: "To review", done: false,
      action: "Mostly not permitted for NRIs — POSB usually closed; NSC/KVP/SSY/MIS held to maturity then closed. Confirm scheme-by-scheme.", notes: "" },
  ],

  /* ---- Alerts / reminders ------------------------------------------------- */
  alerts: [
    { id: "al_sd1", title: "SmartDelay: register EK012 (LGW→DXB)", due: "2026-07-26", kind: "smartdelay",
      note: "Register ≥24h before departure at csp.smartdelay.com/csp using your policy number." },
    { id: "al_sd2", title: "SmartDelay: register EK522 (DXB→TRV)", due: "2026-07-26", kind: "smartdelay",
      note: "Each flight registered separately, ≥24h before." },
    { id: "al_sd3", title: "SmartDelay: register EK523 (TRV→DXB)", due: "2026-08-16", kind: "smartdelay",
      note: "≥24h before the 17 Aug return." },
    { id: "al_sd4", title: "SmartDelay: register EK029 (DXB→LHR)", due: "2026-08-16", kind: "smartdelay",
      note: "≥24h before the 17 Aug return." },
    { id: "al_fcdo", title: "FCDO/insurance check (DXB transit)", due: "2026-07-20", kind: "verify",
      note: "UAE all-but-essential warning LIFTED 18 Jun 2026 (reversible). Get written confirmation of Worldwide cover + what happens if the advisory is reinstated mid-trip; keep monitoring." },
    { id: "al_passport", title: "Apply: kids' passport re-issue (Trivandrum, Tatkal)", due: "2026-07-29", kind: "admin",
      note: "Apply online + book the earliest PSK Trivandrum appointment in the first days of the trip; use Tatkal so the books dispatch before 17 Aug. Both parents + old passports + Annexure-D. Then update the UKVI eVisa with the new numbers." },
    { id: "al_monsoon", title: "Monsoon/landslide risk — Kollur leg (2–5 Aug)", due: "2026-08-01", kind: "warning",
      note: "Peak SW monsoon; IMD red alerts seen for Kasaragod/coastal Karnataka & the Western Ghats. Build extra road-time buffer MAQ↔Kollur and Kollur→Kasaragod, check IMD/road status, keep meds in day bags." },
    { id: "al_airspace", title: "Gulf airspace / Dubai transit check before return", due: "2026-08-15", kind: "verify",
      note: "Ceasefire deadline ~16 Aug, the day before the 17 Aug Dubai-transit return. Re-check the UAE advisory + Emirates operations; know rebooking options." },
    { id: "al_school", title: "School-friends catch-up scheduled?", due: "2026-07-31", kind: "social",
      note: "Must be slotted 29–31 Jul before classmates leave TVM." },
    { id: "al_kollur", title: "Leave Kollur by 10:00", due: "2026-08-05", kind: "warning",
      note: "~160 km / 3.5–4h to Kasaragod for the 14:30 train." },
    { id: "al_baggage", title: "Baggage audit (30kg + 115cm cabin)", due: "2026-08-16", kind: "warning",
      note: "India-boarding cabin must be ≤115cm linear as well as ≤7kg." },
  ],

  /* ---- Key contacts (personal numbers come from import) -------------------- */
  contacts: [
    { id: "ct_irctc", label: "IRCTC customer care", value: "14646 / 08044647999" },
    { id: "ct_rail", label: "Railway enquiry", value: "139" },
    { id: "ct_hotel", label: "Hotel Mahalakshmi Residency", value: "08254 258332" },
    { id: "ct_cega", label: "Cega 24h assistance (insurance)", value: "" },
    { id: "ct_csp", label: "Crispin Speers (insurance admin)", value: "" },
    { id: "ct_smartdelay", label: "SmartDelay registration", value: "https://csp.smartdelay.com/csp" },
    { id: "ct_renjith", label: "Co-organiser", value: "" },
  ],

  /* ---- Source documents (paste your own links in the app, see README) ----- */
  documents: [
    { id: "d_ek1", group: "Flights", label: "Emirates ticket — Traveller 1", localLink: "", driveLink: "" },
    { id: "d_ek2", group: "Flights", label: "Emirates ticket — Traveller 2", localLink: "", driveLink: "" },
    { id: "d_ek3", group: "Flights", label: "Emirates ticket — Traveller 3", localLink: "", driveLink: "" },
    { id: "d_ek4", group: "Flights", label: "Emirates ticket — Traveller 4", localLink: "", driveLink: "" },
    { id: "d_ekfare", group: "Flights", label: "Emirates fare conditions", localLink: "", driveLink: "" },
    { id: "d_tn1", group: "Trains", label: "ERS 20632 — group A", localLink: "", driveLink: "" },
    { id: "d_tn2", group: "Trains", label: "ERS 20632 — group B", localLink: "", driveLink: "" },
    { id: "d_tn3", group: "Trains", label: "ERS 20632 — group C", localLink: "", driveLink: "" },
    { id: "d_ts1", group: "Trains", label: "ERS 20633 — group A", localLink: "", driveLink: "" },
    { id: "d_ts2", group: "Trains", label: "ERS 20633 — group B", localLink: "", driveLink: "" },
    { id: "d_ts3", group: "Trains", label: "ERS 20633 — group C", localLink: "", driveLink: "" },
    { id: "d_hotel", group: "Stay & temple", label: "Hotel Mahalakshmi voucher", localLink: "", driveLink: "" },
    { id: "d_homa", group: "Stay & temple", label: "Chandika Homa ticket", localLink: "", driveLink: "" },
    { id: "d_ins", group: "Insurance", label: "Travel policy wording 2026", localLink: "", driveLink: "" },
    { id: "d_ipid", group: "Insurance", label: "Insurance product summary (IPID)", localLink: "", driveLink: "" },
    { id: "d_sd", group: "Insurance", label: "SmartDelay leaflet", localLink: "", driveLink: "" },
  ],

  /* ---- Draft emails (real numbers come from import) ----------------------- */
  emails: [
    { id: "em_cover", title: "Insurance — DXB transit cover check", to: "",
      toHint: "Crispin Speers / Canopius (your insurer's claims/servicing email)",
      subject: "Travel policy [policy no.] — written confirmation of Worldwide cover & Dubai (DXB) transit for 27 Jul / 17 Aug 2026 travel",
      body:
"Dear Crispin Speers / Canopius team,\n\n" +
"Policy number: [your policy number] (Employee Benefit Travel Insurance).\n\n" +
"We are four UK-resident travellers flying London–Dubai–Trivandrum and back on 27 July and 17 August 2026 with Emirates (EK012/EK522 outbound, EK523/EK029 return). Both directions transit airside at Dubai International (DXB); we do not leave the airport or enter the UAE.\n\n" +
"We note the policy excludes cover for travel \"to or within areas to which the FCDO advise against all or all but essential travel,\" and that the FCDO lifted its all-but-essential warning for the UAE on 18 June 2026, though the regional situation remains volatile and could change at short notice.\n\n" +
"Please confirm IN WRITING:\n" +
"1. That our geographical cover is Worldwide (we are travelling to India); and\n" +
"2. That cover (including the airside Dubai transit) is valid for this trip, AND the position if the FCDO were to reinstate an all-but-essential advisory for the UAE while we are mid-trip.\n\n" +
"We would be grateful for written confirmation to keep on file before we travel.\n\n" +
"Kind regards,\n[Your name]" },

    { id: "em_homa", title: "Temple — Homa group entry & ages", to: "",
      toHint: "Sri Mookambika Temple help desk (booking / devaswom email)",
      subject: "Chandika Homa 04 Aug 2026 (ticket [ticket no.]) — group entry & age confirmation",
      body:
"Respected Sir/Madam,\n\n" +
"We have a Chandika Homa booking on 04 August 2026 at 08:30 AM — ticket no. [your ticket no.].\n\n" +
"The ticket names one devotee, but our family group attending is 13 people. Could you please confirm:\n\n" +
"1. Whether all 13 may attend/enter the Homa on this sponsor ticket, or whether separate darshan/entry tickets are required for the others — and if so, how to book them; and\n" +
"2. The ticket lists restrictions on persons above 65, children below 10, and persons with comorbidities. Our group includes four elders aged 69–74 and a 6-year-old child — please confirm they are permitted to attend, as we believe these may be older COVID-era instructions.\n\n" +
"We will all wear traditional dress and report together as instructed.\n\n" +
"Thank you for your guidance.\n\n" +
"Kind regards,\n[Your name] · [your phone]" },

    { id: "em_hotel", title: "Hotel — 13 guests + extra bedding", to: "reservation@mahalakshmiresidency.com",
      toHint: "reservation@mahalakshmiresidency.com (from the voucher)",
      subject: "Reservation [res no.] (2–5 Aug 2026) — 13 guests across 5 Premium rooms + extra bedding",
      body:
"Dear Mahalakshmi Residency team,\n\n" +
"Reservation no. [your reservation no.], 5 Premium rooms, check-in 02 August 2026, checkout 05 August 2026.\n\n" +
"Our group is 13 people travelling together (the voucher records 10). Could you please confirm:\n\n" +
"1. That all 13 guests can be accommodated across the 5 Premium rooms; and\n" +
"2. Extra mattresses/bedding for the additional guests, with any extra-person charge.\n\n" +
"We arrive late on the night of 02/03 August (after the train to Mangaluru), so we would be grateful if the rooms are held for an early-hours check-in as booked.\n\n" +
"Thank you.\n\n" +
"Kind regards,\n[Your name] · [your phone]" },

    { id: "em_annexd", title: "Annexure-D — parental consent (print & sign)", to: "",
      toHint: "NOT an email — tap Copy, paste into a doc, print, and BOTH parents sign for the PSK appointment (one per child)",
      subject: "Annexure 'D' — Declaration of Parent/Guardian for issue of passport to a minor",
      body:
"ANNEXURE 'D'\n" +
"DECLARATION OF PARENT/GUARDIAN FOR ISSUE OF PASSPORT TO A MINOR (both parents consenting)\n\n" +
"We, the parents of the minor named below, give our consent to the issue of a passport to our minor child.\n\n" +
"Minor's name: ____________________  (fill one form per child)\n" +
"Date of birth: ____________________\n" +
"Existing passport no.: ____________________\n\n" +
"Father's name: ____________________\n" +
"Father's passport no.: ____________________\n" +
"Mother's name: ____________________\n" +
"Mother's passport no.: ____________________\n\n" +
"Residential address: ____________________\n\n" +
"We declare that the particulars given above are true and that we have no objection to the issue of a passport to our above-named minor child.\n\n" +
"Signature of Father: ____________________   Date: __________\n" +
"Signature of Mother: ____________________   Date: __________\n" +
"Place: ____________________\n\n" +
"Note: Use the official Annexure 'D' from passportindia.gov.in if one is provided — this is a prompt sheet to prepare it. Print one per child; both parents sign (in front of the passport officer if asked)." },
  ],

  /* ---- Self-drive rental state (default: not recommended) ------------------ */
  selfDrive: { optedIn: false, startDate: "2026-08-12", endDate: "2026-08-15", dayRateINR: 0 },
};
