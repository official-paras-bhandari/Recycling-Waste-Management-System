// ==========================================================
// EcoTrack End-to-End Walkthrough & Resident Home Logic
// ==========================================================

// Screens
const screens = {
  welcome: document.getElementById("screenWelcome"),
  address: document.getElementById("screenAddress"),
  bins: document.getElementById("screenBins"),
  reminders: document.getElementById("screenReminders"),
  home: document.getElementById("screenHome")
};

// Top prototype buttons
const protoBtns = {
  welcome: document.getElementById("protoGoWelcome"),
  address: document.getElementById("protoGoAddress"),
  bins: document.getElementById("protoGoBins"),
  reminders: document.getElementById("protoGoReminders"),
  home: document.getElementById("protoGoHome")
};

function navigateTo(screenKey) {
  Object.keys(screens).forEach(key => {
    if (screens[key]) {
      screens[key].style.display = key === screenKey ? "block" : "none";
    }
    if (protoBtns[key]) {
      protoBtns[key].classList.toggle("active", key === screenKey);
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Prototype bar clicks
protoBtns.welcome.addEventListener("click", () => navigateTo("welcome"));
protoBtns.address.addEventListener("click", () => navigateTo("address"));
protoBtns.bins.addEventListener("click", () => navigateTo("bins"));
protoBtns.reminders.addEventListener("click", () => navigateTo("reminders"));
protoBtns.home.addEventListener("click", () => navigateTo("home"));

// ==========================================================
// SCREEN 01: Welcome -> 02 Find Address
// ==========================================================
document.getElementById("welcomeStartBtn").addEventListener("click", () => {
  navigateTo("address");
});

// ==========================================================
// SCREEN 02: Address Search -> 03 Confirm Bins
// ==========================================================
document.getElementById("backToWelcomeBtn").addEventListener("click", () => {
  navigateTo("welcome");
});

const homeAddressLabel = document.getElementById("homeAddressLabel");
const addressSearchInput = document.getElementById("addressSearchInput");

document.querySelectorAll(".suggestion-card").forEach(card => {
  card.addEventListener("click", () => {
    const chosen = card.getAttribute("data-addr");
    if (homeAddressLabel) homeAddressLabel.textContent = chosen.split(",")[0];
    if (addressSearchInput) addressSearchInput.value = chosen;
    navigateTo("bins");
  });
});

document.getElementById("useLocationBtn").addEventListener("click", () => {
  if (homeAddressLabel) homeAddressLabel.textContent = "12 Greenview Ave";
  navigateTo("bins");
});

// ==========================================================
// SCREEN 03: Confirm Bins -> 04 Reminders
// ==========================================================
document.getElementById("backToAddressBtn").addEventListener("click", () => {
  navigateTo("address");
});

document.getElementById("confirmBinsBtn").addEventListener("click", () => {
  navigateTo("reminders");
});

document.getElementById("reportMismatchBtn").addEventListener("click", () => {
  alert("Feedback received: We will review the council bin mapping for your address.");
});

// ==========================================================
// SCREEN 04: Enable Reminders -> 05 Resident Home
// ==========================================================
document.getElementById("backToBinsBtn").addEventListener("click", () => {
  navigateTo("bins");
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
  navigateTo("home");
});

// ==========================================================
// SCREEN 05: Resident Home Interactive Handlers
// ==========================================================

// Change address button in header returns to address screen
document.getElementById("homeChangeAddrBtn").addEventListener("click", () => {
  navigateTo("address");
});

// Brand click goes to Home or Welcome
document.getElementById("homeBrandClick").addEventListener("click", (e) => {
  e.preventDefault();
  navigateTo("home");
});

// Report Flag Modal
const reportProblemModal = document.getElementById("reportProblemModal");
const homeReportFlagBtn = document.getElementById("homeReportFlagBtn");
const closeReportModalX = document.getElementById("closeReportModalX");
const submitIssueBtn = document.getElementById("submitIssueBtn");
const issueSubmittedFeedback = document.getElementById("issueSubmittedFeedback");

homeReportFlagBtn.addEventListener("click", () => {
  issueSubmittedFeedback.style.display = "none";
  reportProblemModal.style.display = "flex";
});

closeReportModalX.addEventListener("click", () => {
  reportProblemModal.style.display = "none";
});

document.querySelectorAll(".issue-radio-box").forEach(box => {
  box.addEventListener("click", () => {
    document.querySelectorAll(".issue-radio-box").forEach(b => b.classList.remove("selected"));
    box.classList.add("selected");
    box.querySelector("input").checked = true;
  });
});

submitIssueBtn.addEventListener("click", () => {
  issueSubmittedFeedback.style.display = "block";
  setTimeout(() => {
    reportProblemModal.style.display = "none";
  }, 1200);
});

// Full Schedule Modal
const fullScheduleModal = document.getElementById("fullScheduleModal");
const homeViewScheduleBtn = document.getElementById("homeViewScheduleBtn");
const closeScheduleModalX = document.getElementById("closeScheduleModalX");

homeViewScheduleBtn.addEventListener("click", () => {
  fullScheduleModal.style.display = "flex";
});

closeScheduleModalX.addEventListener("click", () => {
  fullScheduleModal.style.display = "none";
});

// Close modal on outside click
[reportProblemModal, fullScheduleModal].forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// What can I recycle search
const recycleData = [
  { item: "Plastic bottle", answer: "Yellow-lid bin (Recycling). Rinse and keep cap on." },
  { item: "Cardboard box", answer: "Yellow-lid bin (Recycling). Flatten completely." },
  { item: "Batteries", answer: "Dedicated drop-off depot. Never in kerbside bins." },
  { item: "Food scraps", answer: "Green-lid bin (Garden & food organics)." },
  { item: "Pizza box", answer: "Yellow-lid if clean; general waste if greasy base." }
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

// Initialize on Home (or Welcome if preferred)
navigateTo("home");
