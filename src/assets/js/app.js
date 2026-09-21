/*!
 * JokeMasti client runtime — vanilla JS, no dependencies.
 * Handles: theme, mobile drawer, search, copy/share/download/bookmark/like,
 * sort reordering, install prompt, service worker, offline banner.
 */
(function () {
  'use strict';

  var LS = {
    theme: 'jm_theme',
    bookmarks: 'jm_bookmarks_v1',
    likes: 'jm_likes_v1',
    recent: 'jm_recent_v1',
  };

  // Every internal link/asset path baked into the HTML is site-root-relative
  // ("/jokes/…"), which only works when the site is served from the domain
  // root. When it's hosted under a repo subpath (e.g. GitHub Pages'
  // /JokeMasti/), build.js rewrites those to include the prefix — except
  // this script itself, which stays a plain static file (no templating), so
  // any path *this file* builds at runtime needs the same prefix applied by
  // hand. We derive it from our own <script src> rather than hardcoding it,
  // so the same app.js works unmodified at any deploy path.
  var BASE = (function () {
    var el =
      document.currentScript || document.querySelector('script[src$="/assets/js/app.js"]');
    var src = el ? el.getAttribute('src') || '' : '';
    var idx = src.indexOf('/assets/js/app.js');
    return idx > -1 ? src.slice(0, idx) : '';
  })();

  // ---------------------------------------------------------------- utils
  function safeGet(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }
  function safeSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }
  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }
  function on(el, ev, fn, opts) {
    if (el) el.addEventListener(ev, fn, opts);
  }
  function abs(url) {
    try {
      var u = url && url.charAt(0) === '/' ? BASE + url : url;
      return new URL(u, location.origin).href;
    } catch (e) {
      return url;
    }
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments,
        ctx = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  }

  // ---------------------------------------------------------------- toast
  function toast(msg, icon) {
    var host = qs('#toast-host');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = (icon || '✓') + ' ' + msg;
    host.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity .25s ease';
      setTimeout(function () {
        el.remove();
      }, 260);
    }, 2200);
  }

  // ---------------------------------------------------------------- theme
  function applyTheme(mode) {
    var root = document.documentElement;
    if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
    else root.removeAttribute('data-theme');
  }
  function currentTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(LS.theme);
    } catch (e) {}
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  }
  function initTheme() {
    applyTheme(currentTheme());
    on(qs('#theme-btn'), 'click', function () {
      var order = ['system', 'light', 'dark'];
      var next = order[(order.indexOf(currentTheme()) + 1) % order.length];
      try {
        if (next === 'system') localStorage.removeItem(LS.theme);
        else localStorage.setItem(LS.theme, next);
      } catch (e) {}
      applyTheme(next);
      var labels = { system: 'System theme', light: 'Light mode', dark: 'Dark mode' };
      toast(labels[next], next === 'dark' ? '🌙' : next === 'light' ? '☀️' : '⚙️');
    });
  }

  // ---------------------------------------------------------------- drawer
  function initDrawer() {
    var drawer = qs('#mobile-drawer');
    if (!drawer) return;
    var openBtn = qs('#drawer-open');
    var closers = [qs('#drawer-close'), qs('#drawer-close-x')];
    function open() {
      drawer.setAttribute('data-open', 'true');
      openBtn && openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.setAttribute('data-open', 'false');
      openBtn && openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    on(openBtn, 'click', open);
    closers.forEach(function (b) {
      on(b, 'click', close);
    });
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') close();
    });
  }

  // ---------------------------------------------------------------- offline
  function initOffline() {
    function sync() {
      document.body.classList.toggle('is-offline', !navigator.onLine);
    }
    sync();
    on(window, 'online', sync);
    on(window, 'offline', sync);
  }

  // ---------------------------------------------------------------- bookmarks
  function getBookmarks() {
    return safeGet(LS.bookmarks, { joke: {} });
  }
  function isBookmarked(type, id) {
    var b = getBookmarks();
    return !!(b[type] && b[type][id]);
  }
  function toggleBookmark(type, id, meta) {
    var b = getBookmarks();
    if (!b[type]) b[type] = {};
    var was = !!b[type][id];
    if (was) delete b[type][id];
    else b[type][id] = Object.assign({ savedAt: Date.now() }, meta);
    safeSet(LS.bookmarks, b);
    return !was;
  }

  // ---------------------------------------------------------------- likes
  function getLikes() {
    return safeGet(LS.likes, { joke: {} });
  }
  function toggleLike(type, id) {
    var l = getLikes();
    if (!l[type]) l[type] = {};
    var was = !!l[type][id];
    if (was) delete l[type][id];
    else l[type][id] = true;
    safeSet(LS.likes, l);
    return !was;
  }

  function syncCardState(root) {
    var likes = getLikes();
    var bookmarks = getBookmarks();
    qsa('[data-action="like"]', root).forEach(function (btn) {
      var type = btn.getAttribute('data-type'),
        id = btn.getAttribute('data-id');
      var liked = !!(likes[type] && likes[type][id]);
      btn.setAttribute('aria-pressed', String(liked));
      var countEl = qs('.like-count', btn);
      if (countEl) {
        var base = parseInt(countEl.getAttribute('data-base') || countEl.textContent, 10) || 0;
        if (!countEl.getAttribute('data-base')) countEl.setAttribute('data-base', String(base));
        countEl.textContent = String(base + (liked ? 1 : 0));
      }
    });
    qsa('[data-action="bookmark"]', root).forEach(function (btn) {
      var type = btn.getAttribute('data-type'),
        id = btn.getAttribute('data-id');
      var saved = !!(bookmarks[type] && bookmarks[type][id]);
      btn.setAttribute('aria-pressed', String(saved));
    });
  }

  // ---------------------------------------------------------------- share helpers
  function waLink(text) {
    return 'https://wa.me/?text=' + encodeURIComponent(text);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  // ---------------------------------------------------------------- actions
  function initActions() {
    on(document, 'click', function (e) {
      var t = e.target.closest && e.target.closest('[data-action]');
      if (!t) return;
      var action = t.getAttribute('data-action');

      if (action === 'copy-joke') {
        var card = t.closest('[data-joke-card]');
        if (!card) return;
        copyText(card.getAttribute('data-text') || '').then(function () {
          toast('Joke copied!', '✓');
        });
      } else if (action === 'copy-link') {
        var url = abs(t.getAttribute('data-url') || location.href);
        copyText(url).then(function () {
          toast('Link copied!', '🔗');
        });
      } else if (action === 'share-wa') {
        var jcard = t.closest('[data-joke-card]');
        var text, link;
        if (jcard) {
          text = jcard.getAttribute('data-text') || jcard.getAttribute('data-title') || '';
          link = abs(jcard.getAttribute('data-url') || location.href);
        } else {
          text = document.title;
          link = abs(location.href);
        }
        window.open(waLink(text + ' ' + link), '_blank', 'noopener');
      } else if (action === 'share-more') {
        var jc = t.closest('[data-joke-card]');
        if (!jc) return;
        var shareUrl = abs(jc.getAttribute('data-url') || location.href);
        var shareText = jc.getAttribute('data-text') || '';
        nativeOrCopy(shareUrl, shareText, jc.getAttribute('data-title') || document.title);
      } else if (action === 'share-native') {
        nativeOrCopy(t.getAttribute('data-url'), t.getAttribute('data-text'), document.title);
      } else if (action === 'like') {
        var type = t.getAttribute('data-type'),
          id = t.getAttribute('data-id');
        var nowLiked = toggleLike(type, id);
        syncCardState(document);
        toast(nowLiked ? 'Liked!' : 'Like hataya', nowLiked ? '❤️' : '💔');
      } else if (action === 'bookmark') {
        var btype = t.getAttribute('data-type'),
          bid = t.getAttribute('data-id');
        var card = t.closest('[data-joke-card]');
        var meta = card
          ? {
              title: card.getAttribute('data-title'),
              url: card.getAttribute('data-url'),
              text: card.getAttribute('data-text') || '',
            }
          : {};
        var nowSaved = toggleBookmark(btype, bid, meta);
        syncCardState(document);
        toast(nowSaved ? 'Saved!' : 'Removed from saved', nowSaved ? '🔖' : '🗑️');
      } else if (action === 'clear-search') {
        var input = t.closest('.searchbox__field').querySelector('input[type="search"]');
        input.value = '';
        input.focus();
        input.dispatchEvent(new Event('input'));
      }
    });

    syncCardState(document);
  }

  function nativeOrCopy(url, text, title) {
    url = abs(url || location.href);
    if (navigator.share) {
      navigator.share({ title: title, text: text, url: url }).catch(function () {});
    } else {
      copyText(url).then(function () {
        toast('Link copied!', '🔗');
      });
    }
  }

  // ---------------------------------------------------------------- sort
  function initSort() {
    qsa('[data-sort-select]').forEach(function (sel) {
      on(sel, 'change', function () {
        var container = document.querySelector('[data-sortable]');
        if (!container) return;
        var items = qsa(':scope > *', container);
        var mode = sel.value;
        items.sort(function (a, b) {
          if (mode === 'latest') return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
          return (parseFloat(b.getAttribute('data-score')) || 0) - (parseFloat(a.getAttribute('data-score')) || 0);
        });
        items.forEach(function (it) {
          container.appendChild(it);
        });
      });
    });
  }

  // ---------------------------------------------------------------- search
  var searchIndex = null;
  var searchIndexPromise = null;
  function loadIndex() {
    if (searchIndexPromise) return searchIndexPromise;
    searchIndexPromise = fetch(BASE + '/search-index.json')
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        searchIndex = data;
        return data;
      })
      .catch(function () {
        searchIndex = [];
        return [];
      });
    return searchIndexPromise;
  }

  function matchScore(item, qLower, terms) {
    var hay = item.s; // pre-lowered searchable string
    if (hay.indexOf(qLower) !== -1) return 100;
    var hits = 0;
    for (var i = 0; i < terms.length; i++) if (terms[i] && hay.indexOf(terms[i]) !== -1) hits++;
    return hits ? (hits / terms.length) * 60 : 0;
  }

  function runSearch(query, limit) {
    if (!searchIndex) return [];
    var q = query.trim().toLowerCase();
    if (!q) return [];
    var terms = q.split(/\s+/);
    var results = [];
    for (var i = 0; i < searchIndex.length; i++) {
      var item = searchIndex[i];
      var sc = matchScore(item, q, terms);
      if (sc > 0) results.push({ item: item, sc: sc });
    }
    results.sort(function (a, b) {
      return b.sc - a.sc || (b.item.p || 0) - (a.item.p || 0);
    });
    return results.slice(0, limit || 40).map(function (r) {
      return r.item;
    });
  }

  function recentSearches() {
    return safeGet(LS.recent, []);
  }
  function pushRecent(q) {
    if (!q || q.length < 2) return;
    var list = recentSearches().filter(function (x) {
      return x.toLowerCase() !== q.toLowerCase();
    });
    list.unshift(q);
    safeSet(LS.recent, list.slice(0, 8));
  }

  function resultCardHtml(item) {
    return (
      '<article class="card joke-card" data-joke-card data-id="' +
      item.id +
      '" data-text="' +
      escAttr(item.d) +
      '" data-title="' +
      escAttr(item.n) +
      '" data-url="' +
      item.u +
      '">' +
      '<div class="joke-card__top"><span class="badge badge--brand">' +
      escAttr(item.c) +
      '</span></div>' +
      '<h3 class="joke-card__title"><a href="' +
      BASE +
      item.u +
      '">' +
      escAttr(item.n) +
      '</a></h3>' +
      '<p class="joke-text">' +
      escAttr(item.d) +
      '</p>' +
      '<div class="joke-card__foot"><div class="actions">' +
      '<button class="act act--copy" type="button" data-action="copy-joke">Copy</button>' +
      '<button class="act act--wa" type="button" data-action="share-wa">WhatsApp</button>' +
      '</div></div></article>'
    );
  }
  function escAttr(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function initSearchPage() {
    var resultsEl = qs('#search-results');
    if (!resultsEl) return;
    var statusEl = qs('#search-status');
    var input = qs('#hero-search-input');
    var recentWrap = qs('#recent-searches');
    var recentList = qs('#recent-searches-list');

    function renderRecent() {
      var list = recentSearches();
      if (!recentWrap || !list.length) return;
      recentWrap.hidden = false;
      recentList.innerHTML = list
        .map(function (q) {
          return '<a class="chip" href="' + BASE + '/search/?q=' + encodeURIComponent(q) + '">' + escAttr(q) + '</a>';
        })
        .join('');
    }

    function render(q) {
      if (!q) {
        resultsEl.innerHTML = '';
        statusEl.textContent = '';
        renderRecent();
        return;
      }
      var results = runSearch(q, 60);
      statusEl.textContent = 'Search Results for "' + q + '" — ' + results.length + ' mile';
      if (!results.length) {
        resultsEl.innerHTML =
          '<div class="empty"><div class="empty__emoji">🤷</div><h2>Kuch nahi mila</h2><p>"' +
          escAttr(q) +
          '" ke liye koi joke nahi mila. Kuch aur try kijiye.</p></div>';
        return;
      }
      resultsEl.innerHTML = '<div class="grid-jokes mt-4">' + results.map(resultCardHtml).join('') + '</div>';
      syncCardState(resultsEl);
    }

    function fromUrl() {
      var params = new URLSearchParams(location.search);
      return params.get('q') || '';
    }

    loadIndex().then(function () {
      var q = fromUrl();
      if (input) input.value = q;
      render(q);
      if (q) pushRecent(q);
    });

    var form = qs('#hero-search-form');
    on(form, 'submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      var url = new URL(location.href);
      url.searchParams.set('q', q);
      history.pushState({}, '', url);
      render(q);
      if (q) pushRecent(q);
    });
    on(input, 'input', debounce(function () {
      render(input.value.trim());
    }, 220));
  }

  // ---------------------------------------------------------------- header suggest
  function initHeaderSuggest() {
    qsa('.searchbox').forEach(function (box) {
      var input = box.querySelector('input[type="search"]');
      var panel = box.querySelector('.suggest');
      var form = box.querySelector('form');
      if (!input || !panel) return;
      var isSearchPage = !!qs('#search-results');
      if (isSearchPage) return; // search page renders its own full results

      function close() {
        panel.hidden = true;
        panel.innerHTML = '';
      }
      function show(q) {
        loadIndex().then(function () {
          var results = runSearch(q, 7);
          if (!results.length) {
            close();
            return;
          }
          panel.hidden = false;
          panel.innerHTML =
            '<p class="suggest__label">Suggestions</p>' +
            results
              .map(function (r) {
                return (
                  '<a class="suggest__item" href="' +
                  BASE +
                  r.u +
                  '"><span>' +
                  escAttr(r.n) +
                  '</span><span class="suggest__kind">Joke</span></a>'
                );
              })
              .join('') +
            '<a class="suggest__item" href="' +
            BASE +
            '/search/?q=' +
            encodeURIComponent(q) +
            '"><span>Search Results for "' +
            escAttr(q) +
            '"</span></a>';
        });
      }
      on(input, 'input', debounce(function () {
        var v = input.value.trim();
        box.querySelector('.searchbox__field').classList.toggle('has-value', !!v);
        if (v.length >= 2) show(v);
        else close();
      }, 180));
      on(input, 'blur', function () {
        setTimeout(close, 150);
      });
      on(form, 'submit', function () {
        if (input.value.trim()) pushRecent(input.value.trim());
      });
      on(document, 'click', function (e) {
        if (!box.contains(e.target)) close();
      });
    });
  }

  // ---------------------------------------------------------------- saved page
  function initSavedPage() {
    var jokesEl = qs('#saved-jokes');
    if (!jokesEl) return;
    var emptyEl = qs('#saved-empty');

    function render() {
      var b = getBookmarks();
      var jokeIds = Object.keys(b.joke || {});
      jokesEl.innerHTML = jokeIds
        .map(function (id) {
          var j = b.joke[id];
          return (
            '<article class="card joke-card" data-joke-card data-id="' +
            id +
            '" data-text="' +
            escAttr(j.text) +
            '" data-title="' +
            escAttr(j.title) +
            '" data-url="' +
            j.url +
            '"><h3 class="joke-card__title"><a href="' +
            BASE +
            j.url +
            '">' +
            escAttr(j.title) +
            '</a></h3><p class="joke-text">' +
            escAttr(j.text) +
            '</p><div class="joke-card__foot"><div class="actions">' +
            '<button class="act act--copy" type="button" data-action="copy-joke">Copy</button>' +
            '<button class="act act--wa" type="button" data-action="share-wa">WhatsApp</button>' +
            '<button class="act act--save" type="button" data-action="bookmark" data-type="joke" data-id="' +
            id +
            '" aria-pressed="true">Remove</button>' +
            '</div></div></article>'
          );
        })
        .join('');

      var hasAny = jokeIds.length;
      if (emptyEl) {
        emptyEl.hidden = !!hasAny;
        if (!hasAny) {
          emptyEl.innerHTML =
            '<div class="empty"><div class="empty__emoji">🔖</div><h2>Abhi kuch save nahi kiya</h2>' +
            '<p>Jokes par bookmark icon tap karke unhe yahan save kijiye.</p>' +
            '<div class="mt-6"><a class="btn btn--primary" href="' + BASE + '/jokes/">Jokes Dekhiye</a></div></div>';
        }
      }
      syncCardState(document);
    }

    render();
    on(document, 'click', function (e) {
      var t = e.target.closest && e.target.closest('[data-action="bookmark"]');
      if (t) setTimeout(render, 0);
    });
  }

  // ---------------------------------------------------------------- PWA install
  function initInstall() {
    var bar = qs('#install-bar');
    if (!bar) return;
    var deferred = null;
    var DISMISS_KEY = 'jm_install_dismissed_until';

    function dismissedRecently() {
      var until = 0;
      try {
        until = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      } catch (e) {}
      return Date.now() < until;
    }

    on(window, 'beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      if (!dismissedRecently()) bar.setAttribute('data-show', 'true');
    });
    on(qs('#install-btn'), 'click', function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.finally(function () {
        bar.setAttribute('data-show', 'false');
        deferred = null;
      });
    });
    on(qs('#install-dismiss'), 'click', function () {
      bar.setAttribute('data-show', 'false');
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now() + 14 * 24 * 60 * 60 * 1000));
      } catch (e) {}
    });
    on(window, 'appinstalled', function () {
      bar.setAttribute('data-show', 'false');
      toast('JokeMasti install ho gaya!', '🎉');
    });
  }

  // ---------------------------------------------------------------- ads
  function initAds() {
    var units = qsa('ins.adsbygoogle');
    if (!units.length) return;
    units.forEach(function () {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    });
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register(BASE + '/sw.js').catch(function () {});
      });
    }
  }

  // ---------------------------------------------------------------- boot
  initTheme();
  initDrawer();
  initOffline();
  initActions();
  initSort();
  initHeaderSuggest();
  initSearchPage();
  initSavedPage();
  initInstall();
  initAds();
  initServiceWorker();
})();
