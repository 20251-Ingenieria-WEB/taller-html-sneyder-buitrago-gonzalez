import { bindEvents } from "./events.js";

// Initialize application
async function init() {
  await bindEvents();
}

init();
