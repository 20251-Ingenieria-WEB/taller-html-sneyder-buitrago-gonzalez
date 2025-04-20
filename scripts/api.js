const COMPENDIUM_API = "https://botw-compendium.herokuapp.com/api/v3/compendium";

// Initialize global cache
if (!globalThis.cachedEntries) {
  globalThis.cachedEntries = new Map();
}

// Load entry names from JSON
export async function loadEntryNames() {
  let entryNames = [];
  try {
    entryNames = await fetch("./entries.json").then((res) => res.json());
  } catch (err) {
    console.error(err);
  }
  return entryNames;
}

// Fetch and cache entry data
export async function getEntry(entryName) {
  if (!globalThis.cachedEntries.has(entryName)) {
    const entryData = await fetch(`${COMPENDIUM_API}/entry/${entryName}`)
      .then((res) => res.json())
      .then((json) => json.data);
    globalThis.cachedEntries.set(entryName, entryData);
  }
  return globalThis.cachedEntries.get(entryName);
}
