/* =============================================
   YourChoice – Main JavaScript
   ============================================= */

// ---- Country & Region ----
const countryRegions = {
  IN: { name: 'India',         regions: ['North','South','East','West','Central','Northeast'] },
  US: { name: 'United States', regions: ['Northeast','Southeast','Midwest','Southwest','West'] },
  UK: { name: 'United Kingdom',regions: ['England','Scotland','Wales','Northern Ireland'] },
  CA: { name: 'Canada',        regions: ['Ontario','Quebec','British Columbia','Alberta','Manitoba'] },
  AU: { name: 'Australia',     regions: ['New South Wales','Victoria','Queensland','Western Australia','South Australia'] },
  PK: { name: 'Pakistan',      regions: ['Punjab','Sindh','KPK','Balochistan'] },
  BD: { name: 'Bangladesh',    regions: ['Dhaka','Chittagong','Rajshahi','Khulna','Sylhet'] },
  DE: { name: 'Germany',       regions: ['Bavaria','Berlin','Hamburg','Baden-Württemberg','Hesse'] },
  FR: { name: 'France',        regions: ['Île-de-France','Auvergne','Provence','Normandy'] },
  JP: { name: 'Japan',         regions: ['Kanto','Kansai','Tohoku','Kyushu','Chubu'] },
  SG: { name: 'Singapore',     regions: ['Central','North','Northeast','East','West'] },
  AE: { name: 'UAE',           regions: ['Dubai','Abu Dhabi','Sharjah','Ajman'] },
  LK: { name: 'Sri Lanka',     regions: ['Western','Central','Southern','Northern','Eastern','Uva','Sabaragamuwa'] },
  NP: { name: 'Nepal',         regions: ['Province 1','Province 2','Bagmati','Gandaki','Lumbini'] },
  NG: { name: 'Nigeria',       regions: ['Lagos','Abuja','Kano','Ibadan','Port Harcourt'] },
  ZA: { name: 'South Africa',  regions: ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape'] },
  BR: { name: 'Brazil',        regions: ['São Paulo','Rio de Janeiro','Minas Gerais','Bahia'] },
  MX: { name: 'Mexico',        regions: ['Mexico City','Jalisco','Nuevo León','Puebla'] },
  IT: { name: 'Italy',         regions: ['Lombardy','Lazio','Campania','Sicily','Veneto'] },
  ES: { name: 'Spain',         regions: ['Madrid','Catalonia','Andalusia','Valencia'] },
};

function populateCountries(id) {
  const sel = document.getElementById(id);
  if (!sel) return;
  Object.entries(countryRegions).forEach(([code, d]) => {
    const o = document.createElement('option');
    o.value = code; o.textContent = d.name;
    sel.appendChild(o);
  });
}

function populateRegions(countryCode, regionId) {
  const sel = document.getElementById(regionId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Select Region</option>';
  if (countryRegions[countryCode]) {
    countryRegions[countryCode].regions.forEach(r => {
      const o = document.createElement('option');
      o.value = r.toLowerCase().replace(/\s+/g, '-');
      o.textContent = r;
      sel.appendChild(o);
    });
  }
}

// ---- LocalStorage ----
const save  = (k, v) => localStorage.setItem('yc_' + k, JSON.stringify(v));
const load  = k => { try { return JSON.parse(localStorage.getItem('yc_' + k)); } catch { return null; } };
const clear = () => Object.keys(localStorage).filter(k => k.startsWith('yc_')).forEach(k => localStorage.removeItem(k));

// ---- Page Transition ----
function goTo(url) {
  document.body.style.transition = 'opacity 0.35s ease';
  document.body.style.opacity = '0';
  setTimeout(() => location.href = url, 350);
}
function startOver() { clear(); goTo('index.html'); }

// ---- Form Helpers ----
function getRadio(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}
function getSelect(id) {
  const el = document.getElementById(id);
  return el && el.value ? el.value : null;
}
function markError(cardId, msg) {
  const card = document.getElementById(cardId);
  if (!card) return;
  card.classList.add('error');
  let err = card.querySelector('.err-msg');
  if (!err) { err = document.createElement('p'); err.className = 'err-msg'; card.appendChild(err); }
  err.textContent = msg || 'Please answer this question.';
}
function clearError(cardId) {
  const card = document.getElementById(cardId);
  if (card) { card.classList.remove('error'); const e = card.querySelector('.err-msg'); if (e) e.remove(); }
}

// ---- Recommendation Engine ----
function getRecommendation() {
  const info  = load('userInfo') || {};
  const prefs = load('prefs')    || {};

  function score(row) {
    let s = 0;
    if (row.age    === info.age)    s += 3;
    if (row.gender === info.gender) s += 2;
    if (row.country=== info.country)s += 2;
    if (row.region === info.region) s += 1;
    const pk = (prefs.preference || prefs.style || prefs.taste || prefs.service || '').toLowerCase();
    if (pk && (row.preference || '').toLowerCase().includes(pk)) s += 4;
    const pc = (prefs.price || '').toLowerCase();
    if (pc && (row.price || '').toLowerCase() === pc) s += 2;
    const bk = (prefs.buy || prefs.platform || '').toLowerCase();
    if (bk && (row.buy || '').toLowerCase().includes(bk.split(' ')[0])) s += 1;
    return s;
  }

  const scored = dataset.map(r => ({ ...r, _s: score(r) }));
  const max    = Math.max(...scored.map(r => r._s));
  const best   = scored.filter(r => r._s === max);
  return best[Math.floor(Math.random() * best.length)];
}

// ---- Entrepreneur Analytics ----
function analyzeMarket(filters) {
  let data = [...dataset];
  if (filters.age)    data = data.filter(r => r.age    === filters.age);
  if (filters.gender && filters.gender !== 'all') data = data.filter(r => r.gender === filters.gender);
  if (filters.country)data = data.filter(r => r.country=== filters.country);
  if (!data.length)   data = [...dataset];

  const count = (arr, key) => arr.reduce((acc, r) => { acc[r[key]] = (acc[r[key]] || 0) + 1; return acc; }, {});
  return {
    prefCounts:  count(data, 'preference'),
    buyCounts:   count(data, 'buy'),
    priceCounts: count(data, 'price'),
    total: data.length, data
  };
}

function generateSuggestions(pref, buy, price) {
  const base = [
    `Prioritize <strong>${pref}</strong> — it's the top preference in your segment.`,
    `Optimize for <strong>${buy}</strong> purchasing — streamline that experience.`,
    `Target the <strong>${(price||'').replace(/-/g,' ')}</strong> price band for maximum reach.`,
    'Add verified social proof (ratings, reviews) to build trust quickly.',
    'Consider bundles or loyalty perks to improve retention and order value.'
  ];
  if ((pref||'').toLowerCase().includes('tech')) {
    base.push('Highlight wireless compatibility and app integration in your marketing.');
  }
  if (buy === 'online') {
    base.push('Invest in fast shipping and frictionless returns.');
  }
  return base.slice(0, 5);
}

// ---- Charts ----
function barChart(id, labels, data, label, colors) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data,
        backgroundColor: colors || labels.map((_,i) => `hsla(${260+i*35},70%,65%,0.75)`),
        borderRadius: 8, borderSkipped: false }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#d4c8ff' } },
        x: { grid: { display: false }, ticks: { color: '#d4c8ff' } }
      }
    }
  });
}

