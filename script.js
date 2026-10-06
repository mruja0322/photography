/* =========================================================
   Mruja Shah — Photography
   Static site, no build step. Edit the CONFIG, GENRES and
   photos list below and everything else updates itself.
   ========================================================= */

/* ---------- 1. CONFIG ---------- */
const SITE = {
  name: "Mruja Shah",
  whatsapp: "919686038031",
  email: "mruja.v.shah@gmail.com",
  instagram: "https://www.instagram.com/mrxja_photography",
  handle: "@mrxja_photography",
};

/* Genres. The order here sets the filter chips and section order.
   `blurb` is the line shown under each genre heading.
   Any genre used on a photo but missing here is still shown, at the end. */
const GENRES = [
  { name: "Sunset", blurb: "Golden hours, warm skies and quiet light." },
  { name: "Wildlife", blurb: "Birds and animals in the wild." },
  { name: "Nature", blurb: "Mountains, water and open air." },
  { name: "Moon", blurb: "Night skies and our nearest neighbour." },
  { name: "Architecture", blurb: "Palaces, temples and fine detail." },
  { name: "Travel", blurb: "Places passed along the way." },
];

/* Default prices in rupees. Override a single photo with:
   { prices: { digital: 599, A4: 1599, A3: 2599, A2: 3999 } } */
const PRICES = {
  digital: 499,
  sizes: { A4: 1499, A3: 2499, A2: 3999 },
};

/* ---------- 2. PHOTOS ----------
   Add ~10 per genre. Per photo:
     category  → the genre (must match a name above, or a new one)
     title     → caption shown under the photo
     alt       → description for screen readers
     prices    → optional per-photo price override             */
const photos = [
  { category: "Sunset", src: "images/sunset/sunset-1.jpeg", title: "Sunset 1", alt: "Warm sunset sky over the horizon" },
  { category: "Sunset", src: "images/sunset/sunset-2.jpeg", title: "Sunset 2", alt: "Golden light across a calm evening sky" },
  { category: "Sunset", src: "images/sunset/sunset-3.jpeg", title: "Sunset 3", alt: "Pastel sunset clouds" },
  { category: "Sunset", src: "images/sunset/sunset-4.jpg", title: "Sunset 4", alt: "Sun dipping below the horizon" },
  { category: "Sunset", src: "images/sunset/sunset-5.JPG", title: "Sunset 5", alt: "Evening sky fading to pink" },
  { category: "Sunset", src: "images/sunset/sunset-6.JPG", title: "Sunset 6", alt: "Sunset reflected on still water" },
  { category: "Sunset", src: "images/sunset/sunset-7.JPG", title: "Sunset 7", alt: "Amber sunset behind silhouetted trees" },
  { category: "Wildlife", src: "images/tiger.jpg", title: "Tiger", alt: "A tiger resting in the wild" },
  { category: "Nature", src: "images/snow-river.jpg", title: "Mountains", alt: "Snowy mountains and a rushing river" },
  { category: "Wildlife", src: "images/bee-eater.jpg", title: "Green bee-eater", alt: "A green bee-eater perched on a branch" },
  { category: "Moon", src: "images/moon.jpg", title: "Full moon", alt: "The full moon against a dark sky" },
  { category: "Architecture", src: "images/mysore-palace.jpg", title: "Mysore Palace", alt: "The illuminated Mysore Palace at dusk" },
  { category: "Nature", src: "images/waterfall.jpg", title: "Waterfall", alt: "Water falling over rocks into a pool" },
  { category: "Travel", src: "images/boat.jpg", title: "Golden sea", alt: "A small boat on a golden sea at sunset" },
  { category: "Wildlife", src: "images/peacock.jpg", title: "Peacock", alt: "A peacock with its feathers on display" },
  { category: "Nature", src: "images/lake.jpg", title: "Lake", alt: "A quiet lake surrounded by hills" },
  { category: "Nature", src: "images/bonfire.jpg", title: "Bonfire", alt: "A bonfire glowing at night" },
  { category: "Architecture", src: "images/temple-carving.jpg", title: "Temple carving", alt: "Intricate stone carving on a temple wall" },
];

