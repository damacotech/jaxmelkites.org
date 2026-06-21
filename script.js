const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const topButton = document.querySelector("[data-top]");
const cookieStorageKey = "saintTheklaCookieChoice";

function syncChrome() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  topButton.classList.toggle("is-visible", window.scrollY > 520);
}

function createCookieBanner() {
  if (localStorage.getItem(cookieStorageKey)) return;

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Cookie policy notice");
  banner.innerHTML = `
    <div>
      <strong>Cookie Policy</strong>
      <p>We use basic cookies and local storage to remember site preferences and improve your browsing experience.</p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-accept" data-cookie-choice="accepted">Accept</button>
      <button type="button" class="cookie-decline" data-cookie-choice="declined">Decline</button>
    </div>
  `;

  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie-choice]");
    if (!button) return;

    localStorage.setItem(cookieStorageKey, button.dataset.cookieChoice);
    banner.classList.add("is-hiding");
    window.setTimeout(() => banner.remove(), 220);
  });

  document.body.appendChild(banner);
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", syncChrome, { passive: true });
syncChrome();
createCookieBanner();
