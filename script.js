// ==========================================================
// EcoTrack End-to-End Walkthrough & Resident Home Logic
// Initial Entry: 01 / Welcome -> 02 / Address -> 03 / Bins -> 04 / Reminders -> 05 / Resident Home
// Screens: welcome | address | bins | reminders | home | schedule | recycle
// ==========================================================

const screens = {
  welcome: document.getElementById("screenWelcome"),
  address: document.getElementById("screenAddress"),
  bins: document.getElementById("screenBins"),
  reminders: document.getElementById("screenReminders"),
  home: document.getElementById("screenHome"),
  schedule: document.getElementById("screenSchedule"),
  recycle: document.getElementById("screenRecycle")
};

function showScreen(screenKey) {
  Object.keys(screens).forEach(key => {
    if (screens[key]) {
      screens[key].style.display = key === screenKey ? "block" : "none";
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================================
// SCREEN 01: Welcome -> 02 Address
// ==========================================================
const welcomeStartBtn = document.getElementById("welcomeStartBtn");
if (welcomeStartBtn) {
  welcomeStartBtn.addEventListener("click", () => showScreen("address"));
}

const navResidentPortalBtn = document.getElementById("navResidentPortalBtn");
if (navResidentPortalBtn) {
  navResidentPortalBtn.addEventListener("click", () => showScreen("home"));
}

const navCheckScheduleBtn = document.getElementById("navCheckScheduleBtn");
if (navCheckScheduleBtn) {
  navCheckScheduleBtn.addEventListener("click", () => {
    const heroInput = document.getElementById("heroAddressInput");
    if (heroInput) heroInput.focus();
  });
}

const heroSearchBtn = document.getElementById("heroSearchBtn");
if (heroSearchBtn) {
  heroSearchBtn.addEventListener("click", () => {
    showScreen("schedule");
  });
}

const showcaseLaunchBtn = document.getElementById("showcaseLaunchBtn");
if (showcaseLaunchBtn) {
  showcaseLaunchBtn.addEventListener("click", () => showScreen("home"));
}

const ctaLaunchPortalBtn = document.getElementById("ctaLaunchPortalBtn");
if (ctaLaunchPortalBtn) {
  ctaLaunchPortalBtn.addEventListener("click", () => showScreen("home"));
}

const ctaCheckAddressBtn = document.getElementById("ctaCheckAddressBtn");
if (ctaCheckAddressBtn) {
  ctaCheckAddressBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const heroInput = document.getElementById("heroAddressInput");
    if (heroInput) heroInput.focus();
  });
}

// Hero suggestion chips
document.querySelectorAll(".hero-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".hero-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const addr = chip.getAttribute("data-address");
    const heroInput = document.getElementById("heroAddressInput");
    if (heroInput) heroInput.value = addr;
    const previewAddr = document.getElementById("previewAddressText");
    if (previewAddr) previewAddr.textContent = addr;
  });
});

// Calendar ICS generator
function downloadCalendarIcs(eventName, desc) {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EcoTrack//Waste Management System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "SUMMARY:" + eventName,
    "DESCRIPTION:" + desc,
    "DTSTART;VALUE=DATE:20260925",
    "DTEND;VALUE=DATE:20260926",
    "LOCATION:12 Greenview Ave, Riverton",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT12H",
    "DESCRIPTION:EcoTrack Reminder: Put bins out tonight",
    "ACTION:DISPLAY",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "EcoTrack-Kerbside-Collection.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const heroDownloadIcsBtn = document.getElementById("heroDownloadIcsBtn");
if (heroDownloadIcsBtn) {
  heroDownloadIcsBtn.addEventListener("click", () => {
    downloadCalendarIcs("Kerbside Collection: General Waste + Recycling", "EcoTrack kerbside collection. Put General (Red) and Recycling (Yellow) bins out before 6:00 AM.");
  });
}

const heroViewFullScheduleBtn = document.getElementById("heroViewFullScheduleBtn");
if (heroViewFullScheduleBtn) {
  heroViewFullScheduleBtn.addEventListener("click", () => showScreen("schedule"));
}

const downloadIcsBtn = document.getElementById("downloadIcsBtn");
if (downloadIcsBtn) {
  downloadIcsBtn.addEventListener("click", () => {
    downloadCalendarIcs("Kerbside Collection: General Waste + Recycling", "EcoTrack kerbside collection. Put General (Red) and Recycling (Yellow) bins out before 6:00 AM.");
  });
}

// Waste Guide directory on landing page
const landingWasteItems = [
  { name: "Pizza box", cat: "yellow", badge: "Recycling (Yellow)", badgeClass: "badge-yellow", rule: "Clean lid in Yellow bin. Greasy or food-soaked base belongs in Green FOGO or Red bin.", tip: "Remove crusts and greaseproof paper liner." },
  { name: "Plastic bottles & jugs", cat: "yellow", badge: "Recycling (Yellow)", badgeClass: "badge-yellow", rule: "Empty liquids, quick rinse. Keep plastic caps screwed on.", tip: "Eligible for 10c refund through Return and Earn." },
  { name: "Cardboard boxes", cat: "yellow", badge: "Recycling (Yellow)", badgeClass: "badge-yellow", rule: "Flatten completely to save truck space. Remove excessive plastic tape.", tip: "Keep dry before collection morning." },
  { name: "Glass jars & drink bottles", cat: "yellow", badge: "Recycling (Yellow)", badgeClass: "badge-yellow", rule: "Empty and rinse. Metal jar lids can stay on or go in loose.", tip: "Broken glassware goes in Red bin, wrapped safely." },
  { name: "Aluminium cans & foil", cat: "yellow", badge: "Recycling (Yellow)", badgeClass: "badge-yellow", rule: "Empty cans completely. Scrunch clean foil into a golf ball size.", tip: "Small foil shreds fall through sorting screens." },
  { name: "Food scraps & fruit peels", cat: "green", badge: "Organics & FOGO (Green)", badgeClass: "badge-green", rule: "All fruit, vegetable, meat and cooked scraps go into your green organics bin.", tip: "Use certified compostable caddy liners only." },
  { name: "Garden clippings & leaves", cat: "green", badge: "Organics & FOGO (Green)", badgeClass: "badge-green", rule: "Place loose in green bin: lawn clippings, branches up to 10cm diameter.", tip: "No plastic pots or treated building timber." },
  { name: "Soft plastics & plastic bags", cat: "red", badge: "General Waste (Red)", badgeClass: "badge-red", rule: "Bread bags, frozen food bags and cling wrap belong in Red lid bin.", tip: "Never put soft plastics in yellow bin — they jam sorting machines." },
  { name: "Household batteries", cat: "depot", badge: "Special Depot Drop-off", badgeClass: "badge-depot", rule: "NEVER put batteries in household bins. Major fire risk in trucks.", tip: "Drop off free at B-cycle bins at Coles, Woolworths, or Aldi." },
  { name: "Disposable coffee cups", cat: "red", badge: "Separation Required", badgeClass: "badge-red", rule: "Plastic lid in Yellow bin. Paper cup with polyethylene lining in Red bin.", tip: "Bring a reusable keep-cup to save landfill." },
  { name: "Aerosol spray cans", cat: "yellow", badge: "Recycling (Yellow)", badgeClass: "badge-yellow", rule: "Must be completely empty of pressure and propellant.", tip: "Partially full cans belong at hazardous chemical drop-off." },
  { name: "Nappies & sanitary items", cat: "red", badge: "General Waste (Red)", badgeClass: "badge-red", rule: "Wrap securely and place into red-lid general waste.", tip: "Never in recycling or green bins." }
];

function renderLandingWasteGrid(items) {
  const grid = document.getElementById("wasteCardsGrid");
  if (!grid) return;
  grid.innerHTML = items.map(i => `
    <div class="waste-item-card">
      <div class="wic-top">
        <span class="wic-badge ${i.badgeClass}">${i.badge}</span>
      </div>
      <h3 class="wic-name">${i.name}</h3>
      <p class="wic-rule">${i.rule}</p>
      <div class="wic-tip"><strong>Tip:</strong> ${i.tip}</div>
    </div>
  `).join("");
}
renderLandingWasteGrid(landingWasteItems);

const wasteSearchInput = document.getElementById("wasteSearchInput");
if (wasteSearchInput) {
  wasteSearchInput.addEventListener("input", () => {
    const q = wasteSearchInput.value.trim().toLowerCase();
    const filtered = landingWasteItems.filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.rule.toLowerCase().includes(q) || 
      i.tip.toLowerCase().includes(q)
    );
    renderLandingWasteGrid(filtered);
  });
}

document.querySelectorAll("#wasteFilterPills .wg-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("#wasteFilterPills .wg-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    const cat = pill.getAttribute("data-category");
    if (cat === "all") {
      renderLandingWasteGrid(landingWasteItems);
    } else {
      const filtered = landingWasteItems.filter(i => i.cat === cat);
      renderLandingWasteGrid(filtered);
    }
  });
});

// FAQ Accordion
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const wasActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
    if (!wasActive) {
      item.classList.add("active");
    }
  });
});

// ==========================================================
// SCREEN NAVIGATION & BOTTOM TABS
// ==========================================================

