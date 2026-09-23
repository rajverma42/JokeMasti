/* JokeMasti client script. Progressive enhancement: every page works without it. */
(function () {
'use strict';
var JM = window.JM || {};
var BASE = JM.base || '';
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var enc = encodeURIComponent;
var store = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
};
function icon(n) { return '<svg class="i" aria-hidden="true" focusable="false"><use href="' + JM.icons + '#' + n + '"/></svg>'; }
function abs(p) { return JM.site + p; }

// ---------- toast ----------
var toastTimer;
function toast(msg) {
  var t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
}

// ---------- theme ----------
var THEMES = ['system', 'light', 'dark'];
var THEME_ICON = { system: 'system', light: 'sun', dark: 'moon' };
function getTheme() { var t; try { t = localStorage.getItem('jm:theme'); } catch (e) {} return THEMES.indexOf(t) > -1 ? t : 'system'; }
function applyTheme(t) {
  if (t === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  var label = 'Theme: ' + t.charAt(0).toUpperCase() + t.slice(1);
  $$('[data-theme-toggle]').forEach(function (b) {
    var use = b.querySelector('use'); if (use) use.setAttribute('href', JM.icons + '#' + THEME_ICON[t]);
    if (b.classList.contains('icon-btn')) b.setAttribute('aria-label', label + '. Change theme');
    var l = b.querySelector('[data-theme-label]'); if (l) l.textContent = label;
  });
}
function initTheme() {
  applyTheme(getTheme());
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-theme-toggle]'); if (!b) return;
    var next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
    try { localStorage.setItem('jm:theme', next); } catch (err) {}
    applyTheme(next); toast('Theme: ' + next);
  });
}

// ---------- mobile nav ----------
function initNav() {
  var header = $('.site-header'), btn = $('.menu-btn'); if (!header || !btn) return;
  function set(open) {
    header.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    var use = btn.querySelector('use'); if (use) use.setAttribute('href', JM.icons + '#' + (open ? 'close' : 'menu'));
  }
  btn.addEventListener('click', function () { set(!header.classList.contains('nav-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('nav-open')) { set(false); btn.focus(); } });
  document.addEventListener('click', function (e) { if (header.classList.contains('nav-open') && !header.contains(e.target)) set(false); });
}

// ---------- clipboard ----------
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
  return fallbackCopy(text);
}
function fallbackCopy(text) {
  return new Promise(function (resolve, reject) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-1000px';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); ok ? resolve() : reject(new Error('copy failed'));
  });
}

// ---------- joke data from a card ----------
function jokeFrom(el) {
  var root = el.closest('[data-joke]'); if (!root) return null;
  var t = root.querySelector('.joke-text');
  var text = $$('p', t).map(function (p) { return p.textContent.trim(); }).join('\n') || (t ? t.textContent.trim() : '');
  return { id: root.getAttribute('data-id'), title: root.getAttribute('data-title'), url: root.getAttribute('data-url'), text: text, root: root };
}
function shareUrls(j) {
  var full = j.text + '\n\nRead more:\n' + j.url;
  var short = j.text.length > 200 ? j.text.slice(0, 199) + '…' : j.text;
  return {
    whatsapp: 'https://wa.me/?text=' + enc(full),
    telegram: 'https://t.me/share/url?url=' + enc(j.url) + '&text=' + enc(j.text),
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(j.url),
    x: 'https://x.com/intent/tweet?text=' + enc(short) + '&url=' + enc(j.url),
    reddit: 'https://www.reddit.com/submit?url=' + enc(j.url) + '&title=' + enc(j.title),
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(j.url),
    email: 'mailto:?subject=' + enc(j.title + ' | ' + JM.name) + '&body=' + enc(full),
    sms: 'sms:?&body=' + enc(full)
  };
}
function openWin(url) {
  var w = window.open(url, '_blank', 'noopener,noreferrer,width=620,height=580');
  if (!w) location.href = url;
}

// ---------- dialogs ----------
function openDialog(d) {
  if (!d) return;
  d._opener = document.activeElement;
  if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
}
function closeDialog(d) {
  if (!d) return;
  if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
}
function initDialogs() {
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) closeDialog(d); });
    d.addEventListener('close', function () { if (d._opener && d._opener.focus) d._opener.focus(); });
  });
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-close-dialog]'); if (b) closeDialog(b.closest('dialog')); });
}
function openShareSheet(j) {
  var d = $('#share-dialog'), g = $('#share-grid'); if (!d || !g) return;
  var s = shareUrls(j);
  var items = [
    ['whatsapp', 'WhatsApp', s.whatsapp], ['telegram', 'Telegram', s.telegram], ['facebook', 'Facebook', s.facebook],
    ['x', 'X', s.x], ['globe', 'Reddit', s.reddit], ['globe', 'LinkedIn', s.linkedin], ['mail', 'Email', s.email], ['sms', 'SMS', s.sms]
  ];
  var html = '';
  if (navigator.share) html += '<button type="button" class="btn" data-sheet="native">' + icon('share') + 'More apps</button>';
  html += items.map(function (it) {
    var external = it[2].indexOf('http') === 0 ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a class="btn' + (it[1] === 'WhatsApp' ? ' btn-wa' : '') + '" href="' + esc(it[2]) + '"' + external + '>' + icon(it[0]) + it[1] + '</a>';
  }).join('');
  html += '<button type="button" class="btn" data-sheet="copy-link">' + icon('link') + 'Copy link</button>';
  html += '<button type="button" class="btn" data-sheet="copy">' + icon('copy') + 'Copy joke</button>';
  g.innerHTML = html;
  g.onclick = function (e) {
    var b = e.target.closest('[data-sheet]');
    if (!b) { if (e.target.closest('a')) closeDialog(d); return; }
    var k = b.getAttribute('data-sheet');
    if (k === 'native') nativeShare(j, true);
    if (k === 'copy-link') copyText(j.url).then(function () { toast('✓ Link copied!'); }, function () { toast('Copy failed. Press and hold to copy.'); });
    if (k === 'copy') doCopy(j);
    closeDialog(d);
  };
  openDialog(d);
}
function nativeShare(j, noFallback) {
  if (navigator.share) {
    navigator.share({ title: j.title, text: j.text + '\n\nRead more:', url: j.url }).catch(function (err) {
      if (err && err.name !== 'AbortError' && !noFallback) openShareSheet(j);
    });
  } else if (!noFallback) openShareSheet(j);
}
function doCopy(j) {
  var text = JM.copyLink ? j.text + '\n\n' + j.url : j.text;
  copyText(text).then(function () { toast('✓ Joke copied!'); }, function () { toast('Copy failed. Press and hold the joke to copy it.'); });
}

