import { createEntryEl } from "./categories.js"

const ZELDA_API = "https://zelda.fanapis.com/api"
const COMPENDIUM_API = "https://botw-compendium.herokuapp.com/api/v3/compendium"

/** @type string[] */
let entryNames = []
const loadingEntries = fetch("./entries.json")
  .then(file => file.json())
  .then(json => { entryNames = json })

if (!globalThis.cachedEntries) {
  globalThis.cachedEntries = new Map()
}

const debounce = (fn, ms = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), ms)
  }
}

/** @type HTMLInputElement */
// @ts-ignore
const searchInput = document.getElementById("searchInput")
const searchForm = document.getElementById("searchForm")
const searchResults = document.getElementById("searchResults")
const resultsLoading = document.getElementById("resultsLoading")
const categoryFilter = document.getElementById("categoryFilter")

const search = async (entryName) => {
  const entriesFound = entryNames.filter((item) => {
    return item.toLowerCase().includes(entryName.toLowerCase())
  })


  if (entriesFound.length === 0) {
    searchResults.innerHTML = "No entries found"
    return
  }

  searchResults.innerHTML = ""
  resultsLoading.style.display = "block"
  entriesFound
    .forEach(async entryName => {
      if (!globalThis.cachedEntries.has(entryName)) {
        const entryData = await fetch(`${COMPENDIUM_API}/entry/${entryName}`)
          .then(res => res.json())
          .then(json => json.data)
        globalThis.cachedEntries.set(entryName, entryData)
      }

      resultsLoading.style.display = "none"
      searchResults.innerHTML += createEntryEl(globalThis.cachedEntries.get(entryName))
    });
}

//TODO: delete
setTimeout(() =>
  search("boko")
  , 500);


searchForm.onsubmit = (e) => {
  e.preventDefault()
  search(searchInput.value)
}

searchInput.oninput = debounce((e) => {
  if (e.target.value.length < 3) {
    searchResults.innerHTML = ""
    return
  }

  search(e.target.value)
})

// fetch(`${ZELDA_API}/games`).then(res => res.json()).then(json => {
//   if (json.data) {
//     resultsEl.innerHTML = ""
//     json.data.forEach(e => {
//       // HTML
//       resultsEl.innerHTML +=
//         `<div class="game-card">
//           <h3>
//             ${e.name}
//           </h3>
//           <p>
//             ${e.description}
//           </p>
//         </div>`
//     })
//   }
// })

