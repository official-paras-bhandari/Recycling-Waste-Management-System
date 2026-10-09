// ==========================================================
// EcoTrack Resident Home System Logic (Image 3)
// ==========================================================

// Address Switcher Modal
const addressChangeModal = document.getElementById("addressChangeModal");
const homeChangeAddrBtn = document.getElementById("homeChangeAddrBtn");
const closeAddressModalX = document.getElementById("closeAddressModalX");
const homeAddressLabel = document.getElementById("homeAddressLabel");

homeChangeAddrBtn.addEventListener("click", () => {
  addressChangeModal.style.display = "flex";
});

closeAddressModalX.addEventListener("click", () => {
  addressChangeModal.style.display = "none";
});

document.querySelectorAll(".addr-item-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".addr-item-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    homeAddressLabel.textContent = btn.getAttribute("data-addr");
    addressChangeModal.style.display = "none";
  });
});

// Report Flag Modal (Header red flag)
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

// Close modals when clicking outside
[reportProblemModal, fullScheduleModal, addressChangeModal].forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
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