// ---------- saved jokes ----------
var SAVED_KEY = 'jm:saved';
function savedIds() { var v = store.get(SAVED_KEY, []); return Array.isArray(v) ? v : []; }
function syncSaveButtons(scope) {
  var ids = savedIds();
  $$('[data-action="save"]', scope).forEach(function (b) {
    var j = jokeFrom(b); if (!j) return;
    var on = ids.indexOf(j.id) > -1;
    b.setAttribute('aria-pressed', String(on));
    var use = b.querySelector('use'); if (use) use.setAttribute('href', JM.icons + '#' + (on ? 'bookmark-fill' : 'bookmark'));
    var span = b.querySelector('span'); if (span) span.textContent = on ? 'Saved' : (b.closest('.joke-detail') ? 'Save Joke' : 'Save');
  });
}
function toggleSave(j) {
  var ids = savedIds(), i = ids.indexOf(j.id);
  if (i > -1) ids.splice(i, 1); else ids.unshift(j.id);
  if (!store.set(SAVED_KEY, ids)) { toast('Could not save. Your browser storage may be full or blocked.'); return; }
  toast(i > -1 ? 'Removed from saved jokes' : '✓ Joke saved');
  syncSaveButtons();
  if ($('[data-saved]') && i > -1) renderSaved();
}

