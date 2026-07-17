const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const topButton = document.querySelector("[data-top]");
const cookieStorageKey = "saintTheklaCookieChoice";
const eventPopupImage = "assets/divine-liturgy-july-19-2026.jpg";

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

function createEventPopup() {
  const popup = document.createElement("section");
  popup.className = "event-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-label", "Divine Liturgy invitation");
  popup.innerHTML = `
    <div class="event-popup-dialog">
      <button type="button" class="event-popup-close" data-event-popup-close aria-label="Close popup">×</button>
      <img class="event-popup-image" src="${eventPopupImage}" alt="Saint Thekla Divine Liturgy invitation for Sunday July 19 2026 at 12:00 PM at Prince of Peace Catholic Church">
    </div>
  `;

  const closePopup = () => {
    popup.classList.add("is-hiding");
    document.body.classList.remove("has-event-popup");
    window.removeEventListener("keydown", handleKeydown);
    window.setTimeout(() => popup.remove(), 180);
  };

  function handleKeydown(event) {
    if (event.key === "Escape") closePopup();
  }

  popup.addEventListener("click", (event) => {
    if (event.target === popup || event.target.closest("[data-event-popup-close]")) {
      closePopup();
    }
  });

  document.body.appendChild(popup);
  document.body.classList.add("has-event-popup");
  window.requestAnimationFrame(() => popup.classList.add("is-visible"));
  window.addEventListener("keydown", handleKeydown);
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
createEventPopup();
createCookieBanner();