// Schedule Screen Triggers
const homeViewScheduleBtn = document.getElementById("homeViewScheduleBtn");
if (homeViewScheduleBtn) {
  homeViewScheduleBtn.addEventListener("click", () => showScreen("schedule"));
}

const scheduleBackToHomeBtn = document.getElementById("scheduleBackToHomeBtn");
if (scheduleBackToHomeBtn) {
  scheduleBackToHomeBtn.addEventListener("click", () => showScreen("home"));
}

const scheduleNavHomeBtn = document.getElementById("scheduleNavHomeBtn");
if (scheduleNavHomeBtn) {
  scheduleNavHomeBtn.addEventListener("click", () => showScreen("home"));
}

const scheduleBottomTabHome = document.getElementById("scheduleBottomTabHome");
if (scheduleBottomTabHome) {
  scheduleBottomTabHome.addEventListener("click", () => showScreen("home"));
}

// Home Screen Nav & Tabs
const homeNavHomeBtn = document.getElementById("homeNavHomeBtn");
if (homeNavHomeBtn) {
  homeNavHomeBtn.addEventListener("click", () => showScreen("home"));
}
const homeNavScheduleBtn = document.getElementById("homeNavScheduleBtn");
if (homeNavScheduleBtn) {
  homeNavScheduleBtn.addEventListener("click", () => showScreen("schedule"));
}
const homeNavRecycleBtn = document.getElementById("homeNavRecycleBtn");
if (homeNavRecycleBtn) {
  homeNavRecycleBtn.addEventListener("click", () => {
    showScreen("recycle");
    switchRecycleSubview("viewRecycleHub");
  });
}
const homeNavOverviewBtn = document.getElementById("homeNavOverviewBtn");
if (homeNavOverviewBtn) {
  homeNavOverviewBtn.addEventListener("click", () => showScreen("welcome"));
}

const homeBottomTabHome = document.getElementById("homeBottomTabHome");
if (homeBottomTabHome) {
  homeBottomTabHome.addEventListener("click", () => showScreen("home"));
}
const homeBottomTabSchedule = document.getElementById("homeBottomTabSchedule");
if (homeBottomTabSchedule) {
  homeBottomTabSchedule.addEventListener("click", () => showScreen("schedule"));
}
const homeBottomTabRecycle = document.getElementById("homeBottomTabRecycle");
if (homeBottomTabRecycle) {
  homeBottomTabRecycle.addEventListener("click", () => {
    showScreen("recycle");
    switchRecycleSubview("viewRecycleHub");
  });
}
const homeBottomTabAccount = document.getElementById("homeBottomTabAccount");
if (homeBottomTabAccount) {
  homeBottomTabAccount.addEventListener("click", () => {
    alert("EcoTrack Account: Logged in as John Smith (12 Greenview Ave).");
  });
}

// Schedule Screen Tabs
const scheduleNavRecycleBtn = document.getElementById("scheduleNavRecycleBtn");
if (scheduleNavRecycleBtn) {
  scheduleNavRecycleBtn.addEventListener("click", () => {
    showScreen("recycle");
    switchRecycleSubview("viewRecycleHub");
  });
}
const scheduleNavOverviewBtn = document.getElementById("scheduleNavOverviewBtn");
if (scheduleNavOverviewBtn) {
  scheduleNavOverviewBtn.addEventListener("click", () => showScreen("welcome"));
}

const scheduleBottomTabRecycle = document.getElementById("scheduleBottomTabRecycle");
if (scheduleBottomTabRecycle) {
  scheduleBottomTabRecycle.addEventListener("click", () => {
    showScreen("recycle");
    switchRecycleSubview("viewRecycleHub");
  });
}
const scheduleBottomTabAccount = document.getElementById("scheduleBottomTabAccount");
if (scheduleBottomTabAccount) {
  scheduleBottomTabAccount.addEventListener("click", () => {
    alert("EcoTrack Account: Logged in as John Smith (12 Greenview Ave).");
  });
}

// Schedule View Switcher
const tabUpcoming = document.getElementById("tabUpcoming");
const tabMonthView = document.getElementById("tabMonthView");
const panelUpcoming = document.getElementById("panelUpcoming");
const panelMonthView = document.getElementById("panelMonthView");
const scheduleSubtitle = document.getElementById("scheduleSubtitle");

function switchScheduleTab(view) {
  const isUpcoming = view === "upcoming";
  if (tabUpcoming) tabUpcoming.classList.toggle("active", isUpcoming);
  if (tabMonthView) tabMonthView.classList.toggle("active", !isUpcoming);
  if (tabUpcoming) tabUpcoming.setAttribute("aria-selected", String(isUpcoming));
  if (tabMonthView) tabMonthView.setAttribute("aria-selected", String(!isUpcoming));
  if (panelUpcoming) panelUpcoming.style.display = isUpcoming ? "block" : "none";
  if (panelMonthView) panelMonthView.style.display = isUpcoming ? "none" : "block";
  if (scheduleSubtitle) {
    scheduleSubtitle.textContent = isUpcoming ? "Upcoming collections for your address" : "September 2026";
  }
}

if (tabUpcoming) tabUpcoming.addEventListener("click", () => switchScheduleTab("upcoming"));
if (tabMonthView) tabMonthView.addEventListener("click", () => switchScheduleTab("month"));

// ==========================================================
// SCREEN 02: Address -> 03 Bins
// ==========================================================
const backToWelcomeBtn = document.getElementById("backToWelcomeBtn");
if (backToWelcomeBtn) {
  backToWelcomeBtn.addEventListener("click", () => showScreen("welcome"));
}

const homeAddressLabel = document.getElementById("homeAddressLabel");
const addressSearchInput = document.getElementById("addressSearchInput");

document.querySelectorAll(".suggestion-card").forEach(card => {
  card.addEventListener("click", () => {
    const chosen = card.getAttribute("data-addr");
    if (homeAddressLabel) homeAddressLabel.textContent = chosen.split(",")[0];
    if (addressSearchInput) addressSearchInput.value = chosen;
    showScreen("bins");
  });
});

const useLocationBtn = document.getElementById("useLocationBtn");
if (useLocationBtn) {
  useLocationBtn.addEventListener("click", () => {
    if (homeAddressLabel) homeAddressLabel.textContent = "12 Greenview Ave";
    showScreen("bins");
  });
}

// ==========================================================
// SCREEN 03: Confirm Bins -> 04 Reminders
// ==========================================================
const backToAddressBtn = document.getElementById("backToAddressBtn");
if (backToAddressBtn) {
  backToAddressBtn.addEventListener("click", () => showScreen("address"));
}

const confirmBinsBtn = document.getElementById("confirmBinsBtn");
if (confirmBinsBtn) {
  confirmBinsBtn.addEventListener("click", () => showScreen("reminders"));
}

const reportMismatchBtn = document.getElementById("reportMismatchBtn");
if (reportMismatchBtn) {
  reportMismatchBtn.addEventListener("click", () => {
    alert("Feedback noted: We will verify council bin assignments for your address.");
  });
}

// ==========================================================
// SCREEN 04: Enable Reminders -> 05 Resident Home
// ==========================================================
const backToBinsBtn = document.getElementById("backToBinsBtn");
if (backToBinsBtn) {
  backToBinsBtn.addEventListener("click", () => showScreen("bins"));
}

const optNightBefore = document.getElementById("optNightBefore");
const optMorningOf = document.getElementById("optMorningOf");

if (optNightBefore && optMorningOf) {
  [optNightBefore, optMorningOf].forEach(opt => {
    opt.addEventListener("click", () => {
      [optNightBefore, optMorningOf].forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
}

const finishSetupBtn = document.getElementById("finishSetupBtn");
if (finishSetupBtn) {
  finishSetupBtn.addEventListener("click", () => showScreen("home"));
}

// Change address button in resident home
const homeChangeAddrBtn = document.getElementById("homeChangeAddrBtn");
if (homeChangeAddrBtn) {
  homeChangeAddrBtn.addEventListener("click", () => showScreen("address"));
}

const homeBrandLink = document.getElementById("homeBrandLink");
if (homeBrandLink) {
  homeBrandLink.addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("welcome");
  });
}

const scheduleBrandLink = document.getElementById("scheduleBrandLink");
if (scheduleBrandLink) {
  scheduleBrandLink.addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("welcome");
  });
}

// Side buttons in home
const sideBulkyBtn = document.getElementById("sideBulkyBtn");
if (sideBulkyBtn) {
  sideBulkyBtn.addEventListener("click", () => {
    alert("Bulky pickup booking: Subject to council availability (Riverton Area).");
  });
}

const sideCentresBtn = document.getElementById("sideCentresBtn");
if (sideCentresBtn) {
  sideCentresBtn.addEventListener("click", () => {
    alert("Riverton Resource Recovery Centre: 45 Quarry Rd (Open Sat–Wed 8am–4pm).");
  });
}

const homeReminderToggle = document.getElementById("homeReminderToggle");
if (homeReminderToggle) {
  homeReminderToggle.addEventListener("change", () => {
    localStorage.setItem("ecotrack_reminder_active", homeReminderToggle.checked);
  });
}

// Quick search in home
const homeRecycleSearch = document.getElementById("homeRecycleSearch");
const homeInstantResults = document.getElementById("homeInstantResults");
if (homeRecycleSearch && homeInstantResults) {
  homeRecycleSearch.addEventListener("focus", () => {
    showScreen("recycle");
    switchRecycleSubview("viewRecycleHub");
    const rhSearch = document.getElementById("recycleHubSearchInput");
    if (rhSearch) rhSearch.focus();
  });
}

