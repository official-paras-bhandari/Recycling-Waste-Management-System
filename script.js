// ==========================================================
// EcoTrack End-to-End Walkthrough, Resident Home & Schedule Logic
// Architecture: Pure HTML, CSS, and Vanilla JavaScript
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

// ==========================================================
// SCREEN 02: Address -> 03 Bins
// ==========================================================
document.getElementById("backToWelcomeBtn").addEventListener("click", () => {
  showScreen("welcome");
});

const homeAddressLabel = document.getElementById("homeAddressLabel");
const addressSearchInput = document.getElementById("addressSearchInput");

function updateAddressDisplay(fullAddress) {
  const shortAddr = fullAddress.split(",")[0].trim();
  if (homeAddressLabel) homeAddressLabel.textContent = shortAddr;
  if (addressSearchInput) addressSearchInput.value = fullAddress;
}

document.querySelectorAll(".suggestion-card").forEach(card => {
  card.addEventListener("click", () => {
    const chosen = card.getAttribute("data-addr");
    updateAddressDisplay(chosen);
    showScreen("bins");
  });
});

document.getElementById("useLocationBtn").addEventListener("click", () => {
  updateAddressDisplay("12 Greenview Ave, Riverton");
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
  if (opt) {
    opt.addEventListener("click", () => {
      [optNightBefore, optMorningOf].forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  }
});

document.getElementById("finishSetupBtn").addEventListener("click", () => {
  showScreen("home");
});

// ==========================================================
// SCREEN 05: Resident Home Handlers
// ==========================================================

// Change address button returns to address setup
document.getElementById("homeChangeAddrBtn").addEventListener("click", () => {
  showScreen("address");
});

// Navigate to Schedule from Home
const homeViewScheduleBtn = document.getElementById("homeViewScheduleBtn");
if (homeViewScheduleBtn) {
  homeViewScheduleBtn.addEventListener("click", () => showScreen("schedule"));
}

const homeNavScheduleBtn = document.getElementById("homeNavScheduleBtn");
if (homeNavScheduleBtn) {
  homeNavScheduleBtn.addEventListener("click", () => showScreen("schedule"));
}

const homeBottomTabSchedule = document.getElementById("homeBottomTabSchedule");
if (homeBottomTabSchedule) {
  homeBottomTabSchedule.addEventListener("click", () => showScreen("schedule"));
}

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

if (homeRecycleSearch && homeInstantResults) {
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
}

// Secondary service buttons
document.getElementById("sideBulkyBtn").addEventListener("click", () => {
  alert("Bulky pickup booking: Subject to council availability (Prototype Demo).");
});

document.getElementById("sideCentresBtn").addEventListener("click", () => {
  alert("Riverton Resource Recovery Centre: 45 Quarry Rd (Open Sat–Wed 8am–4pm).");
});

// Reminder toggle
const homeReminderToggle = document.getElementById("homeReminderToggle");
if (homeReminderToggle) {
  homeReminderToggle.addEventListener("change", () => {
    localStorage.setItem("ecotrack_reminder_active", homeReminderToggle.checked);
  });
  const savedReminder = localStorage.getItem("ecotrack_reminder_active");
  if (savedReminder !== null) {
    homeReminderToggle.checked = savedReminder === "true";
  }
}

// ==========================================================
// SCREEN 06 & 07: SCHEDULE LOGIC (Images 1 & 2)
// ==========================================================

// Schedule Navigation Back to Home / Address
const scheduleBackToHomeBtn = document.getElementById("scheduleBackToHomeBtn");
if (scheduleBackToHomeBtn) {
  scheduleBackToHomeBtn.addEventListener("click", () => showScreen("home"));
}

const scheduleBrandLink = document.getElementById("scheduleBrandLink");
if (scheduleBrandLink) {
  scheduleBrandLink.addEventListener("click", (e) => {
    e.preventDefault();
    showScreen("home");
  });
}

const scheduleNavHomeBtn = document.getElementById("scheduleNavHomeBtn");
if (scheduleNavHomeBtn) {
  scheduleNavHomeBtn.addEventListener("click", () => showScreen("home"));
}

const scheduleBottomTabHome = document.getElementById("scheduleBottomTabHome");
if (scheduleBottomTabHome) {
  scheduleBottomTabHome.addEventListener("click", () => showScreen("home"));
}

// Segmented View Switcher: Upcoming (Image 1) vs Month View (Image 2)
const tabUpcoming = document.getElementById("tabUpcoming");
const tabMonthView = document.getElementById("tabMonthView");
const panelUpcoming = document.getElementById("panelUpcoming");
const panelMonthView = document.getElementById("panelMonthView");
const scheduleSubtitle = document.getElementById("scheduleSubtitle");

function switchScheduleTab(view) {
  if (view === "upcoming") {
    if (tabUpcoming) {
      tabUpcoming.classList.add("active");
      tabUpcoming.setAttribute("aria-selected", "true");
    }
    if (tabMonthView) {
      tabMonthView.classList.remove("active");
      tabMonthView.setAttribute("aria-selected", "false");
    }
    if (panelUpcoming) panelUpcoming.style.display = "block";
    if (panelMonthView) panelMonthView.style.display = "none";
    if (scheduleSubtitle) scheduleSubtitle.textContent = "Upcoming collections for your address";
  } else {
    if (tabMonthView) {
      tabMonthView.classList.add("active");
      tabMonthView.setAttribute("aria-selected", "true");
    }
    if (tabUpcoming) {
      tabUpcoming.classList.remove("active");
      tabUpcoming.setAttribute("aria-selected", "false");
    }
    if (panelMonthView) panelMonthView.style.display = "block";
    if (panelUpcoming) panelUpcoming.style.display = "none";
    if (scheduleSubtitle) scheduleSubtitle.textContent = "September 2026";
  }
}

if (tabUpcoming && tabMonthView) {
  tabUpcoming.addEventListener("click", () => switchScheduleTab("upcoming"));
  tabMonthView.addEventListener("click", () => switchScheduleTab("month"));
}

// Calendar Day Selection Logic (Image 2: 07 / Month calendar)
const calGridDays = document.getElementById("calGridDays");
const calCalloutBox = document.getElementById("calCalloutBox");

const calendarCollectionMap = {
  "25": {
    title: "Fri 25 Sept · Collection moved",
    bins: "General waste + Recycling"
  },
  "4": {
    title: "Fri 4 Sept · Collection",
    bins: "General waste + Recycling"
  },
  "11": {
    title: "Fri 11 Sept · Collection",
    bins: "General waste + Garden"
  },
  "18": {
    title: "Fri 18 Sept · Collection",
    bins: "General waste + Recycling"
  }
};

if (calGridDays && calCalloutBox) {
  calGridDays.querySelectorAll(".cal-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      calGridDays.querySelectorAll(".cal-cell").forEach(c => c.classList.remove("is-selected"));
      cell.classList.add("is-selected");

      const day = cell.getAttribute("data-day");
      if (calendarCollectionMap[day]) {
        calCalloutBox.innerHTML = `
          <strong>${calendarCollectionMap[day].title}</strong>
          <span>${calendarCollectionMap[day].bins}</span>
        `;
      } else {
        calCalloutBox.innerHTML = `
          <strong>${day} Sept · No collection</strong>
          <span>Standard collections run on Thursdays/Fridays</span>
        `;
      }
    });
  });
}

