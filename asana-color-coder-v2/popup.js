
const toggle = document.getElementById('toggle');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const ghLink = document.getElementById('ghLink');

const GITHUB_REPO = 'https://github.com/YOUR_USERNAME/asana-color-coder';
const RULES_URL   = 'https://raw.githubusercontent.com/HaipingGAO/asana-color-coder/main/rules.js';
ghLink.href = GITHUB_REPO + '/edit/main/rules.js';

// Restore toggle state
chrome.storage.sync.get(['enabled'], (result) => {
  toggle.checked = result.enabled !== false;
});

// Show last fetch time
chrome.storage.local.get(['lastFetch'], (result) => {
  if (result.lastFetch) {
    const mins = Math.round((Date.now() - result.lastFetch) / 60000);
    statusDot.classList.add('live');
    statusText.textContent = mins < 1
      ? 'Rules: just updated'
      : `Rules: updated ${mins}m ago`;
  } else {
    statusDot.classList.add('cached');
    statusText.textContent = 'Rules: using cached version';
  }
});

// Toggle handler
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE', enabled });
  });
});