// ==========================================================
// RECYCLE SYSTEM (Matches User Uploaded Screenshots)
// Subviews: viewRecycleHub, viewItemDetail, viewAllBins, viewBinDetail, viewBinItemsList, viewLearn
// ==========================================================

const recycleSubviews = {
  hub: document.getElementById("viewRecycleHub"),
  itemDetail: document.getElementById("viewItemDetail"),
  allBins: document.getElementById("viewAllBins"),
  binDetail: document.getElementById("viewBinDetail"),
  binItemsList: document.getElementById("viewBinItemsList"),
  learn: document.getElementById("viewLearn")
};

let subviewHistory = ["viewRecycleHub"];

function switchRecycleSubview(viewId, pushHistory = true) {
  Object.keys(recycleSubviews).forEach(key => {
    const el = recycleSubviews[key];
    if (el) {
      if (el.id === viewId) {
        el.style.display = "flex";
        el.classList.add("active");
      } else {
        el.style.display = "none";
        el.classList.remove("active");
      }
    }
  });

  if (pushHistory && (subviewHistory.length === 0 || subviewHistory[subviewHistory.length - 1] !== viewId)) {
    subviewHistory.push(viewId);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function popRecycleSubview() {
  if (subviewHistory.length > 1) {
    subviewHistory.pop();
    const prev = subviewHistory[subviewHistory.length - 1];
    switchRecycleSubview(prev, false);
  } else {
    switchRecycleSubview("viewRecycleHub", false);
  }
}

// Recycle Bottom Tabs
const recycleBottomTabHome = document.getElementById("recycleBottomTabHome");
if (recycleBottomTabHome) {
  recycleBottomTabHome.addEventListener("click", () => showScreen("home"));
}
const recycleBottomTabSchedule = document.getElementById("recycleBottomTabSchedule");
if (recycleBottomTabSchedule) {
  recycleBottomTabSchedule.addEventListener("click", () => showScreen("schedule"));
}
const recycleBottomTabRecycle = document.getElementById("recycleBottomTabRecycle");
if (recycleBottomTabRecycle) {
  recycleBottomTabRecycle.addEventListener("click", () => {
    showScreen("recycle");
    switchRecycleSubview("viewRecycleHub");
  });
}
const recycleBottomTabAccount = document.getElementById("recycleBottomTabAccount");
if (recycleBottomTabAccount) {
  recycleBottomTabAccount.addEventListener("click", () => {
    alert("EcoTrack Account: Logged in as John Smith (12 Greenview Ave).");
  });
}

const recycleBrandLink = document.getElementById("recycleBrandLink");
if (recycleBrandLink) {
  recycleBrandLink.addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("home");
  });
}

function getHdWheelieBinSvg(binType) {
  let lid0 = "#FDE047", lid1 = "#EAB308", lid2 = "#CA8A04", handle = "#A16207";
  let badge = `
    <!-- Mobius Loop Recycling Emblem -->
    <g fill="#E2E8F0" opacity="0.85">
      <path d="M60 75 L66 85 H54 Z"/>
      <path d="M50 97 L56 87 L46 87 Z"/>
      <path d="M70 97 L75 87 L65 87 Z"/>
      <circle cx="60" cy="93" r="8" fill="none" stroke="#E2E8F0" stroke-width="2.5" stroke-dasharray="8 4" opacity="0.9"/>
    </g>
  `;
  let alt = "Yellow lid recycling bin";

  if (binType === "green" || binType === "organics") {
    lid0 = "#4ADE80"; lid1 = "#16A34A"; lid2 = "#15803D"; handle = "#14532D";
    badge = `
      <!-- Organics Leaf Emblem -->
      <g fill="#86EFAC" opacity="0.9">
        <path d="M60 83 C52 83 48 91 48 99 C56 99 68 97 70 87 C70 83 66 83 60 83 Z"/>
        <path d="M50 99 C56 93 62 89 70 87" stroke="#14532D" stroke-width="2" stroke-linecap="round"/>
      </g>
    `;
    alt = "Green lid organics bin";
  } else if (binType === "red" || binType === "general") {
    lid0 = "#F87171"; lid1 = "#DC2626"; lid2 = "#B91C1C"; handle = "#7F1D1D";
    badge = `
      <!-- General Waste Emblem -->
      <g opacity="0.85">
        <circle cx="60" cy="93" r="9" fill="none" stroke="#FCA5A5" stroke-width="2.5"/>
        <line x1="53" y1="86" x2="67" y2="100" stroke="#FCA5A5" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    `;
    alt = "Red lid general waste bin";
  } else if (binType === "grey" || binType === "dropoff") {
    lid0 = "#94A3B8"; lid1 = "#475569"; lid2 = "#334155"; handle = "#1E293B";
    badge = `
      <!-- Local Drop-off Pin Emblem -->
      <g>
        <path d="M60 81 C55 81 51 85 51 90 C51 96 60 104 60 104 C60 104 69 96 69 90 C69 85 65 81 60 81 Z" fill="#60A5FA"/>
        <circle cx="60" cy="89" r="2.8" fill="#1E3A8A"/>
      </g>
    `;
    alt = "Drop-off special items bin";
  }

  const uid = Math.random().toString(36).substring(2, 8);
  const b_id = "bGrad_" + uid;
  const l_id = "lGrad_" + uid;

  return `
    <svg class="hd-wheelie-bin" viewBox="0 0 120 160" aria-label="${alt}" role="img">
      <defs>
        <linearGradient id="${b_id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2D3748"/>
          <stop offset="25%" stop-color="#3A475A"/>
          <stop offset="75%" stop-color="#3A475A"/>
          <stop offset="100%" stop-color="#1F2937"/>
        </linearGradient>
        <linearGradient id="${l_id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${lid0}"/>
          <stop offset="50%" stop-color="${lid1}"/>
          <stop offset="100%" stop-color="${lid2}"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="154" rx="46" ry="6" fill="#000" opacity="0.16"/>
      <circle cx="26" cy="142" r="13" fill="#1E293B"/>
      <circle cx="26" cy="142" r="8" fill="#64748B"/>
      <circle cx="26" cy="142" r="3" fill="#0F172A"/>
      <circle cx="94" cy="142" r="13" fill="#1E293B"/>
      <circle cx="94" cy="142" r="8" fill="#64748B"/>
      <circle cx="94" cy="142" r="3" fill="#0F172A"/>
      <rect x="26" y="140" width="68" height="4" fill="#334155"/>
      <path d="M 28 38 L 92 38 L 84 140 C 84 144 80 146 76 146 L 44 146 C 40 146 36 144 36 140 Z" fill="url(#${b_id})"/>
      <line x1="33" y1="54" x2="87" y2="54" stroke="#1F2937" stroke-width="1.5" opacity="0.55"/>
      <line x1="35" y1="80" x2="85" y2="80" stroke="#1F2937" stroke-width="1.5" opacity="0.55"/>
      <line x1="37" y1="110" x2="83" y2="110" stroke="#1F2937" stroke-width="1.5" opacity="0.55"/>
      <rect x="42" y="44" width="36" height="5" rx="2" fill="#1A202C"/>
      ${badge}
      <rect x="24" y="32" width="72" height="7" rx="2" fill="#1F2937"/>
      <path d="M 18 24 L 102 24 C 104 24 105 26 104 28 L 100 34 C 99 35 98 35 96 35 L 24 35 C 22 35 21 35 20 34 L 16 28 C 15 26 16 24 18 24 Z" fill="url(#${l_id})"/>
      <path d="M 22 24 C 22 17 36 15 60 15 C 84 15 98 17 98 24 Z" fill="url(#${l_id})"/>
      <rect x="44" y="13" width="32" height="4" rx="2" fill="${handle}"/>
    </svg>
  `;
}

const recycleNavHomeBtn = document.getElementById("recycleNavHomeBtn");
if (recycleNavHomeBtn) {
  recycleNavHomeBtn.addEventListener("click", () => showScreen("home"));
}


// ==========================================================
// RECYCLE ITEMS DATASET & RENDERERS
// ==========================================================

