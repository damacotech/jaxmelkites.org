const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const topButton = document.querySelector("[data-top]");
const cookieStorageKey = "saintTheklaCookieChoice";
const eventPopupStorageKey = "saintTheklaFathersDayPopupSeen";
const eventPopupUrl = "https://www.facebook.com/share/p/1AyU4TMmQG/?mibextid=wwXIfr";

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
  const eventExpiresAt = new Date("2026-06-21T03:59:59-04:00");
  if (new Date() > eventExpiresAt || sessionStorage.getItem(eventPopupStorageKey)) return;

  const popup = document.createElement("section");
  popup.className = "event-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-labelledby", "event-popup-title");
  popup.innerHTML = `
    <div class="event-popup-card">
      <button class="event-popup-close" type="button" aria-label="Close Father's Day Party popup" data-event-close>&times;</button>
      <img src="./assets/fathers-day-party.jpg" alt="Father's Day Party flyer for Saint Thekla Melkite Catholic Community on Saturday June 20 at 8:00 PM." />
      <div class="event-popup-copy">
        <h2 id="event-popup-title">Father's Day Party</h2>
        <p>Saturday, June 20 at 8:00 PM at Prince of Peace Catholic Church Hall.</p>
        <div class="event-popup-actions">
          <a class="button primary" href="${eventPopupUrl}" target="_blank" rel="noopener noreferrer" data-event-info>More Info</a>
          <button class="button outline" type="button" data-event-close>Close</button>
        </div>
      </div>
    </div>
  `;

  function closePopup() {
    sessionStorage.setItem(eventPopupStorageKey, "dismissed");
    document.body.classList.remove("has-event-popup");
    popup.classList.add("is-hiding");
    window.setTimeout(() => popup.remove(), 180);
  }

  popup.addEventListener("click", (event) => {
    if (event.target === popup || event.target.closest("[data-event-close], [data-event-info]")) {
      closePopup();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.contains(popup)) {
      closePopup();
    }
  });

  document.body.classList.add("has-event-popup");
  document.body.appendChild(popup);
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
