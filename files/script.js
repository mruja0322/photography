// EDIT THIS LIST: put your photos in the images/ folder, then add one line per photo.
// Example: { src: "images/sunset.jpg", title: "Golden hour" }
const photos = [
  { src: "images/tiger.jpg", title: "Wildlife" },
  { src: "images/sunset.jpg", title: "Sunset" },
  { src: "images/snow-river.jpg", title: "Mountains" },
  { src: "images/bee-eater.jpg", title: "Green bee-eater" },
  { src: "images/moon.jpg", title: "Full moon" },
  { src: "images/mysore-palace.jpg", title: "Mysore Palace" },
  { src: "images/waterfall.jpg", title: "Waterfall" },
  { src: "images/boat.jpg", title: "Golden sea" },
  { src: "images/peacock.jpg", title: "Peacock" },
  { src: "images/lake.jpg", title: "Lake" },
  { src: "images/bonfire.jpg", title: "Bonfire" },
  { src: "images/temple-carving.jpg", title: "Temple carving" },
];

const grid = document.getElementById("grid");
const placeholders = [
  ["#c9835a","#5b3a29"],["#6b8fa3","#22343f"],["#9fb08a","#3b4a30"],
  ["#d9b8a0","#7a5646"],["#8b7fa8","#2f2a44"],["#c7c2b8","#4a4640"]
];

function makeTile(p) {
  const d = document.createElement("div");
  d.className = "tile";
  d.tabIndex = 0;
  d.setAttribute("role", "button");
  d.innerHTML = `<img src="${p.src}" alt="${p.title || ""}" loading="lazy">` + (p.title ? `<span>${p.title}</span>` : "");
  d.onclick = () => openLb(p.src);
  d.onkeydown = e => { if (e.key === "Enter") openLb(p.src); };
  return d;
}

if (photos.length) {
  photos.forEach(p => grid.appendChild(makeTile(p)));
} else {
  placeholders.forEach(([a, b]) => {
    const d = document.createElement("div");
    d.className = "tile";
    d.style.setProperty("--c1", a);
    d.style.setProperty("--c2", b);
    grid.appendChild(d);
  });
}

const lb = document.getElementById("lb");
function openLb(src) { lb.querySelector("img").src = src; lb.classList.add("open"); }
lb.onclick = () => lb.classList.remove("open");
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });

// SHOP: edit prices here (in rupees). Add "digital" or "print" to a photo above to override its price.
const PRICES = { digital: 499, print: 1499 };
const WHATSAPP = "919686038031";
const rupees = n => "\u20B9" + Number(n).toLocaleString("en-IN");

const picker = document.getElementById("picker");
const buy = document.getElementById("buy");
const orderImg = document.getElementById("order-img");
const orderTitle = document.getElementById("order-title");
const radios = document.querySelectorAll('input[name="fmt"]');
let chosen = null;

function updateBuy() {
  const fmt = document.querySelector('input[name="fmt"]:checked');
  if (!chosen || !fmt) {
    buy.removeAttribute("href");
    buy.setAttribute("aria-disabled", "true");
    buy.textContent = chosen ? "Now choose a format" : "Choose a photo and format";
    return;
  }
  const type = fmt.value === "digital" ? "digital download" : "framed print";
  const price = chosen[fmt.value] ?? PRICES[fmt.value];
  const msg = `Hi Mruja, I'd like to buy "${chosen.title}" (${type}, ${rupees(price)}).`;
  buy.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  buy.target = "_blank"; buy.rel = "noopener";
  buy.setAttribute("aria-disabled", "false");
  buy.textContent = "Buy for " + rupees(price) + " on WhatsApp";
}

photos.forEach(p => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "thumb";
  b.setAttribute("aria-label", p.title || "Photo");
  b.innerHTML = `<img src="${p.src}" alt="" loading="lazy">`;
  b.onclick = () => {
    chosen = { ...p, title: p.title || "Untitled" };
    picker.querySelectorAll(".thumb").forEach(t => t.classList.remove("on"));
    b.classList.add("on");
    orderImg.src = p.src; orderImg.hidden = false;
    orderTitle.textContent = chosen.title;
    document.getElementById("p-digital").textContent = rupees(p.digital ?? PRICES.digital);
    document.getElementById("p-print").textContent = rupees(p.print ?? PRICES.print);
    radios.forEach(r => { r.disabled = false; });
    updateBuy();
  };
  picker.appendChild(b);
});
radios.forEach(r => r.addEventListener("change", updateBuy));
buy.addEventListener("click", e => { if (buy.getAttribute("aria-disabled") === "true") e.preventDefault(); });

// Image protection (deterrents only: a determined person can still capture what the screen shows)
document.addEventListener("contextmenu", e => { if (e.target.closest("img,.tile,.thumb,.order,.lightbox")) e.preventDefault(); });
document.addEventListener("dragstart", e => { if (e.target.tagName === "IMG") e.preventDefault(); });
document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && ["s","p","u"].includes(k)) e.preventDefault();
  if (k === "printscreen") { try { navigator.clipboard.writeText(" "); } catch (_) {} }
});