const recycleItemsDB = {
  "plastic-bottle": {
    name: "Plastic bottle",
    cat: "plastic",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Follow the steps below.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Drink bottles, water bottles and similar plastic containers.",
    steps: [
      "Empty the bottle (no liquid).",
      "Keep the lid on (unless your council asks to remove it).",
      "No need to crush - a quick rinse is fine.",
      "Put it in loose, not inside a plastic bag."
    ],
    refundNotice: "Eligible drink containers can also be returned for a 10c refund through Return and Earn.",
    videoTitle: "How to prepare plastic bottles for recycling",
    videoDur: "0:45",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="24" y="8" width="16" height="8" rx="2" fill="#3B82F6"/><path d="M20 18C20 16 24 16 24 16H40C40 16 44 16 44 18L46 36C46 48 42 56 32 56C22 56 18 48 18 36L20 18Z" fill="#93C5FD" fill-opacity="0.5" stroke="#3B82F6" stroke-width="2"/><path d="M22 28H42M21 38H43" stroke="#60A5FA" stroke-width="1.5" stroke-dasharray="2 2"/></svg>`,
    similar: [
      { key: "plastic-bottle", name: "Soft drink bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "cartons", name: "Milk bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/><path d="M10 12h16v6H10z" fill="#93C5FD"/></svg>` },
      { key: "plastic-tubs", name: "Plastic food container", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M8 12h20l-3 14H11z" fill="#CBD5E1"/><rect x="7" y="10" width="22" height="3" rx="1" fill="#64748B"/></svg>` }
    ]
  },
  "plastic-tubs": {
    name: "Plastic tubs and containers",
    cat: "plastic",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Rinse away food residue before disposal.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Yoghurt tubs, takeaway containers, margarine tubs (clean and empty).",
    steps: [
      "Scrape out any food residue.",
      "Give it a quick rinse with cold water.",
      "Lids can stay on if made of hard plastic.",
      "Place into bin loose, never enclosed in a shopping bag."
    ],
    refundNotice: null,
    videoTitle: "Properly recycling food containers",
    videoDur: "0:40",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="12" y="18" width="40" height="6" rx="2" fill="#64748B"/><path d="M14 24H50L44 54H20L14 24Z" fill="#CBD5E1" stroke="#475569" stroke-width="2"/></svg>`,
    similar: [
      { key: "plastic-bottle", name: "Plastic bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "hard-plastic", name: "Shampoo bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="12" y="10" width="12" height="20" rx="3" fill="#60A5FA"/></svg>` },
      { key: "cartons", name: "Yoghurt carton", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/></svg>` }
    ]
  },
  "cartons": {
    name: "Food and drink cartons",
    cat: "paper",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Milk, juice and soup cartons are recyclable.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Milk, juice, custard and similar liquid paperboard cartons.",
    steps: [
      "Pour out all liquid completely.",
      "Flatten carton to save room in your recycling bin.",
      "Plastic spout caps can stay attached.",
      "Drop into recycling bin loose."
    ],
    refundNotice: "Eligible 100ml–3L juice and flavoured milk cartons qualify for 10c return.",
    videoTitle: "Carton recycling & recovery guide",
    videoDur: "0:45",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><path d="M20 20L32 10L44 20V56H20V20Z" fill="#F1F5F9" stroke="#64748B" stroke-width="2"/><path d="M20 20H44V32H20V20Z" fill="#93C5FD" fill-opacity="0.4"/></svg>`,
    similar: [
      { key: "paper-cardboard", name: "Cereal box", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="10" y="8" width="16" height="22" rx="2" fill="#FDE047"/></svg>` },
      { key: "plastic-bottle", name: "Milk bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "aluminium-cans", name: "Aluminium can", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="11" y="8" width="14" height="20" rx="3" fill="#94A3B8"/></svg>` }
    ]
  },
  "paper-cardboard": {
    name: "Paper and cardboard",
    cat: "paper",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Clean and dry paper and cardboard belong in recycling.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Boxes, packaging, newspapers, magazines, office paper.",
    steps: [
      "Flatten all cardboard boxes completely.",
      "Keep dry and clean from grease or oil.",
      "Remove plastic packaging, bubble wrap and polystyrene foam inserts.",
      "Place into bin loose."
    ],
    refundNotice: null,
    videoTitle: "How cardboard is sorted & remade",
    videoDur: "0:50",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><path d="M12 24L32 14L52 24L32 34L12 24Z" fill="#FDE047" stroke="#CA8A04" stroke-width="2"/><path d="M12 24V44L32 54V34L12 24Z" fill="#EAB308" stroke="#CA8A04" stroke-width="2"/><path d="M52 24V44L32 54V34L52 24Z" fill="#CA8A04" stroke="#A16207" stroke-width="2"/></svg>`,
    similar: [
      { key: "cartons", name: "Milk carton", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/></svg>` },
      { key: "pizza-box", name: "Pizza box", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#FBBF24"/></svg>` },
      { key: "clean-foil", name: "Foil tray", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#CBD5E1"/></svg>` }
    ]
  },
  "glass-bottles": {
    name: "Glass bottles and jars",
    cat: "glass",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "100% recyclable infinitely with zero loss in quality.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Wine bottles, beer bottles, pasta sauce jars, jam jars.",
    steps: [
      "Empty contents completely.",
      "Quick rinse to remove residue.",
      "Metal lids and caps can stay on.",
      "Do NOT put drinking glasses, Pyrex or ceramics into recycling."
    ],
    refundNotice: "Glass beer, cider and soft drink bottles are eligible for 10c Return and Earn.",
    videoTitle: "Glass recycling & circular economy",
    videoDur: "0:45",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="28" y="8" width="8" height="8" rx="1" fill="#15803D"/><path d="M26 16H38L42 30V56H22V30L26 16Z" fill="#86EFAC" fill-opacity="0.4" stroke="#15803D" stroke-width="2"/></svg>`,
    similar: [
      { key: "plastic-bottle", name: "Plastic bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "aluminium-cans", name: "Aluminium can", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="11" y="8" width="14" height="20" rx="3" fill="#94A3B8"/></svg>` },
      { key: "clean-foil", name: "Foil tray", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#CBD5E1"/></svg>` }
    ]
  },
  "aluminium-cans": {
    name: "Aluminium cans and tins",
    cat: "metal",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Infinite recyclable metal with major energy savings.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Soft drink cans, canned food tins, pet food tins.",
    steps: [
      "Empty completely and give a quick rinse.",
      "Drop tuna/soup can lids inside the can so edges are safe.",
      "No need to crush drink cans.",
      "Drop into yellow bin loose."
    ],
    refundNotice: "All aluminium beverage cans qualify for a 10c refund at collection points.",
    videoTitle: "Metal recycling process explained",
    videoDur: "0:40",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="18" y="12" width="28" height="40" rx="6" fill="#94A3B8" stroke="#475569" stroke-width="2"/><line x1="18" y1="20" x2="46" y2="20" stroke="#64748B" stroke-width="1.5"/><line x1="18" y1="44" x2="46" y2="44" stroke="#64748B" stroke-width="1.5"/></svg>`,
    similar: [
      { key: "clean-foil", name: "Aluminium foil", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#CBD5E1"/></svg>` },
      { key: "aerosol-cans", name: "Aerosol can", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="12" y="12" width="12" height="20" rx="2" fill="#94A3B8"/></svg>` },
      { key: "plastic-bottle", name: "Plastic bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` }
    ]
  },
  "clean-foil": {
    name: "Clean foil and trays",
    cat: "metal",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Must be scrunched into a tennis ball size.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Cooking foil, aluminium pie trays, chocolate wrapping foil.",
    steps: [
      "Wipe off food residue.",
      "Scrunch small foil pieces together until the size of a golf or tennis ball.",
      "Small loose foil gets lost in sorting machines.",
      "Place into recycling bin."
    ],
    refundNotice: null,
    videoTitle: "How to properly recycle foil",
    videoDur: "0:35",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><path d="M10 24L16 16H48L54 24L48 48H16L10 24Z" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/><rect x="18" y="24" width="28" height="16" rx="2" fill="#E2E8F0"/></svg>`,
    similar: [
      { key: "aluminium-cans", name: "Food tin", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="11" y="8" width="14" height="20" rx="3" fill="#94A3B8"/></svg>` },
      { key: "pizza-box", name: "Pizza box", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#FBBF24"/></svg>` },
      { key: "paper-cardboard", name: "Cardboard", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="10" y="8" width="16" height="22" rx="2" fill="#FDE047"/></svg>` }
    ]
  },
  "aerosol-cans": {
    name: "Aerosol cans (empty)",
    cat: "metal",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Can MUST be completely empty.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Deodorant cans, hairspray cans, shaving cream cans.",
    steps: [
      "Ensure the can is 100% empty — press nozzle until nothing comes out.",
      "Do NOT pierce, crush or flatten aerosol cans.",
      "Plastic caps can be placed in yellow bin.",
      "If partially full with chemicals/paint, take to community depot."
    ],
    refundNotice: null,
    videoTitle: "Aerosol safety in recycling facilities",
    videoDur: "0:45",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="22" y="16" width="20" height="40" rx="4" fill="#94A3B8" stroke="#475569" stroke-width="2"/><rect x="28" y="8" width="8" height="8" rx="1" fill="#DC2626"/><circle cx="32" cy="12" r="1.5" fill="#FFFFFF"/></svg>`,
    similar: [
      { key: "aluminium-cans", name: "Drink can", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="11" y="8" width="14" height="20" rx="3" fill="#94A3B8"/></svg>` },
      { key: "plastic-bottle", name: "Spray bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "batteries", name: "Batteries", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="12" y="10" width="12" height="18" rx="2" fill="#374151"/></svg>` }
    ]
  },
  "hard-plastic": {
    name: "Hard plastic packaging",
    cat: "plastic",
    canRecycle: true,
    statusText: "Yes, you can recycle this",
    statusSub: "Rigid household plastic bottles and tubs.",
    binType: "yellow",
    binName: "Yellow-lid bin",
    binDesc: "Shampoo bottles, detergent bottles, berry punnets.",
    steps: [
      "Rinse away any residue or suds.",
      "Keep pump dispensers in General waste if spring-loaded.",
      "Bottles and rigid punnets go into Yellow bin loose.",
      "Soft plastic wrap must be removed."
    ],
    refundNotice: null,
    videoTitle: "Rigid plastic recycling guidelines",
    videoDur: "0:40",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="20" y="16" width="24" height="40" rx="6" fill="#60A5FA" stroke="#2563EB" stroke-width="2"/><path d="M28 8h8v8h-8z" fill="#1D4ED8"/></svg>`,
    similar: [
      { key: "plastic-bottle", name: "Water bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "plastic-tubs", name: "Takeaway container", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M8 12h20l-3 14H11z" fill="#CBD5E1"/></svg>` },
      { key: "cartons", name: "Milk carton", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/></svg>` }
    ]
  },
  "pizza-box": {
    name: "Pizza box",
    cat: "paper",
    canRecycle: true,
    statusText: "Yes, with separation",
    statusSub: "Clean cardboard is recyclable; grease is not.",
    binType: "yellow",
    binName: "Yellow-lid (top) / Green or Red (base)",
    binDesc: "Tear the box into clean top lid and greasy base.",
    steps: [
      "Tear off the clean cardboard lid — put in Yellow-lid bin.",
      "Greasy, food-soaked bottom goes into Green FOGO bin (or Red bin).",
      "Remove all leftover pizza crusts, plastic dipping cups and wax paper.",
      "Flatten cardboard pieces before placing into bin."
    ],
    refundNotice: null,
    videoTitle: "The pizza box contamination trap",
    videoDur: "0:40",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="20" width="44" height="24" rx="3" fill="#FBBF24" stroke="#D97706" stroke-width="2"/><line x1="10" y1="32" x2="54" y2="32" stroke="#B45309" stroke-width="1.5"/></svg>`,
    similar: [
      { key: "paper-cardboard", name: "Cardboard box", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="10" y="8" width="16" height="22" rx="2" fill="#FDE047"/></svg>` },
      { key: "cartons", name: "Food carton", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/></svg>` },
      { key: "clean-foil", name: "Foil tray", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#CBD5E1"/></svg>` }
    ]
  },
  "coffee-cup": {
    name: "Disposable coffee cup",
    cat: "paper",
    canRecycle: false,
    statusText: "Separation required",
    statusSub: "Lid is recyclable; cup goes in General Waste.",
    binType: "red",
    binName: "Plastic lid in Yellow · Paper cup in Red",
    binDesc: "Takeaway cups have a plastic polyethylene waterproof lining.",
    steps: [
      "Remove plastic lid -> Yellow-lid bin.",
      "Cardboard sleeve -> Yellow-lid bin.",
      "The paper cup itself MUST go into Red-lid General waste.",
      "Alternative: Bring a reusable keep-cup to your cafe!"
    ],
    refundNotice: null,
    videoTitle: "Why coffee cups are not recyclable",
    videoDur: "0:45",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><path d="M18 16H46L40 56H24L18 16Z" fill="#F87171" stroke="#DC2626" stroke-width="2"/><rect x="16" y="12" width="32" height="6" rx="2" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/></svg>`,
    similar: [
      { key: "plastic-bottle", name: "Cold drink cup", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` },
      { key: "cartons", name: "Juice carton", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/></svg>` },
      { key: "paper-cardboard", name: "Paper sleeve", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="10" y="8" width="16" height="22" rx="2" fill="#FDE047"/></svg>` }
    ]
  },
  "batteries": {
    name: "Household batteries",
    cat: "depot",
    canRecycle: false,
    statusText: "Never in kerbside bins!",
    statusSub: "Severe fire hazard in waste trucks and sorting plants.",
    binType: "depot",
    binName: "Dedicated Depot / B-cycle Drop-off",
    binDesc: "AA, AAA, button cells, phone and power tool lithium batteries.",
    steps: [
      "NEVER put batteries in Red, Yellow, or Green bins.",
      "Place clear sticky tape over both battery terminals.",
      "Store safely in a glass container at home.",
      "Drop off for free at B-cycle bins at Aldi, Woolworths, Bunnings or Council Depot."
    ],
    refundNotice: "Free household battery drop-off available at over 4,000 drop points nationwide.",
    videoTitle: "Battery fires in recycling trucks",
    videoDur: "0:50",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><rect x="22" y="16" width="20" height="38" rx="3" fill="#334155" stroke="#1E293B" stroke-width="2"/><rect x="27" y="10" width="10" height="6" rx="1" fill="#F59E0B"/><line x1="32" y1="24" x2="32" y2="34" stroke="#EF4444" stroke-width="2"/><line x1="27" y1="29" x2="37" y2="29" stroke="#EF4444" stroke-width="2"/></svg>`,
    similar: [
      { key: "aerosol-cans", name: "Aerosol can", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="12" y="12" width="12" height="20" rx="2" fill="#94A3B8"/></svg>` },
      { key: "aluminium-cans", name: "Metal tin", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="11" y="8" width="14" height="20" rx="3" fill="#94A3B8"/></svg>` },
      { key: "plastic-bottle", name: "Chemical bottle", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/></svg>` }
    ]
  },
  "nappies": {
    name: "Nappies & sanitary items",
    cat: "red",
    canRecycle: false,
    statusText: "General waste bin only",
    statusSub: "Nappies contaminate entire truckloads of recycling.",
    binType: "red",
    binName: "Red-lid bin",
    binDesc: "Disposable nappies, baby wipes, incontinence pads.",
    steps: [
      "Wrap nappy tightly and seal inside a plastic bag.",
      "Dispose immediately into red-lid general waste bin.",
      "Never put into Yellow recycling or Green FOGO bins.",
      "Consider modern reusable cloth nappies to cut household waste."
    ],
    refundNotice: null,
    videoTitle: "Preventing sanitary contamination",
    videoDur: "0:30",
    visualSvg: `<svg viewBox="0 0 64 64" fill="none"><path d="M14 20H50C50 36 42 50 32 50C22 50 14 36 14 20Z" fill="#FED7AA" stroke="#EA580C" stroke-width="2"/><line x1="14" y1="26" x2="50" y2="26" stroke="#C2410C" stroke-width="1.5"/></svg>`,
    similar: [
      { key: "pizza-box", name: "Food packaging", icon: `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="14" width="20" height="12" rx="2" fill="#FBBF24"/></svg>` },
      { key: "coffee-cup", name: "Coffee cup", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M18 16H46L40 56H24L18 16Z" fill="#F87171"/></svg>` },
      { key: "plastic-tubs", name: "Plastic wrap", icon: `<svg viewBox="0 0 36 36" fill="none"><path d="M8 12h20l-3 14H11z" fill="#CBD5E1"/></svg>` }
    ]
  }
};