// ---------- action delegation ----------
function initActions() {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action]'); if (!b) return;
    var a = b.getAttribute('data-action');
    if (a === 'share-page' || a === 'copy-page-link') {
      var box = b.closest('[data-share-page]'); if (!box) return;
      var url = box.getAttribute('data-url'), title = box.getAttribute('data-title');
      if (a === 'copy-page-link') copyText(url).then(function () { toast('✓ Link copied!'); }, function () { toast('Copy failed.'); });
      else if (navigator.share) navigator.share({ title: title, url: url }).catch(function () {});
      else copyText(url).then(function () { toast('✓ Link copied! Paste it anywhere to share.'); });
      return;
    }
    var j = jokeFrom(b); if (!j) return;
    if (a === 'whatsapp') return; // real link
    e.preventDefault();
    if (a === 'copy') doCopy(j);
    else if (a === 'share') nativeShare(j);
    else if (a === 'more') openShareSheet(j);
    else if (a === 'save') toggleSave(j);
    else if (a === 'telegram' || a === 'facebook' || a === 'x') openWin(shareUrls(j)[a]);
  });
}

// ---------- index loading ----------
var indexPromise = null;
function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(JM.index, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status); return r.json();
    }).then(function (data) {
      data.jokes.forEach(function (j) { j.s = (j.t + ' ' + j.x + ' ' + j.g.join(' ') + ' ' + (data.cats[j.c] ? data.cats[j.c].n : '') + ' ' + data.langs[j.l].n).toLowerCase(); });
      return data;
    });
    indexPromise.catch(function () { indexPromise = null; });
  }
  return indexPromise;
}
function loadingHtml(n) { var s = ''; for (var i = 0; i < (n || 3); i++) s += '<div class="skeleton"></div>'; return '<div class="joke-grid" aria-busy="true" aria-label="Loading jokes">' + s + '</div>'; }
function errorHtml() {
  return '<div class="state" role="alert"><div class="state-emoji" aria-hidden="true">📡</div><h2>Jokes didn\'t load</h2><p class="muted">' +
    (navigator.onLine ? 'The joke list could not be downloaded. Check your connection and try again.' : 'You\'re offline. Reconnect to load more jokes.') +
    '</p><div class="btn-row"><button type="button" class="btn btn-primary" data-retry>Try again</button></div></div>';
}

// ---------- card rendering (mirrors build.js) ----------
function highlight(text, terms) {
  if (!terms || !terms.length) return esc(text);
  var re = new RegExp('(' + terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
  return String(text).split(re).map(function (part, i) { return i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part); }).join('');
}
function renderCard(j, idx, terms, h) {
  var L = idx.langs[j.l], C = idx.cats[j.c] || { n: j.c };
  var url = abs(j.u), tag = h || 'h3';
  var s = shareUrls({ text: j.x, url: url, title: j.t });
  var tags = j.g.length ? '<div class="joke-tags">' + j.g.map(function (t) {
    return idx.tags.indexOf(t) > -1 ? '<a href="' + BASE + '/tag/' + t + '/">#' + esc(t) + '</a>' : '<span>#' + esc(t) + '</span>';
  }).join('') + '</div>' : '';
  return '<article class="joke-card" data-joke data-id="' + j.i + '" data-url="' + esc(url) + '" data-title="' + esc(j.t) + '">' +
    '<' + tag + ' class="joke-title"><a href="' + BASE + j.u + '">' + highlight(j.t, terms) + '</a></' + tag + '>' +
    '<div class="joke-text" lang="' + L.h + '" dir="' + L.d + '">' + j.x.split('\n').filter(Boolean).map(function (l) { return '<p>' + highlight(l, terms) + '</p>'; }).join('') + '</div>' +
    '<div class="joke-meta"><a class="chip" href="' + BASE + '/jokes/' + L.s + '/">' + esc(L.n) + '</a><a class="chip" href="' + BASE + '/category/' + j.c + '/">' + esc(C.n) + '</a></div>' + tags +
    '<div class="joke-actions">' +
    '<button type="button" class="btn btn-sm" data-action="copy">' + icon('copy') + '<span>Copy</span></button>' +
    '<a class="btn btn-sm btn-wa" href="' + esc(s.whatsapp) + '" target="_blank" rel="noopener noreferrer" data-action="whatsapp">' + icon('whatsapp') + '<span>WhatsApp</span></a>' +
    '<button type="button" class="btn btn-sm" data-action="save" aria-pressed="false">' + icon('bookmark') + '<span>Save</span></button>' +
    '<span class="actions-more">' +
    '<button type="button" class="icon-btn" data-action="share" aria-label="Share">' + icon('share') + '</button>' +
    '<button type="button" class="icon-btn" data-action="telegram" aria-label="Share on Telegram">' + icon('telegram') + '</button>' +
    '<button type="button" class="icon-btn" data-action="facebook" aria-label="Share on Facebook">' + icon('facebook') + '</button>' +
    '<button type="button" class="icon-btn" data-action="x" aria-label="Share on X">' + icon('x') + '</button>' +
    '<button type="button" class="icon-btn" data-action="more" aria-label="More share options">' + icon('more') + '</button>' +
    '</span></div></article>';
}