function doughnutChart(id, labels, data) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data,
        backgroundColor: ['#6C63FF','#4A90E2','#FF7A18','#38B2AC','#ED64A6'],
        borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: { legend: { position: 'bottom', labels: { color: '#d4c8ff', font: { family: 'Poppins', size: 12 } } } }
    }
  });
}

// ---- Interest helpers ----
const INTEREST_EMOJI  = { gift:'🎁', clothes:'👕', food:'🍔', services:'🛠️' };
const INTEREST_LABEL  = { gift:'Gift', clothes:'Clothes', food:'Food', services:'Services' };

// =========================================================
// DOMContentLoaded
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  // Animate body in
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity = '1';
  });

  // Populate country dropdowns
  ['countrySelect','countryEnt','countryRes'].forEach(populateCountries);

  const countryMain = document.getElementById('countrySelect');
  if (countryMain) countryMain.addEventListener('change', e => populateRegions(e.target.value, 'regionSelect'));
  const countryEnt = document.getElementById('countryEnt');
  if (countryEnt)  countryEnt.addEventListener('change', e => populateRegions(e.target.value, 'regionEnt'));
  const countryRes = document.getElementById('countryRes');
  if (countryRes)  countryRes.addEventListener('change', e => populateRegions(e.target.value, 'regionRes'));

  // ---- USER INFO FORM ----
  const userForm = document.getElementById('userInfoForm');
  if (userForm) {
    userForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      const fields = [
        ['age','cardAge'], ['gender','cardGender'], ['interest','cardInterest']
      ];
      fields.forEach(([n, c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      ['cardCountry','cardRegion'].forEach(c => clearError(c));
      if (!getSelect('countrySelect')) { markError('cardCountry'); ok = false; }
      if (!getSelect('regionSelect'))  { markError('cardRegion');  ok = false; }
      if (!ok) return;

      save('userInfo', {
        age: getRadio('age'), gender: getRadio('gender'),
        country: getSelect('countrySelect'), region: getSelect('regionSelect'),
        interest: getRadio('interest')
      });
      const dest = { gift:'gift.html', clothes:'clothes.html', food:'food.html', services:'services.html' };
      goTo(dest[getRadio('interest')] || 'result.html');
    });
  }

  // ---- GIFT FORM ----
  const giftForm = document.getElementById('giftForm');
  if (giftForm) {
    giftForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      [['preference','cardPref'],['price','cardPrice'],['buy','cardBuy'],['occasion','cardOccasion']].forEach(([n,c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      if (!ok) return;
      save('prefs', { preference:getRadio('preference'), price:getRadio('price'), buy:getRadio('buy'), occasion:getRadio('occasion') });
      goTo('result.html');
    });
  }

  // ---- CLOTHES FORM ----
  const clothesForm = document.getElementById('clothesForm');
  if (clothesForm) {
    clothesForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      [['style','cardStyle'],['priceSens','cardPriceSens'],['priority','cardPriority'],['platform','cardPlatform']].forEach(([n,c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      if (!ok) return;
      save('prefs', { style:getRadio('style'), priceSensitivity:getRadio('priceSens'), priority:getRadio('priority'), platform:getRadio('platform') });
      goTo('result.html');
    });
  }

  // ---- FOOD FORM ----
  const foodForm = document.getElementById('foodForm');
  if (foodForm) {
    foodForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      [['taste','cardTaste'],['habit','cardHabit'],['factor','cardFactor'],['newProduct','cardNew']].forEach(([n,c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      if (!ok) return;
      save('prefs', { taste:getRadio('taste'), habit:getRadio('habit'), factor:getRadio('factor'), newProduct:getRadio('newProduct') });
      goTo('result.html');
    });
  }

  // ---- SERVICES FORM ----
  const servicesForm = document.getElementById('servicesForm');
  if (servicesForm) {
    servicesForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      [['service','cardService'],['factor','cardFactor'],['booking','cardBooking'],['satisfaction','cardSatisfaction']].forEach(([n,c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      if (!ok) return;
      save('prefs', { service:getRadio('service'), factor:getRadio('factor'), booking:getRadio('booking'), satisfaction:getRadio('satisfaction') });
      goTo('result.html');
    });
  }

  // ---- RESULT PAGE ----
  const resultSection = document.getElementById('resultSection');
  if (resultSection) {
    const info  = load('userInfo') || {};
    const prefs = load('prefs')    || {};
    const rec   = getRecommendation();
    const cn    = (countryRegions[info.country] || {}).name || info.country || '—';

    document.getElementById('sumAge').textContent     = info.age    || '—';
    document.getElementById('sumGender').textContent  = info.gender || '—';
    document.getElementById('sumCountry').textContent = cn;
    document.getElementById('sumRegion').textContent  = (info.region||'—').replace(/-/g,' ');
    document.getElementById('sumInterest').textContent= INTEREST_LABEL[info.interest] || '—';

    document.getElementById('recEmoji').textContent   = INTEREST_EMOJI[info.interest] || '✨';
    document.getElementById('recLabel').textContent   = `Recommended ${INTEREST_LABEL[info.interest] || 'Idea'}`;
    document.getElementById('recTitle').textContent   = rec ? rec.recommendation : 'Great choice found!';
    document.getElementById('recReason').innerHTML    = rec
      ? `People in your age group <strong>(${info.age})</strong> with similar preferences <em>(${rec.preference})</em> in <strong>${cn}</strong> frequently choose this.`
      : 'Based on your answers, this is a top pick for you!';
  }

  // ---- ENT PRODUCT TEST FORM ----
  const entForm = document.getElementById('entProductForm');
  if (entForm) {
    entForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      [['entAge','cardEntAge'],['entGender','cardEntGender'],['entCategory','cardEntCat'],['entPrice','cardEntPrice']].forEach(([n,c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      clearError('cardEntCountry');
      if (!getSelect('countryEnt')) { markError('cardEntCountry'); ok = false; }
      if (!ok) return;
      save('entFilters', { age:getRadio('entAge'), gender:getRadio('entGender'), country:getSelect('countryEnt'), category:getRadio('entCategory'), price:getRadio('entPrice') });
      goTo('entrepreneur-result.html');
    });
  }

  // ---- RESEARCH FORM ----
  const resForm = document.getElementById('researchForm');
  if (resForm) {
    resForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      [['resAge','cardResAge'],['resGender','cardResGender'],['resCategory','cardResCat']].forEach(([n,c]) => {
        clearError(c);
        if (!getRadio(n)) { markError(c); ok = false; }
      });
      clearError('cardResCountry');
      if (!getSelect('countryRes')) { markError('cardResCountry'); ok = false; }
      if (!ok) return;
      save('resFilters', { age:getRadio('resAge'), gender:getRadio('resGender'), country:getSelect('countryRes'), category:getRadio('resCategory') });
      goTo('entrepreneur-result.html?mode=research');
    });
  }

  // ---- ENT RESULT PAGE ----
  const entResult = document.getElementById('entResultSection');
  if (entResult) {
    const params  = new URLSearchParams(location.search);
    const mode    = params.get('mode');
    const filters = mode === 'research' ? (load('resFilters') || {}) : (load('entFilters') || {});
    const analytics = analyzeMarket(filters);

    const pl = Object.keys(analytics.prefCounts), pd = Object.values(analytics.prefCounts);
    const bl = Object.keys(analytics.buyCounts),  bd = Object.values(analytics.buyCounts);
    const rl = Object.keys(analytics.priceCounts),rd = Object.values(analytics.priceCounts);

    barChart('chartPrefs', pl, pd, 'Preferences');
    doughnutChart('chartBuy', bl, bd);
    barChart('chartPrice', rl, rd, 'Price Ranges', ['#FF7A18','#6C63FF','#4A90E2','#38B2AC']);

    const topPref  = pl[pd.indexOf(Math.max(...pd))] || 'N/A';
    const topBuy   = bl[bd.indexOf(Math.max(...bd))] || 'N/A';
    const topPrice = rl[rd.indexOf(Math.max(...rd))] || 'N/A';
    const filterSummary = `${filters.age || 'All ages'} · ${filters.gender || 'All genders'} · ${(countryRegions[filters.country] || {}).name || 'All countries'}`;

    document.getElementById('insightSummary').textContent = filterSummary;
    document.getElementById('insightText').innerHTML =
      `Customers aged <strong>${filters.age || 'various'}</strong> prefer <strong>${topPref}</strong> and most buy <strong>${topBuy}</strong>. Sweet-spot price: <strong>${topPrice.replace(/-/g,' ')}</strong>.`;

    const ul = document.getElementById('suggestionList');
    generateSuggestions(topPref, topBuy, topPrice).forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = s;
      ul.appendChild(li);
    });
  }

});
