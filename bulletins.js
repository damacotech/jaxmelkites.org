const bulletinsList = document.querySelector("[data-bulletins-list]");
let loadedBulletins = [];

function getI18n() {
  return window.saintTheklaI18n;
}

function t(value) {
  return getI18n()?.translate(value) || value;
}

function getBulletinLocale() {
  return getI18n()?.getLocale() || "en-US";
}

function parseBulletinDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatBulletinDate(value) {
  const date = parseBulletinDate(value);
  return date
    ? new Intl.DateTimeFormat(getBulletinLocale(), {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date)
    : t("Date not set");
}

function getBulletinFileName(bulletin) {
  const fallbackName = "saint-thekla-bulletin.pdf";
  const pathName = String(bulletin.pdf || "").split("/").pop();
  return pathName || fallbackName;
}

function normalizeBulletins(items) {
  return items
    .filter((item) => item && item.date && item.pdf)
    .sort((first, second) => {
      const firstDate = parseBulletinDate(first.date)?.getTime() || 0;
      const secondDate = parseBulletinDate(second.date)?.getTime() || 0;
      return secondDate - firstDate;
    });
}

function openAndDownloadBulletin(bulletin) {
  window.open(bulletin.pdf, "_blank", "noopener,noreferrer");

  const downloadLink = document.createElement("a");
  downloadLink.href = bulletin.pdf;
  downloadLink.download = getBulletinFileName(bulletin);
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

function createBulletinCard(bulletin, index) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  const details = document.createElement("span");
  const label = document.createElement("span");
  const date = document.createElement("time");
  const action = document.createElement("span");

  button.type = "button";
  button.className = "bulletin-card";
  button.setAttribute("aria-label", `${t("Open and download bulletin from")} ${formatBulletinDate(bulletin.date)}`);

  image.src = "./assets/hero-emblem.jpg";
  image.alt = "";
  image.loading = index === 0 ? "eager" : "lazy";

  details.className = "bulletin-card-details";
  label.textContent = index === 0 ? t("Latest bulletin") : t("Bulletin");
  date.textContent = formatBulletinDate(bulletin.date);
  date.dateTime = bulletin.date;
  action.className = "bulletin-card-action";
  action.textContent = t("Open PDF");

  details.append(label, date, action);
  button.append(image, details);
  button.addEventListener("click", () => openAndDownloadBulletin(bulletin));
  return button;
}

function renderBulletinCards() {
  if (!bulletinsList || loadedBulletins.length === 0) return;
  bulletinsList.replaceChildren(...loadedBulletins.map((bulletin, index) => createBulletinCard(bulletin, index)));
}

async function loadBulletins() {
  if (!bulletinsList) return;

  try {
    const response = await fetch("./bulletins/data/bulletins.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Bulletin data not found");

    loadedBulletins = normalizeBulletins(await response.json());
    renderBulletinCards();
  } catch (error) {
    bulletinsList.innerHTML = `
      <article class="bulletin-empty">
        <h3>${t("Bulletins temporarily unavailable.")}</h3>
        <p>${t("The bulletin archive could not be loaded.")}</p>
      </article>
    `;
  }
}

window.addEventListener("saintthekla:languagechange", renderBulletinCards);
loadBulletins();
