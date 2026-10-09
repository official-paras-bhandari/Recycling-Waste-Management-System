// ==========================================================
// EcoTrack System Script (DAT709 Capstone Prototype)
// ==========================================================

// 1. Council Verified Recycling Guidance (Section 04-D)
const recyclingDatabase = [
  {
    name: "Plastic drink bottles & milk jugs",
    bin: "Yellow-lid bin",
    badgeClass: "badge-yellow",
    accepted: true,
    instructions: "Rinse clean and leave screw lids attached. Do not crush completely flat.",
    source: "City of Riverton · Verified Sep 2026"
  },
  {
    name: "Cardboard boxes & packaging",
    bin: "Yellow-lid bin",
    badgeClass: "badge-yellow",
    accepted: true,
    instructions: "Flatten completely. Remove heavy plastic packing tape and polystyrene foam.",
    source: "City of Riverton · Verified Sep 2026"
  },
  {
    name: "Pizza boxes (clean lid / greasy base)",
    bin: "Yellow-lid bin (Clean lid) / Green or Red (Greasy base)",
    badgeClass: "badge-yellow",
    accepted: true,
    instructions: "Tear off clean top for recycling. Food-soiled greasy base goes into compost or general waste.",
    source: "City of Riverton · Verified Sep 2026"
  },
  {
    name: "Household batteries (AA, AAA, button cells)",
    bin: "Dedicated Drop-off (Never in kerbside bins)",
    badgeClass: "badge-special",
    accepted: false,
    instructions: "Fire risk in collection trucks. Tape battery terminals and take to local supermarket or disposal hub.",
    source: "B-cycle National Stewardship · Verified Aug 2026"
  },
  {
    name: "Food scraps & fruit peels",
    bin: "Green-lid bin (Garden & food)",
    badgeClass: "badge-green",
    accepted: true,
    instructions: "Wrap in council-approved compostable liners or place loose in the green bin.",
    source: "City of Riverton · Verified Sep 2026"
  },
  {
    name: "Soft plastics & plastic bags",
    bin: "Red-lid bin (General waste)",
    badgeClass: "badge-red",
    accepted: false,
    instructions: "Soft plastic tangles sorting machinery. Place in red general bin or check specialized store return.",
    source: "City of Riverton · Verified Sep 2026"
  },
  {
    name: "Glass wine bottles & pasta sauce jars",
    bin: "Yellow-lid bin",
    badgeClass: "badge-yellow",
    accepted: true,
    instructions: "Rinse food residues thoroughly. Metal lids can remain on jars or be placed in yellow bin.",
    source: "City of Riverton · Verified Sep 2026"
  },
  {
    name: "Old computers, tablets & cables (E-Waste)",
    bin: "Disposal Centre / E-Waste Depot",
    badgeClass: "badge-special",
    accepted: false,
    instructions: "Do not bin. Contains hazardous heavy metals. Drop off at Riverton Resource Recovery Centre.",
    source: "National Television and Computer Recycling Scheme"
  }
];

// 2. Greeting based on current time
function updateGreeting() {
  const greetingEl = document.getElementById("greetingText");
  if (!greetingEl) return;
  const hour = new Date().getHours();
  let timeStr = "Good afternoon";
  if (hour < 12) timeStr = "Good morning";
  else if (hour >= 18) timeStr = "Good evening";
  greetingEl.textContent = `${timeStr}, John`;
}

// 3. Search Guidance Logic
const itemSearchInput = document.getElementById("itemSearchInput");
const clearItemSearch = document.getElementById("clearItemSearch");
const searchResultsPanel = document.getElementById("searchResultsPanel");
const resultsList = document.getElementById("resultsList");
const resultsCount = document.getElementById("resultsCount");

