// ================================================================
// content.js — ENGINE ONLY. Do not edit color rules here.
// Color rules live in rules.js on GitHub.
// ================================================================

// !! REPLACE THIS URL with your own GitHub raw URL after uploading rules.js !!
const RULES_URL = 'https://https://raw.githubusercontent.com/HaipingGAO/asana-color-coder/main/rules.js';

// How often to check GitHub for updates (in milliseconds)
const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // every 1 hour

let SWIM_LANE_COLORS = {};
let isEnabled = true;

// ── FETCH RULES FROM GITHUB ─────────────────────────────────────
async function fetchRules() {
  try {
    const res = await fetch(RULES_URL + '?t=' + Date.now()); // bust cache
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);
    const code = await res.text();

    // Safely evaluate the rules file to extract SWIM_LANE_COLORS
    const fn = new Function(code + '; return SWIM_LANE_COLORS;');
    const rules = fn();

    if (rules && typeof rules === 'object') {
      SWIM_LANE_COLORS = rules;
      // Cache rules in storage so extension works offline
      chrome.storage.local.set({ cachedRules: code, lastFetch: Date.now() });
      console.log('[Asana Color Coder] Rules updated from GitHub:', Object.keys(rules).length, 'projects');
      applyColors();
    }
  } catch (err) {
    console.warn('[Asana Color Coder] Could not fetch rules from GitHub, using cache.', err);
    loadCachedRules();
  }
}

// ── LOAD CACHED RULES (fallback when offline) ───────────────────
function loadCachedRules() {
  chrome.storage.local.get(['cachedRules'], (result) => {
    if (result.cachedRules) {
      try {
        const fn = new Function(result.cachedRules + '; return SWIM_LANE_COLORS;');
        SWIM_LANE_COLORS = fn();
        applyColors();
      } catch (e) {
        console.warn('[Asana Color Coder] Cache parse failed.', e);
      }
    }
  });
}

// ── TOGGLE (from popup) ─────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'TOGGLE') {
    isEnabled = msg.enabled;
    isEnabled ? applyColors() : removeColors();
  }
});

// ── APPLY COLORS ────────────────────────────────────────────────
function applyColors() {
  if (!isEnabled) return;
  document.querySelectorAll('[aria-label^="row "]').forEach(card => {
    const label = card.getAttribute('aria-label');
    const match = label.match(/^row (.+?), column/i);
    if (!match) return;

    const swimLaneName = match[1].trim();
    const colorKey = Object.keys(SWIM_LANE_COLORS).find(
      key => key.toLowerCase() === swimLaneName.toLowerCase()
    );

    if (colorKey) {
      const { bg, border } = SWIM_LANE_COLORS[colorKey];
      const cardLayout = card.querySelector('.BoardCardLayout');
      if (cardLayout) {
        cardLayout.style.setProperty('background-color', bg, 'important');
        cardLayout.style.setProperty('border-left', `4px solid ${border}`, 'important');
        cardLayout.style.setProperty('border-radius', '6px', 'important');
        cardLayout.setAttribute('data-color-coded', 'true');
      }
    }
  });
}

// ── REMOVE COLORS ───────────────────────────────────────────────
function removeColors() {
  document.querySelectorAll('[data-color-coded="true"]').forEach(card => {
    card.style.removeProperty('background-color');
    card.style.removeProperty('border-left');
    card.style.removeProperty('border-radius');
    card.removeAttribute('data-color-coded');
  });
}

// ── INIT ────────────────────────────────────────────────────────
chrome.storage.sync.get(['enabled'], (result) => {
  isEnabled = result.enabled !== false;
});

// Load cached rules immediately so colors show without waiting for fetch
loadCachedRules();

// Fetch latest rules from GitHub
setTimeout(fetchRules, 1500);

// Re-fetch periodically while tab is open
setInterval(fetchRules, UPDATE_INTERVAL_MS);

// Re-apply on DOM changes (Asana rebuilds UI constantly)
const observer = new MutationObserver(() => { if (isEnabled) applyColors(); });
observer.observe(document.body, { childList: true, subtree: true });
