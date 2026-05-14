// ================================================================
// rules.js — EDIT THIS FILE ON GITHUB TO UPDATE COLORS FOR EVERYONE
// ================================================================
// This file lives on GitHub. The extension fetches it automatically.
// Teammates never need to reinstall when you change this file.
//
// HOW TO EDIT:
//   1. Go to your GitHub repo → click rules.js → click the pencil icon
//   2. Add / remove / rename project lines below
//   3. Click "Commit changes" — teammates get updates within seconds
// ================================================================

// ── PRESET COLOR PALETTE ────────────────────────────────────────
// Reference by PRESET[0] to PRESET[9]. Never touch hex codes.
const PRESET = [
  { bg: '#FF91F0', border: '#D966CC' }, // [0] hot pink
  { bg: '#B09FE8', border: '#7B6BC8' }, // [1] lavender
  { bg: '#FFD6F5', border: '#E066BB' }, // [2] pale pink
  { bg: '#C8EEFF', border: '#4A90D9' }, // [3] light blue
  { bg: '#FFFAC8', border: '#D4A800' }, // [4] pale yellow
  { bg: '#FFCA8A', border: '#E07800' }, // [5] peach
  { bg: '#A8EFCC', border: '#28A745' }, // [6] mint green
  { bg: '#FFBB99', border: '#D45500' }, // [7] salmon
  { bg: '#C8C8C8', border: '#888888' }, // [8] grey
  { bg: '#FFD6F5', border: '#C044AA' }, // [9] pale pink alt
];

// ── CURRENT PROJECTS ────────────────────────────────────────────
// Left side  = exact Asana swim lane name (case-insensitive)
// Right side = PRESET[n] color number
const SWIM_LANE_COLORS = {
  'Others/Janitoring':          PRESET[8],  // grey
  'Platform 2.0 launch':        PRESET[1],  // lavender
  'RevOps 2026':                PRESET[5],  // peach
  "Steph's Linkedin Webinar":   PRESET[3],  // light blue
  'Summer PD':                  PRESET[4],  // pale yellow
  'Teacher Appreciation Week':  PRESET[6],  // mint green
  'User insight/nurturing':     PRESET[2],  // pale pink
  'V3 Support Shirley':         PRESET[0],  // hot pink

  // ── ADD NEW PROJECTS BELOW ──────────────────────────────────
  // 'New Project Name':         PRESET[7],  // salmon
  // 'New Project Name':         PRESET[9],  // pale pink alt
};