function handleItemSearch() {
  const query = itemSearchInput.value.trim().toLowerCase();
  if (!query) {
    clearItemSearch.style.display = "none";
    searchResultsPanel.style.display = "none";
    return;
  }

  clearItemSearch.style.display = "block";
  const matches = recyclingDatabase.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.bin.toLowerCase().includes(query) ||
    item.instructions.toLowerCase().includes(query)
  );

  resultsList.innerHTML = "";
  if (matches.length === 0) {
    resultsCount.textContent = "No specific match found";
    resultsList.innerHTML = `
      <div class="result-item-card">
        <p style="font-size: 0.9rem; color: var(--text-muted);">
          Item not found in demo rules. When in doubt, avoid contaminating the yellow recycling bin. Check disposal centres for special items.
        </p>
      </div>
    `;
  } else {
    resultsCount.textContent = `${matches.length} result${matches.length > 1 ? "s" : ""} found`;
    matches.forEach(item => {
      const card = document.createElement("div");
      card.className = "result-item-card";
      card.innerHTML = `
        <div class="result-item-top">
          <strong>${item.name}</strong>
          <span class="result-bin-badge ${item.badgeClass}">${item.bin}</span>
        </div>
        <p class="result-item-instructions"><strong>Put in:</strong> ${item.bin}. ${item.instructions}</p>
        <span class="result-source-meta">Verified Rule: ${item.source}</span>
      `;
      resultsList.appendChild(card);
    });
  }

  searchResultsPanel.style.display = "block";
}

itemSearchInput.addEventListener("input", handleItemSearch);
clearItemSearch.addEventListener("click", () => {
  itemSearchInput.value = "";
  clearItemSearch.style.display = "none";
  searchResultsPanel.style.display = "none";
  itemSearchInput.focus();
});

// 4. Modal Helpers
function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
}

// 5. Report Problem Wizard (Screen 02 Blueprint)
const reportModal = document.getElementById("reportModal");
const headerReportBtn = document.getElementById("headerReportBtn");
const closeReportModalBtn = document.getElementById("closeReportModalBtn");
const reportStep1 = document.getElementById("reportStep1");
const reportStep2 = document.getElementById("reportStep2");
const reportStepSuccess = document.getElementById("reportStepSuccess");
const reportStepMyReports = document.getElementById("reportStepMyReports");

const reportNextBtn = document.getElementById("reportNextBtn");
const reportBackBtn = document.getElementById("reportBackBtn");
const reportDetailsForm = document.getElementById("reportDetailsForm");
const finishReportBtn = document.getElementById("finishReportBtn");
const openMyReportsBtn = document.getElementById("openMyReportsBtn");
const backToChooseIssueBtn = document.getElementById("backToChooseIssueBtn");

const binSelectGroup = document.getElementById("binSelectGroup");
const reportLocationInput = document.getElementById("reportLocation");
const locationHint = document.getElementById("locationHint");
const reportPhotoInput = document.getElementById("reportPhotoInput");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const photoPreviewWrap = document.getElementById("photoPreviewWrap");
const photoPreviewImg = document.getElementById("photoPreviewImg");
const removePhotoBtn = document.getElementById("removePhotoBtn");

let selectedCategory = "Missed collection";
let currentPhotoData = null;

// Issue Radio Card Clicks
const issueCards = document.querySelectorAll(".issue-option-card");
issueCards.forEach(card => {
  card.addEventListener("click", () => {
    issueCards.forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    const radio = card.querySelector("input[type='radio']");
    radio.checked = true;
    selectedCategory = radio.value;
  });
});

headerReportBtn.addEventListener("click", () => {
  showStep(reportStep1);
  openModal(reportModal);
});

closeReportModalBtn.addEventListener("click", () => {
  closeModal(reportModal);
});

function showStep(stepEl) {
  [reportStep1, reportStep2, reportStepSuccess, reportStepMyReports].forEach(step => {
    step.style.display = "none";
  });
  stepEl.style.display = "block";
}