function renderItemDetailView(itemKey) {
  const item = recycleItemsDB[itemKey] || recycleItemsDB["plastic-bottle"];
  
  // Title
  const titleEl = document.getElementById("itemDetailTitle");
  if (titleEl) titleEl.textContent = item.name;

  // Visual
  const visualEl = document.getElementById("itemDetailVisual");
  if (visualEl) visualEl.innerHTML = item.visualSvg;

  // Status
  const statusPill = document.getElementById("itemDetailStatusPill");
  const statusIcon = document.getElementById("itemDetailStatusIcon");
  const statusText = document.getElementById("itemDetailStatusText");
  const statusSub = document.getElementById("itemDetailStatusSub");

  if (statusText) statusText.textContent = item.statusText;
  if (statusSub) statusSub.textContent = item.statusSub;

  if (statusPill && statusIcon) {
    if (item.canRecycle) {
      statusPill.style.background = "#F0FDF4";
      statusPill.style.borderColor = "#DCFCE7";
      statusIcon.style.background = "#15803D";
      statusIcon.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`;
      if (statusText) statusText.style.color = "#166534";
    } else {
      statusPill.style.background = "#FEF2F2";
      statusPill.style.borderColor = "#FECACA";
      statusIcon.style.background = "#DC2626";
      statusIcon.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;
      if (statusText) statusText.style.color = "#991B1B";
    }
  }

  // Target Bin Card
  const targetBox = document.getElementById("itemTargetBinBox");
  const binGraphic = document.getElementById("itemTargetBinGraphic");
  const binTag = document.getElementById("itemTargetBinTag");
  const binTitle = document.getElementById("itemTargetBinTitle");
  const binDesc = document.getElementById("itemTargetBinDesc");

  if (binTitle) binTitle.textContent = item.binName;
  if (binDesc) binDesc.textContent = item.binDesc;

  if (targetBox && binGraphic && binTag) {
    targetBox.className = "target-bin-box";
    let lidColorClass = "bin-yellow";
    if (item.binType === "yellow") {
      targetBox.classList.add("bin-yellow-target");
      lidColorClass = "bin-yellow";
      binTag.style.background = "#FEF08A";
      binTag.style.color = "#854D0E";
      binTag.textContent = "PUT IN";
    } else if (item.binType === "green") {
      targetBox.classList.add("bin-green-target");
      lidColorClass = "bin-green";
      binTag.style.background = "#DCFCE7";
      binTag.style.color = "#166534";
      binTag.textContent = "PUT IN";
    } else if (item.binType === "red") {
      targetBox.classList.add("bin-red-target");
      lidColorClass = "bin-red";
      binTag.style.background = "#FEE2E2";
      binTag.style.color = "#991B1B";
      binTag.textContent = "PUT IN";
    } else {
      targetBox.classList.add("bin-depot-target");
      lidColorClass = "bin-grey";
      binTag.style.background = "#EFF6FF";
      binTag.style.color = "#1D4ED8";
      binTag.textContent = "DROP OFF";
    }

    binGraphic.innerHTML = getHdWheelieBinSvg(item.binType);
  }

  // Steps
  const stepsContainer = document.getElementById("itemHowToSteps");
  if (stepsContainer) {
    stepsContainer.innerHTML = item.steps.map((s, idx) => `
      <div class="how-step-item-web">
        <span class="step-num-bubble">${idx + 1}</span>
        <span class="step-content-text-web">${s}</span>
      </div>
    `).join("");
  }

  // Refund Callout
  const refundCallout = document.getElementById("itemRefundCallout");
  if (refundCallout) {
    if (item.refundNotice) {
      refundCallout.style.display = "flex";
      refundCallout.querySelector(".cbb-text").textContent = item.refundNotice;
    } else {
      refundCallout.style.display = "none";
    }
  }

  // Video guide
  const videoTitle = document.getElementById("itemGuideVideoTitle");
  if (videoTitle) videoTitle.textContent = item.videoTitle;

  // Similar items
  const similarContainer = document.getElementById("similarItemsRow");
  if (similarContainer && item.similar) {
    similarContainer.innerHTML = item.similar.map(s => `
      <button type="button" class="similar-item-card" data-item="${s.key}">
        <div class="sic-thumb">${s.icon}</div>
        <span>${s.name}</span>
      </button>
    `).join("");

    similarContainer.querySelectorAll(".similar-item-card").forEach(c => {
      c.addEventListener("click", () => {
        const key = c.getAttribute("data-item");
        renderItemDetailView(key);
      });
    });
  }

  switchRecycleSubview("viewItemDetail");
}

// Item Detail Back Button
const itemDetailBackBtn = document.getElementById("itemDetailBackBtn");
if (itemDetailBackBtn) {
  itemDetailBackBtn.addEventListener("click", () => popRecycleSubview());
}

// Favorite Heart Toggle
const itemDetailFavBtn = document.getElementById("itemDetailFavBtn");
if (itemDetailFavBtn) {
  itemDetailFavBtn.addEventListener("click", () => {
    itemDetailFavBtn.classList.toggle("is-favorite");
    const isFav = itemDetailFavBtn.classList.contains("is-favorite");
    itemDetailFavBtn.innerHTML = isFav 
      ? `<svg viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
  });
}

