const state = { selected: KING_DATA[0].name, compare: [] };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const byName = (name) => KING_DATA.find((king) => king.name === name);

function unique(field) {
  return [...new Set(KING_DATA.map((king) => king[field]))].sort();
}

function fillSelect(id, values) {
  const select = $(id);
  values.forEach((value) => select.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`));
}

function matchesFilters(king) {
  const text = $('#search').value.trim().toLowerCase();
  const kingdom = $('#kingdomFilter').value;
  const era = $('#eraFilter').value;
  const status = $('#statusFilter').value;
  const haystack = Object.values(king).join(' ').toLowerCase();
  return (!text || haystack.includes(text)) &&
    (kingdom === 'all' || king.kingdom === kingdom) &&
    (era === 'all' || king.era === era) &&
    (status === 'all' || king.status === status);
}

function filteredKings() {
  const sorted = KING_DATA.filter(matchesFilters);
  const sort = $('#sort').value;
  return sorted.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'kingdom') return `${a.kingdom}${a.start}`.localeCompare(`${b.kingdom}${b.start}`);
    if (sort === 'status') return a.status.localeCompare(b.status) || a.start - b.start;
    return a.start - b.start;
  });
}

function renderCards() {
  const list = filteredKings();
  $('#resultCount').textContent = `${list.length} shown`;
  $('#cards').innerHTML = list.map((king) => `
    <button class="king-card ${state.selected === king.name ? 'active' : ''}" data-name="${king.name}">
      <span class="avatar">${king.name.slice(0, 1)}</span>
      <span class="pill ${king.status}">${king.status}</span>
      <h3>${king.name}</h3>
      <p class="meta">${king.kingdom} • ${formatYears(king)}</p>
      <p>${king.takeaway}</p>
    </button>
  `).join('') || '<p class="empty">No kings match those filters. Try clearing search or choosing “All.”</p>';
  $$('.king-card').forEach((card) => card.addEventListener('click', () => selectKing(card.dataset.name)));
  if (!list.some((king) => king.name === state.selected) && list[0]) state.selected = list[0].name;
  renderDetail();
  renderTimeline(list);
}

function selectKing(name) {
  state.selected = name;
  renderCards();
  if (innerWidth < 900) $('#detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatYears(king) {
  const start = Math.abs(king.start);
  const end = Math.abs(king.end);
  return king.start === king.end ? `c. ${start} BC` : `c. ${start}–${end} BC`;
}

function renderDetail() {
  const king = byName(state.selected) || filteredKings()[0] || KING_DATA[0];
  $('#detail').innerHTML = `
    <div class="detail-top">
      <span class="avatar large">${king.name.slice(0, 1)}</span>
      <div><span class="pill ${king.status}">${king.status}</span><h2>${king.name}</h2></div>
    </div>
    <p class="summary">${king.summary}</p>
    <div class="fact-grid">
      <div><strong>Kingdom</strong><span>${king.kingdom}</span></div>
      <div><strong>Reign</strong><span>${formatYears(king)}</span></div>
      <div><strong>Capital</strong><span>${king.capital}</span></div>
      <div><strong>House</strong><span>${king.house}</span></div>
      <div><strong>Era</strong><span>${king.era}</span></div>
      <div><strong>Region</strong><span>${king.region}</span></div>
    </div>
    <section class="scripture"><h3>Bible check</h3><p>${king.refs}</p></section>
    <section><h3>Remember this</h3><p>${king.takeaway}</p></section>
    <div class="detail-actions">
      <button class="button primary" id="quizButton">Quick check</button>
      <button class="button ghost" id="compareButton">Add to compare</button>
    </div>
  `;
  $('#quizButton').addEventListener('click', () => openQuiz(king));
  $('#compareButton').addEventListener('click', () => addCompare(king.name));
}

function renderTimeline(list) {
  const min = Math.min(...KING_DATA.map((king) => king.start));
  const max = Math.max(...KING_DATA.map((king) => king.end));
  $('#timelineTrack').innerHTML = list.map((king) => {
    const left = ((king.start - min) / (max - min)) * 82;
    const width = Math.max(((king.end - king.start) / (max - min)) * 82, 2.5);
    return `<button class="timeline-row" data-name="${king.name}"><span>${king.name}</span><i class="${king.status}" style="left:${left}%;width:${width}%"></i><small>${formatYears(king)}</small></button>`;
  }).join('');
  $$('.timeline-row').forEach((row) => row.addEventListener('click', () => openTimelinePopup(byName(row.dataset.name))));
}

function openTimelinePopup(king) {
  if (!king) return;
  state.selected = king.name;
  renderCards();
  $('#timelinePopupContent').innerHTML = `
    <div class="detail-top popup-top">
      <span class="avatar large">${king.name.slice(0, 1)}</span>
      <div><span class="pill ${king.status}">${king.status}</span><h2>${king.name}</h2></div>
    </div>
    <p class="summary">${king.summary}</p>
    <div class="popup-facts">
      <div><strong>Reign</strong><span>${formatYears(king)}</span></div>
      <div><strong>Kingdom</strong><span>${king.kingdom}</span></div>
      <div><strong>Capital</strong><span>${king.capital}</span></div>
      <div><strong>Bible references</strong><span>${king.refs}</span></div>
    </div>
    <section class="scripture"><h3>Remember this</h3><p>${king.takeaway}</p></section>
    <div class="detail-actions"><button class="button primary" value="close">Got it</button></div>
  `;
  $('#timelineDialog').showModal();
}

function renderMap() {
  const regions = [
    { name: 'Israel', color: '#3867d6', center: [32.65, 35.25], radius: 65000, note: 'Northern kingdom: Samaria, Jezreel, Galilee, and nearby hill country.' },
    { name: 'Judah', color: '#f7b731', center: [31.68, 35.16], radius: 52000, note: 'Southern kingdom centered on Jerusalem, Bethlehem, and the Judean hills.' },
    { name: 'Aram', color: '#20bf6b', center: [33.52, 36.30], radius: 85000, note: 'Aram/Syria region around Damascus.' },
    { name: 'Moab', color: '#795548', center: [31.55, 35.70], radius: 45000, note: 'Plateau east of the Dead Sea.' },
    { name: 'Egypt', color: '#c0392b', center: [30.05, 31.23], radius: 145000, note: 'Nile delta and lower Egypt, where pharaohs enter the Bible story.' },
    { name: 'Assyria', color: '#8e44ad', center: [36.36, 43.15], radius: 160000, note: 'Assyrian heartland around Nineveh and the upper Tigris.' },
    { name: 'Babylon', color: '#e67e22', center: [32.54, 44.42], radius: 135000, note: 'Babylonian heartland on the Euphrates in Mesopotamia.' },
    { name: 'Persia', color: '#16a085', center: [29.93, 52.89], radius: 170000, note: 'Persian royal heartland represented near Persepolis/Pasargadae.' }
  ];
  const cities = [
    ['Jerusalem', 31.778, 35.235, 'Capital of Judah and Davidic kings.'],
    ['Samaria', 32.276, 35.198, 'Capital of the northern kingdom of Israel.'],
    ['Damascus', 33.513, 36.292, 'Major city of Aram/Syria.'],
    ['Nineveh', 36.359, 43.152, 'Assyrian capital region.'],
    ['Babylon', 32.543, 44.420, 'Capital city of Babylon.'],
    ['Susa', 32.190, 48.257, 'Persian royal city in Esther and Nehemiah.'],
    ['Memphis/Cairo area', 30.044, 31.236, 'Lower Egypt/Nile delta reference point.']
  ];
  $('#mapLegend').innerHTML = regions.map((region) => `<button data-region="${region.name}"><span style="background:${region.color}"></span>${region.name}<small>${region.note}</small></button>`).join('');
  if (!window.L) {
    $('#accurateMap').innerHTML = '<p class="empty">Map tiles could not load. Use the region buttons to filter the explorer.</p>';
  } else {
    const map = L.map('accurateMap', { scrollWheelZoom: false }).setView([32.2, 38.5], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    regions.forEach((region) => {
      L.circle(region.center, {
        radius: region.radius,
        color: region.color,
        weight: 2,
        fillColor: region.color,
        fillOpacity: 0.2
      }).addTo(map).bindPopup(`<strong>${region.name}</strong><br>${region.note}<br><em>Click the legend to filter kings.</em>`);
    });
    cities.forEach(([name, lat, lng, note]) => {
      L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${name}</strong><br>${note}`);
    });
  }
  $$('[data-region]').forEach((el) => el.addEventListener('click', () => {
    $('#search').value = el.dataset.region;
    renderCards();
    location.hash = 'explorer';
  }));
}