// ---------- search ----------
function terms(q) { return String(q || '').toLowerCase().trim().split(/\s+/).filter(function (t) { return t.length > 0; }).slice(0, 8); }
function score(j, ts) {
  var sc = 0, t = j.t.toLowerCase(), tagStr = j.g.join(' ');
  for (var i = 0; i < ts.length; i++) {
    var w = ts[i];
    if (j.s.indexOf(w) === -1) return -1;
    if (t.indexOf(w) > -1) sc += 6;
    if (tagStr.indexOf(w) > -1) sc += 4;
    if (j.x.toLowerCase().indexOf(w) > -1) sc += 2;
  }
  return sc + j.p / 100;
}
var SORTS = {
  popular: function (a, b) { return b.p - a.p || (a.i < b.i ? -1 : 1); },
  trending: function (a, b) { return b.r - a.r || b.p - a.p; },
  newest: function (a, b) { return (b.d > a.d ? 1 : b.d < a.d ? -1 : 0) || b.p - a.p; },
  shortest: function (a, b) { return a.n - b.n; },
  longest: function (a, b) { return b.n - a.n; }
};
function query(idx, o) {
  var ts = terms(o.q);
  var shortMax = JM.shortMax || 160, medMax = JM.mediumMax || 360;
  var list = idx.jokes.filter(function (j) {
    if (o.lang && j.l !== o.lang) return false;
    if (o.cat && j.c !== o.cat) return false;
    if (o.len === 'short' && j.n > shortMax) return false;
    if (o.len === 'medium' && (j.n <= shortMax || j.n > medMax)) return false;
    if (o.len === 'long' && j.n <= medMax) return false;
    if (ts.length) { j._sc = score(j, ts); if (j._sc < 0) return false; }
    return true;
  });
  if (ts.length && (!o.sort || o.sort === 'relevance')) list.sort(function (a, b) { return b._sc - a._sc; });
  else list.sort(SORTS[o.sort] || SORTS.popular);
  return { list: list, terms: ts };
}

// Header search dialog
function initSearchDialog() {
  var d = $('#search-dialog'), input = $('#dlg-q'), body = $('#dlg-body'); if (!d || !input) return;
  var timer;
  function suggestions(idx) {
    var cats = Object.keys(idx.cats).slice(0, 10).map(function (k) { return '<li><a class="chip" href="' + BASE + '/category/' + k + '/">' + idx.cats[k].e + ' ' + esc(idx.cats[k].n) + '</a></li>'; }).join('');
    var langs = Object.keys(idx.langs).map(function (k) { return '<li><a class="chip" href="' + BASE + '/jokes/' + idx.langs[k].s + '/">' + esc(idx.langs[k].n) + '</a></li>'; }).join('');
    return '<p class="suggest-label">Popular categories</p><ul class="chip-list">' + cats + '</ul><p class="suggest-label" style="margin-top:16px">Languages</p><ul class="chip-list">' + langs + '</ul>';
  }
  function render() {
    var q = input.value.trim();
    loadIndex().then(function (idx) {
      if (!q) { body.innerHTML = suggestions(idx); return; }
      var r = query(idx, { q: q, sort: 'relevance' });
      var ql = q.toLowerCase();
      var catHits = Object.keys(idx.cats).filter(function (k) { return idx.cats[k].n.toLowerCase().indexOf(ql) > -1; }).slice(0, 4);
      var tagHits = idx.tags.filter(function (t) { return t.indexOf(ql) === 0; }).slice(0, 6);
      var html = '';
      if (catHits.length || tagHits.length) {
        html += '<ul class="chip-list">' + catHits.map(function (k) { return '<li><a class="chip" href="' + BASE + '/category/' + k + '/">' + idx.cats[k].e + ' ' + esc(idx.cats[k].n) + '</a></li>'; }).join('') +
          tagHits.map(function (t) { return '<li><a class="chip" href="' + BASE + '/tag/' + t + '/">#' + esc(t) + '</a></li>'; }).join('') + '</ul>';
      }
      if (!r.list.length) html += '<p class="muted" style="margin-top:14px">No jokes match “' + esc(q) + '”. Try a shorter word, or browse a category.</p>';
      else html += '<ul class="mini-results">' + r.list.slice(0, 8).map(function (j) {
        return '<li><a href="' + BASE + j.u + '"><strong>' + highlight(j.t, r.terms) + '</strong><span lang="' + idx.langs[j.l].h + '">' + highlight(j.x.replace(/\n/g, ' '), r.terms) + '</span></a></li>';
      }).join('') + '</ul><p style="margin:14px 0 0"><a class="btn btn-primary btn-sm" href="' + BASE + '/search/?q=' + enc(q) + '">See all ' + r.list.length + ' results</a></p>';
      body.innerHTML = html;
    }, function () { body.innerHTML = errorHtml(); });
  }
  function open() { openDialog(d); input.focus(); input.select(); render(); }
  document.addEventListener('click', function (e) { if (e.target.closest('[data-open-search]')) { e.preventDefault(); open(); } });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && tag !== 'input' && tag !== 'textarea' && tag !== 'select' && !e.target.isContentEditable && !d.open) { e.preventDefault(); open(); }
  });
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(render, 140); });
  body.addEventListener('click', function (e) { if (e.target.closest('[data-retry]')) render(); });
}