// Watch Guide Card click
const itemWatchGuideBtn = document.getElementById("itemWatchGuideBtn");
if (itemWatchGuideBtn) {
  itemWatchGuideBtn.addEventListener("click", () => {
    const videoTitle = document.getElementById("itemGuideVideoTitle")?.textContent || "Recycling Guide";
    openVideoModal(videoTitle, [
      "Keep containers loose in your kerbside recycling bin.",
      "Light rinse is sufficient — no need to run through a dishwasher.",
      "Leave plastic bottle caps screwed on tightly."
    ]);
  });
}

// ==========================================================
// ALL BINS SUBVIEW
// ==========================================================
const rhViewAllBinsBtn = document.getElementById("rhViewAllBinsBtn");
if (rhViewAllBinsBtn) {
  rhViewAllBinsBtn.addEventListener("click", () => switchRecycleSubview("viewAllBins"));
}

const allBinsBackBtn = document.getElementById("allBinsBackBtn");
if (allBinsBackBtn) {
  allBinsBackBtn.addEventListener("click", () => popRecycleSubview());
}

// Click on any bin card in Hub or All Bins
document.querySelectorAll(".rh-bin-card, .rh-bin-card-web, .all-bin-row-card, .all-bin-card-web").forEach(btn => {
  btn.addEventListener("click", () => {
    const binType = btn.getAttribute("data-bin");
    renderBinDetailView(binType);
  });
});

// Common searches chip clicks in Hub
document.querySelectorAll(".rh-search-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const itemKey = chip.getAttribute("data-item");
    if (itemKey) {
      renderItemDetailView(itemKey);
    }
  });
});

const rhMoreItemsBtn = document.getElementById("rhMoreItemsBtn");
if (rhMoreItemsBtn) {
  rhMoreItemsBtn.addEventListener("click", () => {
    renderBinItemsList("all");
    switchRecycleSubview("viewBinItemsList");
  });
}

// ==========================================================
// BIN DETAIL SUBVIEW
// ==========================================================
const binDetailsDB = {
  recycling: {
    name: "Recycling bin",
    tag: "Yellow lid",
    tagClass: "abr-tag-yellow",
    lidClass: "bin-yellow",
    desc: "Clean and empty recyclable packaging, paper, glass, metals and more.",
    timing: "Every second Thursday",
    countdown: "Next: Thu, 8 Oct (in 9 days)",
    tip: "Keep items clean, empty and loose. Do not put them in plastic bags.",
    goesIn: [
      { key: "plastic-bottle", name: "Plastic packaging", svg: `<path d="M14 6h8v4h-8z" fill="#3B82F6"/><path d="M12 11h12l1 18H11z" fill="#93C5FD"/>` },
      { key: "paper-cardboard", name: "Paper & cardboard", svg: `<path d="M8 12h20v14H8z" fill="#FDE047"/><path d="M6 16h24v12H6z" fill="#FACC15"/>` },
      { key: "glass-bottles", name: "Glass bottles and jars", svg: `<path d="M15 6h6v5h-6z" fill="#15803D"/><path d="M12 12h12l1 18H11z" fill="#86EFAC"/>` },
      { key: "aluminium-cans", name: "Metal cans and tins", svg: `<rect x="11" y="8" width="14" height="20" rx="3" fill="#94A3B8"/>` },
      { key: "cartons", name: "Cartons", svg: `<path d="M10 12l8-5 8 5v17H10z" fill="#E2E8F0"/>` },
      { key: "clean-foil", name: "Clean foil and trays", svg: `<rect x="8" y="14" width="20" height="12" rx="2" fill="#CBD5E1"/>` }
    ],
    doesntGoIn: [
      { name: "Food scraps", svg: `<circle cx="16" cy="16" r="10" fill="#FCA5A5"/>` },
      { name: "Plastic bags", svg: `<path d="M10 10h12v14H10z" fill="#E2E8F0"/>` },
      { name: "Nappies", svg: `<path d="M8 12h16c0 6-3 12-8 12s-8-6-8-12z" fill="#FED7AA"/>` }
    ]
  },
  organics: {
    name: "Organics bin",
    tag: "Green lid",
    tagClass: "abr-tag-green",
    lidClass: "bin-green",
    desc: "Food scraps and garden waste turned into nutrient-rich compost.",
    timing: "Every second Thursday",
    countdown: "Next: Thu, 1 Oct (in 2 days)",
    tip: "Use certified compostable caddy liners only. No plastic shopping bags.",
    goesIn: [
      { key: "food-scraps", name: "Fruit & vegetable scraps", svg: `<circle cx="18" cy="18" r="12" fill="#4ADE80"/>` },
      { key: "food-scraps", name: "Meat, bones & cheese", svg: `<path d="M12 14h12l2 12H10z" fill="#F87171"/>` },
      { key: "food-scraps", name: "Coffee grounds & tea bags", svg: `<circle cx="18" cy="18" r="10" fill="#78350F"/>` },
      { key: "garden", name: "Grass clippings & weeds", svg: `<path d="M10 24l8-14 8 14H10z" fill="#15803D"/>` },
      { key: "garden", name: "Small branches & prunings", svg: `<line x1="12" y1="26" x2="24" y2="10" stroke="#78350F" stroke-width="3"/>` },
      { key: "garden", name: "Leaves & flowers", svg: `<circle cx="18" cy="18" r="8" fill="#F472B6"/>` }
    ],
    doesntGoIn: [
      { name: "Plastic bags", svg: `<path d="M10 10h12v14H10z" fill="#E2E8F0"/>` },
      { name: "Treated wood", svg: `<rect x="10" y="10" width="12" height="12" fill="#64748B"/>` },
      { name: "Pet waste", svg: `<circle cx="16" cy="16" r="8" fill="#A16207"/>` }
    ]
  },
  general: {
    name: "General waste bin",
    tag: "Red lid",
    tagClass: "abr-tag-red",
    lidClass: "bin-red",
    desc: "Non-recyclable and non-organic household waste.",
    timing: "Every Thursday (Weekly)",
    countdown: "Next: Thu, 1 Oct (in 2 days)",
    tip: "Bag your rubbish to keep the bin clean and prevent litter during collection.",
    goesIn: [
      { key: "nappies", name: "Nappies & baby wipes", svg: `<path d="M8 12h16c0 6-3 12-8 12s-8-6-8-12z" fill="#FED7AA"/>` },
      { key: "coffee-cup", name: "Takeaway coffee cups", svg: `<path d="M14 12h16l-3 14H17z" fill="#F87171"/>` },
      { key: "soft-plastics", name: "Plastic bags & wrappers", svg: `<path d="M10 10h12v14H10z" fill="#E2E8F0"/>` },
      { key: "ceramics", name: "Broken ceramics & glassware", svg: `<path d="M12 24l6-12 6 12z" fill="#CBD5E1"/>` },
      { key: "foam", name: "Polystyrene & meat trays", svg: `<rect x="10" y="12" width="16" height="12" fill="#E2E8F0"/>` },
      { key: "textiles", name: "Worn rags & shoes", svg: `<rect x="12" y="12" width="12" height="12" fill="#94A3B8"/>` }
    ],
    doesntGoIn: [
      { name: "Batteries", svg: `<rect x="12" y="10" width="12" height="18" rx="2" fill="#374151"/>` },
      { name: "Gas bottles", svg: `<rect x="10" y="10" width="14" height="18" fill="#F59E0B"/>` },
      { name: "Building rubble", svg: `<polygon points="10,24 18,12 26,24" fill="#64748B"/>` }
    ]
  },
  dropoff: {
    name: "Drop-off & special items",
    tag: "Local centres",
    tagClass: "abr-tag-blue",
    lidClass: "bin-grey",
    desc: "Items that don't go in household bins: hazardous, electronic, and bulky waste.",
    timing: "Riverton Resource Recovery Centre",
    countdown: "45 Quarry Rd · Sat-Wed 8am-4pm",
    tip: "Free drop-off for households. Commercial fees may apply.",
    goesIn: [
      { key: "batteries", name: "Household batteries", svg: `<rect x="12" y="10" width="12" height="18" rx="2" fill="#374151"/>` },
      { key: "e-waste", name: "Computers & TVs", svg: `<rect x="8" y="10" width="20" height="14" rx="2" fill="#475569"/>` },
      { key: "paint", name: "Paint cans & thinners", svg: `<rect x="12" y="12" width="12" height="16" fill="#F43F5E"/>` },
      { key: "whitegoods", name: "Fridges & washing machines", svg: `<rect x="10" y="8" width="16" height="22" rx="2" fill="#E2E8F0"/>` },
      { key: "mattresses", name: "Mattresses", svg: `<rect x="8" y="14" width="20" height="10" rx="3" fill="#CBD5E1"/>` },
      { key: "fluo", name: "Fluorescent tubes", svg: `<line x1="8" y1="18" x2="28" y2="18" stroke="#FBBF24" stroke-width="4"/>` }
    ],
    doesntGoIn: [
      { name: "Asbestos (licence req)", svg: `<circle cx="16" cy="16" r="10" fill="#EF4444"/>` },
      { name: "Explosives/flares", svg: `<path d="M12 12l8 8" stroke="#DC2626" stroke-width="3"/>` },
      { name: "Medical waste", svg: `<rect x="10" y="10" width="12" height="12" fill="#DC2626"/>` }
    ]
  }
};

