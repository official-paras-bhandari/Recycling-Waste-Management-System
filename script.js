// ==========================================================
// EcoTrack End-to-End Walkthrough Controller
// Screens: 01 Welcome -> 02 Find address -> 03 Confirm bins -> 04 Reminders -> 05 Resident Home
// ==========================================================

const screens = {
  1: document.getElementById("screen1"),
  2: document.getElementById("screen2"),
  3: document.getElementById("screen3"),
  4: document.getElementById("screen4"),
  5: document.getElementById("screen5")
};

const pills = document.querySelectorAll(".step-pill");
let chosenAddress = "12 Greenview Ave, Riverton";

// Switch active screen
function goToScreen(stepNumber) {
  // Hide all screens
  Object.values(screens).forEach(screen => {
    if (screen) screen.style.display = "none";
  });

  // Show target screen
  if (screens[stepNumber]) {
    screens[stepNumber].style.display = "flex";
    screens[stepNumber].scrollTop = 0;
  }

  // Update top walkthrough switcher pills
  pills.forEach(pill => {
    pill.classList.toggle("active", parseInt(pill.getAttribute("data-step")) === stepNumber);
  });
}

// Top walkthrough pills click listener
pills.forEach(pill => {
  pill.addEventListener("click", () => {
    const step = parseInt(pill.getAttribute("data-step"));
    goToScreen(step);
  });
});

// Flow transitions
// 01 Welcome -> 02 Find address
const btnToScreen2 = document.getElementById("btnToScreen2");
if (btnToScreen2) {
  btnToScreen2.addEventListener("click", () => goToScreen(2));
}

// 02 Back to 01
const backTo1 = document.getElementById("backTo1");
if (backTo1) {
  backTo1.addEventListener("click", () => goToScreen(1));
}

// 02 Address selection -> 03 Confirm bins
document.querySelectorAll(".suggest-card").forEach(card => {
  card.addEventListener("click", () => {
    chosenAddress = card.getAttribute("data-address");
    const shortAddr = chosenAddress.split(",")[0];
    const homeAddressText = document.getElementById("homeAddressText");
    if (homeAddressText) homeAddressText.textContent = shortAddr;
    goToScreen(3);
  });
});

const useCurrentLocationBtn = document.getElementById("useCurrentLocationBtn");
if (useCurrentLocationBtn) {
  useCurrentLocationBtn.addEventListener("click", () => {
    chosenAddress = "12 Greenview Ave, Riverton";
    goToScreen(3);
  });
}

// 03 Back to 02
const backTo2 = document.getElementById("backTo2");
if (backTo2) {
  backTo2.addEventListener("click", () => goToScreen(2));
}

// 03 Confirm bins -> 04 Reminders
const btnToScreen4 = document.getElementById("btnToScreen4");
if (btnToScreen4) {
  btnToScreen4.addEventListener("click", () => goToScreen(4));
}

// 03 Mismatch Link
const reportMismatchLink = document.getElementById("reportMismatchLink");
if (reportMismatchLink) {
  reportMismatchLink.addEventListener("click", () => {
    alert("Mismatch feedback recorded (Demo). We will verify your council area schedule.");
  });
}

// 04 Back to 03
const backTo3 = document.getElementById("backTo3");
if (backTo3) {
  backTo3.addEventListener("click", () => goToScreen(3));
}

// 04 Timing selection toggle
const timeNightBefore = document.getElementById("timeNightBefore");
const timeMorningOf = document.getElementById("timeMorningOf");
if (timeNightBefore && timeMorningOf) {
  timeNightBefore.addEventListener("click", () => {
    timeNightBefore.classList.add("active");
    timeMorningOf.classList.remove("active");
  });
  timeMorningOf.addEventListener("click", () => {
    timeMorningOf.classList.add("active");
    timeNightBefore.classList.remove("active");
  });
}

// 04 Finish setup -> 05 Resident Home
const btnToScreen5 = document.getElementById("btnToScreen5");
if (btnToScreen5) {
  btnToScreen5.addEventListener("click", () => goToScreen(5));
}

// 05 Resident Home "Change" -> returns to 02 Find address
const homeChangeAddrBtn = document.getElementById("homeChangeAddrBtn");
if (homeChangeAddrBtn) {
  homeChangeAddrBtn.addEventListener("click", () => goToScreen(2));
}

// 05 Report Flag button
const homeReportBtn = document.getElementById("homeReportBtn");
if (homeReportBtn) {
  homeReportBtn.addEventListener("click", () => {
    alert("Report issue hub: tap an issue (Missed collection, Damaged bin, Illegal dumping) to report to council.");
  });
}

// 05 View full schedule button
const btnViewFullSchedule = document.getElementById("btnViewFullSchedule");
if (btnViewFullSchedule) {
  btnViewFullSchedule.addEventListener("click", () => {
    alert("Full Schedule for " + chosenAddress + ":\n• Fri 25 Sep: General + Recycling (Moved from Thu 24 due to holiday)\n• Thu 01 Oct: General + Garden & food\n• Thu 08 Oct: General + Recycling");
  });
}

// 05 Search: What can I recycle?
const homeSearchInput = document.getElementById("homeSearchInput");
const homeSearchResults = document.getElementById("homeSearchResults");

const recycleGuide = [
  { item: "Plastic drink bottles", bin: "Recycling (Yellow lid)", tip: "Rinse & leave lid on" },
  { item: "Cardboard boxes", bin: "Recycling (Yellow lid)", tip: "Flatten completely" },
  { item: "Pizza box", bin: "Yellow (clean top) / Red (greasy base)", tip: "Tear clean cardboard top" },
  { item: "Food scraps & fruit peels", bin: "Garden & food (Green lid)", tip: "Compostable organic matter" },
  { item: "Batteries", bin: "Special Drop-off Depot", tip: "Never in kerbside bins. Fire hazard" },
  { item: "Soft plastics & chip packets", bin: "General waste (Red lid)", tip: "Curbside general waste" }
];

if (homeSearchInput && homeSearchResults) {
  homeSearchInput.addEventListener("input", () => {
    const q = homeSearchInput.value.trim().toLowerCase();
    if (!q) {
      homeSearchResults.style.display = "none";
      return;
    }
    const matches = recycleGuide.filter(g => g.item.toLowerCase().includes(q) || g.bin.toLowerCase().includes(q));
    if (matches.length === 0) {
      homeSearchResults.innerHTML = `<span style="font-size:0.8rem;color:#6B7280;">No rule match found.</span>`;
    } else {
      homeSearchResults.innerHTML = matches.map(m => `
        <div style="font-size:0.82rem;padding:4px 0;border-bottom:1px solid #F3F4F6;">
          <strong>${m.item}</strong>: <span style="color:#15803D;font-weight:600;">${m.bin}</span> (${m.tip})
        </div>
      `).join("");
    }
    homeSearchResults.style.display = "flex";
  });
}

// Default start: start at Screen 05 (Resident Home) or 01 based on user preference
// Starting directly on Screen 5 so the user can immediately see the home screen,
// and can click any step in the top bar to inspect 01, 02, 03, 04, 05!
goToScreen(5);