function addCompare(name) {
  state.compare = [name, ...state.compare.filter((item) => item !== name)].slice(0, 3);
  $('#compareTray').innerHTML = state.compare.map((item) => {
    const king = byName(item);
    return `<article><strong>${king.name}</strong><span>${king.kingdom}</span><small>${king.takeaway}</small></article>`;
  }).join('');
}

function openQuiz(king) {
  $('#quizQuestion').textContent = `Which Bible reference helps you check the story of ${king.name}?`;
  $('#quizResult').textContent = '';
  $('#quizAnswer').onclick = (event) => {
    event.preventDefault();
    $('#quizResult').textContent = `${king.refs}. Bonus: ${king.takeaway}`;
  };
  $('#quizDialog').showModal();
}

function wireEvents() {
  ['#search', '#kingdomFilter', '#eraFilter', '#statusFilter', '#sort'].forEach((id) => $(id).addEventListener('input', renderCards));
  $('#clearFilters').addEventListener('click', () => {
    $('#search').value = '';
    $('#kingdomFilter').value = 'all';
    $('#eraFilter').value = 'all';
    $('#statusFilter').value = 'all';
    $('#sort').value = 'year';
    renderCards();
  });
  $('#randomKing').addEventListener('click', () => selectKing(KING_DATA[Math.floor(Math.random() * KING_DATA.length)].name));
}

function init() {
  $('#kingCount').textContent = KING_DATA.length;
  fillSelect('#kingdomFilter', unique('kingdom'));
  fillSelect('#eraFilter', unique('era'));
  fillSelect('#statusFilter', unique('status'));
  renderMap();
  wireEvents();
  renderCards();
  addCompare('David');
  addCompare('Jeroboam I');
}

init();
