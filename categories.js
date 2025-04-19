/** @import {Creature, Equipment, Material, Monster, Treasure} from "./schemas.ts" */

export const CATEGORIES = [
  "monsters",
  "equipment",
  "materials",
  "creatures",
  "treasure",
]

/**
 * @param {Creature | Equipment | Material | Monster | Treasure} entry
 */
export const createEntryEl = (entry) => {
  if (!entry) {
    console.error("no entry")
    return ""
  }
  if (!CATEGORIES.includes(entry.category)) {
    console.error("Unknown category: ", entry.category)
    return "<div>not found<div>"
  }

  let dropsEl = "";

  if ("drops" in entry) {
    // HTML
    dropsEl = `<span>Drops: ${entry.drops.join(", ")}</span>`
  }

  // HTML
  const el =
    `<div tabindex="0" class=${"entry " + entry.category}>
      <div class="name-cover">
        <img src="${entry.image}"/>
        <div class="info">
          <h2 class="id">${entry.id.toString().padStart(3, '0')}</h2>
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
    </div>`
  return el
}