// Proceed to Step 2 with conditional rules (Section 05)
reportNextBtn.addEventListener("click", () => {
  document.getElementById("step2Title").textContent = selectedCategory;
  
  if (selectedCategory === "Missed collection" || selectedCategory === "Damaged or missing bin") {
    binSelectGroup.style.display = "block";
    reportLocationInput.value = document.getElementById("currentAddress").textContent;
    locationHint.textContent = "Defaulting to registered household address.";
  } else if (selectedCategory === "Overflowing public bin" || selectedCategory === "Illegal dumping") {
    binSelectGroup.style.display = "none";
    reportLocationInput.value = "";
    reportLocationInput.placeholder = "e.g., Corner of Riverton Park & High St";
    locationHint.textContent = "Enter public street, park, or intersection name (never your home address).";
  } else {
    binSelectGroup.style.display = "none";
    reportLocationInput.value = document.getElementById("currentAddress").textContent;
    locationHint.textContent = "Enter relevant location for this issue.";
  }
  
  showStep(reportStep2);
});

reportBackBtn.addEventListener("click", () => {
  showStep(reportStep1);
});

// Photo upload preview handling
reportPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      currentPhotoData = evt.target.result;
      photoPreviewImg.src = currentPhotoData;
      photoPreviewWrap.style.display = "inline-block";
      uploadPlaceholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

removePhotoBtn.addEventListener("click", () => {
  reportPhotoInput.value = "";
  currentPhotoData = null;
  photoPreviewImg.src = "";
  photoPreviewWrap.style.display = "none";
  uploadPlaceholder.style.display = "flex";
});

// Submit Report (Persist in LocalStorage to satisfy Section 10 QA checklist)
reportDetailsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const referenceId = "ECO-" + Math.floor(10000 + Math.random() * 90000);
  const location = reportLocationInput.value.trim();
  const description = document.getElementById("reportDescription").value.trim();
  const binType = binSelectGroup.style.display !== "none" ? document.getElementById("reportBinType").value : null;
  const timestamp = new Date().toLocaleString();

  const newReport = {
    id: referenceId,
    category: selectedCategory,
    location,
    description,
    binType,
    photoAttached: !!currentPhotoData,
    date: timestamp,
    status: "Received (Demo)"
  };

  // Save to localStorage
  const existing = JSON.parse(localStorage.getItem("ecotrack_reports") || "[]");
  existing.unshift(newReport);
  localStorage.setItem("ecotrack_reports", JSON.stringify(existing));

  // Update Success Screen
  document.getElementById("submittedRefNumber").textContent = referenceId;
  document.getElementById("submittedTimestamp").textContent = timestamp;

  // Reset form
  reportDetailsForm.reset();
  removePhotoBtn.click();

  showStep(reportStepSuccess);
});

finishReportBtn.addEventListener("click", () => {
  closeModal(reportModal);
});

// My Reports List
function renderMyReports() {
  const reports = JSON.parse(localStorage.getItem("ecotrack_reports") || "[]");
  const container = document.getElementById("myReportsList");
  container.innerHTML = "";

  if (reports.length === 0) {
    container.innerHTML = `
      <div class="demo-callout" style="text-align: center;">
        No reports submitted yet. Submit a demo issue above to view status here.
      </div>
    `;
    return;
  }

  reports.forEach(r => {
    const card = document.createElement("div");
    card.className = "saved-report-card";
    card.innerHTML = `
      <div class="saved-report-top">
        <strong>${r.category}</strong>
        <span class="saved-report-status">${r.status}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">
        Ref: <strong>${r.id}</strong> • ${r.location}
      </p>
      <span style="font-size: 0.78rem; color: #9CA3AF;">Submitted: ${r.date}</span>
    `;
    container.appendChild(card);
  });
}

openMyReportsBtn.addEventListener("click", () => {
  renderMyReports();
  showStep(reportStepMyReports);
});

backToChooseIssueBtn.addEventListener("click", () => {
  showStep(reportStep1);
});

// 6. Schedule Modal & Export to Calendar (.ics)
const scheduleModal = document.getElementById("scheduleModal");
const viewFullScheduleBtn = document.getElementById("viewFullScheduleBtn");
const closeScheduleModalBtn = document.getElementById("closeScheduleModalBtn");
const exportCalendarBtn = document.getElementById("exportCalendarBtn");
const navScheduleLink = document.getElementById("navScheduleLink");
const tabSchedule = document.getElementById("tabSchedule");

function openSchedule() {
  openModal(scheduleModal);
}

