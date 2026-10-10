// ==========================================================
// EcoTrack End-to-End Walkthrough & Resident Home Logic
// Initial Entry: 01 / Welcome -> 02 / Address -> 03 / Bins -> 04 / Reminders -> 05 / Resident Home
// ==========================================================

const screens = {
  welcome: document.getElementById("screenWelcome"),
  address: document.getElementById("screenAddress"),
  bins: document.getElementById("screenBins"),
  reminders: document.getElementById("screenReminders"),
  home: document.getElementById("screenHome"),
  schedule: document.getElementById("screenSchedule")
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
document.getElementById("welcomeStartBtn").addEventListener("click", () => {
  showScreen("address");
});

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
document.getElementById("backToWelcomeBtn").addEventListener("click", () => {
  showScreen("welcome");
});

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

document.getElementById("useLocationBtn").addEventListener("click", () => {
  if (homeAddressLabel) homeAddressLabel.textContent = "12 Greenview Ave";
  showScreen("bins");
});

// ==========================================================
// SCREEN 03: Confirm Bins -> 04 Reminders
// ==========================================================
document.getElementById("backToAddressBtn").addEventListener("click", () => {
  showScreen("address");
});

document.getElementById("confirmBinsBtn").addEventListener("click", () => {
  showScreen("reminders");
});

document.getElementById("reportMismatchBtn").addEventListener("click", () => {
  alert("Feedback noted: We will verify council bin assignments for your address.");
});

// ==========================================================
// SCREEN 04: Enable Reminders -> 05 Resident Home
// ==========================================================
document.getElementById("backToBinsBtn").addEventListener("click", () => {
  showScreen("bins");
});

const optNightBefore = document.getElementById("optNightBefore");
const optMorningOf = document.getElementById("optMorningOf");

[optNightBefore, optMorningOf].forEach(opt => {
  opt.addEventListener("click", () => {
    [optNightBefore, optMorningOf].forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
  });
});

document.getElementById("finishSetupBtn").addEventListener("click", () => {
  showScreen("home");
});

// ==========================================================
// SCREEN 05: Resident Home Handlers
// ==========================================================

// Change address button in header returns to address setup
document.getElementById("homeChangeAddrBtn").addEventListener("click", () => {
  showScreen("address");
});



// "What can I recycle?" Search
const recycleData = [
  { item: "Plastic bottle", answer: "Yellow-lid bin (Recycling). Rinse and keep cap on." },
  { item: "Cardboard box", answer: "Yellow-lid bin (Recycling). Flatten completely." },
  { item: "Batteries", answer: "Dedicated drop-off depot. Never in kerbside bins." },
  { item: "Food scraps", answer: "Green-lid bin (Garden & food organics)." },
  { item: "Pizza box", answer: "Yellow-lid if clean; general waste if greasy base." },
  { item: "Glass jars & bottles", answer: "Yellow-lid bin (Recycling). Rinse clean." },
  { item: "Soft plastic & plastic bags", answer: "Red-lid bin (General waste) or supermarket return." }
];

const homeRecycleSearch = document.getElementById("homeRecycleSearch");
const homeInstantResults = document.getElementById("homeInstantResults");

homeRecycleSearch.addEventListener("input", () => {
  const q = homeRecycleSearch.value.trim().toLowerCase();
  if (!q) {
    homeInstantResults.style.display = "none";
    return;
  }
  const matches = recycleData.filter(r => r.item.toLowerCase().includes(q));
  if (matches.length > 0) {
    homeInstantResults.innerHTML = matches.map(m => `
      <div class="instant-res-card">
        <strong>${m.item}</strong>: ${m.answer}
      </div>
    `).join("");
    homeInstantResults.style.display = "block";
  } else {
    homeInstantResults.innerHTML = `<div class="instant-res-card">Check council depot rules for "${q}".</div>`;
    homeInstantResults.style.display = "block";
  }
});

// Secondary service buttons
document.getElementById("sideBulkyBtn").addEventListener("click", () => {
  alert("Bulky pickup booking: Subject to council availability (Prototype Demo).");
});

document.getElementById("sideCentresBtn").addEventListener("click", () => {
  alert("Riverton Resource Recovery Centre: 45 Quarry Rd (Open Sat–Wed 8am–4pm).");
});

// Reminder toggle
const homeReminderToggle = document.getElementById("homeReminderToggle");
homeReminderToggle.addEventListener("change", () => {
  localStorage.setItem("ecotrack_reminder_active", homeReminderToggle.checked);
});

// Start immediately on Onboarding Welcome UI (Image 1, Left)
showScreen("welcome");
