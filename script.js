// EcoTrack Minimalist Logic (Home Only)

// Council Verified Recycling Database
const recyclingDatabase = [
  { name: "Plastic drink bottle", bin: "Yellow-lid bin", tip: "Rinse and leave cap on." },
  { name: "Cardboard box", bin: "Yellow-lid bin", tip: "Flatten completely." },
  { name: "Pizza box (clean top)", bin: "Yellow-lid bin", tip: "Greasy base goes in general waste." },
  { name: "Batteries (AA, AAA)", bin: "Drop-off only", tip: "Never put in kerbside bins. Fire hazard." },
  { name: "Food scraps & fruit peels", bin: "Green-lid bin", tip: "Garden & food organics." },
  { name: "Soft plastic & bread bags", bin: "Red-lid bin", tip: "Kerbside general waste." },
  { name: "Glass jars & wine bottles", bin: "Yellow-lid bin", tip: "Rinse clean. Lids can stay on." }
];

// Recycling Search
const searchInput = document.getElementById("recycleSearch");
const searchClear = document.getElementById("searchClear");
const searchDropdown = document.getElementById("searchDropdown");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    searchClear.style.display = "none";
    searchDropdown.style.display = "none";
    return;
  }
  searchClear.style.display = "block";
  const matches = recyclingDatabase.filter(item => 
    item.name.toLowerCase().includes(q) || item.bin.toLowerCase().includes(q)
  );
  searchResults.innerHTML = "";
  if (matches.length === 0) {
    searchResults.innerHTML = `<p style="font-size:0.85rem;color:var(--text-muted);padding:4px;">No match in council guide.</p>`;
  } else {
    matches.forEach(item => {
      const el = document.createElement("div");
      el.className = "search-result-card";
      el.innerHTML = `<strong>Put in: ${item.bin}</strong><p>${item.name} — ${item.tip}</p>`;
      searchResults.appendChild(el);
    });
  }
  searchDropdown.style.display = "block";
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.style.display = "none";
  searchDropdown.style.display = "none";
  searchInput.focus();
});

// Modals Helper
function showModal(id) {
  document.getElementById(id).classList.add("active");
  document.body.style.overflow = "hidden";
}
function hideModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "auto";
}

// Report Modal
const reportFlagBtn = document.getElementById("reportFlagBtn");
const closeReportBtn = document.getElementById("closeReportBtn");
const submitDemoReportBtn = document.getElementById("submitDemoReportBtn");
const reportConfirmNotice = document.getElementById("reportConfirmNotice");
const demoRefId = document.getElementById("demoRefId");

reportFlagBtn.addEventListener("click", () => {
  reportConfirmNotice.style.display = "none";
  showModal("reportOverlay");
});
closeReportBtn.addEventListener("click", () => hideModal("reportOverlay"));

// Radio Selection
document.querySelectorAll(".issue-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".issue-item").forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");
    item.querySelector("input").checked = true;
  });
});

submitDemoReportBtn.addEventListener("click", () => {
  const ref = "ECO-" + Math.floor(10000 + Math.random() * 90000);
  demoRefId.textContent = ref;
  reportConfirmNotice.style.display = "block";
  setTimeout(() => hideModal("reportOverlay"), 1400);
});

// Schedule Modal
const viewScheduleBtn = document.getElementById("viewScheduleBtn");
const closeScheduleBtn = document.getElementById("closeScheduleBtn");
const dlIcsBtn = document.getElementById("dlIcsBtn");
function openSched() { showModal("scheduleOverlay"); }
viewScheduleBtn.addEventListener("click", openSched);
closeScheduleBtn.addEventListener("click", () => hideModal("scheduleOverlay"));

dlIcsBtn.addEventListener("click", () => {
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EcoTrack//Schedule//EN\nBEGIN:VEVENT\nSUMMARY:EcoTrack: Red + Yellow Bin Collection\nDTSTART:20260925T070000\nDTEND:20260925T080000\nLOCATION:12 Greenview Ave, Riverton\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ecotrack_collection.ics";
  a.click();
});

// Address Switcher
const changeAddressBtn = document.getElementById("changeAddressBtn");
const closeAddressBtn = document.getElementById("closeAddressBtn");
const addressDisplay = document.getElementById("addressDisplay");

function openAddr() { showModal("addressOverlay"); }
changeAddressBtn.addEventListener("click", openAddr);
closeAddressBtn.addEventListener("click", () => hideModal("addressOverlay"));

document.querySelectorAll(".addr-choice").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".addr-choice").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    addressDisplay.textContent = b.getAttribute("data-addr");
    hideModal("addressOverlay");
  });
});

// Secondary Actions
document.getElementById("bulkyBtn").addEventListener("click", () => {
  alert("Bulky pickup booking is subject to council quota (Prototype concept).");
});
document.getElementById("centreBtn").addEventListener("click", () => {
  alert("Riverton Resource Recovery Centre: 45 Quarry Rd (Open Sat–Wed 8am–4pm).");
});
