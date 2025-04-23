// Initialize application
async function init() {
  initElements();
  await bindEvents();
}

window.onload = () => init();