/* ---------- 3. Helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rupees = n => "\u20B9" + Number(n).toLocaleString("en-IN");
const slugify = s => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo";
const waLink = t => "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(t);

const PHOTOS = photos.map((p, i) => {
  const genre = p.category || "General";
  const title = p.title || "Untitled";
  return Object.assign({}, p, {
    genre, title,
    alt: p.alt || title + " — " + genre + " photograph by " + SITE.name,
    slug: slugify(title) + "-" + (i + 1),
  });
});

function genreOrder() {
  const present = [...new Set(PHOTOS.map(p => p.genre))];
  const listed = GENRES.map(g => g.name).filter(n => present.includes(n));
  const extras = present.filter(n => !listed.includes(n))
    .sort((a, b) => (a === "General") - (b === "General"));
  return [...listed, ...extras];
}
const genreBlurb = n => (GENRES.find(g => g.name === n) || {}).blurb || "";

function priceFor(p, fmt, size) {
  const custom = p.prices || {};
  if (fmt === "digital") return custom.digital ?? p.digital ?? PRICES.digital;
  return custom[size] ?? (size === "A4" ? (p.print ?? PRICES.sizes.A4) : PRICES.sizes[size]);
}

/* ---------- 4. State ---------- */
const state = {
  filter: "All",
  shopFilter: "All",
  search: "",
  chosen: null,
  cart: [],
  lbList: [],
  lbIndex: 0,
  lastFocus: null,
};

const CART_KEY = "mruja-shortlist";
try { state.cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]") || []; } catch (_) { state.cart = []; }
const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (_) {} };

/* ---------- 5. Element refs ---------- */
const $ = id => document.getElementById(id);
const grid = $("grid"), empty = $("empty"), chips = $("chips"), search = $("search");
const picker = $("picker"), shopChips = $("shop-chips");
const orderImg = $("order-img"), orderWm = $("order-wm"), orderTitle = $("order-title");
const pDigital = $("p-digital"), pPrint = $("p-print");
const buy = $("buy"), addBtn = $("add"), sizeSel = $("size"), sizeRow = $("size-row");
const radios = document.querySelectorAll('input[name="fmt"]');
const cartList = $("cart-list"), cartCount = $("cart-count"), cartEmpty = $("cart-empty");
const cartFoot = $("cart-foot"), cartTotal = $("cart-total"), cartSend = $("cart-send"), cartClear = $("cart-clear");

/* ---------- 6. Gallery ---------- */
function visible() {
  const q = state.search.trim().toLowerCase();
  return PHOTOS.filter(p =>
    (state.filter === "All" || p.genre === state.filter) &&
    (!q || (p.title + " " + p.genre).toLowerCase().includes(q)));
}

function buildChips(container, active, onPick) {
  container.innerHTML = "";
  ["All", ...genreOrder()].forEach(name => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (name === active ? " on" : "");
    b.textContent = name;
    b.setAttribute("aria-pressed", String(name === active));
    b.onclick = () => onPick(name);
    container.appendChild(b);
  });
}

function makeTile(p) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "tile";
  b.setAttribute("aria-label", "View " + p.title);
  b.innerHTML = '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy" decoding="async">' +
    (p.title ? "<span>" + esc(p.title) + "</span>" : "");
  b.onclick = () => openLb(p);
  return b;
}

function renderGallery() {
  const list = visible();
  grid.innerHTML = "";
  empty.hidden = list.length > 0;
  if (!list.length) return;

  const groups = state.filter === "All"
    ? genreOrder().map(g => [g, list.filter(p => p.genre === g)]).filter(g => g[1].length)
    : [[state.filter, list]];

  groups.forEach(([name, items]) => {
    const group = document.createElement("div");
    group.className = "category-group";

    const label = document.createElement("button");
    label.type = "button";
    label.className = "category-label";
    label.setAttribute("aria-expanded", "true");
    label.innerHTML = "<span>" + esc(name) + '</span><span class="caret" aria-hidden="true">\u25BE</span>';

    const blurb = document.createElement("p");
    blurb.className = "category-blurb";
    blurb.textContent = genreBlurb(name);

    const g = document.createElement("div");
    g.className = "category-grid";
    items.forEach(p => g.appendChild(makeTile(p)));

    if (state.filter === "All") {
      label.onclick = () => {
        const closed = group.classList.toggle("closed");
        label.setAttribute("aria-expanded", String(!closed));
      };
    } else {
      label.style.cursor = "default";
    }

    group.append(label, blurb, g);
    grid.appendChild(group);
  });
}

