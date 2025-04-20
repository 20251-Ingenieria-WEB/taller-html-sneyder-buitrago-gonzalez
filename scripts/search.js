import { showSearchInfo, clearContent, createResultsPage, getCategoryFilters, createEntryEl } from "./ui.js";
import { getEntry } from "./api.js";

// Track search results
let entriesFound = [];

// Search entries
export async function search(entryName, entryNames) {
  clearContent();
  if (entryName.length < 3) {
    // Enforce minimum input length for searches
    showSearchInfo("Type at least 3 characters");
    return;
  }

  // Filter entries by search term
  entriesFound = entryNames.filter((item) =>
    item.toLowerCase().includes(entryName.toLowerCase())
  );
  return filterAndRender(entriesFound);
}

// Filter and render entries by category
export async function filterAndRender(entries) {
  // Collect checked category filters, ensuring only valid categories
  const categoriesShown = Array.from(getCategoryFilters()).reduce(
    (prev, el) => {
      return { ...prev, [el.value]: el.checked };
    },
    {}
  );

  clearContent();
  showSearchInfo("Loading...");
  const page = createResultsPage();

  let hasEntries = false;
  // Process entries and render those matching selected categories
  const entriesAdded = entries.map(async (entry) => {
    const entryData = await getEntry(entry);
    if (!categoriesShown[entryData.category]) return;

    hasEntries = true;
    showSearchInfo("", false);
    page.innerHTML += createEntryEl(entryData);
  });

  await Promise.all(entriesAdded);

  // Return page for adding event listeners
  if (hasEntries) {
    return page;
  } else {
    showSearchInfo("No entries found");
    return null;
  }
}
