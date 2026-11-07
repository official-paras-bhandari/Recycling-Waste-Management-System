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

// Whole onboarding result lives in one JSON profile (localStorage; no real auth yet)
const loadProfile = () => { try { return JSON.parse(localStorage.getItem("ecotrack_profile")) || {}; } catch (e) { return {}; } };

function completeOnboarding(email) {
  const remindersOn = document.getElementById("setupRemindersToggle").checked;
  const profile = {
    address: addressSearchInput ? addressSearchInput.value.trim() : "",
    bins: [...document.querySelectorAll("#screenBins .bin-setup-card:not(.off)")].map(c => c.innerText.trim().replace(/\s+/g, " ")),
    reminder: { on: remindersOn, when: optMorningOf.classList.contains("selected") ? "morning" : "night" },
    account: email ? { email } : null // null = guest
  };
  localStorage.setItem("ecotrack_profile", JSON.stringify(profile));
  localStorage.setItem("ecotrack_reminder_active", remindersOn);
  localStorage.setItem("ecotrack_onboarded", "1");
  window.location.hash = "dashboard";
  showScreen("home");
}

const finishSetupBtn = document.getElementById("finishSetupBtn");
if (finishSetupBtn) finishSetupBtn.addEventListener("click", () => showScreen("save"));
document.getElementById("backToRemindersBtn").addEventListener("click", () => showScreen("reminders"));
document.getElementById("continueGuestBtn").addEventListener("click", () => completeOnboarding(null));
document.getElementById("createAccountBtn").addEventListener("click", () => {
  const input = document.getElementById("saveEmailInput");
  if (!input.checkValidity() || !input.value) { input.reportValidity(); return; }
  completeOnboarding(input.value.trim());
});

// Australian address search via OpenStreetMap Nominatim (free, no key; keep requests debounced)
const NOM = "https://nominatim.openstreetmap.org";
const suggSection = document.querySelector(".suggestions-section");
const suggGrid = suggSection.querySelector(".suggestion-grid");
const chooseAddress = addr => {
  if (homeAddressLabel) homeAddressLabel.textContent = addr.split(",")[0];
  addressSearchInput.value = addr;
  showScreen("bins");
};
// "12 Smith St, Newtown, NSW 2042": street + suburb + state + postcode
const fmtAddr = r => {
  const a = r.address || {};
  const street = [a.house_number, a.road].filter(Boolean).join(" ");
  return [street, a.suburb || a.city || a.town || a.village, [a.state, a.postcode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
};
function renderSuggestions(list) {
  suggGrid.replaceChildren(...list.map(addr => {
    const b = document.createElement("button");
    b.className = "suggestion-card";
    b.innerHTML = '<div class="sugg-text"><strong></strong></div>';
    b.querySelector("strong").textContent = addr;
    b.addEventListener("click", () => chooseAddress(addr));
    return b;
  }));
  suggSection.style.display = list.length ? "" : "none";
}
renderSuggestions([]); // suggestions appear only after typing
let searchTimer;
addressSearchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  const q = addressSearchInput.value.trim();
  if (q.length < 3) return renderSuggestions([]);
  searchTimer = setTimeout(async () => {
    try {
      const r = await fetch(`${NOM}/search?format=jsonv2&addressdetails=1&countrycodes=au&limit=5&q=${encodeURIComponent(q)}`);
      if (q === addressSearchInput.value.trim()) renderSuggestions((await r.json()).map(fmtAddr).filter(Boolean));
    } catch (e) { renderSuggestions([]); } // offline: Enter still accepts typed text
  }, 400);
});
addressSearchInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && addressSearchInput.value.trim().length >= 3) chooseAddress(addressSearchInput.value.trim());
});

const useLocationBtn = document.getElementById("useLocationBtn");
useLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return showToast("Location not supported. Type your address instead.");
  navigator.geolocation.getCurrentPosition(async p => {
    try {
      const r = await fetch(`${NOM}/reverse?format=jsonv2&addressdetails=1&lat=${p.coords.latitude}&lon=${p.coords.longitude}`);
      const addr = fmtAddr(await r.json());
      if (!addr) throw 0;
      chooseAddress(addr);
    } catch (e) { showToast("Couldn't find your address. Type it instead."); }
  }, () => showToast("Location blocked. Type your address instead."));
});

// Bin cards toggle on/off; at least one must stay on
const binCards = document.querySelectorAll("#screenBins .bin-setup-card");
binCards.forEach(c => c.addEventListener("click", () => c.classList.toggle("off")));
confirmBinsBtn.addEventListener("click", e => {
  if ([...binCards].every(c => c.classList.contains("off"))) { e.stopImmediatePropagation(); showToast("Select at least one bin"); }
}, true);

// Reminders switch dims the options when off
const setupToggle = document.getElementById("setupRemindersToggle");
setupToggle.addEventListener("change", () =>
  document.querySelectorAll("#screenReminders .sub-section").forEach(s => s.style.opacity = setupToggle.checked ? "" : ".4"));

// Reminder hint: say exactly when the reminder lands
const hint = () => {
  const morning = optMorningOf.classList.contains("selected");
  document.getElementById("reminderHint").textContent = setupToggle.checked
    ? (morning ? "We'll remind you on collection morning at 6:00 am." : "We'll remind you the evening before at 7:00 pm.")
    : "Reminders are off. You can turn them on later.";
};
[optNightBefore, optMorningOf, setupToggle].forEach(el => el.addEventListener(el === setupToggle ? "change" : "click", hint));
hint();

// Google sign-in (Google Identity Services). Set a real OAuth client ID to enable it.
// shortcut: ID token is decoded, not verified; verify server-side once a backend exists.
const GOOGLE_CLIENT_ID = "";
const googleBtn = document.getElementById("googleBtn");
function onGoogle({ credential }) {
  const p = JSON.parse(decodeURIComponent(escape(atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))));
  completeOnboarding(p.email);
}
if (GOOGLE_CLIENT_ID) {
  const sc = document.createElement("script");
  sc.src = "https://accounts.google.com/gsi/client";
  sc.onload = () => {
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogle });
    google.accounts.id.renderButton(document.getElementById("googleBtnWrap"), { theme: "outline", size: "large", text: "continue_with", width: 320 });
    googleBtn.remove();
  };
  document.head.appendChild(sc);
} else {
  googleBtn.addEventListener("click", () => showToast("Google sign-in needs a client ID. Use email or continue as guest."));
}