function renderBinDetailView(binKey) {
  const data = binDetailsDB[binKey] || binDetailsDB.recycling;

  const titleEl = document.getElementById("binDetailTitle");
  if (titleEl) titleEl.textContent = data.name;

  const heroTitle = document.getElementById("bdHeroTitle");
  if (heroTitle) heroTitle.textContent = data.name;

  const heroTag = document.getElementById("bdHeroTag");
  if (heroTag) {
    heroTag.textContent = data.tag;
    heroTag.className = "abr-tag " + data.tagClass;
  }

  const heroDesc = document.getElementById("bdHeroDesc");
  if (heroDesc) heroDesc.textContent = data.desc;

  const heroGraphic = document.getElementById("bdHeroGraphic");
  if (heroGraphic) {
    heroGraphic.innerHTML = getHdWheelieBinSvg(binKey);
  }

  const timing = document.getElementById("bdCollectionTiming");
  if (timing) timing.textContent = data.timing;

  const countdown = document.getElementById("bdCollectionCountdown");
  if (countdown) countdown.textContent = data.countdown;

  const tipText = document.getElementById("bdTipText");
  if (tipText) tipText.textContent = data.tip;

  // What goes in grid
  const whatGoesGrid = document.getElementById("bdWhatGoesInGrid");
  if (whatGoesGrid) {
    whatGoesGrid.innerHTML = data.goesIn.map(item => `
      <button type="button" class="wg-tile-web" data-item="${item.key}">
        <div class="wg-tile-icon">
          <svg viewBox="0 0 36 36" fill="none">${item.svg}</svg>
        </div>
        <span>${item.name}</span>
      </button>
    `).join("");

    whatGoesGrid.querySelectorAll(".wg-tile, .wg-tile-web").forEach(btn => {
      btn.addEventListener("click", () => {
        const itemKey = btn.getAttribute("data-item");
        if (recycleItemsDB[itemKey]) {
          renderItemDetailView(itemKey);
        } else {
          renderItemDetailView("plastic-bottle");
        }
      });
    });
  }

  // What doesn't go in row
  const whatNotRow = document.getElementById("bdWhatDoesntGoInRow");
  if (whatNotRow) {
    whatNotRow.innerHTML = data.doesntGoIn.map(item => `
      <div class="wn-tile-web">
        <span class="wn-bad-badge">&times;</span>
        <div class="wn-tile-icon">
          <svg viewBox="0 0 32 32" fill="none">${item.svg}</svg>
        </div>
        <span>${item.name}</span>
      </div>
    `).join("");
  }

  switchRecycleSubview("viewBinDetail");
}

const binDetailBackBtn = document.getElementById("binDetailBackBtn");
if (binDetailBackBtn) {
  binDetailBackBtn.addEventListener("click", () => popRecycleSubview());
}

const bdViewAllWhatGoesInBtn = document.getElementById("bdViewAllWhatGoesInBtn");
if (bdViewAllWhatGoesInBtn) {
  bdViewAllWhatGoesInBtn.addEventListener("click", () => {
    renderBinItemsList("all");
    switchRecycleSubview("viewBinItemsList");
  });
}

const bdViewAllWhatDoesntBtn = document.getElementById("bdViewAllWhatDoesntBtn");
if (bdViewAllWhatDoesntBtn) {
  bdViewAllWhatDoesntBtn.addEventListener("click", () => {
    renderItemDetailView("nappies");
  });
}

// ==========================================================
// WHAT GOES IN THE RECYCLING BIN (Filterable Items List)
// ==========================================================
const detailedBinItemsList = [
  { key: "plastic-bottle", cat: "plastic", name: "Plastic bottles", desc: "Drink bottles, water bottles and similar plastic containers.", icon: `<svg viewBox="0 0 28 28" fill="none"><path d="M11 5h6v3h-6z" fill="#3B82F6"/><path d="M9 9h10l1 15H8z" fill="#93C5FD"/></svg>` },
  { key: "plastic-tubs", cat: "plastic", name: "Plastic tubs and containers", desc: "Yoghurt tubs, takeaway containers (clean and empty).", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="5" y="8" width="18" height="3" rx="1" fill="#64748B"/><path d="M6 12h16l-2 12H8z" fill="#CBD5E1"/></svg>` },
  { key: "cartons", cat: "paper", name: "Food and drink cartons", desc: "Milk, juice and similar cartons (clean and empty).", icon: `<svg viewBox="0 0 28 28" fill="none"><path d="M8 9l6-4 6 4v14H8z" fill="#E2E8F0"/></svg>` },
  { key: "paper-cardboard", cat: "paper", name: "Paper and cardboard", desc: "Boxes, packaging and paper (clean and dry).", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="6" y="6" width="16" height="16" rx="2" fill="#FDE047"/></svg>` },
  { key: "glass-bottles", cat: "glass", name: "Glass bottles and jars", desc: "Drink bottles and food jars (empty, no lids required).", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="12" y="4" width="4" height="4" fill="#15803D"/><path d="M10 9h8l1 15H9z" fill="#86EFAC"/></svg>` },
  { key: "aluminium-cans", cat: "metal", name: "Aluminium cans and tins", desc: "Drink cans, food tins and clean aluminium trays.", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="8" y="6" width="12" height="16" rx="2" fill="#94A3B8"/></svg>` },
  { key: "clean-foil", cat: "metal", name: "Clean foil and trays", desc: "Foil, aluminium trays and clean foil containers.", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="6" y="10" width="16" height="10" rx="1" fill="#CBD5E1"/></svg>` },
  { key: "aerosol-cans", cat: "metal", name: "Aerosol cans (empty)", desc: "Empty household aerosol cans.", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="9" y="8" width="10" height="16" rx="2" fill="#94A3B8"/></svg>` },
  { key: "hard-plastic", cat: "plastic", name: "Hard plastic packaging", desc: "Food packaging, shampoo bottles and household containers.", icon: `<svg viewBox="0 0 28 28" fill="none"><rect x="8" y="8" width="12" height="16" rx="3" fill="#60A5FA"/></svg>` }
];

function renderBinItemsList(catFilter = "all") {
  const container = document.getElementById("wgiItemsList");
  if (!container) return;

  const filtered = catFilter === "all" 
    ? detailedBinItemsList 
    : detailedBinItemsList.filter(i => i.cat === catFilter);

  container.innerHTML = filtered.map(item => `
    <button type="button" class="wgi-card-web" data-item="${item.key}">
      <div class="wgi-thumb">${item.icon}</div>
      <div class="wgi-meta">
        <strong>${item.name}</strong>
        <p>${item.desc}</p>
      </div>
      <svg class="chevron-right" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
    </button>
  `).join("");

  container.querySelectorAll(".wgi-item-card, .wgi-card-web").forEach(c => {
    c.addEventListener("click", () => {
      const key = c.getAttribute("data-item");
      renderItemDetailView(key);
    });
  });
}

