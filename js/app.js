/* DOFAMIN — демо-сайт, версия 4. Данные — в menu-data.js */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';
  const waLink = text => 'https://wa.me/' + SHOP.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  const pad2 = n => String(n).padStart(2, '0');
  const plural = (n, one, few, many) => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  };
  const pic = (photo, alt, sizes, lazy = true) =>
    `<img src="img/menu/${photo}-800.webp" srcset="img/menu/${photo}-480.webp 480w, img/menu/${photo}-800.webp 800w" sizes="${sizes}" alt="${esc(alt)}" width="800" height="1000"${lazy ? ' loading="lazy"' : ''} decoding="async">`;

  /* ================================================================
     Ковёр: строки DOFAMIN, каждая вторая перевёрнута — как на аватаре.
     Метрики Playfair Display 400 при кегле 100: заглавная 70.8, DOFA+MIN 457.9.
     ================================================================ */
  const CAP = 70.8, W = 457.9;
  function rugSVG({ rows, reps = 1, gap = 46, rowAnim = false, loop = false, aspect = 'xMidYMid meet' }) {
    let g = '';
    for (let r = 0; r < rows; r++) {
      let line = '';
      const n = loop ? reps * 2 : reps;
      for (let k = 0; k < n; k++) {
        line += `<text x="${(k * (W + gap)).toFixed(1)}" y="${CAP}" font-size="100"><tspan class="r">DOFA</tspan><tspan class="b">MIN</tspan></text>`;
      }
      const flip = r % 2 === 1;
      const outer = flip ? `translate(0 ${(r * CAP + CAP).toFixed(1)}) scale(1 -1)` : `translate(0 ${(r * CAP).toFixed(1)})`;
      const inner = rowAnim ? `<g class="row" style="--i:${r};--dir:${flip ? 1 : -1}">${line}</g>` : line;
      g += `<g transform="${outer}">${inner}</g>`;
    }
    const vw = reps * W + (reps - 1) * gap;
    const vh = rows * CAP;
    const body = loop ? `<g class="loop">${g}</g>` : g;
    return `<svg class="rug" viewBox="0 -2 ${vw.toFixed(1)} ${(vh + 4).toFixed(1)}" preserveAspectRatio="${aspect}" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  function buildRugs() {
    $$('[data-rug-band]').forEach(el => {
      el.innerHTML = rugSVG({ rows: +el.dataset.rugBand || 2, reps: 22, gap: 40, aspect: 'xMinYMid meet' });
    });
    // Надпись DOFAMIN, сотканная из ковра. На первом экране нити «вплетаются» в буквы при загрузке.
    // Число рядов — по высоте надписи, чтобы нити было видно и на телефоне.
    $$('[data-woven]').forEach(el => {
      const inHero = !!el.closest('.hero');
      const h = el.getBoundingClientRect().height || 120;
      const rows = +el.dataset.rows || Math.max(3, Math.min(6, Math.round(h / 34)));
      el.innerHTML = rugSVG({ rows, reps: 5, loop: true, rowAnim: inHero && !reduceMotion, aspect: 'xMinYMid slice' });
    });
  }
  const fontsReady = document.fonts && document.fonts.load
    ? Promise.race([document.fonts.load('400 100px Playfair', 'DOFAMIN'), new Promise(r => setTimeout(r, 1200))])
    : Promise.resolve();
  fontsReady.then(buildRugs);

  /* Первый экран: ковёр на весь экран — одна SVG-картинка, ряды двигаются внутри неё
     (так же, как надпись в подвале: этот способ работает и на iPhone). Ряды через один перевёрнуты
     и идут навстречу. Число рядов и повторов — по размеру экрана. */
  const heroRug = $('[data-hero-rug]');
  let heroW = 0;
  function buildHeroRug() {
    if (!heroRug || window.innerWidth === heroW) return;
    heroW = window.innerWidth;
    const box = heroRug.getBoundingClientRect();
    const h = box.height || window.innerHeight, w = box.width || heroW;
    const rows = Math.max(9, Math.round(h / 66));
    const P = W + 46;                                   // один повтор DOFAMIN с промежутком
    const vh = rows * CAP, vw = w * vh / h;             // размер картинки в её единицах
    const k = Math.ceil(vw / P);                        // сдвиг на k повторов — круг без скачка
    const sh = (k * P).toFixed(1), dur = k * 10;        // 10 секунд на один повтор
    let line = '';
    for (let i = 0; i < 2 * k + 1; i++) line += `<text x="${(i * P).toFixed(1)}" y="${CAP}" font-size="100"><tspan class="r">DOFA</tspan><tspan class="b">MIN</tspan></text>`;
    let g = '';
    for (let r = 0; r < rows; r++) {
      const flip = r % 2 === 1;
      const outer = flip ? `translate(0 ${(r * CAP + CAP).toFixed(1)}) scale(1 -1)` : `translate(0 ${(r * CAP).toFixed(1)})`;
      g += `<g transform="${outer}"><g class="hl${flip ? ' hl--b' : ''}">${line}</g></g>`;
    }
    heroRug.innerHTML = `<svg class="rug" viewBox="0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><style>` +
      `.hl{animation:hlA ${dur}s linear infinite}.hl--b{animation-name:hlB}` +
      `@keyframes hlA{to{transform:translateX(-${sh}px)}}@keyframes hlB{from{transform:translateX(-${sh}px)}to{transform:translateX(0)}}` +
      `@media (prefers-reduced-motion:reduce){.hl{animation-duration:${dur * 2}s!important;animation-iteration-count:infinite!important}}` +
      `</style>${g}</svg>`;
  }
  buildHeroRug();

  /* Сотканный текст (заголовок на ярлыке): плитка из двух рядов DOFAMIN — прямого и перевёрнутого —
     лежит фоном и видна только внутри букв. Плитка повторяется без шва через каждые W + 46. */
  (function weaveText() {
    const els = $$('[data-woven-text]');
    if (!els.length) return;
    const P = W + 46;
    const row = `<text x="0" y="${CAP}" font-size="100"><tspan class="r">DOFA</tspan><tspan class="b">MIN</tspan></text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${P.toFixed(1)} ${(2 * CAP).toFixed(1)}" width="${P.toFixed(1)}" height="${(2 * CAP).toFixed(1)}">` +
      `<style>.r{fill:#9a393b}.b{fill:#3e6585}text{font-family:Georgia,'Times New Roman',serif}</style><rect width="100%" height="100%" fill="#2e1413"/>` +
      `${row}<g transform="translate(0 ${(2 * CAP).toFixed(1)}) scale(1 -1)">${row}</g></svg>`;
    const url = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
    els.forEach(el => { el.style.backgroundImage = url; });
  })();

  /* ================================================================
     Бегущая строка: копия содержимого для бесшовного круга
     ================================================================ */
  const mq = $('[data-marquee]');
  if (mq) mq.innerHTML += mq.innerHTML;

  /* Лента с коробки торта: 8 повторов, сдвиг на половину — круг без скачка */
  $$('[data-rib]').forEach(el => {
    el.innerHTML = '<b>DOFAMIN</b><span>coffee &amp; pastry</span><span aria-hidden="true">·</span>'.repeat(8);
  });

  /* ================================================================
     Витрина как сторис: полоски сверху, листается сама, пока блок на экране
     ================================================================ */
  const vSec = $('[data-vitrina]');
  if (vSec) {
    const N = VITRINA.length, DUR = 6000;
    const story = $('[data-story]'), media = $('[data-v-media]'), bars = $('[data-v-bars]'), pan = $('[data-v-pan]');
    story.style.setProperty('--vdur', DUR + 'ms');
    media.innerHTML = VITRINA.map((v, i) =>
      `<img class="story__img" src="img/menu/${v.photo}-800.webp" srcset="img/menu/${v.photo}-480.webp 480w, img/menu/${v.photo}-800.webp 800w" sizes="(min-width:1024px) 440px, 92vw" alt="${esc(v.name)}" width="800" height="1000"${i ? ' loading="lazy"' : ''} decoding="async">`).join('');
    bars.innerHTML = VITRINA.map(() => '<i><b></b></i>').join('');
    const imgs = $$('.story__img', media), barEls = $$('i', bars);
    let cur = -1;

    const firstSentence = t => (t.match(/^.+?[.!?](\s|$)/) || [t])[0].trim();
    const paintPanel = v => {
      const it = byId[v.id];
      const n = v.flavors ? v.flavors.length : 0;
      const meta = esc(v.tag) + (n ? ` · ${n} ${plural(n, 'вкус', 'вкуса', 'вкусов')}` : '');
      const btn = v.action === 'wa'
        ? `<a class="btn btn--accent btn--block" href="${waLink(v.wa)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>${esc(v.btn)}</a>`
        : `<button class="btn btn--accent btn--block" type="button" data-add="${v.id}"><svg><use href="#i-plus"/></svg>${esc(v.btn)}${it && it.price ? ' · ' + rub(it.price) : ''}</button>`;
      pan.innerHTML = `<small>${meta}</small><h3>${esc(v.name)}</h3><p>${esc(firstSentence(v.line))}</p>${btn}`;
    };
    const show = i => {
      cur = (i + N) % N;
      const v = VITRINA[cur];
      imgs.forEach((im, k) => im.classList.toggle('is-on', k === cur));
      barEls.forEach(el => el.classList.remove('is-on'));
      void bars.offsetWidth; // перезапуск заполнения полоски
      barEls.forEach((el, k) => { el.classList.toggle('is-done', k < cur); el.classList.toggle('is-on', k === cur); });
      vSec.style.setProperty('--vt', v.tint);
      paintPanel(v);
    };
    show(0);
    $('[data-v-next]').addEventListener('click', () => show(cur + 1));
    $('[data-v-prev]').addEventListener('click', () => show(cur - 1));

    // Сама листается, только когда сторис на экране и вкладка открыта
    if (!reduceMotion) {
      bars.addEventListener('animationend', e => { if (e.target.parentNode === barEls[cur]) show(cur + 1); });
      let inView = false;
      const setPause = () => story.classList.toggle('is-paused', !inView || document.hidden);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => { inView = es[0].isIntersecting; setPause(); }, { threshold: 0.4 }).observe(story);
      } else { inView = true; setPause(); }
      document.addEventListener('visibilitychange', setPause);
    }
  }

  /* ================================================================
     Меню-карта
     ================================================================ */
  /* Каталог — приём Delta Cafés и Henrietta Said: продукт вырезан из фона и стоит на подложке цвета раздела.
     Где вырезать чисто не получилось (тарелки, рука, газета) — фото в круглом окне-тарелке. */
  const priceHTML = it => it.price
    ? `<span class="pcard__price">${rub(it.price)}</span>`
    : `<span class="pcard__price na">цена уточняется</span>`;
  const addBtn = it => `<button class="add" type="button" data-add="${it.id}" aria-label="Добавить «${esc(it.name)}» в корзину"><svg><use href="#i-plus"/></svg></button>`;
  const stage = it => {
    const c = (typeof CUTS !== 'undefined') && CUTS[it.photo];
    if (c && c.mode === 'cut') return `<img class="pcard__cut" src="img/cut/${it.photo}-480.webp" alt="${esc(it.name)}" loading="lazy" decoding="async">`;
    return `<span class="pcard__circle"><img src="img/menu/${it.photo}-480.webp" alt="${esc(it.name)}" width="480" height="600" loading="lazy" decoding="async"></span>`;
  };
  const menuWrap = $('[data-menu]');
  const tabsRow = $('[data-tabs-row]');
  if (menuWrap) {
    tabsRow.innerHTML = CATEGORIES.map((c, i) =>
      `<button class="tab" type="button" data-tab="${c.id}" aria-current="${i === 0}">${esc(c.title)}</button>`).join('');
    menuWrap.innerHTML = CATEGORIES.map(c => {
      const list = ITEMS.filter(i => i.cat === c.id);
      const cards = list.filter(i => i.photo).map(it => `
        <article class="pcard">
          <button class="pcard__open" type="button" data-open="${it.id}" aria-label="${esc(it.name)} — подробнее">
            <span class="pcard__stage">${stage(it)}</span>
            <span class="pcard__name">${esc(it.name)}</span>
          </button>
          <div class="pcard__foot">${priceHTML(it)}${addBtn(it)}</div>
        </article>`).join('');
      const rows = list.filter(i => !i.photo).map(it => `
        <div class="trow">
          <div><p class="trow__name">${esc(it.name)}</p><p class="trow__line">${esc(it.line)}</p></div>
          ${priceHTML(it)}${addBtn(it)}
        </div>`).join('');
      return `<section class="cat" id="cat-${c.id}" data-cat="${c.id}" aria-labelledby="h-${c.id}">
        <div class="cat__head"><h3 id="h-${c.id}">${esc(c.title)}</h3><sup>${list.length}</sup></div>
        ${cards ? `<div class="pgrid">${cards}</div>` : ''}
        ${rows ? `<div class="trows">${rows}</div>` : ''}
      </section>`;
    }).join('');

    const setTab = id => {
      $$('[data-tab]', tabsRow).forEach(t => {
        const on = t.dataset.tab === id;
        t.setAttribute('aria-current', on);
        if (on) tabsRow.scrollTo({ left: t.offsetLeft - tabsRow.clientWidth / 2 + t.clientWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    };
    tabsRow.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      const sec = document.getElementById('cat-' + b.dataset.tab);
      if (sec) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setTab(b.dataset.tab);
    });
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting) setTab(en.target.dataset.cat); }), { rootMargin: '-35% 0px -60% 0px' });
      $$('[data-cat]', menuWrap).forEach(s => spy.observe(s));
    }

  }

  /* ================================================================
     Текст проявляется по словам
     ================================================================ */
  const magic = $('[data-magic]');
  let magicWords = [];
  if (magic && !reduceMotion) {
    const wrapWords = node => {
      Array.from(node.childNodes).forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) wrapWords(ch);
      });
    };
    wrapWords(magic);
    magicWords = $$('.w', magic);
  }

  /* ================================================================
     Отзывы
     ================================================================ */
  const rvWrap = $('[data-reviews]');
  if (rvWrap) {
    rvWrap.innerHTML = REVIEWS.map(r => `
      <figure class="rv"><blockquote>«${esc(r.text)}»</blockquote><figcaption>${esc(r.who)} · ${esc(r.date)}</figcaption></figure>`).join('');
  }

  /* ================================================================
     Движение по прокрутке: один обработчик на всё
     ================================================================ */
  const cakes = $('[data-box]');
  const steps = $$('[data-step]');
  const constel = $('[data-constel]');
  let ticking = false;

  function frame() {
    ticking = false;
    const vh = window.innerHeight;
    const sticky = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - vh)); };
    const view = (el, a = 1, b = 0) => { const r = el.getBoundingClientRect(); return clamp((vh * a - r.top) / (r.height + vh * (a - b))); };

    if (magicWords.length) {
      const p = view(magic, 0.88, 0.45);
      const n = magicWords.length;
      magicWords.forEach((w, k) => w.style.setProperty('--o', (0.16 + 0.84 * clamp(p * (n + 4) - k)).toFixed(2)));
    }
    if (cakes) {
      // лента «завязывается» слева направо, пока фото торта поднимается по экрану
      const r = $('.cakes__pic', cakes).getBoundingClientRect();
      const q = reduceMotion ? 1 : clamp((vh - r.top - r.height * 0.45) / (vh * 0.4));
      cakes.style.setProperty('--p', q.toFixed(3));
      steps.forEach(s => { if (reduceMotion || s.getBoundingClientRect().top < vh * 0.9) s.classList.add('is-on'); });
    }
    if (constel && isDesktop() && !reduceMotion) constel.style.setProperty('--p', view(constel).toFixed(3));
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { buildHeroRug(); frame(); }, 120); });
  window.addEventListener('load', frame);
  frame();

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
  const cartDlg = $('[data-cart]');
  function paintCounters(bump) {
    const t = totals();
    badge.textContent = t.count;
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
    $('[data-m-imgwrap]').innerHTML = it.photo ? pic(it.photo, it.name, '(min-width:820px) 470px, 100vw', false) : '';
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
     Ссылки и часы работы
     ================================================================ */
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa || ''); });
  $$('[data-yandex]').forEach(a => { a.href = SHOP.yandex; });

  const d = new Date();
  const mins = ((d.getUTCHours() + 3) % 24) * 60 + d.getUTCMinutes(); // Грозный, UTC+3
  const isOpen = mins >= SHOP.hours.open && mins < SHOP.hours.close;
  const st = $('[data-status]');
  if (st) {
    st.textContent = isOpen ? 'Сейчас открыто · до 00:00' : 'Сейчас закрыто · откроемся в 08:00';
    st.classList.toggle('is-closed', !isOpen);
  }
  const stShort = $('[data-status-short]');
  if (stShort) {
    stShort.textContent = isOpen ? 'Открыто до 00:00' : 'Откроемся в 08:00';
    const dot = $('.hero__meta .dot');
    if (dot) dot.classList.toggle('is-closed', !isOpen);
  }

  renderCart();
  paintCounters(false);
})();
