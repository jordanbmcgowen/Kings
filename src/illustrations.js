/*
 * Tiny hand-built SVG emblems for every king.
 * Each one is unique and nods to a defining moment or symbol from that king's
 * life in the Bible story, so the explorer tiles become fun to scan and learn from.
 *
 * Everything is composed from a few primitive helpers so the art stays small,
 * crisp at avatar sizes, and easy to tweak. No external assets are loaded.
 */
(function () {
  // --- primitive shape helpers -------------------------------------------
  const C = (cx, cy, r, f, e = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${e}/>`;
  const R = (x, y, w, h, f, rx = 0, e = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${e}/>`;
  const P = (d, f, e = '') => `<path d="${d}" fill="${f}" ${e}/>`;
  const L = (x1, y1, x2, y2, s, w, e = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" ${e}/>`;
  // stroked (un-filled) path
  const S = (d, s, w, e = '') => `<path d="${d}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${e}/>`;

  // a classic three-point crown centered on cx, sitting on baseY
  const crown = (cx, baseY, w, h, fill = '#facc15', jewel = '#ef4444') => {
    const x0 = cx - w / 2, x1 = cx + w / 2, top = baseY - h;
    const d = `M${x0} ${baseY} L${x0} ${top} L${cx - w * 0.24} ${top + h * 0.5} L${cx} ${top - h * 0.18} L${cx + w * 0.24} ${top + h * 0.5} L${x1} ${top} L${x1} ${baseY} Z`;
    return P(d, fill) + C(x0, top, 2.2, jewel) + C(cx, top - h * 0.18, 2.4, jewel) + C(x1, top, 2.2, jewel) + R(x0 - 1, baseY - 1, w + 2, 3.6, '#d9920f', 1.6);
  };

  // a curling flame
  const flame = (cx, by, h, f = '#fb923c', inner = '#fde68a') => {
    const w = h * 0.6;
    return P(`M${cx} ${by} C${cx - w} ${by - h * 0.4} ${cx - w * 0.5} ${by - h * 0.7} ${cx} ${by - h} C${cx + w * 0.5} ${by - h * 0.7} ${cx + w} ${by - h * 0.4} ${cx} ${by} Z`, f) +
      P(`M${cx} ${by} C${cx - w * 0.42} ${by - h * 0.3} ${cx - w * 0.2} ${by - h * 0.45} ${cx} ${by - h * 0.62} C${cx + w * 0.2} ${by - h * 0.45} ${cx + w * 0.42} ${by - h * 0.3} ${cx} ${by} Z`, inner);
  };

  // soft spotlight frame
  const wrap = (bg, body) =>
    `<svg viewBox="0 0 64 64" class="king-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">` +
    `<rect width="64" height="64" rx="16" fill="${bg}"/>` +
    `<circle cx="32" cy="29" r="23" fill="#ffffff" opacity="0.5"/>` +
    body + `</svg>`;

  // background tint by narrative status
  const BG = { good: '#d6f6e4', bad: '#ffdde6', mixed: '#fdeec4', contested: '#fdeec4', foreign: '#e8def9' };

  // --- one emblem per king ------------------------------------------------
  const ART = {
    // Saul — Israel's first king, who hurled his spear in jealous rage
    'Saul':
      crown(34, 30, 24, 14, '#fbbf24', '#ef4444') +
      L(12, 54, 46, 20, '#92400e', 4) + P('M46 20 L54 11 L49 25 Z', '#cbd5e1'),

    // Ish-bosheth — a short, fractured reign cut down by assassination
    'Ish-bosheth':
      crown(32, 44, 26, 14, '#fcd34d', '#ef4444') +
      S('M31 12 L27 26 L34 30 L29 44', '#1f2937', 2.6),

    // David — the shepherd-poet and his lyre
    'David':
      S('M20 48 Q13 29 26 15', '#b45309', 4) + S('M44 48 Q51 29 38 15', '#b45309', 4) +
      L(24, 16, 40, 16, '#d97706', 4) +
      L(28, 19, 28, 47, '#fcd34d', 1.6) + L(32, 18, 32, 48, '#fcd34d', 1.6) + L(36, 19, 36, 47, '#fcd34d', 1.6) +
      R(19, 46, 26, 5, '#92400e', 2),

    // Solomon — builder of the temple, famed for wisdom
    'Solomon':
      P('M12 30 L32 14 L52 30 Z', '#fbbf24') + R(14, 30, 36, 20, '#fde68a', 2) +
      R(19, 33, 4, 15, '#f59e0b') + R(27, 33, 4, 15, '#f59e0b') + R(35, 33, 4, 15, '#f59e0b') + R(43, 33, 4, 15, '#f59e0b') +
      R(13, 49, 38, 4, '#d97706', 1) + C(32, 22, 2.4, '#fff7cd'),

    // Rehoboam — the harsh answer that split the kingdom in two
    'Rehoboam':
      P('M12 48 L12 30 L20 36 L24 24 L27 48 Z', '#facc15') +
      P('M52 48 L52 30 L44 36 L40 24 L37 48 Z', '#facc15') +
      S('M33 16 L28 32 L35 32 L30 50', '#3b82f6', 3),

    // Jeroboam I — the golden calf at Bethel and Dan
    'Jeroboam I':
      R(16, 46, 32, 4, '#a16207', 1) +
      R(21, 30, 20, 12, '#fbbf24', 6) + C(43, 31, 6, '#fbbf24') +
      S('M41 26 L37 21', '#fef3c7', 2.4) + S('M45 26 L49 21', '#fef3c7', 2.4) +
      R(24, 40, 3, 7, '#d97706') + R(37, 40, 3, 7, '#d97706') + C(45, 30, 1.2, '#7c2d12'),

    // Abijam — clung to his father's sins; warred against Israel
    'Abijam':
      P('M32 14 L40 22 L34 50 L30 50 L24 22 Z', '#cbd5e1') + R(24, 21, 16, 4, '#92400e', 1.5) +
      C(32, 19, 3, '#f59e0b') + L(18, 44, 46, 44, '#94a3b8', 3),

    // Asa — tore down idols and trusted God in battle (toppled idol)
    'Asa':
      L(18, 50, 50, 50, '#15803d', 3) +
      P('M40 50 L46 22 L52 22 L50 50 Z', '#94a3b8', 'transform="rotate(18 46 36)"') +
      C(48, 18, 4, '#94a3b8', 'transform="rotate(18 46 36)"'),

    // Nadab — his line snuffed out (extinguished lamp + smoke)
    'Nadab':
      P('M22 44 Q32 50 42 44 L40 36 L24 36 Z', '#d97706') + C(32, 35, 6, '#fbbf24') +
      S('M32 30 Q28 26 31 22 Q34 19 30 15', '#94a3b8', 2.4),

    // Baasha — destroyed Jeroboam's house by the sword/axe
    'Baasha':
      L(40, 14, 24, 52, '#92400e', 4) +
      P('M40 14 Q52 16 50 30 Q40 30 36 22 Z', '#cbd5e1') +
      P('M40 14 Q28 14 30 28 Q40 28 42 20 Z', '#e2e8f0'),

    // Elah — drunk and careless when struck down (spilled cup)
    'Elah':
      P('M22 22 L42 22 L38 36 L26 36 Z', '#fbbf24', 'transform="rotate(24 32 30)"') +
      L(34, 34, 30, 44, '#fbbf24', 3, 'transform="rotate(24 32 30)"') +
      C(45, 40, 3, '#b91c1c') + C(40, 47, 2.2, '#b91c1c') + C(48, 47, 1.8, '#b91c1c'),

    // Zimri — reigned seven days, then burned the palace around himself
    'Zimri':
      R(20, 34, 24, 18, '#a16207', 2) + R(25, 40, 5, 12, '#7c2d12') + R(35, 40, 5, 12, '#7c2d12') +
      flame(32, 36, 22) + flame(23, 38, 13) + flame(41, 38, 13),

    // Omri — founded Samaria, the new capital
    'Omri':
      R(16, 30, 32, 22, '#d6b06a', 2) +
      R(16, 24, 6, 8, '#c79a4f') + R(29, 22, 6, 10, '#c79a4f') + R(42, 24, 6, 8, '#c79a4f') +
      R(28, 40, 8, 12, '#7c5a2a') + C(32, 18, 2.4, '#fbbf24'),

    // Ahab — Naboth's vineyard, seized by greed
    'Ahab':
      S('M32 14 Q36 18 33 22', '#15803d', 2.4) + P('M28 18 L40 18 L43 22 L25 22 Z', '#16a34a') +
      C(30, 27, 4.4, '#7c3aed') + C(38, 27, 4.4, '#7c3aed') + C(34, 34, 4.4, '#8b5cf6') +
      C(30, 40, 4.4, '#7c3aed') + C(38, 40, 4.4, '#7c3aed'),

    // Jehoshaphat — sent singers ahead of the army in praise
    'Jehoshaphat':
      L(22, 12, 22, 52, '#92400e', 3) + P('M22 14 L46 18 L40 26 L46 34 L22 30 Z', '#22c55e') +
      P('M30 36 L30 24 L34 23 L34 35 Z', '#1f2937') + C(29, 36, 2.6, '#1f2937') + C(35, 35, 2.2, '#1f2937'),

    // Ahaziah of Israel — fell through the lattice and was injured
    'Ahaziah of Israel':
      R(20, 16, 24, 32, '#cbd5e1', 3) + R(23, 19, 18, 26, '#7dd3fc', 1) +
      S('M23 19 L41 45 M41 19 L23 45 M32 19 L32 45 M23 32 L41 32', '#475569', 2) +
      S('M28 26 L36 34 L33 38', '#b91c1c', 2.4),

    // Joram of Israel — half-removed Baal pillar, half-hearted reform
    'Joram of Israel':
      R(26, 18, 12, 34, '#94a3b8', 2, 'transform="rotate(14 32 36)"') +
      C(32, 16, 6, '#64748b', 'transform="rotate(14 32 36)"') +
      P('M44 48 L58 60 L48 60 Z', '#0f172a', 'opacity="0.18"'),

    // Jehoram of Judah — bound by marriage to the house of Ahab
    'Jehoram of Judah':
      S('M27 32 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0', '#facc15', 4) +
      S('M40 32 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0', '#b91c1c', 4),

    // Ahaziah of Judah — struck down fleeing in his chariot
    'Ahaziah of Judah':
      C(26, 42, 9, '#7c5a2a') + C(26, 42, 3, '#fde68a') +
      S('M26 33 L26 51 M17 42 L35 42 M20 36 L32 48 M32 36 L20 48', '#fbbf24', 2) +
      L(34, 32, 30, 40, '#475569', 2.4) + P('M30 40 L34 38 L33 43 Z', '#475569'),

    // Athaliah — the rightful heir hidden away from her purge
    'Athaliah':
      P('M18 46 Q32 36 46 46 L46 52 L18 52 Z', '#d6b06a', '') + R(18, 50, 28, 4, '#a16207', 1) +
      C(32, 40, 6, '#fde68a') + crown(32, 26, 16, 9, '#facc15', '#ef4444'),

    // Jehu — the furious charioteer who swept away Ahab's house
    'Jehu':
      C(30, 38, 11, '#1e293b') + C(30, 38, 9, '#475569') + C(30, 38, 3, '#facc15') +
      S('M30 27 L30 49 M19 38 L41 38 M22 30 L38 46 M38 30 L22 46', '#fbbf24', 2) +
      L(44, 30, 56, 30, '#94a3b8', 2.4) + L(45, 36, 57, 36, '#94a3b8', 2.4) + L(44, 42, 56, 42, '#94a3b8', 2.4),

    // Joash of Judah — the chest of coins that repaired the temple
    'Joash of Judah':
      R(18, 28, 28, 22, '#92400e', 3) + R(18, 28, 28, 6, '#a16207', 2) +
      R(28, 24, 8, 4, '#1f2937', 1) +
      C(28, 18, 4, '#fbbf24') + C(37, 20, 3.4, '#fbbf24') + C(33, 15, 3, '#fde68a'),

    // Jehoahaz — Israel ground low, then mercy (a broken yoke)
    'Jehoahaz':
      S('M16 26 Q32 38 48 26', '#7c5a2a', 4) +
      L(24, 30, 22, 46, '#92400e', 3) + L(40, 30, 42, 46, '#92400e', 3) +
      L(31, 22, 39, 30, '#cbd5e1', 3) + L(39, 22, 31, 30, '#cbd5e1', 3),

    // Jehoash of Israel — Elisha's arrow of the LORD's victory
    'Jehoash of Israel':
      S('M18 50 Q22 32 18 14', '#92400e', 3) + L(18, 14, 18, 50, '#fcd34d', 1.4) +
      L(20, 32, 50, 22, '#475569', 2.6) + P('M50 22 L43 20 L45 27 Z', '#1f2937') +
      P('M20 32 L24 30 L24 35 Z', '#b91c1c'),

    // Amaziah — obeyed by halves; a tilted, unbalanced scale
    'Amaziah':
      L(32, 14, 32, 30, '#92400e', 3) + C(32, 13, 2.6, '#fbbf24') +
      L(18, 22, 46, 26, '#94a3b8', 2.4) +
      S('M18 22 L13 34 L23 34 Z', '#cbd5e1', 2) + S('M46 26 L41 40 L51 40 Z', '#cbd5e1', 2),

    // Jeroboam II — borders pushed out wide in a prosperous age
    'Jeroboam II':
      P('M20 22 L20 50 L18 54 L26 50 L26 22 Z', '#92400e') + P('M26 24 L48 28 L42 34 L48 40 L26 38 Z', '#3b82f6') +
      L(48, 30, 56, 30, '#22c55e', 3) + P('M56 30 L51 27 L51 33 Z', '#16a34a') +
      L(10, 34, 18, 34, '#22c55e', 3) + P('M10 34 L15 31 L15 37 Z', '#16a34a'),

    // Uzziah — burned incense unlawfully and was struck (censer)
    'Uzziah':
      S('M30 16 Q26 20 30 24 Q34 28 30 32', '#94a3b8', 2.4) +
      P('M22 32 Q32 30 42 32 L40 42 Q32 46 24 42 Z', '#fbbf24') + R(20, 31, 24, 3, '#d97706', 1.5) +
      L(32, 24, 32, 31, '#94a3b8', 2) + C(43, 40, 2.4, '#e2e8f0') + C(46, 44, 1.8, '#e2e8f0'),

    // Zechariah — the last link of Jehu's dynasty, snapped
    'Zechariah':
      S('M14 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#fbbf24', 3) +
      S('M28 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#fbbf24', 3) +
      S('M44 26 a 6 6 0 0 1 6 10', '#94a3b8', 3) + S('M52 44 a 6 6 0 0 1 -6 -10', '#94a3b8', 3) +
      L(46, 22, 54, 30, '#ef4444', 2.4),

    // Shallum — a single month, gone like one crescent moon
    'Shallum':
      P('M40 14 A18 18 0 1 0 40 50 A14 14 0 1 1 40 14 Z', '#fcd34d') +
      C(46, 20, 1.6, '#fde68a') + C(50, 30, 1.2, '#fde68a'),

    // Menahem — heavy tribute paid to Assyria (money bag)
    'Menahem':
      P('M24 26 Q32 20 40 26 L46 48 Q32 54 18 48 Z', '#a16207') + R(24, 22, 16, 6, '#7c5a2a', 2) +
      C(32, 40, 7, '#fbbf24') + P('M30 37 L34 37 M32 35 L32 45', '#7c2d12', '') + L(30, 37, 34, 37, '#7c2d12', 1.6) + L(32, 35, 32, 45, '#7c2d12', 1.6),

    // Pekahiah — cut down by his own officer (dagger)
    'Pekahiah':
      L(40, 16, 24, 48, '#cbd5e1', 3) + P('M40 16 L46 14 L44 20 Z', '#e2e8f0') +
      R(20, 44, 14, 4, '#92400e', 1.5, 'transform="rotate(-26 27 46)"') +
      C(27, 46, 2.6, '#fbbf24', 'transform="rotate(-26 27 46)"'),

    // Pekah — land torn away as Assyria carried it off
    'Pekah':
      P('M16 20 L30 24 L28 36 L33 48 L18 46 Z', '#16a34a') +
      P('M36 22 L48 20 L46 34 L50 46 L36 44 Z', '#16a34a', 'opacity="0.55"') +
      S('M31 16 L34 30 L30 32 L33 50', '#ffffff', 2),

    // Jotham — quietly built up Judah (a strong gate)
    'Jotham':
      R(18, 26, 28, 26, '#d6b06a', 2) + P('M18 26 L32 16 L46 26 Z', '#c79a4f') +
      P('M26 52 L26 36 A6 6 0 0 1 38 36 L38 52 Z', '#7c5a2a') +
      R(20, 28, 24, 3, '#a16207') + C(32, 21, 2, '#fde68a'),

    // Ahaz — copied a pagan altar instead of trusting God
    'Ahaz':
      R(18, 38, 28, 12, '#94a3b8', 2) + R(16, 34, 32, 5, '#64748b', 1) +
      L(20, 34, 18, 28, '#475569', 2.4) + L(44, 34, 46, 28, '#475569', 2.4) +
      flame(26, 34, 12) + flame(38, 34, 12) + flame(32, 32, 16),

    // Hoshea — the last king of Israel, led off in chains
    'Hoshea':
      crown(24, 22, 12, 7, '#fbbf24', '#ef4444') + C(24, 22, 1.5, '#0f172a', 'opacity="0.2"') +
      S('M30 34 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#64748b', 3) +
      S('M40 42 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#64748b', 3) +
      S('M50 50 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#64748b', 3),

    // Hezekiah — the shadow on the sundial turned back
    'Hezekiah':
      C(32, 36, 10, '#fde68a') + C(32, 36, 6, '#fbbf24') +
      L(32, 36, 24, 28, '#92400e', 2.6) +
      [...Array(8)].map((_, i) => {
        const a = (i / 8) * Math.PI * 2; return L(32 + Math.cos(a) * 13, 36 + Math.sin(a) * 13, 32 + Math.cos(a) * 17, 36 + Math.sin(a) * 17, '#f59e0b', 2);
      }).join('') +
      S('M44 18 q -8 -4 -14 4', '#ef4444', 2.4) + P('M30 22 L31 16 L36 20 Z', '#ef4444'),

    // Manasseh — humbled in captivity, his chains broken in repentance
    'Manasseh':
      S('M22 30 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#94a3b8', 3) +
      S('M42 30 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', '#94a3b8', 3) +
      L(26, 34, 22, 46, '#94a3b8', 3) + L(38, 34, 42, 46, '#94a3b8', 3) +
      P('M30 18 L34 18 L33 26 L37 26 L31 40 L33 30 L29 30 Z', '#fde047'),

    // Amon — went back to the idols without his father's repentance
    'Amon':
      R(26, 18, 12, 28, '#64748b', 2) + C(32, 16, 6, '#94a3b8') +
      R(20, 46, 24, 5, '#475569', 1.5) + C(29, 16, 1.4, '#1f2937') + C(35, 16, 1.4, '#1f2937'),

    // Josiah — found the Book of the Law and renewed the covenant
    'Josiah':
      P('M14 22 Q32 16 32 22 L32 48 Q32 42 14 48 Z', '#fef3c7') +
      P('M50 22 Q32 16 32 22 L32 48 Q32 42 50 48 Z', '#fde68a') +
      L(32, 22, 32, 48, '#92400e', 2) +
      L(19, 28, 28, 26, '#a16207', 1.4) + L(19, 34, 28, 32, '#a16207', 1.4) + L(36, 26, 45, 28, '#a16207', 1.4) + L(36, 32, 45, 34, '#a16207', 1.4),

    // Jehoahaz of Judah — three months, then an empty throne
    'Jehoahaz of Judah':
      P('M20 50 L20 26 Q20 20 26 20 L38 20 Q44 20 44 26 L44 50 Z', '#7c5a2a') +
      R(16, 48, 32, 4, '#5c3f1c', 1) + R(24, 26, 16, 14, '#a16207', 2) +
      L(50, 18, 56, 24, '#94a3b8', 2.4) + L(56, 18, 50, 24, '#94a3b8', 2.4),

    // Jehoiakim — sliced up Jeremiah's scroll and burned it
    'Jehoiakim':
      P('M16 22 Q24 18 24 24 L24 46 Q24 40 16 46 Z', '#fde68a') +
      P('M30 24 Q38 20 38 26 L38 48 Q38 42 30 48 Z', '#fef3c7') +
      L(28, 16, 44, 40, '#cbd5e1', 3) + P('M44 40 L49 44 L46 38 Z', '#94a3b8') +
      flame(40, 52, 10),

    // Jehoiachin — carried to Babylon, later lifted from prison
    'Jehoiachin':
      R(18, 16, 28, 36, '#475569', 2) +
      L(24, 16, 24, 52, '#94a3b8', 3) + L(40, 16, 40, 52, '#94a3b8', 3) +
      L(32, 16, 32, 30, '#94a3b8', 3, 'transform="rotate(28 32 30)"') +
      crown(32, 44, 12, 7, '#fbbf24', '#ef4444'),

    // Zedekiah — saw Jerusalem fall and the temple burn
    'Zedekiah':
      P('M14 30 L32 16 L50 30 Z', '#b08968') + R(16, 30, 32, 20, '#d6b06a', 1) +
      R(22, 36, 5, 14, '#7c5a2a') + R(37, 36, 5, 14, '#7c5a2a') +
      flame(32, 34, 18) + flame(22, 36, 11) + flame(42, 36, 11),

    // Pharaoh Neco II — Egypt's king at Megiddo (pyramid + sun)
    'Pharaoh Neco II':
      C(44, 22, 6, '#fbbf24') + P('M12 50 L30 22 L48 50 Z', '#e3c178') +
      L(30, 22, 30, 50, '#caa45a', 1.5) + R(10, 50, 44, 4, '#b08968', 1) +
      L(44, 12, 44, 8, '#fbbf24', 2) + L(54, 22, 58, 22, '#fbbf24', 2),

    // Tiglath-pileser III — Assyrian power (winged bull / lamassu)
    'Tiglath-pileser III':
      P('M18 30 Q10 22 16 18 Q22 22 24 28 Z', '#9333ea') +
      R(24, 28, 18, 16, '#7e22ce', 2) + R(38, 22, 8, 10, '#9333ea', 2) +
      S('M42 22 L40 16 M46 22 L48 16', '#c084fc', 2.4) +
      R(26, 44, 3, 8, '#6b21a8') + R(37, 44, 3, 8, '#6b21a8') + C(44, 26, 1.4, '#fef3c7'),

    // Shalmaneser V — laid siege to Samaria (ladder on the wall)
    'Shalmaneser V':
      R(34, 18, 20, 34, '#8b5cf6', 1) + R(34, 18, 20, 5, '#7c3aed', 1) +
      R(38, 26, 4, 6, '#5b21b6') + R(46, 26, 4, 6, '#5b21b6') + R(38, 38, 4, 6, '#5b21b6') + R(46, 38, 4, 6, '#5b21b6') +
      L(16, 52, 34, 16, '#92400e', 3) + L(22, 52, 40, 16, '#92400e', 3) +
      L(18, 44, 38, 28, '#a16207', 2.4) + L(20, 36, 38, 24, '#a16207', 2.4),

    // Sennacherib — his vast camp struck down before Jerusalem
    'Sennacherib':
      P('M14 48 L24 28 L34 48 Z', '#7c3aed') + P('M30 48 L40 30 L50 48 Z', '#8b5cf6') +
      L(24, 28, 24, 24, '#6b21a8', 2) + L(40, 30, 40, 26, '#6b21a8', 2) +
      P('M44 12 L46 18 L52 18 L47 22 L49 28 L44 24 L39 28 L41 22 L36 18 L42 18 Z', '#fde047'),

    // Nebuchadnezzar II — the great golden statue on the plain
    'Nebuchadnezzar II':
      R(28, 18, 8, 28, '#fbbf24', 1) + C(32, 14, 5, '#fbbf24') +
      R(24, 24, 16, 4, '#fcd34d', 1) + L(28, 24, 24, 38, '#f59e0b', 2.4) + L(36, 24, 40, 38, '#f59e0b', 2.4) +
      R(22, 46, 20, 6, '#a16207', 1) + crown(32, 11, 9, 5, '#fde047', '#7c3aed'),

    // Belshazzar — the cup of the feast and the writing on the wall
    'Belshazzar':
      P('M20 22 L34 22 L31 34 Q27 38 23 34 Z', '#fbbf24') + L(27, 36, 27, 46, '#fbbf24', 3) + R(22, 46, 10, 3, '#d97706', 1) +
      R(40, 14, 16, 22, '#e9d5ff', 2) +
      S('M44 20 L52 20 M44 25 L52 25 M44 30 L49 30', '#7c3aed', 2) +
      P('M44 36 q3 -2 6 0 q2 2 0 4', '#fca5a5', 'opacity="0.9"'),

    // Darius the Mede — the lions' den that could not harm Daniel
    'Darius the Mede':
      C(32, 34, 12, '#f59e0b') + C(32, 34, 8, '#fbbf24') +
      [...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2; return P(`M${32 + Math.cos(a) * 11} ${34 + Math.sin(a) * 11} L${32 + Math.cos(a) * 17} ${34 + Math.sin(a) * 17} L${32 + Math.cos(a + 0.32) * 12} ${34 + Math.sin(a + 0.32) * 12} Z`, '#d97706');
      }).join('') +
      C(28, 33, 1.6, '#1f2937') + C(36, 33, 1.6, '#1f2937') + P('M29 38 Q32 41 35 38', '#7c2d12') + L(29, 38, 35, 38, '#7c2d12', 1.6),

    // Cyrus — the decree that freed the exiles to rebuild (sealed scroll)
    'Cyrus':
      R(18, 24, 28, 18, '#fef3c7', 2) + R(18, 24, 28, 4, '#fde68a') + R(18, 38, 28, 4, '#fde68a') +
      L(23, 30, 41, 30, '#a16207', 1.4) + L(23, 34, 38, 34, '#a16207', 1.4) +
      C(32, 46, 5, '#dc2626') + C(32, 46, 2.4, '#fca5a5'),

    // Ahasuerus — the golden scepter extended in Esther's court
    'Ahasuerus':
      crown(32, 24, 22, 12, '#a855f7', '#facc15') +
      L(20, 50, 44, 30, '#fbbf24', 4) + C(45, 29, 3.4, '#fde047') +
      C(45, 29, 1.4, '#7c3aed'),
  };

  // Fallback for any king not explicitly drawn: a generic crowned monogram.
  function fallback(king) {
    const initial = king.name.slice(0, 1);
    return crown(32, 24, 18, 10, '#fbbf24', '#ef4444') +
      `<text x="32" y="48" text-anchor="middle" font-size="20" font-weight="900" fill="#475569" font-family="Inter, sans-serif">${initial}</text>`;
  }

  // Public API: returns an inline SVG string for a king object.
  window.kingArt = function (king) {
    const bg = BG[king.status] || '#e7edff';
    const body = ART[king.name] || fallback(king);
    return wrap(bg, body);
  };
})();
