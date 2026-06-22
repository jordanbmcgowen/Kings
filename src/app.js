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
    { name: 'Egypt', color: '#c0392b', label: [150, 438], d: 'M58 420c45-36 103-48 171-36 11 55 20 103 12 173H44c8-47 7-89 14-137z' },
    { name: 'Judah', color: '#f7b731', label: [325, 392], d: 'M300 343c21 5 39 15 50 32-3 24-14 49-32 72-25-13-45-31-57-54 15-20 26-37 39-50z' },
    { name: 'Israel', color: '#3867d6', label: [324, 281], d: 'M296 206c31 8 55 26 69 54-9 37-30 66-65 86-25-22-30-61-20-94 4-15 9-30 16-46z' },
    { name: 'Moab', color: '#795548', label: [391, 386], d: 'M368 330c42 12 63 43 64 88-20 18-43 28-72 30 7-34 11-73 8-118z' },
    { name: 'Aram', color: '#20bf6b', label: [414, 196], d: 'M352 118c59-8 111 5 157 39-9 47-36 82-84 108-20-33-48-59-84-76 0-24 4-47 11-71z' },
    { name: 'Assyria', color: '#8e44ad', label: [630, 126], d: 'M510 33c114 8 215 43 303 105-15 59-51 104-111 134-55-52-116-87-183-105-18-39-21-83-9-134z' },
    { name: 'Babylon', color: '#e67e22', label: [642, 332], d: 'M536 257c88 9 158 46 211 110-19 52-55 87-109 106-79-21-143-61-193-118 20-39 50-71 91-98z' },
    { name: 'Persia', color: '#16a085', label: [779, 290], d: 'M724 151c61 36 111 87 150 154v155c-70-3-126-25-167-66 31-70 37-151 17-243z' }
  ];
  $('#mapRegions').innerHTML = regions.map((region) => `
    <g tabindex="0" role="button" aria-label="Filter by ${region.name}" class="region" data-region="${region.name}">
      <path d="${region.d}" fill="${region.color}" />
      <text x="${region.label[0]}" y="${region.label[1]}" text-anchor="middle">${region.name}</text>
    </g>
  `).join('');
  $('#mapLegend').innerHTML = regions.map((region) => `<button data-region="${region.name}"><span style="background:${region.color}"></span>${region.name}</button>`).join('');
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
