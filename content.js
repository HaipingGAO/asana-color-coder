// ================================================================
// content.js — ENGINE ONLY. Color rules live in rules.json on GitHub.
// !! Replace the RULES_URL below with your actual GitHub raw URL !!
// ================================================================

const RULES_URL = 'https://https://raw.githubusercontent.com/HaipingGAO/asana-color-coder/refs/heads/main/rules.json';
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

let SWIM_LANE_COLORS = {};
let isEnabled = true;

async function fetchRules() {
  try {
    const res = await fetch(RULES_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);
    const data = await res.json();
    if (data && Array.isArray(data.projects)) {
      SWIM_LANE_COLORS = {};
      data.projects.forEach(p => {
        SWIM_LANE_COLORS[p.name.toLowerCase()] = { bg: p.bg, border: p.border };
      });
      chrome.storage.local.set({ cachedRules: JSON.stringify(data), lastFetch: Date.now() });
      console.log('[Asana Color Coder] Rules updated from GitHub:', data.projects.length, 'projects');
      applyColors();
    }
  } catch (err) {
    console.warn('[Asana Color Coder] Could not fetch from GitHub, using cache.', err);
    loadCachedRules();
  }
}

function loadCachedRules() {
  chrome.storage.local.get(['cachedRules'], (result) => {
    if (result.cachedRules) {
      try {
        const data = JSON.parse(result.cachedRules);
        SWIM_LANE_COLORS = {};
        data.projects.forEach(p => {
          SWIM_LANE_COLORS[p.name.toLowerCase()] = { bg: p.bg, border: p.border };
        });
        applyColors();
      } catch (e) {
        console.warn('[Asana Color Coder] Cache parse failed.', e);
      }
    }
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'TOGGLE') {
    isEnabled = msg.enabled;
    isEnabled ? applyColors() : removeColors();
  }
});

function applyColors() {
  if (!isEnabled) return;
  document.querySelectorAll('[aria-label^="row "]').forEach(card => {
    const label = card.getAttribute('aria-label');
    const match = label.match(/^row (.+?), column/i);
    if (!match) return;
    const key = match[1].trim().toLowerCase();
    const colors = SWIM_LANE_COLORS[key];
    if (colors) {
      const cardLayout = card.querySelector('.BoardCardLayout');
      if (cardLayout) {
        cardLayout.style.setProperty('background-color', colors.bg, 'important');
        cardLayout.style.setProperty('border-left', '4px solid ' + colors.border, 'important');
        cardLayout.style.setProperty('border-radius', '6px', 'important');
        cardLayout.setAttribute('data-color-coded', 'true');
      }
    }
  });
}

function removeColors() {
  document.querySelectorAll('[data-color-coded="true"]').forEach(card => {
    card.style.removeProperty('background-color');
    card.style.removeProperty('border-left');
    card.style.removeProperty('border-radius');
    card.removeAttribute('data-color-coded');
  });
}

chrome.storage.sync.get(['enabled'], (result) => { isEnabled = result.enabled !== false; });
loadCachedRules();
setTimeout(fetchRules, 1500);
setInterval(fetchRules, UPDATE_INTERVAL_MS);
const observer = new MutationObserver(() => { if (isEnabled) applyColors(); });
observer.observe(document.body, { childList: true, subtree: true });
