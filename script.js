const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const topButton = document.querySelector("[data-top]");
const cookieStorageKey = "saintTheklaCookieChoice";
const eventPopupImage = "assets/paraklesis-service-august-1-2026.jpg";
const eventPopupExpiresAt = Date.parse("2026-08-02T00:00:00-04:00");
const liturgyAnchorDate = "2026-06-21";
const liturgyIntervalDays = 14;
const liturgyTimeLabel = "12:00 PM";
const liturgyLocation = "Prince of Peace Catholic Church, 6320 Bennett Rd, Jacksonville, FL 32216";

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const weekdayDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

function syncChrome() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  topButton.classList.toggle("is-visible", window.scrollY > 520);
}

function createLocalDate(dateString, hour = 12) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, hour, 0, 0);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatCalendarDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function createCalendarUrl(date) {
  const datePart = formatCalendarDate(date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Saint Thekla Divine Liturgy",
    dates: `${datePart}T120000/${datePart}T130000`,
    ctz: "America/New_York",
    details: "Melkite Catholic Divine Liturgy with Saint Thekla Melkite Catholic Community.",
    location: liturgyLocation,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getUpcomingLiturgies(count) {
  const now = new Date();
  const upcoming = [];
  let candidate = createLocalDate(liturgyAnchorDate);

  while (candidate < now) {
    candidate = addDays(candidate, liturgyIntervalDays);
  }

  for (let index = 0; index < count; index += 1) {
    upcoming.push(new Date(candidate));
    candidate = addDays(candidate, liturgyIntervalDays);
  }

  return upcoming;
}

function renderUpcomingLiturgies() {
  const dateLists = document.querySelectorAll("[data-upcoming-liturgies]");
  const highestCount = Math.max(1, ...Array.from(dateLists, (list) => Number(list.dataset.count) || 4));
  const upcoming = getUpcomingLiturgies(highestCount);
  const nextLiturgy = upcoming[0];

  document.querySelectorAll("[data-next-liturgy-label]").forEach((element) => {
    element.textContent = "Next Divine Liturgy";
  });

  document.querySelectorAll("[data-next-liturgy-short]").forEach((element) => {
    element.textContent = `${shortDateFormatter.format(nextLiturgy)} • ${liturgyTimeLabel}`;
  });

  document.querySelectorAll("[data-next-liturgy-day]").forEach((element) => {
    element.textContent = weekdayDateFormatter.format(nextLiturgy);
  });

  document.querySelectorAll("[data-next-liturgy-calendar]").forEach((element) => {
    element.setAttribute("href", createCalendarUrl(nextLiturgy));
  });

  dateLists.forEach((list) => {
    const count = Number(list.dataset.count) || 4;
    list.innerHTML = upcoming
      .slice(0, count)
      .map(
        (date, index) => `
          <article>
            <span>${index === 0 ? "Next" : "Upcoming"}</span>
            <strong>${fullDateFormatter.format(date)}</strong>
            <small>${liturgyTimeLabel}</small>
          </article>
        `,
      )
      .join("");
  });
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
  const eventPopupExpiresIn = eventPopupExpiresAt - Date.now();
  if (eventPopupExpiresIn <= 0) return;

  const popup = document.createElement("section");
  popup.className = "event-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-label", "Paraklesis Service invitation");
  popup.innerHTML = `
    <div class="event-popup-dialog">
      <button type="button" class="event-popup-close" data-event-popup-close aria-label="Close popup">×</button>
      <img class="event-popup-image" src="${eventPopupImage}" alt="Saint Thekla Paraklesis Service invitation for Saturday August 1 2026 at 6:30 PM at Christ the Prince of Peace">
    </div>
  `;

  let expirationTimer;
  let isClosing = false;

  const closePopup = () => {
    if (isClosing) return;
    isClosing = true;
    window.clearTimeout(expirationTimer);
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
  expirationTimer = window.setTimeout(closePopup, eventPopupExpiresIn);
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
renderUpcomingLiturgies();
createEventPopup();
createCookieBanner();
