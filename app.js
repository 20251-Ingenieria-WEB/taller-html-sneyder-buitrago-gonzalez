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

const closeDetailedInfo = document.getElementById("closeDetailedInfo")
const detailedInfoDiv = document.getElementById("detailedInfo")
const detailedEntryImg = document.getElementById("detailedEntryImg")
const detailedEntryId = document.getElementById("detaledEntryId")
const detailedEntryName = document.getElementById("detailedEntryName")
const descriptionText = document.getElementById("descriptionText")
const locationsText = document.getElementById("locationsText")
const dropsText = document.getElementById("dropsText")

const toggleDetails = async (entryName) => {
  contentDiv.classList.toggle("no-overflow")
  detailedInfoDiv.classList.toggle("detailed-info")

  if (!entryName) return
  const entry = await getEntry(entryName)
  detailedEntryImg.setAttribute("src", entry.image)
  detailedEntryId.innerText = entry.id.toString()
  detailedEntryName.innerText = entry.name
  descriptionText.innerText = entry.description
  locationsText.innerText = entry.common_locations.join("\n")
  if ("drops" in entry) {
    dropsText.parentElement.style.display = "block"
    dropsText.innerText = entry.drops.join(", ")
  } else {
    dropsText.parentElement.style.display = "none"
  }
}

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
  let moreThanOneEntry = false;
  const entriesAdded = entriesFound
    .map(async entry => {
      const entryData = await getEntry(entry);

      if (!categoriesShown[entryData.category]) {
        return
      }

      moreThanOneEntry = true
      resultsLoading.style.display = "none"
      page.innerHTML += createEntryEl(entryData)
    });

  await Promise.all(entriesAdded)

  if (moreThanOneEntry) {
    const els = page.getElementsByClassName("entry")
    Object.values(els).forEach(el => {
      el.addEventListener("click", () => {
        toggleDetails(el.getAttribute("name"))
      })
    })

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

closeDetailedInfo.onclick = (e) => {
  toggleDetails()
}

detailedInfoDiv.onclick = (e) => {
  toggleDetails()
}

Object.values(detailedInfoDiv.children).forEach(el => {
  el.addEventListener("click", e => {
    e.stopPropagation()
  })
})