/* ---------- 7. Lightbox ---------- */
const lb = $("lb"), lbImg = $("lb-img"), lbTitle = $("lb-title"), lbCount = $("lb-count");
const lbClose = $("lb-close"), lbPrev = $("lb-prev"), lbNext = $("lb-next"), lbZoom = $("lb-zoom"), lbShare = $("lb-share");
const pan = { x: 0, y: 0 };
let drag = null;

function preload(i) {
  const p = state.lbList[(i + state.lbList.length) % state.lbList.length];
  if (p) { const im = new Image(); im.src = p.src; }
}

function applyPan() {
  lbImg.style.transform = lb.classList.contains("zoomed")
    ? "translate(" + pan.x + "px," + pan.y + "px) scale(1.9)" : "";
}

function showLb() {
  const p = state.lbList[state.lbIndex];
  if (!p) return;
  lbImg.src = p.src;
  lbImg.alt = p.alt;
  lbTitle.textContent = p.title;
  lbCount.textContent = (state.lbIndex + 1) + " / " + state.lbList.length;
  lb.classList.remove("zoomed", "dragging");
  lbZoom.textContent = "\uFF0B";
  lbZoom.setAttribute("aria-label", "Zoom in");
  pan.x = pan.y = 0; applyPan();
  try { history.replaceState(null, "", "#p/" + p.slug); } catch (_) { location.hash = "p/" + p.slug; }
  preload(state.lbIndex + 1);
  preload(state.lbIndex - 1);
}

function openLbAt(list, index) {
  if (!list.length) return;
  state.lbList = list;
  state.lbIndex = ((index % list.length) + list.length) % list.length;
  state.lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  showLb();
  lbClose.focus();
}

function openLb(photo) {
  const list = visible();
  const i = list.findIndex(p => p.slug === photo.slug);
  openLbAt(list, i < 0 ? 0 : i);
}

function closeLb() {
  lb.hidden = true;
  lb.classList.remove("zoomed", "dragging");
  lbImg.style.transform = "";
  document.body.style.overflow = "";
  try { history.replaceState(null, "", location.pathname + location.search); } catch (_) {}
  if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
}

const lbGo = d => { if (state.lbList.length) openLbAt(state.lbList, state.lbIndex + d); };

lbClose.onclick = closeLb;
lbPrev.onclick = () => lbGo(-1);
lbNext.onclick = () => lbGo(1);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });

lbZoom.onclick = () => {
  const z = lb.classList.toggle("zoomed");
  lbZoom.textContent = z ? "\uFF0D" : "\uFF0B";
  lbZoom.setAttribute("aria-label", z ? "Zoom out" : "Zoom in");
  if (!z) { pan.x = pan.y = 0; }
  applyPan();
};

lbImg.addEventListener("pointerdown", e => {
  if (!lb.classList.contains("zoomed")) return;
  drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  lb.classList.add("dragging");
  try { lbImg.setPointerCapture(e.pointerId); } catch (_) {}
});
lbImg.addEventListener("pointermove", e => {
  if (!drag) return;
  pan.x = drag.px + (e.clientX - drag.x);
  pan.y = drag.py + (e.clientY - drag.y);
  applyPan();
});
const endDrag = () => { drag = null; lb.classList.remove("dragging"); };
lbImg.addEventListener("pointerup", endDrag);
lbImg.addEventListener("pointercancel", endDrag);

lbShare.onclick = async () => {
  const p = state.lbList[state.lbIndex];
  if (!p) return;
  const url = location.origin + location.pathname + "#p/" + p.slug;
  try {
    if (navigator.share) { await navigator.share({ title: p.title, text: p.title + " — " + SITE.name, url }); return; }
    await navigator.clipboard.writeText(url);
    lbShare.textContent = "Copied!";
    setTimeout(() => { lbShare.textContent = "Share"; }, 1500);
  } catch (_) {}
};

