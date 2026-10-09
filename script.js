// Waste Sorting Database
const wasteDatabase = [
  {
    name: "Plastic Water Bottles & Milk Jugs",
    category: "plastic",
    bin: "Yellow Bin",
    tagClass: "tag-yellow",
    details: "Rinse clean and leave lids attached. Do not crush completely flat."
  },
  {
    name: "Cardboard Packaging & Boxes",
    category: "paper",
    bin: "Blue Bin",
    tagClass: "tag-blue",
    details: "Flatten all boxes completely. Remove excessive plastic packing tape."
  },
  {
    name: "Fruit & Vegetable Scraps",
    category: "organic",
    bin: "Green Bin",
    tagClass: "tag-green",
    details: "Compostable organic matter. Keep free from plastic wrappers or stickers."
  },
  {
    name: "Coffee Grounds & Tea Bags",
    category: "organic",
    bin: "Green Bin",
    tagClass: "tag-green",
    details: "Ensure tea bags are compostable (staple & synthetic tag free)."
  },
  {
    name: "Household Batteries (AA, AAA, Li-ion)",
    category: "hazardous",
    bin: "Special E-Waste",
    tagClass: "tag-red",
    details: "Never place in curbside bins. Fire hazard. Tape terminals and drop off at collection hubs."
  },
  {
    name: "Old Laptops, Tablets & Smartphones",
    category: "hazardous",
    bin: "Special E-Waste",
    tagClass: "tag-red",
    details: "Deliver to certified e-waste recovery centers for safe precious metal extraction."
  },
  {
    name: "Glass Bottles & Condiment Jars",
    category: "glass",
    bin: "Yellow / Glass Bin",
    tagClass: "tag-yellow",
    details: "Rinse food residues out thoroughly. Metal lids can often be recycled separately."
  },
  {
    name: "Aluminum Soda Cans & Food Tins",
    category: "glass",
    bin: "Yellow Bin",
    tagClass: "tag-yellow",
    details: "Empty completely and rinse. Highly recyclable infinitely."
  },
  {
    name: "Newspapers, Magazines & Office Paper",
    category: "paper",
    bin: "Blue Bin",
    tagClass: "tag-blue",
    details: "Keep clean and dry. Shredded paper should be bagged in paper bags."
  },
  {
    name: "Garden Trimmings & Fallen Leaves",
    category: "organic",
    bin: "Green Bin",
    tagClass: "tag-green",
    details: "No soil, treated timber, or plastic plant pots."
  },
  {
    name: "Fluorescent Tubes & CFL Bulbs",
    category: "hazardous",
    bin: "Hazardous Drop-off",
    tagClass: "tag-red",
    details: "Contains mercury vapour. Must be disposed of at dedicated council hazardous drop-offs."
  },
  {
    name: "Soft Plastic Bags & Bubble Wrap",
    category: "plastic",
    bin: "Store Return / Soft Plastics",
    tagClass: "tag-yellow",
    details: "Check local supermarket return bins; avoid placing in standard yellow recycling bins."
  }
];

// DOM Elements
const guideGrid = document.getElementById("guideGrid");
const wasteSearchInput = document.getElementById("wasteSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const categoryFilters = document.getElementById("categoryFilters");
const noResults = document.getElementById("noResults");

// Modal Elements
const pickupModal = document.getElementById("pickupModal");
const openPickupModalBtn = document.getElementById("openPickupModalBtn");
const heroScheduleBtn = document.getElementById("heroScheduleBtn");
const ctaScheduleBtn = document.getElementById("ctaScheduleBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const pickupForm = document.getElementById("pickupForm");
const bookingSuccess = document.getElementById("bookingSuccess");
const successSummary = document.getElementById("successSummary");
const successDoneBtn = document.getElementById("successDoneBtn");
const pickupDateInput = document.getElementById("pickupDate");

// Navigation Elements
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

let currentCategory = "all";

// Render Waste Guide Cards
function renderGuideItems(items) {
  guideGrid.innerHTML = "";
  
  if (items.length === 0) {
    noResults.style.display = "block";
    return;
  }
  
  noResults.style.display = "none";
  
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-header">
        <h4>${item.name}</h4>
        <span class="bin-tag ${item.tagClass}">${item.bin}</span>
      </div>
      <p class="item-details">${item.details}</p>
    `;
    guideGrid.appendChild(card);
  });
}

// Filter and Search Logic
function filterItems() {
  const query = wasteSearchInput.value.trim().toLowerCase();
  clearSearchBtn.style.display = query.length > 0 ? "block" : "none";

  const filtered = wasteDatabase.filter(item => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesQuery = item.name.toLowerCase().includes(query) || 
                         item.bin.toLowerCase().includes(query) || 
                         item.details.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  renderGuideItems(filtered);
}

// Category Filter Button Clicks
categoryFilters.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-btn")) {
    categoryFilters.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentCategory = e.target.getAttribute("data-category");
    filterItems();
  }
});

// Search Input Listener
wasteSearchInput.addEventListener("input", filterItems);

// Clear Search Button
clearSearchBtn.addEventListener("click", () => {
  wasteSearchInput.value = "";
  clearSearchBtn.style.display = "none";
  filterItems();
  wasteSearchInput.focus();
});

// Mobile Nav Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Close Mobile Nav on link click
navMenu.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

// Modal Open/Close Controls
function openModal() {
  pickupModal.classList.add("active");
  pickupModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  
  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  if (pickupDateInput) {
    pickupDateInput.min = today;
  }
}

function closeModal() {
  pickupModal.classList.remove("active");
  pickupModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
  
  // Reset form state after transition
  setTimeout(() => {
    pickupForm.reset();
    pickupForm.style.display = "block";
    bookingSuccess.style.display = "none";
  }, 300);
}

[openPickupModalBtn, heroScheduleBtn, ctaScheduleBtn].forEach(btn => {
  if (btn) btn.addEventListener("click", openModal);
});

[closeModalBtn, cancelModalBtn, successDoneBtn].forEach(btn => {
  if (btn) btn.addEventListener("click", closeModal);
});

// Close modal when clicking on the backdrop
pickupModal.addEventListener("click", (e) => {
  if (e.target === pickupModal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && pickupModal.classList.contains("active")) {
    closeModal();
  }
});

// Pickup Form Submission
pickupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const name = document.getElementById("fullName").value.trim();
  const date = document.getElementById("pickupDate").value;
  const wasteType = document.getElementById("wasteType").value;
  const address = document.getElementById("address").value.trim();
  
  const referenceId = "ECO-" + Math.floor(100000 + Math.random() * 900000);
  
  successSummary.innerHTML = `
    Thank you, <strong>${name}</strong>!<br>
    Your collection for <strong>${wasteType}</strong> at <strong>${address}</strong> 
    has been scheduled for <strong>${date}</strong>.<br><br>
    Booking Reference: <span style="font-family: monospace; font-weight: bold; color: var(--primary);">${referenceId}</span>
  `;
  
  pickupForm.style.display = "none";
  bookingSuccess.style.display = "block";
});

// Initial Render
renderGuideItems(wasteDatabase);