viewFullScheduleBtn.addEventListener("click", openSchedule);
navScheduleLink.addEventListener("click", (e) => { e.preventDefault(); openSchedule(); });
tabSchedule.addEventListener("click", openSchedule);
closeScheduleModalBtn.addEventListener("click", () => closeModal(scheduleModal));

// Generate valid .ics file (Satisfies Section 04-C QA criteria)
exportCalendarBtn.addEventListener("click", () => {
  const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EcoTrack//Waste Collection Schedule//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:EcoTrack: Red + Yellow Bin Collection (Adjusted)
DESCRIPTION:General waste and recycling pickup moved to Friday due to public holiday.
DTSTART:20260925T070000
DTEND:20260925T080000
LOCATION:12 Greenview Ave, Riverton
END:VEVENT
BEGIN:VEVENT
SUMMARY:EcoTrack: Red + Green Bin Collection
DESCRIPTION:General waste and garden/food organic waste collection.
DTSTART:20261001T070000
DTEND:20261001T080000
LOCATION:12 Greenview Ave, Riverton
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.setAttribute("download", "ecotrack_schedule.ics");
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
});

// 7. Bulky Pickup Modal
const bulkyModal = document.getElementById("bulkyModal");
const bookBulkyPickupBtn = document.getElementById("bookBulkyPickupBtn");
const closeBulkyModalBtn = document.getElementById("closeBulkyModalBtn");
const bulkyForm = document.getElementById("bulkyForm");
const bulkySuccess = document.getElementById("bulkySuccess");

bookBulkyPickupBtn.addEventListener("click", () => {
  bulkyForm.style.display = "block";
  bulkySuccess.style.display = "none";
  openModal(bulkyModal);
});
closeBulkyModalBtn.addEventListener("click", () => closeModal(bulkyModal));

bulkyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  bulkyForm.style.display = "none";
  bulkySuccess.style.display = "block";
});

// 8. Disposal Centres Modal
const centresModal = document.getElementById("centresModal");
const findDisposalCentreBtn = document.getElementById("findDisposalCentreBtn");
const closeCentresModalBtn = document.getElementById("closeCentresModalBtn");
const navCentresLink = document.getElementById("navCentresLink");

function openCentres() {
  openModal(centresModal);
}
findDisposalCentreBtn.addEventListener("click", openCentres);
navCentresLink.addEventListener("click", (e) => { e.preventDefault(); openCentres(); });
closeCentresModalBtn.addEventListener("click", () => closeModal(centresModal));

// 9. Demo Address Switcher
const addressModal = document.getElementById("addressModal");
const changeAddressBtn = document.getElementById("changeAddressBtn");
const closeAddressModalBtn = document.getElementById("closeAddressModalBtn");
const currentAddressSpan = document.getElementById("currentAddress");

changeAddressBtn.addEventListener("click", () => openModal(addressModal));
closeAddressModalBtn.addEventListener("click", () => closeModal(addressModal));

document.querySelectorAll(".address-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".address-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const newAddr = btn.getAttribute("data-addr");
    const newName = btn.getAttribute("data-name");
    currentAddressSpan.textContent = newAddr;
    document.getElementById("greetingText").textContent = `Good afternoon, ${newName}`;
    closeModal(addressModal);
  });
});

// 10. Reminder Toggle Preference (Local Storage)
const reminderToggle = document.getElementById("reminderToggle");
reminderToggle.addEventListener("change", () => {
  localStorage.setItem("ecotrack_reminder_enabled", reminderToggle.checked);
});

// 11. Recycle & Account Nav Links
document.getElementById("navRecycleLink").addEventListener("click", (e) => {
  e.preventDefault();
  itemSearchInput.focus();
  itemSearchInput.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("tabRecycle").addEventListener("click", () => {
  itemSearchInput.focus();
  itemSearchInput.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("navAccountLink").addEventListener("click", (e) => {
  e.preventDefault();
  openModal(addressModal);
});

document.getElementById("tabAccount").addEventListener("click", () => {
  openModal(addressModal);
});

// Initialize greeting
updateGreeting();
