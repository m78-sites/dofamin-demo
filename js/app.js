/* DOFAMIN — демо-сайт. Данные — в menu-data.js */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';
  const waLink = text => 'https://wa.me/' + SHOP.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  const plural = (n, one, few, many) => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  };

  // ——— Фото блюд: два размера на каждую позицию ———
  const pic = (photo, alt, sizes, lazy = true) =>
    `<img src="img/menu/${photo}-800.webp" srcset="img/menu/${photo}-480.webp 480w, img/menu/${photo}-800.webp 800w" sizes="${sizes}" alt="${esc(alt)}" width="800" height="1000"${lazy ? ' loading="lazy"' : ''} decoding="async">`;

  /* ================================================================
     Ковёр: строки DOFAMIN, каждая вторая перевёрнута — как на аватаре.
     Метрики Playfair Display 400 при кегле 100: высота заглавной 70.8,
     ширина DOFA 266.3, MIN 191.6.
     ================================================================ */
  const CAP = 70.8, W = 457.9;

  function rugSVG({ rows, reps = 1, gap = 46, anim = false, drift = false }) {
    let g = '';
    for (let r = 0; r < rows; r++) {
      let line = '';
      for (let k = 0; k < reps; k++) {
        const x = k * (W + gap);
        line += `<text x="${x}" y="${CAP}" font-size="100"><tspan class="r">DOFA</tspan><tspan class="b">MIN</tspan></text>`;
      }
      const flip = r % 2 === 1;
      const outer = flip ? `translate(0 ${(r * CAP + CAP).toFixed(1)}) scale(1 -1)` : `translate(0 ${(r * CAP).toFixed(1)})`;
      let inner = line;
      if (anim) inner = `<g class="row-in${flip ? ' from-r' : ''}" style="--i:${r}">${inner}</g>`;
      if (drift) inner = `<g class="drift" data-dir="${flip ? -1 : 1}">${inner}</g>`;
      g += `<g transform="${outer}">${inner}</g>`;
    }
    const vw = reps * W + (reps - 1) * gap;
    const vh = rows * CAP;
    return `<svg class="rug" viewBox="-4 -2 ${(vw + 8).toFixed(1)} ${(vh + 4).toFixed(1)}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${g}</svg>`;
  }

  function buildRugs() {
    const hero = $('[data-rug-hero]');
    if (hero) hero.innerHTML = rugSVG({ rows: 6, anim: !reduceMotion, drift: !reduceMotion });
    $$('[data-rug-band]').forEach(el => {
      el.innerHTML = rugSVG({ rows: +el.dataset.rugBand || 2, reps: 24, gap: 40 }).replace('xMidYMid meet', 'xMinYMid meet');
    });
    const foot = $('[data-rug-footer]');
    if (foot) foot.innerHTML = rugSVG({ rows: 4, reps: Math.max(3, Math.round(window.innerWidth / 260)), gap: 40 });
  }

  // Шрифт должен успеть загрузиться, иначе первые кадры ковра нарисуются запасным шрифтом
  const fontsReady = document.fonts && document.fonts.load
    ? Promise.race([document.fonts.load('400 100px Playfair', 'DOFAMIN'), new Promise(r => setTimeout(r, 1500))])
    : Promise.resolve();
  fontsReady.then(buildRugs);

  // Ряды ковра чуть расходятся при прокрутке — как переплетение нитей
  // На телефоне ковёр маленький — там сдвиг ломает ромбы, поэтому только от 1024 px
  if (!reduceMotion && window.matchMedia('(min-width: 1024px)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        if (y > window.innerHeight * 1.2) return;
        const shift = Math.min(10, y * 0.02);
        $$('[data-rug-hero] .drift').forEach(g => {
          g.style.transform = `translateX(${(shift * +g.dataset.dir).toFixed(1)}px)`;
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ================================================================
     Новинки
     ================================================================ */
  const novWrap = $('[data-novelties]');
  if (novWrap) {
    novWrap.innerHTML = NOVELTIES.map(n => {
      const flavors = n.flavors ? `<ul class="chips" aria-label="Вкусы">${n.flavors.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : '';
      const btn = n.action === 'wa'
        ? `<a class="btn btn--accent btn--block" href="${waLink(n.wa)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>${esc(n.btn)}</a>`
        : `<button class="btn btn--accent btn--block" type="button" data-add="${n.id}"><svg><use href="#i-plus"/></svg>${esc(n.btn)}</button>`;
      return `<article class="nov reveal">
        <div class="nov__img">${pic(n.photo, n.name, '(min-width:1100px) 25vw, (min-width:640px) 46vw, 82vw')}<span class="nov__tag">${esc(n.tag)}</span></div>
        <div class="nov__body"><h3>${esc(n.name)}</h3><p>${esc(n.line)}</p>${flavors}<div class="nov__btn">${btn}</div></div>
      </article>`;
    }).join('');
  }

  /* ================================================================
     Меню
     ================================================================ */
  const priceHTML = it => it.price
    ? `<span class="price">${rub(it.price)}</span>`
    : `<span class="price price--na">цена уточняется</span>`;
  const addBtn = it => `<button class="add" type="button" data-add="${it.id}" aria-label="Добавить «${esc(it.name)}» в корзину"><svg><use href="#i-plus"/></svg></button>`;

  const menuWrap = $('[data-menu]');
  const tabsRow = $('[data-tabs-row]');
  if (menuWrap) {
    tabsRow.innerHTML = CATEGORIES.map((c, i) =>
      `<button class="tab" type="button" data-tab="${c.id}" aria-current="${i === 0}">${esc(c.title)}</button>`).join('');

    menuWrap.innerHTML = CATEGORIES.map(c => {
      const list = ITEMS.filter(i => i.cat === c.id);
      const withPhoto = list.filter(i => i.photo);
      const noPhoto = list.filter(i => !i.photo);
      const cards = withPhoto.map(it => `
        <article class="card reveal">
          <button class="card__open" type="button" data-open="${it.id}" aria-label="${esc(it.name)} — подробнее">
            <span class="card__img">${pic(it.photo, it.name, '(min-width:1200px) 280px, (min-width:768px) 30vw, 46vw')}</span>
            <span class="card__cat">${esc(c.label)}</span>
            <span class="card__name">${esc(it.name)}</span>
            <span class="card__line">${esc(it.line)}</span>
          </button>
          <div class="card__foot">${priceHTML(it)}${addBtn(it)}</div>
        </article>`).join('');
      const rows = noPhoto.map(it => `
        <div class="row">
          <div><p class="row__name">${esc(it.name)}</p><p class="row__line">${esc(it.line)}</p></div>
          ${priceHTML(it)}${addBtn(it)}
        </div>`).join('');
      return `<section class="cat" id="cat-${c.id}" data-cat="${c.id}" aria-labelledby="h-${c.id}">
        <div class="cat__head"><h3 id="h-${c.id}">${esc(c.title)}</h3><span>${list.length} ${plural(list.length, 'позиция', 'позиции', 'позиций')}</span></div>
        ${cards ? `<div class="grid">${cards}</div>` : ''}
        ${rows ? `<div class="rows">${rows}</div>` : ''}
      </section>`;
    }).join('');

    // Вкладки: прокрутка к разделу и подсветка текущего
    tabsRow.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      const sec = document.getElementById('cat-' + b.dataset.tab);
      if (sec) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setTab(b.dataset.tab);
    });
    const setTab = id => {
      $$('[data-tab]', tabsRow).forEach(t => {
        const on = t.dataset.tab === id;
        t.setAttribute('aria-current', on);
        if (on) {
          const left = t.offsetLeft - tabsRow.clientWidth / 2 + t.clientWidth / 2;
          tabsRow.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    };
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) setTab(en.target.dataset.cat); });
      }, { rootMargin: '-35% 0px -60% 0px' });
      $$('[data-cat]', menuWrap).forEach(s => spy.observe(s));
    }
  }

  /* ================================================================
     Отзывы
     ================================================================ */
  const rvWrap = $('[data-reviews]');
  if (rvWrap) {
    rvWrap.innerHTML = REVIEWS.map(r => `
      <figure class="rv reveal"><blockquote>«${esc(r.text)}»</blockquote><figcaption>${esc(r.who)} · ${esc(r.date)} · 2ГИС</figcaption></figure>`).join('');
  }

  /* ================================================================
     Корзина
     ================================================================ */
  const KEY = 'dofamin-cart-v1';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(id => { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* приватный режим */ } };

  const totals = () => {
    let count = 0, sum = 0, unknown = 0;
    Object.entries(cart).forEach(([id, q]) => {
      const it = byId[id]; count += q;
      if (it.price) sum += it.price * q; else unknown += q;
    });
    return { count, sum, unknown };
  };

  const badge = $('[data-count]');
  const fab = $('[data-fab]');
  function paintCounters(bump) {
    const t = totals();
    badge.textContent = t.count;
    badge.classList.toggle('is-on', t.count > 0);
    if (bump) { badge.classList.remove('is-bump'); void badge.offsetWidth; badge.classList.add('is-bump'); }
    fab.classList.toggle('is-on', t.count > 0 && !cartDlg.open);
    $('[data-fab-count]').textContent = `${t.count} ${plural(t.count, 'позиция', 'позиции', 'позиций')}`;
    $('[data-fab-sum]').textContent = t.sum ? rub(t.sum) + (t.unknown ? ' +' : '') : 'Открыть';
  }

  const toastEl = $('[data-toast]');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 1600);
  }

  function add(id, btn) {
    if (!byId[id]) return;
    cart[id] = (cart[id] || 0) + 1;
    save(); paintCounters(true); renderCart();
    toast('Добавлено: ' + byId[id].name);
    if (btn && btn.classList.contains('add')) {
      const use = btn.querySelector('use');
      btn.classList.add('is-added'); use.setAttribute('href', '#i-check');
      setTimeout(() => { btn.classList.remove('is-added'); use.setAttribute('href', '#i-plus'); }, 1100);
    }
  }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = q;
    save(); paintCounters(false); renderCart();
  }

  const cartDlg = $('[data-cart]');
  const listEl = $('[data-cart-list]');
  function renderCart() {
    const ids = Object.keys(cart);
    const empty = ids.length === 0;
    $('[data-cart-empty]').hidden = !empty;
    $('[data-cart-form]').hidden = empty;
    $('[data-cart-foot]').hidden = empty;
    listEl.innerHTML = ids.map(id => {
      const it = byId[id], q = cart[id];
      const thumb = it.photo
        ? `<img src="img/menu/${it.photo}-480.webp" alt="" width="56" height="70" loading="lazy">`
        : `<span class="ci__ph" aria-hidden="true"><svg style="color:var(--rug-red)"><use href="#i-rhomb"/></svg></span>`;
      return `<div class="ci">${thumb}
        <div><p class="ci__name">${esc(it.name)}</p><p class="ci__price">${it.price ? rub(it.price) + ' за шт.' : 'цена уточняется'}</p></div>
        <div class="qty" role="group" aria-label="Количество: ${esc(it.name)}">
          <button type="button" data-dec="${id}" aria-label="Убрать одну"><svg><use href="#i-minus"/></svg></button>
          <span>${q}</span>
          <button type="button" data-inc="${id}" aria-label="Добавить ещё"><svg><use href="#i-plus"/></svg></button>
        </div></div>`;
    }).join('');
    const t = totals();
    $('[data-total]').textContent = t.sum ? rub(t.sum) : '—';
    $('[data-total-note]').textContent = t.unknown
      ? (t.sum ? 'плюс позиции без цены, их сумму назовёт администратор' : 'сумму назовёт администратор в WhatsApp')
      : '';
  }

  listEl.addEventListener('click', e => {
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
    if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
  });

  $('[data-send]').addEventListener('click', () => {
    const f = $('[data-cart-form]');
    const name = f.name.value.trim(), when = f.when.value, comment = f.comment.value.trim();
    const t = totals();
    const lines = ['Здравствуйте! Заказ с сайта DOFAMIN (ДЕМО, тестовый — не готовить):', ''];
    Object.entries(cart).forEach(([id, q], i) => {
      const it = byId[id];
      lines.push(`${i + 1}. ${it.name} × ${q} — ${it.price ? rub(it.price * q) : 'цену подскажите'}`);
    });
    lines.push('');
    if (t.sum) lines.push('Итого по ценам с сайта: ' + rub(t.sum) + (t.unknown ? ' + позиции без цены' : ''));
    lines.push('Когда: ' + when);
    if (name) lines.push('Имя: ' + name);
    if (comment) lines.push('Комментарий: ' + comment);
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
  });

  /* ================================================================
     Окна
     ================================================================ */
  const modal = $('[data-modal]');
  let modalItem = null;

  function lock(on) { document.documentElement.style.overflow = on ? 'hidden' : ''; }
  function openDlg(d) {
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    lock(true); paintCounters(false);
  }
  function closeDlg(d) { if (d.open) d.close(); }
  [modal, cartDlg].forEach(d => {
    d.addEventListener('close', () => { if (!modal.open && !cartDlg.open) lock(false); paintCounters(false); });
    d.addEventListener('click', e => { if (e.target === d) closeDlg(d); });
    $$('[data-close]', d).forEach(b => b.addEventListener('click', () => closeDlg(d)));
  });

  function openItem(id) {
    const it = byId[id]; if (!it) return;
    modalItem = it;
    $('[data-m-imgwrap]').innerHTML = it.photo ? pic(it.photo, it.name, '(min-width:820px) 460px, 100vw', false) : '';
    $('[data-m-cat]').textContent = catById[it.cat].label;
    $('[data-m-name]').textContent = it.name;
    $('[data-m-line]').textContent = it.line;
    const s = $('[data-m-sostav]');
    s.hidden = !it.sostav;
    s.querySelector('span').textContent = it.sostav || '';
    $('[data-m-add]').innerHTML = `<svg><use href="#i-plus"/></svg>В корзину${it.price ? ' · ' + rub(it.price) : ''}`;
    openDlg(modal);
  }
  $('[data-m-add]').addEventListener('click', () => {
    if (!modalItem) return;
    add(modalItem.id);
    closeDlg(modal);
  });

  // Делегирование: открыть блюдо, добавить, открыть корзину
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { openItem(open.dataset.open); return; }
    const addB = e.target.closest('[data-add]');
    if (addB) { add(addB.dataset.add, addB); return; }
    const oc = e.target.closest('[data-open-cart]');
    if (oc) { renderCart(); openDlg(cartDlg); }
  });

  /* ================================================================
     Мобильное меню
     ================================================================ */
  const mnav = $('[data-mnav]'), burger = $('[data-burger]');
  const setNav = on => {
    mnav.classList.toggle('is-open', on);
    mnav.setAttribute('aria-hidden', !on);
    burger.setAttribute('aria-expanded', on);
    lock(on);
    if (on) $('[data-mnav-close]').focus(); else burger.focus({ preventScroll: true });
  };
  burger.addEventListener('click', () => setNav(true));
  $('[data-mnav-close]').addEventListener('click', () => setNav(false));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) setNav(false); });

  /* ================================================================
     Ссылки, часы работы, появление блоков
     ================================================================ */
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa || ''); });
  $$('[data-yandex]').forEach(a => { a.href = SHOP.yandex; });

  const st = $('[data-status]');
  if (st) {
    const d = new Date();
    const m = ((d.getUTCHours() + 3) % 24) * 60 + d.getUTCMinutes(); // Грозный, UTC+3
    const open = m >= SHOP.hours.open && m < SHOP.hours.close;
    st.textContent = open ? 'Сейчас открыто · до 00:00' : 'Сейчас закрыто · откроемся в 08:00';
    st.classList.toggle('is-closed', !open);
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(ents => ents.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
  }

  renderCart();
  paintCounters(false);
})();