// Filters (listing pages and /search/)
function initFilters() {
  $$('form[data-filters]').forEach(function (form) {
    var results = form.nextElementSibling && form.nextElementSibling.hasAttribute('data-results') ? form.nextElementSibling : null;
    var staticList = form.parentNode.querySelector('[data-static-list]');
    var empty = form.parentNode.querySelector('[data-search-empty]');
    var lockLang = form.getAttribute('data-lock-lang') || '', lockCat = form.getAttribute('data-lock-cat') || '';
    var defSort = form.getAttribute('data-default-sort') || 'popular';
    var isSearch = document.body.getAttribute('data-page') === 'search' || location.pathname.replace(BASE, '').indexOf('/search/') === 0;
    var shown = 0, current = null;
    var F = function (n) { return form.elements[n]; };
    function state() {
      return {
        q: F('q') ? F('q').value.trim() : '',
        lang: lockLang || (F('lang') ? F('lang').value : ''),
        cat: lockCat || (F('cat') ? F('cat').value : ''),
        len: F('len') ? F('len').value : '',
        sort: F('sort') ? F('sort').value : defSort
      };
    }
    function active(s) { return !!(s.q || (!lockLang && s.lang) || (!lockCat && s.cat) || s.len || s.sort !== defSort); }
    function syncUrl(s) {
      var p = new URLSearchParams();
      if (s.q) p.set('q', s.q);
      if (!lockLang && s.lang) p.set('lang', s.lang);
      if (!lockCat && s.cat) p.set('cat', s.cat);
      if (s.len) p.set('len', s.len);
      if (s.sort !== defSort) p.set('sort', s.sort);
      var qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
    function more(idx) {
      var chunk = current.list.slice(shown, shown + (JM.perPage || 24));
      var grid = results.querySelector('.joke-grid');
      grid.insertAdjacentHTML('beforeend', chunk.map(function (j) { return renderCard(j, idx, current.terms); }).join(''));
      shown += chunk.length;
      var btn = results.querySelector('[data-more]');
      if (btn) btn.parentNode.hidden = shown >= current.list.length;
      syncSaveButtons(results);
    }
    function run(opts) {
      var s = state();
      if (!opts || !opts.initial) syncUrl(s);
      if (!active(s)) {
        results.hidden = true; results.innerHTML = '';
        if (staticList) staticList.hidden = false;
        if (empty) empty.hidden = false;
        return;
      }
      results.hidden = false;
      if (staticList) staticList.hidden = true;
      if (empty) empty.hidden = true;
      results.innerHTML = loadingHtml(3);
      loadIndex().then(function (idx) {
        current = query(idx, { q: s.q, lang: s.lang, cat: s.cat, len: s.len, sort: s.q && s.sort === defSort && isSearch ? 'relevance' : s.sort });
        shown = 0;
        if (!current.list.length) {
          results.innerHTML = '<div class="state"><div class="state-emoji" aria-hidden="true">🤷</div><h2>No jokes found</h2><p class="muted">Nothing matches these filters. Try fewer words, another language or a different category.</p><div class="btn-row"><button type="button" class="btn btn-primary" data-clear>Clear filters</button><a class="btn" href="' + BASE + '/random-joke/">Random joke</a></div></div>';
          return;
        }
        results.innerHTML = '<p class="filter-status"><span>' + current.list.length + ' joke' + (current.list.length === 1 ? '' : 's') + ' found' + (s.q ? ' for “' + esc(s.q) + '”' : '') + '</span><button type="button" class="btn btn-sm" data-clear>Clear filters</button></p><div class="joke-grid"></div><div class="results-more"><button type="button" class="btn btn-primary" data-more>Load more jokes</button></div>';
        more(idx);
      }, function () { results.innerHTML = errorHtml(); });
    }
    results && results.addEventListener('click', function (e) {
      if (e.target.closest('[data-more]')) loadIndex().then(more);
      if (e.target.closest('[data-clear]')) { form.reset(); run(); }
      if (e.target.closest('[data-retry]')) run();
    });
    if (!results) return;
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    form.addEventListener('reset', function () { setTimeout(run, 0); });
    form.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT') run(); });
    var t; if (F('q')) F('q').addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 250); });
    // apply URL params
    var p = new URLSearchParams(location.search), any = false;
    ['q', 'lang', 'cat', 'len', 'sort'].forEach(function (k) {
      var v = p.get(k); if (v && F(k)) { F(k).value = v; if (F(k).value === v) any = true; }
    });
    if (any) run({ initial: true });
  });
}