// Add to Calendar (.ics Download)
const downloadIcsBtn = document.getElementById("downloadIcsBtn");
if (downloadIcsBtn) {
  downloadIcsBtn.addEventListener("click", () => {
    const address = homeAddressLabel ? homeAddressLabel.textContent : "12 Greenview Ave, Riverton";
    const events = [
      { date: "20260925", summary: "EcoTrack: General + Recycling Collection", desc: "Moved from Thu 24 Sept. Place red and yellow lid bins out by 7:00 am." },
      { date: "20261001", summary: "EcoTrack: General + Garden Collection", desc: "Place red and green lid bins out by 7:00 am." },
      { date: "20261008", summary: "EcoTrack: General + Recycling Collection", desc: "Place red and yellow lid bins out by 7:00 am." },
      { date: "20261015", summary: "EcoTrack: General + Garden Collection", desc: "Place red and green lid bins out by 7:00 am." }
    ];

    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EcoTrack//Waste Collection Schedule//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";
    events.forEach((ev, idx) => {
      ics += "BEGIN:VEVENT\r\n";
      ics += `UID:ecotrack-col-${idx + 1}@riverton.council\r\n`;
      ics += `DTSTAMP:${ev.date}T000000Z\r\n`;
      ics += `DTSTART;VALUE=DATE:${ev.date}\r\n`;
      ics += `SUMMARY:${ev.summary}\r\n`;
      ics += `DESCRIPTION:${ev.desc}\r\n`;
      ics += `LOCATION:${address}\r\n`;
      ics += "STATUS:CONFIRMED\r\n";
      ics += "END:VEVENT\r\n";
    });
    ics += "END:VCALENDAR\r\n";

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = "ecotrack-collection-schedule.ics";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  });
}

// Start on Onboarding Welcome UI
showScreen("welcome");
