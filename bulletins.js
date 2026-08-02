const bulletinsList = document.querySelector("[data-bulletins-list]");
const previewModal = document.querySelector("[data-bulletin-modal]");
const previewFrame = document.querySelector("[data-bulletin-preview]");
const previewTitle = document.querySelector("[data-bulletin-preview-title]");
const previewDate = document.querySelector("[data-bulletin-preview-date]");
const previewDownload = document.querySelector("[data-bulletin-download]");
const previewClose = document.querySelector("[data-bulletin-close]");
let activeBulletinButton = null;

const bulletinDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function parseBulletinDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatBulletinDate(value) {
  const date = parseBulletinDate(value);
  return date ? bulletinDateFormatter.format(date) : "Date not set";
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

function openBulletin(bulletin, button) {
  const title = bulletin.title || "Parish Bulletin";
  const date = formatBulletinDate(bulletin.date);

  previewTitle.textContent = title;
  previewDate.textContent = date;
  previewFrame.src = bulletin.pdf;
  previewDownload.href = bulletin.pdf;

  bulletinsList
    .querySelectorAll(".bulletin-card.is-active")
    .forEach((activeButton) => activeButton.classList.remove("is-active"));

  button.classList.add("is-active");
  activeBulletinButton = button;
  previewModal.hidden = false;
  document.body.classList.add("bulletin-open");
  previewClose?.focus();
}

function closeBulletin() {
  if (!previewModal || previewModal.hidden) return;

  previewModal.hidden = true;
  previewFrame.src = "";
  document.body.classList.remove("bulletin-open");
  activeBulletinButton?.focus();
}

function createBulletinCard(bulletin, index) {
  const button = document.createElement("button");
  const preview = document.createElement("span");
  const eyebrow = document.createElement("span");
  const title = document.createElement("strong");
  const date = document.createElement("time");
  const description = document.createElement("small");
  const action = document.createElement("span");

  button.type = "button";
  button.className = "bulletin-card";
  button.setAttribute("aria-label", `Preview ${bulletin.title || "bulletin"} from ${formatBulletinDate(bulletin.date)}`);

  preview.className = "bulletin-card-preview";
  preview.textContent = "PDF";

  eyebrow.textContent = index === 0 ? "Latest" : "Bulletin";
  title.textContent = bulletin.title || "Parish Bulletin";
  date.textContent = formatBulletinDate(bulletin.date);
  date.dateTime = bulletin.date;
  description.textContent = bulletin.description || "Preview or download the PDF bulletin.";
  action.className = "bulletin-card-action";
  action.textContent = "Open preview";

  button.append(preview, eyebrow, title, date, description, action);
  button.addEventListener("click", () => openBulletin(bulletin, button));
  return button;
}

async function loadBulletins() {
  if (!bulletinsList) return;

  try {
    const response = await fetch("./bulletins/data/bulletins.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Bulletin data not found");

    const bulletins = normalizeBulletins(await response.json());
    if (bulletins.length === 0) return;

    const cards = bulletins.map(createBulletinCard);
    bulletinsList.replaceChildren(...cards);
  } catch (error) {
    bulletinsList.innerHTML = `
      <article class="bulletin-empty">
        <h3>Bulletins temporarily unavailable.</h3>
        <p>The bulletin archive could not be loaded.</p>
      </article>
    `;
  }
}

previewModal?.addEventListener("click", (event) => {
  if (event.target === previewModal || event.target.closest("[data-bulletin-close]")) {
    closeBulletin();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBulletin();
});

loadBulletins();