// ---------- Joke of the Day ----------
function todayIso() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function dayNumber(iso) { var a = iso.split('-').map(Number); return Math.floor(Date.UTC(a[0], a[1] - 1, a[2]) / 864e5); }
function initJotd() {
  var boxes = $$('[data-jotd]'); if (!boxes.length) return;
  var iso = todayIso();
  $$('[data-jotd-date]').forEach(function (el) {
    try { el.textContent = 'Today’s joke for ' + new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '. Come back tomorrow for a new one.'; } catch (e) {}
  });
  loadIndex().then(function (idx) {
    var j = idx.jokes[dayNumber(iso) % idx.jokes.length];
    boxes.forEach(function (b) {
      if (b.querySelector('[data-id="' + j.i + '"]')) return;
      b.innerHTML = renderCard(j, idx, null, b.getAttribute('data-jotd-heading') || 'h3');
    });
    syncSaveButtons();
  }, function () { /* keep build-time joke */ });
}

// ---------- Random joke ----------
function initRandom() {
  var btn = $('[data-random-btn]'), out = $('[data-random-out]'), sel = $('[data-random-lang]'); if (!btn || !out) return;
  var last = null;
  function pick() {
    btn.disabled = true;
    loadIndex().then(function (idx) {
      var pool = idx.jokes.filter(function (j) { return !sel || !sel.value || j.l === sel.value; });
      if (!pool.length) { out.innerHTML = '<div class="state"><h2>No jokes in this language yet</h2><p class="muted">Pick another language.</p></div>'; return; }
      var j, tries = 0;
      do { j = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && last && j.i === last && ++tries < 10);
      last = j.i;
      out.innerHTML = renderCard(j, idx, null, 'h2');
      syncSaveButtons(out);
    }, function () { out.innerHTML = errorHtml(); }).then(function () { btn.disabled = false; }, function () { btn.disabled = false; });
  }
  btn.addEventListener('click', pick);
  if (sel) sel.addEventListener('change', pick);
  out.addEventListener('click', function (e) { if (e.target.closest('[data-retry]')) pick(); });
}

