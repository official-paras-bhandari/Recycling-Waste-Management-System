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
const scheduleAddressLabel = document.getElementById("scheduleAddressLabel");
const addressSearchInput = document.getElementById("addressSearchInput");

function updateAddressDisplay(fullAddress) {
  const shortAddr = fullAddress.split(",")[0].trim();
  if (homeAddressLabel) homeAddressLabel.textContent = shortAddr;
  if (scheduleAddressLabel) scheduleAddressLabel.textContent = shortAddr;
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

// Reminder toggles synchronized across Home & Schedule
const homeReminderToggle = document.getElementById("homeReminderToggle");
const scheduleReminderToggle = document.getElementById("scheduleReminderToggle");

function syncReminders(isActive) {
  if (homeReminderToggle) homeReminderToggle.checked = isActive;
  if (scheduleReminderToggle) scheduleReminderToggle.checked = isActive;
  localStorage.setItem("ecotrack_reminder_active", isActive);
}

if (homeReminderToggle) {
  homeReminderToggle.addEventListener("change", () => syncReminders(homeReminderToggle.checked));
}
if (scheduleReminderToggle) {
  scheduleReminderToggle.addEventListener("change", () => syncReminders(scheduleReminderToggle.checked));
}

// Restore saved reminder state
const savedReminder = localStorage.getItem("ecotrack_reminder_active");
if (savedReminder !== null) {
  syncReminders(savedReminder === "true");
}

// ==========================================================
// SCREEN 06: FULL COLLECTION SCHEDULE LOGIC
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

const scheduleChangeAddrBtn = document.getElementById("scheduleChangeAddrBtn");
if (scheduleChangeAddrBtn) {
  scheduleChangeAddrBtn.addEventListener("click", () => showScreen("address"));
}

// Schedule Master Dataset (Riverton Council Kerbside Collections)
const scheduleCollections = [
  {
    id: "col-1",
    date: "2026-09-25",
    year: 2026,
    month: 8, // September (0-indexed)
    day: 25,
    dayName: "Friday",
    formattedDate: "Friday, 25 Sep",
    monthName: "September 2026",
    isNext: true,
    holidayNote: "Rescheduled from Thu 24 Sep due to Riverton Council public holiday",
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-2",
    date: "2026-10-01",
    year: 2026,
    month: 9, // October
    day: 1,
    dayName: "Thursday",
    formattedDate: "Thursday, 1 Oct",
    monthName: "October 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-3",
    date: "2026-10-08",
    year: 2026,
    month: 9,
    day: 8,
    dayName: "Thursday",
    formattedDate: "Thursday, 8 Oct",
    monthName: "October 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-4",
    date: "2026-10-15",
    year: 2026,
    month: 9,
    day: 15,
    dayName: "Thursday",
    formattedDate: "Thursday, 15 Oct",
    monthName: "October 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-5",
    date: "2026-10-22",
    year: 2026,
    month: 9,
    day: 22,
    dayName: "Thursday",
    formattedDate: "Thursday, 22 Oct",
    monthName: "October 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-6",
    date: "2026-10-29",
    year: 2026,
    month: 9,
    day: 29,
    dayName: "Thursday",
    formattedDate: "Thursday, 29 Oct",
    monthName: "October 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-7",
    date: "2026-11-05",
    year: 2026,
    month: 10, // November
    day: 5,
    dayName: "Thursday",
    formattedDate: "Thursday, 5 Nov",
    monthName: "November 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-8",
    date: "2026-11-12",
    year: 2026,
    month: 10,
    day: 12,
    dayName: "Thursday",
    formattedDate: "Thursday, 12 Nov",
    monthName: "November 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-9",
    date: "2026-11-19",
    year: 2026,
    month: 10,
    day: 19,
    dayName: "Thursday",
    formattedDate: "Thursday, 19 Nov",
    monthName: "November 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-10",
    date: "2026-11-26",
    year: 2026,
    month: 10,
    day: 26,
    dayName: "Thursday",
    formattedDate: "Thursday, 26 Nov",
    monthName: "November 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-11",
    date: "2026-12-03",
    year: 2026,
    month: 11, // December
    day: 3,
    dayName: "Thursday",
    formattedDate: "Thursday, 3 Dec",
    monthName: "December 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-12",
    date: "2026-12-10",
    year: 2026,
    month: 11,
    day: 10,
    dayName: "Thursday",
    formattedDate: "Thursday, 10 Dec",
    monthName: "December 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-13",
    date: "2026-12-17",
    year: 2026,
    month: 11,
    day: 17,
    dayName: "Thursday",
    formattedDate: "Thursday, 17 Dec",
    monthName: "December 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-14",
    date: "2026-12-24",
    year: 2026,
    month: 11,
    day: 24,
    dayName: "Thursday",
    formattedDate: "Thursday, 24 Dec",
    monthName: "December 2026",
    isNext: false,
    bins: ["red", "green"],
    timing: "Put bins out before 7:00 am"
  },
  {
    id: "col-15",
    date: "2026-12-31",
    year: 2026,
    month: 11,
    day: 31,
    dayName: "Thursday",
    formattedDate: "Thursday, 31 Dec",
    monthName: "December 2026",
    isNext: false,
    bins: ["red", "yellow"],
    timing: "Put bins out before 7:00 am"
  }
];

// Bin metadata configurations
const binDetailsConfig = {
  red: {
    label: "General waste",
    sub: "Red lid · Weekly",
    figClass: "bin-red-fig",
    dotClass: "red-dot",
    hint: "General household items"
  },
  yellow: {
    label: "Recycling",
    sub: "Yellow lid · Fortnightly",
    figClass: "bin-yellow-fig",
    dotClass: "yellow-dot",
    hint: "Paper, plastics, glass & tins"
  },
  green: {
    label: "Garden & food",
    sub: "Green lid · Fortnightly",
    figClass: "bin-green-fig",
    dotClass: "green-dot",
    hint: "Food scraps & garden organics"
  }
};

let currentBinFilter = "all";

// Render Timeline Collections
const scheduleTimelineContent = document.getElementById("scheduleTimelineContent");

function renderTimeline() {
  if (!scheduleTimelineContent) return;

  const filtered = scheduleCollections.filter(item => {
    if (currentBinFilter === "all") return true;
    return item.bins.includes(currentBinFilter);
  });

  if (filtered.length === 0) {
    scheduleTimelineContent.innerHTML = `
      <div class="schedule-card" style="text-align: center; padding: 40px 20px;">
        <h3 style="margin-bottom: 8px;">No collections found for this filter</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Select "All Bins" to view complete kerbside schedule.</p>
      </div>
    `;
    return;
  }

  // Group items by month
  const grouped = {};
  filtered.forEach(item => {
    if (!grouped[item.monthName]) {
      grouped[item.monthName] = [];
    }
    grouped[item.monthName].push(item);
  });

  let html = "";
  Object.keys(grouped).forEach(monthTitle => {
    const items = grouped[monthTitle];
    html += `
      <div class="timeline-month-block">
        <div class="timeline-month-heading">
          <span>${monthTitle}</span>
          <span class="timeline-month-count">${items.length} collection${items.length > 1 ? "s" : ""}</span>
        </div>
        <div class="timeline-cards-list">
    `;

    items.forEach(c => {
      const isNextClass = c.isNext ? "is-next" : "";
      const nextBadge = c.isNext ? `<span class="pill-badge pill-in-days">NEXT COLLECTION</span>` : "";
      const holidayBadge = c.holidayNote ? `<span class="pill-badge pill-usually">Public Holiday Adjustment</span>` : "";

      const binsHtml = c.bins.map(b => {
        const info = binDetailsConfig[b];
        return `
          <div class="bin-entry-pill">
            <div class="bin-figure ${info.figClass}">
              <div class="fig-lid"></div>
              <div class="fig-body"></div>
            </div>
            <div class="bin-entry-text">
              <strong>${info.label}</strong>
              <span>${info.sub}</span>
            </div>
          </div>
        `;
      }).join("");

      html += `
        <div class="schedule-card ${isNextClass}" id="${c.id}">
          <div class="card-top-meta">
            <div class="card-date-badge-wrap">
              <h2 class="card-date-title">${c.formattedDate}</h2>
              ${nextBadge}
              ${holidayBadge}
            </div>
            <div class="card-timing-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>${c.timing}</span>
            </div>
          </div>

          ${c.holidayNote ? `<p style="font-size: 0.88rem; color: #92400E; margin-bottom: 12px; font-weight: 500;">Notice: ${c.holidayNote}</p>` : ""}

          <div class="card-bins-list">
            ${binsHtml}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  scheduleTimelineContent.innerHTML = html;
}

// Filter chip handlers
document.querySelectorAll(".bin-filter-chips .filter-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".bin-filter-chips .filter-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentBinFilter = chip.getAttribute("data-filter");
    renderTimeline();
  });
});

// View switcher: Timeline vs Calendar
const viewTimelineBtn = document.getElementById("viewTimelineBtn");
const viewCalendarBtn = document.getElementById("viewCalendarBtn");
const scheduleTimelineView = document.getElementById("scheduleTimelineView");
const scheduleCalendarView = document.getElementById("scheduleCalendarView");

if (viewTimelineBtn && viewCalendarBtn) {
  viewTimelineBtn.addEventListener("click", () => {
    viewTimelineBtn.classList.add("active");
    viewCalendarBtn.classList.remove("active");
    scheduleTimelineView.style.display = "block";
    scheduleCalendarView.style.display = "none";
  });

  viewCalendarBtn.addEventListener("click", () => {
    viewCalendarBtn.classList.add("active");
    viewTimelineBtn.classList.remove("active");
    scheduleTimelineView.style.display = "none";
    scheduleCalendarView.style.display = "block";
    renderCalendar(calendarState.year, calendarState.month);
  });
}

// ==========================================================
// Interactive Monthly Calendar View
// ==========================================================
const calendarState = {
  year: 2026,
  month: 8, // September 2026
  selectedDate: "2026-09-25"
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const calCurrentMonthTitle = document.getElementById("calCurrentMonthTitle");
const calendarDaysGrid = document.getElementById("calendarDaysGrid");
const calSelectedDayDetails = document.getElementById("calSelectedDayDetails");
const calPrevMonthBtn = document.getElementById("calPrevMonthBtn");
const calNextMonthBtn = document.getElementById("calNextMonthBtn");

function renderCalendar(year, month) {
  if (!calendarDaysGrid || !calCurrentMonthTitle) return;

  calCurrentMonthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // Convert Sunday (0) to 7 for Mon-Sun week
  let startDayOfWeek = firstDay.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek; // 1: Mon, ..., 7: Sun

  // Days from previous month to fill the first row
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const leadingBlanks = startDayOfWeek - 1;

  let daysHtml = "";

  // Leading days
  for (let i = leadingBlanks; i > 0; i--) {
    const dayNum = prevMonthLastDay - i + 1;
    daysHtml += `<div class="cal-day-cell other-month"><span>${dayNum}</span></div>`;
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    const collection = scheduleCollections.find(c => c.date === dateKey);
    const isSelected = calendarState.selectedDate === dateKey;
    const isNext = collection && collection.isNext;

    let dotsHtml = "";
    let cellClass = "cal-day-cell";

    if (collection) {
      cellClass += " is-collection";
      dotsHtml = `<div class="cal-dots-row">` + collection.bins.map(b => {
        const dotColor = b === "red" ? "red-dot" : b === "yellow" ? "yellow-dot" : "green-dot";
        return `<span class="cal-dot ${dotColor}"></span>`;
      }).join("") + `</div>`;
    }

    if (isSelected) {
      cellClass += " selected";
    }
    if (isNext) {
      cellClass += " is-today";
    }

    daysHtml += `
      <div class="${cellClass}" data-date="${dateKey}">
        <span>${d}</span>
        ${dotsHtml}
      </div>
    `;
  }

  // Trailing blanks for uniform grid
  const totalSlots = leadingBlanks + totalDays;
  const trailingBlanks = (7 - (totalSlots % 7)) % 7;
  for (let j = 1; j <= trailingBlanks; j++) {
    daysHtml += `<div class="cal-day-cell other-month"><span>${j}</span></div>`;
  }

  calendarDaysGrid.innerHTML = daysHtml;

  // Add click handlers on day cells
  calendarDaysGrid.querySelectorAll(".cal-day-cell:not(.other-month)").forEach(cell => {
    cell.addEventListener("click", () => {
      calendarDaysGrid.querySelectorAll(".cal-day-cell").forEach(c => c.classList.remove("selected"));
      cell.classList.add("selected");
      const d = cell.getAttribute("data-date");
      calendarState.selectedDate = d;
      renderCalendarSelectedDetails(d);
    });
  });

  renderCalendarSelectedDetails(calendarState.selectedDate);
}

function renderCalendarSelectedDetails(dateKey) {
  if (!calSelectedDayDetails) return;

  const collection = scheduleCollections.find(c => c.date === dateKey);

  if (!collection) {
    const dateObj = new Date(dateKey + "T00:00:00");
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const dateLabel = isNaN(dateObj.getTime()) ? dateKey : dateObj.toLocaleDateString("en-AU", options);

    calSelectedDayDetails.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <strong style="font-size: 1.05rem;">${dateLabel}</strong>
        <span class="pill-badge" style="background: #F3F4F6; color: var(--text-muted);">No Kerbside Collection</span>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">No bins scheduled for collection on this day. Standard Riverton collections occur on Thursdays.</p>
    `;
    return;
  }

  const nextBadge = collection.isNext ? `<span class="pill-badge pill-in-days">NEXT COLLECTION</span>` : "";
  const holidayBadge = collection.holidayNote ? `<span class="pill-badge pill-usually">Holiday Adjustment</span>` : "";

  const binsHtml = collection.bins.map(b => {
    const info = binDetailsConfig[b];
    return `
      <div class="bin-entry-pill" style="margin-bottom: 8px;">
        <div class="bin-figure ${info.figClass}">
          <div class="fig-lid"></div>
          <div class="fig-body"></div>
        </div>
        <div class="bin-entry-text">
          <strong>${info.label} (${info.sub.split("·")[0].trim()})</strong>
          <span>${info.hint}</span>
        </div>
      </div>
    `;
  }).join("");

  calSelectedDayDetails.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 2px;">${collection.formattedDate}</h3>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${collection.timing}</span>
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        ${nextBadge}
        ${holidayBadge}
      </div>
    </div>
    ${collection.holidayNote ? `<p style="font-size: 0.86rem; color: #92400E; margin-bottom: 12px; font-weight: 500;">${collection.holidayNote}</p>` : ""}
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
      ${binsHtml}
    </div>
  `;
}

if (calPrevMonthBtn) {
  calPrevMonthBtn.addEventListener("click", () => {
    if (calendarState.month === 8) return; // Keep demo range Sept-Dec 2026
    calendarState.month--;
    renderCalendar(calendarState.year, calendarState.month);
  });
}

if (calNextMonthBtn) {
  calNextMonthBtn.addEventListener("click", () => {
    if (calendarState.month === 11) return; // Keep demo range Sept-Dec 2026
    calendarState.month++;
    renderCalendar(calendarState.year, calendarState.month);
  });
}

// ==========================================================
// EXPORT & PRINT HANDLERS
// ==========================================================

// 1. Add to Calendar (.ics download)
const downloadIcsBtn = document.getElementById("downloadIcsBtn");
if (downloadIcsBtn) {
  downloadIcsBtn.addEventListener("click", () => {
    const address = homeAddressLabel ? homeAddressLabel.textContent : "12 Greenview Ave, Riverton";
    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EcoTrack//Waste Collection Schedule//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";

    scheduleCollections.forEach(c => {
      const dtDate = c.date.replace(/-/g, "");
      const binNames = c.bins.map(b => binDetailsConfig[b].label).join(" & ");
      const summary = `EcoTrack: ${binNames} Collection`;
      const description = `Put bins out by 7:00 am. Address: ${address}. ${c.holidayNote || ""}`;

      ics += "BEGIN:VEVENT\r\n";
      ics += `UID:ecotrack-${c.id}@riverton.council\r\n`;
      ics += `DTSTAMP:${dtDate}T000000Z\r\n`;
      ics += `DTSTART;VALUE=DATE:${dtDate}\r\n`;
      ics += `SUMMARY:${summary}\r\n`;
      ics += `DESCRIPTION:${description}\r\n`;
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

// 2. Print / Save PDF
const printScheduleBtn = document.getElementById("printScheduleBtn");
if (printScheduleBtn) {
  printScheduleBtn.addEventListener("click", () => {
    window.print();
  });
}

// Initialise Timeline View
renderTimeline();

// Start on Onboarding Welcome UI
showScreen("welcome");
