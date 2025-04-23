// Debounce utility
const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
};

// Bind event listeners
async function bindEvents() {
  const entryNames = await loadEntryNames();
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const closeDetailedInfoBtn = document.getElementById("closeDetailedInfo");
  const detailedInfoDiv = getDetailedInfoDiv();

  // Handle search and render results
  const handleSearch = () => {
    // @ts-ignore
    search(searchInput.value, entryNames).then((page) => {
      if (page) {
        // Attach click listeners to entry elements
        Array.from(page.getElementsByClassName("entry")).forEach((el) =>
          el.addEventListener("click", () => toggleDetails(el.getAttribute("name"), getEntry))
        );
      }
    });
  };

  searchForm.onsubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  searchInput.oninput = debounce((e) => handleSearch());

  // Re-render on category filter change
  Array.from(getCategoryFilters()).forEach((el) =>
    el.addEventListener("change", () => handleSearch())
  );

  closeDetailedInfoBtn.onclick = () => toggleDetails();

  // close detailed info when clicked not in a child
  detailedInfoDiv.onclick = () => toggleDetails();

  // Prevent event propagation for detailed info children
  Array.from(detailedInfoDiv.children).forEach((el) =>
    el.addEventListener("click", (e) => e.stopPropagation())
  );
}