// ---------- Saved page ----------
function renderSaved() {
  var box = $('[data-saved]'); if (!box) return;
  var ids = savedIds();
  if (!ids.length) {
    box.innerHTML = '<div class="state"><div class="state-emoji" aria-hidden="true">🔖</div><h2>You haven\'t saved any jokes yet.</h2><p class="muted">Tap Save on any joke to keep it here on this device.</p><div class="btn-row"><a class="btn btn-primary" href="' + BASE + '/jokes/">Explore Jokes</a></div></div>';
    return;
  }
  box.innerHTML = loadingHtml(Math.min(ids.length, 3));
  loadIndex().then(function (idx) {
    var map = {}; idx.jokes.forEach(function (j) { map[j.i] = j; });
    var found = ids.map(function (id) { return map[id]; }).filter(Boolean);
    var gone = ids.length - found.length;
    box.innerHTML = '<p class="filter-status"><span>' + found.length + ' saved joke' + (found.length === 1 ? '' : 's') + '</span></p>' +
      (gone ? '<p class="notice">' + gone + ' saved joke' + (gone === 1 ? ' is' : 's are') + ' no longer available and ' + (gone === 1 ? 'was' : 'were') + ' hidden.</p>' : '') +
      '<div class="joke-grid">' + found.map(function (j) { return renderCard(j, idx); }).join('') + '</div>';
    syncSaveButtons(box);
  }, function () { box.innerHTML = errorHtml(); box.querySelector('[data-retry]').onclick = renderSaved; });
}

// ---------- Contact (mailto only) ----------
function initContact() {
  var form = $('form[data-contact-form]'); if (!form) return;
  var err = form.querySelector('[data-form-error]');
  var mailLink = $('a[href^="mailto:"]', form.parentNode);
  var to = mailLink ? mailLink.getAttribute('href').replace('mailto:', '') : '';
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, problems = [];
    if (!f.name.value.trim()) problems.push('your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) problems.push('a valid email address');
    if (f.message.value.trim().length < 5) problems.push('a message');
    if (problems.length) { err.textContent = 'Please add ' + problems.join(', ') + '.'; err.hidden = false; return; }
    err.hidden = true;
    var body = f.message.value.trim() + '\n\n— ' + f.name.value.trim() + ' (' + f.email.value.trim() + ')';
    location.href = 'mailto:' + to + '?subject=' + enc('[' + JM.name + '] ' + f.subject.value) + '&body=' + enc(body);
    toast('Opening your email app…');
  });
}

// ---------- Ads (only when enabled in data/site.json) ----------
function initAds() {
  if (!JM.ads || !JM.ads.enabled || !JM.ads.client) return;
  var slots = $$('.ad-slot').filter(function (s) { return s.getAttribute('data-ad-slot'); });
  if (!slots.length) return;
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var sc = document.createElement('script');
    sc.async = true; sc.crossOrigin = 'anonymous';
    sc.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + enc(JM.ads.client);
    document.head.appendChild(sc);
  }
  function fill(slot) {
    if (slot._filled) return; slot._filled = true; load();
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle'; ins.style.display = 'block';
    ins.setAttribute('data-ad-client', JM.ads.client);
    ins.setAttribute('data-ad-slot', slot.getAttribute('data-ad-slot'));
    ins.setAttribute('data-ad-format', 'auto'); ins.setAttribute('data-full-width-responsive', 'true');
    slot.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } }); }, { rootMargin: '300px' });
    slots.forEach(function (s) { io.observe(s); });
  } else slots.forEach(fill);
}

// ---------- PWA & connectivity ----------
function initPwa() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register(BASE + '/sw.js', { scope: BASE + '/' }).catch(function () {}); });
  }
  var banner;
  function show(off) {
    if (off) {
      if (!banner) { banner = document.createElement('div'); banner.className = 'offline-banner'; banner.setAttribute('role', 'status'); banner.textContent = 'You\'re offline. Saved and visited pages still work.'; document.body.appendChild(banner); }
    } else if (banner) { banner.remove(); banner = null; toast('Back online'); }
  }
  window.addEventListener('offline', function () { show(true); });
  window.addEventListener('online', function () { show(false); });
  if (!navigator.onLine) show(true);
}

function init() {
  initTheme(); initNav(); initDialogs(); initActions(); initSearchDialog(); initFilters();
  initJotd(); initRandom(); renderSaved(); initContact(); initAds(); initPwa();
  syncSaveButtons();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
