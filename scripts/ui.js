// DOM elements
const elements = {
  searchInput: document.getElementById("searchInput"),
  searchForm: document.getElementById("searchForm"),
  searchInfo: document.getElementById("searchInfo"),
  contentDiv: document.getElementById("content"),
  categoryFilters: document.getElementById("categoryFilters").getElementsByTagName("input"),
  closeDetailedInfoBtn: document.getElementById("closeDetailedInfo"),
  detailedInfoDiv: document.getElementById("detailedInfo"),
  detailedEntryImg: document.getElementById("detailedEntryImg"),
  detailedEntryId: document.getElementById("detaledEntryId"),
  detailedEntryName: document.getElementById("detailedEntryName"),
  descriptionText: document.getElementById("descriptionText"),
  locationsText: document.getElementById("locationsText"),
  dropsText: document.getElementById("dropsText"),
};

// Toggle detailed info view
export async function toggleDetails(entryName, getEntry) {
  // Toggle visibility of search form, content, and detailed info
  elements.searchForm.classList.toggle("hidden");
  elements.contentDiv.classList.toggle("hidden");
  elements.closeDetailedInfoBtn.classList.toggle("hidden");
  elements.detailedInfoDiv.classList.toggle("detailed-info");

  if (!entryName) return; // Exit if closing details

  // Fetch and render entry details
  const entry = await getEntry(entryName);
  elements.detailedEntryImg.setAttribute("src", entry.image);
  elements.detailedEntryId.innerText = entry.id.toString();
  elements.detailedEntryName.innerText = entry.name;
  elements.descriptionText.innerText = entry.description;

  if ("common_locations" in entry && entry.common_locations != null && entry.common_locations.length > 0) {
    elements.locationsText.parentElement.style.display = "block"
    elements.locationsText.innerText = entry.common_locations.join("\n");
  } else {
    elements.locationsText.parentElement.style.display = "none"
  }

  if ("drops" in entry && entry.drops != null && entry.drops.length > 0) {
    elements.dropsText.parentElement.style.display = "block";
    elements.dropsText.innerText = entry.drops.join(", ");
  } else {
    elements.dropsText.parentElement.style.display = "none";
  }
}

// Show or hide search info message
export function showSearchInfo(message, isVisible = true) {
  elements.searchInfo.innerText = message;
  elements.searchInfo.style.display = isVisible ? "block" : "none";
}

// Clear content area
export function clearContent() {
  elements.contentDiv.innerHTML = "";
}

// Create container for search results
export function createResultsPage() {
  const page = document.createElement("div");
  page.className = "search-results-page";
  elements.contentDiv.appendChild(page);
  return page;
}

export function getCategoryFilters() {
  return elements.categoryFilters;
}

export function getDetailedInfoDiv() {
  return elements.detailedInfoDiv;
}

const CATEGORIES = [
  "monsters",
  "equipment",
  "materials",
  "creatures",
  "treasure",
];

// Create HTML element for an entry
export const createEntryEl = (entry) => {
  if (!entry) {
    console.error("No entry provided");
    return "";
  }
  if (!CATEGORIES.includes(entry.category)) {
    console.error("Unknown category: ", entry.category);
    return "<div>not found</div>";
  }

  // Generate entry HTML with image, ID, name, and SVG frame
  const el = `
    <div id="${entry.id}" name="${entry.name}" tabindex="0" class="entry ${entry.category}">
      <div class="name-cover">
        <img src="${entry.image}"/>
        <div class="entry-info">
          <h2 class="id">${entry.id.toString().padStart(3, "0")}</h2>
          <span class="name">${entry.name}</span>
        </div>
      </div>
      <svg viewBox="0 0 64 64" class="entry-frame">
        <use href="#framePath"/>
        <use href="#framePathCorners" />
      </svg>
      <svg viewBox="0 0 64 64" class="entry-frame-arrows">
        <use href="#framePathArrows"/>
      </svg>
    </div>`;

  return el
};