let swipe = null;
lb.addEventListener("touchstart", e => {
  if (lb.classList.contains("zoomed")) { swipe = null; return; }
  swipe = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
lb.addEventListener("touchend", e => {
  if (!swipe) return;
  const dx = e.changedTouches[0].clientX - swipe.x;
  const dy = e.changedTouches[0].clientY - swipe.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbGo(dx < 0 ? 1 : -1);
  swipe = null;
}, { passive: true });

document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  else if (e.key === "ArrowRight") lbGo(1);
  else if (e.key === "ArrowLeft") lbGo(-1);
  else if (e.key === "Tab") {
    const f = lb.querySelectorAll("button, [href]");
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- 8. Shop: picker + order ---------- */
function currentFormat() {
  const r = document.querySelector('input[name="fmt"]:checked');
  return r ? r.value : null;
}
const currentSize = () => sizeSel.value;

function updateOrder() {
  const p = state.chosen;
  if (!p) {
    buy.setAttribute("aria-disabled", "true");
    buy.textContent = "Choose a photo and format";
    buy.removeAttribute("data-href");
    addBtn.disabled = true;
    return;
  }
  pDigital.textContent = rupees(priceFor(p, "digital"));
  pPrint.textContent = rupees(priceFor(p, "print", currentSize()));
  const fmt = currentFormat();
  if (!fmt) {
    buy.setAttribute("aria-disabled", "true");
    buy.textContent = "Now choose a format";
    buy.removeAttribute("data-href");
    addBtn.disabled = true;
    return;
  }
  const price = priceFor(p, fmt, currentSize());
  const label = fmt === "digital" ? "digital download" : "framed print (" + currentSize() + ")";
  buy.dataset.href = waLink('Hi ' + SITE.name + ', I\'d like to buy "' + p.title + '" (' + label + ', ' + rupees(price) + ').');
  buy.setAttribute("aria-disabled", "false");
  buy.textContent = "Buy for " + rupees(price) + " on WhatsApp";
  addBtn.disabled = false;
}

function selectPhoto(p) {
  state.chosen = p;
  orderImg.src = p.src; orderImg.hidden = false;
  orderWm.hidden = false;
  orderTitle.textContent = p.title;
  radios.forEach(r => { r.disabled = false; });
  sizeSel.disabled = false;
  sizeRow.hidden = false;
  updateOrder();
  addBtn.textContent = "Add to shortlist";
}

function renderPicker() {
  picker.innerHTML = "";
  const q = state.search.trim().toLowerCase();
  let list = PHOTOS.filter(p => state.shopFilter === "All" || p.genre === state.shopFilter);
  if (q) list = list.filter(p => (p.title + " " + p.genre).toLowerCase().includes(q));

  list.forEach(p => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "thumb" + (state.chosen && state.chosen.slug === p.slug ? " on" : "");
    b.setAttribute("aria-label", p.title);
    b.innerHTML = '<img src="' + esc(p.src) + '" alt="" loading="lazy">';
    b.onclick = () => {
      picker.querySelectorAll(".thumb").forEach(t => t.classList.remove("on"));
      b.classList.add("on");
      selectPhoto(p);
    };
    picker.appendChild(b);
  });
}

buy.addEventListener("click", () => {
  if (buy.getAttribute("aria-disabled") === "true") return;
  if (buy.dataset.href) window.open(buy.dataset.href, "_blank", "noopener");
});

addBtn.addEventListener("click", () => {
  const p = state.chosen, fmt = currentFormat();
  if (!p || !fmt) return;
  const size = fmt === "print" ? currentSize() : null;
  state.cart.push({ slug: p.slug, title: p.title, src: p.src, fmt, size, price: priceFor(p, fmt, size) });
  saveCart(); renderCart();
  addBtn.textContent = "Added \u2713";
  setTimeout(() => { if (state.chosen) addBtn.textContent = "Add to shortlist"; }, 1200);
});

radios.forEach(r => r.addEventListener("change", updateOrder));
sizeSel.addEventListener("change", updateOrder);

/* ---------- 9. Shortlist ---------- */
function renderCart() {
  const list = state.cart;
  cartCount.textContent = list.length;
  cartList.innerHTML = "";
  cartEmpty.hidden = list.length > 0;
  cartClear.hidden = list.length === 0;
  cartFoot.hidden = list.length === 0;

  let total = 0;
  list.forEach((it, i) => {
    total += it.price;
    const fmtLabel = it.fmt === "digital" ? "Digital download" : "Framed print \u00B7 " + it.size;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      '<img src="' + esc(it.src) + '" alt="">' +
      '<span class="ci-t">' + esc(it.title) + "<small>" + esc(fmtLabel) + "</small></span>" +
      '<span class="ci-p">' + rupees(it.price) + "</span>" +
      '<button type="button" class="ci-x" aria-label="Remove ' + esc(it.title) + '">\u00D7</button>';
    li.querySelector(".ci-x").onclick = () => {
      state.cart.splice(i, 1); saveCart(); renderCart();
    };
    cartList.appendChild(li);
  });

  cartTotal.textContent = rupees(total);
  const lines = list.map((it, i) =>
    (i + 1) + '. "' + it.title + '" \u2014 ' + (it.fmt === "digital" ? "digital download" : "framed print (" + it.size + ")") + " \u2014 " + rupees(it.price));
  cartSend.href = waLink("Hi " + SITE.name + ", I'd like to order:\n" + lines.join("\n") + "\nTotal: " + rupees(total));
}

cartClear.onclick = () => { state.cart = []; saveCart(); renderCart(); };

/* ---------- 10. Instagram strip ---------- */
function renderFollow() {
  const strip = $("follow-strip");
  if (!strip) return;
  strip.innerHTML = "";
  PHOTOS.slice(0, 8).forEach(p => {
    const a = document.createElement("a");
    a.href = SITE.instagram;
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Open Instagram — " + p.title);
    a.innerHTML = '<img src="' + esc(p.src) + '" alt="" loading="lazy">';
    strip.appendChild(a);
  });
}

/* ---------- 11. Booking form ---------- */
const bookingForm = $("booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("b-name").value.trim();
    if (!name) { $("b-name").focus(); return; }
    const date = $("b-date").value, place = $("b-place").value.trim(), msg = $("b-msg").value.trim();
    let text = "Hi " + SITE.name + ", I'm " + name + ". I'd like: " + $("b-type").value + ".";
    if (date) text += " Date: " + date + ".";
    if (place) text += " Location: " + place + ".";
    if (msg) text += "\n" + msg;
    window.open(waLink(text), "_blank", "noopener");
    $("form-note").textContent = "Opening WhatsApp\u2026 if nothing happens, message " + SITE.whatsapp + ".";
  });
}

