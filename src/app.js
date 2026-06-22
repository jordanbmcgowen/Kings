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
  $$('.timeline-row').forEach((row) => row.addEventListener('click', () => selectKing(row.dataset.name)));
}

function renderMap() {
  const regions = [
    ['Assyria', 430, 65, 190, 90, '#8e44ad'], ['Babylon', 455, 220, 155, 95, '#e67e22'],
    ['Persia', 585, 295, 95, 120, '#16a085'], ['Israel', 260, 174, 75, 86, '#3867d6'],
    ['Judah', 262, 278, 74, 66, '#f7b731'], ['Egypt', 55, 310, 160, 105, '#c0392b'],
    ['Aram', 318, 92, 90, 76, '#20bf6b'], ['Moab', 350, 286, 62, 56, '#795548']
  ];
  $('#mapRegions').innerHTML = regions.map(([name, x, y, w, h, color]) => `
    <g tabindex="0" role="button" aria-label="Filter by ${name}" class="region" data-region="${name}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${color}" />
      <text x="${x + w / 2}" y="${y + h / 2}" dominant-baseline="middle" text-anchor="middle">${name}</text>
    </g>
  `).join('');
  $('#mapLegend').innerHTML = regions.map(([name,, , , , color]) => `<button data-region="${name}"><span style="background:${color}"></span>${name}</button>`).join('');
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