document.querySelectorAll("#wgiFilterPillBar .wgi-pill-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#wgiFilterPillBar .wgi-pill-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.getAttribute("data-cat");
    renderBinItemsList(cat);
  });
});

const binItemsListBackBtn = document.getElementById("binItemsListBackBtn");
if (binItemsListBackBtn) {
  binItemsListBackBtn.addEventListener("click", () => popRecycleSubview());
}

// ==========================================================
// LEARN HUB SUBVIEW (Image 1 Screen 3)
// ==========================================================
const rhSeeAllVideosBtn = document.getElementById("rhSeeAllVideosBtn");
if (rhSeeAllVideosBtn) {
  rhSeeAllVideosBtn.addEventListener("click", () => switchRecycleSubview("viewLearn"));
}

const learnBackBtn = document.getElementById("learnBackBtn");
if (learnBackBtn) {
  learnBackBtn.addEventListener("click", () => popRecycleSubview());
}

const learnStartBtn = document.getElementById("learnStartBtn");
if (learnStartBtn) {
  learnStartBtn.addEventListener("click", () => {
    openVideoModal("Recycling Made Simple: The Basics", [
      "Yellow lid: empty bottles, cans, paper, and clean foil.",
      "Green lid: all food scraps, garden prunings, and compostable caddy liners.",
      "Red lid: soft plastic bags, coffee cups, nappies, and broken ceramics.",
      "Special Depot: all household batteries, e-waste, and paint."
    ]);
  });
}

document.querySelectorAll(".topic-box, .topic-box-web").forEach(box => {
  box.addEventListener("click", () => {
    const topic = box.getAttribute("data-topic");
    if (topic === "basics") {
      switchRecycleSubview("viewAllBins");
    } else if (topic === "materials") {
      renderBinItemsList("all");
      switchRecycleSubview("viewBinItemsList");
    } else if (topic === "tricky") {
      renderItemDetailView("batteries");
    } else {
      renderBinDetailView("organics");
    }
  });
});

document.querySelectorAll(".featured-video-row-item, .rh-video-card, .rh-video-card-web").forEach(item => {
  item.addEventListener("click", () => {
    const videoKey = item.getAttribute("data-video");
    if (videoKey === "mistakes") {
      openVideoModal("Recycling mistakes to avoid (5 common mistakes)", [
        "1. Bagging recyclables in plastic supermarket bags.",
        "2. Leaving food scraps and grease in cardboard pizza boxes.",
        "3. Tossing batteries into household bins (fire risk).",
        "4. Putting takeaway coffee cups in yellow bins.",
        "5. Leaving liquid in drink bottles."
      ]);
    } else if (videoKey === "prepare") {
      openVideoModal("How to prepare items for recycling", [
        "Empty liquids and scrape off food residue.",
        "Quick cold-water rinse — spotless cleaning not needed.",
        "Flatten boxes completely.",
        "Screw plastic bottle caps back onto empty bottles."
      ]);
    } else if (videoKey === "journey") {
      openVideoModal("What actually happens to your recycling?", [
        "Collection trucks deliver loads to Materials Recovery Facilities (MRFs).",
        "Optical sorters and magnets separate paper, aluminium, and plastics.",
        "Baled materials are sent to local re-processors to make new bottles and paper.",
        "Contaminated loads are redirected to landfill."
      ]);
    } else {
      openVideoModal("Food packaging: what goes where?", [
        "Clean aluminium trays & foil -> Yellow bin (scrunched).",
        "Greasy pizza boxes -> Green FOGO bin or Red bin.",
        "Yoghurt and takeaway tubs -> Yellow bin (rinsed).",
        "Foil chip packets and bar wrappers -> Red bin."
      ]);
    }
  });
});

// ==========================================================
// SEARCH IN RECYCLE HUB
// ==========================================================
const recycleHubSearchInput = document.getElementById("recycleHubSearchInput");
const rhSearchDropdown = document.getElementById("rhSearchDropdown");

if (recycleHubSearchInput && rhSearchDropdown) {
  recycleHubSearchInput.addEventListener("input", () => {
    const q = recycleHubSearchInput.value.trim().toLowerCase();
    if (!q) {
      rhSearchDropdown.style.display = "none";
      return;
    }

    const matches = Object.keys(recycleItemsDB).filter(key => {
      const item = recycleItemsDB[key];
      return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });

    if (matches.length > 0) {
      rhSearchDropdown.innerHTML = matches.map(key => {
        const item = recycleItemsDB[key];
        const badgeColor = item.canRecycle ? "background: #DCFCE7; color: #15803D;" : "background: #FEE2E2; color: #DC2626;";
        return `
          <div class="search-dropdown-item" data-key="${key}">
            <div class="sdi-info">
              <strong>${item.name}</strong>
              <span>${item.binName}</span>
            </div>
            <span class="sdi-badge" style="${badgeColor}">${item.canRecycle ? "Recyclable" : "Special/Landfill"}</span>
          </div>
        `;
      }).join("");

      rhSearchDropdown.querySelectorAll(".search-dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          const key = item.getAttribute("data-key");
          renderItemDetailView(key);
          rhSearchDropdown.style.display = "none";
          recycleHubSearchInput.value = "";
        });
      });

      rhSearchDropdown.style.display = "block";
    } else {
      rhSearchDropdown.innerHTML = `
        <div class="search-dropdown-item" style="cursor: default;">
          <div class="sdi-info">
            <strong>No direct match for "${q}"</strong>
            <span>Check council depot rules or general waste.</span>
          </div>
        </div>
      `;
      rhSearchDropdown.style.display = "block";
    }
  });

  // Hide dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!recycleHubSearchInput.contains(e.target) && !rhSearchDropdown.contains(e.target)) {
      rhSearchDropdown.style.display = "none";
    }
  });
}

// ==========================================================
// CAMERA SCANNER SIMULATOR MODAL
// ==========================================================
const scannerModalOverlay = document.getElementById("scannerModalOverlay");
const rhScanItemBannerBtn = document.getElementById("rhScanItemBannerBtn");
const rhSearchCameraBtn = document.getElementById("rhSearchCameraBtn");
const scannerModalCloseBtn = document.getElementById("scannerModalCloseBtn");
const scannerViewGuideBtn = document.getElementById("scannerViewGuideBtn");
let currentScannedItem = "plastic-bottle";

function openScannerModal() {
  if (scannerModalOverlay) {
    scannerModalOverlay.style.display = "flex";
  }
}

function closeScannerModal() {
  if (scannerModalOverlay) {
    scannerModalOverlay.style.display = "none";
  }
}

if (rhScanItemBannerBtn) rhScanItemBannerBtn.addEventListener("click", openScannerModal);
if (rhSearchCameraBtn) rhSearchCameraBtn.addEventListener("click", openScannerModal);
if (scannerModalCloseBtn) scannerModalCloseBtn.addEventListener("click", closeScannerModal);

document.querySelectorAll(".btn-sim-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".btn-sim-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentScannedItem = chip.getAttribute("data-scan");
    const badgeText = document.getElementById("scannerDetectedText");
    if (badgeText) {
      if (currentScannedItem === "plastic-bottle") {
        badgeText.textContent = "Plastic Bottle (PET 1) · 98% Match";
      } else if (currentScannedItem === "pizza-box") {
        badgeText.textContent = "Pizza Box (Corrugated Cardboard) · 96% Match";
      } else {
        badgeText.textContent = "Household Alkaline Battery · 99% Match";
      }
    }
  });
});

if (scannerViewGuideBtn) {
  scannerViewGuideBtn.addEventListener("click", () => {
    closeScannerModal();
    renderItemDetailView(currentScannedItem);
  });
}

// ==========================================================
// VIDEO PLAYER MODAL
// ==========================================================
const videoModalOverlay = document.getElementById("videoModalOverlay");
const videoModalCloseBtn = document.getElementById("videoModalCloseBtn");
const videoModalDoneBtn = document.getElementById("videoModalDoneBtn");

function openVideoModal(title, takeaways) {
  const titleEl = document.getElementById("videoModalTitle");
  if (titleEl) titleEl.textContent = title;

  const notesEl = document.getElementById("videoModalNotes");
  if (notesEl && takeaways) {
    notesEl.innerHTML = `
      <strong>Key Takeaways:</strong>
      <ul style="margin: 8px 0 0 18px;">
        ${takeaways.map(t => `<li>${t}</li>`).join("")}
      </ul>
    `;
  }

  if (videoModalOverlay) {
    videoModalOverlay.style.display = "flex";
  }
}

function closeVideoModal() {
  if (videoModalOverlay) {
    videoModalOverlay.style.display = "none";
  }
}

if (videoModalCloseBtn) videoModalCloseBtn.addEventListener("click", closeVideoModal);
if (videoModalDoneBtn) videoModalDoneBtn.addEventListener("click", closeVideoModal);

// Close modals when clicking backdrop
if (scannerModalOverlay) {
  scannerModalOverlay.addEventListener("click", (e) => {
    if (e.target === scannerModalOverlay) closeScannerModal();
  });
}
if (videoModalOverlay) {
  videoModalOverlay.addEventListener("click", (e) => {
    if (e.target === videoModalOverlay) closeVideoModal();
  });
}

// Initial Screen: Welcome Landing Page
showScreen("welcome");

