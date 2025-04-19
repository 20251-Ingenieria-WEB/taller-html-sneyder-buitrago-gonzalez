/** @import {Creature, Equipment, Material, Monster, Treasure} from "./schemas.ts" */
import { createEntryEl } from "./categories.js"

const ZELDA_API = "https://zelda.fanapis.com/api"
const COMPENDIUM_API = "https://botw-compendium.herokuapp.com/api/v3/compendium"

/** @type string[] */
let entryNames = []
fetch("./entries.json")
  .then(file => file.json())
  .then(json => { entryNames = json })
  .catch(err => console.error(err))

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
const contentDiv = document.getElementById("content")
const resultsLoading = document.getElementById("resultsLoading")
const categoryFilters = document.getElementById("categoryFilters").getElementsByTagName("input")

/**@type (entryName: string) => Promise<Creature | Equipment | Material | Monster | Treasure>*/
const getEntry = async (entryName) => {

  if (!globalThis.cachedEntries.has(entryName)) {
    const entryData = await fetch(`${COMPENDIUM_API}/entry/${entryName}`)
      .then(res => res.json())
      .then(json => json.data)
    globalThis.cachedEntries.set(entryName, entryData)
  }
  return globalThis.cachedEntries.get(entryName)
}

let entriesFound = []
const search = (entryName) => {

  entriesFound = entryNames.filter((item) => {
    return item.toLowerCase().includes(entryName.toLowerCase())
  })

  if (entriesFound.length === 0) {
    contentDiv.innerHTML = "No entries found"
    return
  }

  filterAndShow()
}

const filterAndShow = async () => {
  const categoriesShown = Object.values(categoryFilters).reduce((prev,/**HTMLInputElement*/el) => {
    return { ...prev, [el.value]: el.checked }
  }, {})

  contentDiv.innerHTML = ""
  const page = document.createElement("div")
  page.className = "search-results-page"
  contentDiv.appendChild(page)

  resultsLoading.style.display = "block"
  let moreThanOneEntry = false
  entriesFound
    .forEach(async entry => {
      const entryData = await getEntry(entry);

      if (!categoriesShown[entryData.category]) {
        return
      }

      moreThanOneEntry = true
      resultsLoading.style.display = "none"
      page.innerHTML += createEntryEl(entryData)
    });

  if (moreThanOneEntry) {
  } else {
    resultsLoading.innerText = "No entries found"
  }
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
    contentDiv.innerHTML = ""
    return
  }

  search(e.target.value)
})

Object.values(categoryFilters).forEach((el) => {
  el.onchange = () => filterAndShow()
})
