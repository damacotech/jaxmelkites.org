const bulletinsList = document.querySelector("[data-bulletins-list]");
const previewEmpty = document.querySelector("[data-bulletin-empty]");
const previewContent = document.querySelector("[data-bulletin-preview-content]");
const previewFrame = document.querySelector("[data-bulletin-preview]");
const previewTitle = document.querySelector("[data-bulletin-preview-title]");
const previewDate = document.querySelector("[data-bulletin-preview-date]");
const previewDownload = document.querySelector("[data-bulletin-download]");

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

function selectBulletin(bulletin, button) {
  const title = bulletin.title || "Parish Bulletin";
  const date = formatBulletinDate(bulletin.date);

  previewEmpty.hidden = true;
  previewContent.hidden = false;
  previewTitle.textContent = title;
  previewDate.textContent = date;
  previewFrame.src = bulletin.pdf;
  previewDownload.href = bulletin.pdf;

  bulletinsList
    .querySelectorAll(".bulletin-card.is-active")
    .forEach((activeButton) => activeButton.classList.remove("is-active"));

  button.classList.add("is-active");
}

function createBulletinCard(bulletin, index) {
  const button = document.createElement("button");
  const eyebrow = document.createElement("span");
  const title = document.createElement("strong");
  const date = document.createElement("time");
  const description = document.createElement("small");

  button.type = "button";
  button.className = "bulletin-card";
  button.setAttribute("aria-label", `Preview ${bulletin.title || "bulletin"} from ${formatBulletinDate(bulletin.date)}`);

  eyebrow.textContent = index === 0 ? "Latest" : "Bulletin";
  title.textContent = bulletin.title || "Parish Bulletin";
  date.textContent = formatBulletinDate(bulletin.date);
  date.dateTime = bulletin.date;
  description.textContent = bulletin.description || "Preview or download the PDF bulletin.";

  button.append(eyebrow, title, date, description);
  button.addEventListener("click", () => selectBulletin(bulletin, button));
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
    selectBulletin(bulletins[0], cards[0]);
  } catch (error) {
    bulletinsList.innerHTML = `
      <article class="bulletin-empty">
        <h3>Bulletins temporarily unavailable.</h3>
        <p>The bulletin archive could not be loaded.</p>
      </article>
    `;
  }
}

loadBulletins();