/* ---------- 12. Theme toggle + back-to-top ---------- */
const themeToggle = $("theme-toggle");
try {
  const saved = localStorage.getItem("mruja-theme");
  if (saved) document.documentElement.dataset.theme = saved;
} catch (_) {}
themeToggle.onclick = () => {
  const cur = document.documentElement.dataset.theme;
  const isDark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = isDark ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("mruja-theme", next); } catch (_) {}
};

const toTop = $("to-top");
window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* ---------- 13. Image protection (deterrents only) ---------- */
document.addEventListener("contextmenu", e => {
  if (e.target.closest("img,.tile,.thumb,.order,.lightbox,.follow-strip")) e.preventDefault();
});
document.addEventListener("dragstart", e => { if (e.target.tagName === "IMG") e.preventDefault(); });
document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(k)) e.preventDefault();
  if (k === "printscreen") { try { navigator.clipboard.writeText(" "); } catch (_) {} }
});

/* ---------- 14. Wire up + deep links ---------- */
function renderShopChips() {
  buildChips(shopChips, state.shopFilter, n => { state.shopFilter = n; renderShopChips(); renderPicker(); });
}

function renderGalleryChips() {
  buildChips(chips, state.filter, n => { state.filter = n; renderGalleryChips(); renderGallery(); });
}

search.addEventListener("input", () => { state.search = search.value; renderGallery(); renderPicker(); });

renderFollow();
renderGalleryChips();
renderShopChips();
renderGallery();
renderPicker();
renderCart();
updateOrder();

(function deepLink() {
  const m = location.hash.match(/^#p\/(.+)$/);
  if (!m) return;
  const p = PHOTOS.find(x => x.slug === m[1]);
  if (p) openLbAt(PHOTOS.slice(), PHOTOS.indexOf(p));
})();
