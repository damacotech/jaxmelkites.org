const galleryRoot = document.querySelector("[data-gallery]");
const galleryCount = document.querySelector("[data-gallery-count]");
const lightbox = document.querySelector("[data-gallery-lightbox]");
const lightboxImage = document.querySelector("[data-gallery-lightbox-image]");
const lightboxCaption = document.querySelector("[data-gallery-lightbox-caption]");
const lightboxDate = document.querySelector("[data-gallery-lightbox-date]");
let galleryPhotos = [];
let activePhotoIndex = 0;

function getI18n() {
  return window.saintTheklaI18n;
}

function t(value) {
  return getI18n()?.translate(value) || value;
}

function getGalleryLocale() {
  return getI18n()?.getLocale() || "en-US";
}

function formatDate(value) {
  if (!value) return t("Saint Thekla community");
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? t("Saint Thekla community")
    : new Intl.DateTimeFormat(getGalleryLocale(), {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

function displayCaption(value) {
  const caption = value || t("Saint Thekla community photo");
  if (caption === t("Saint Thekla community photo")) {
    return t("Community life at Saint Thekla");
  }
  if (caption.length <= 120) return caption;

  const shortened = caption.slice(0, 117);
  const finalSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, finalSpace > 80 ? finalSpace : 117)}...`;
}

function updateLightbox(index) {
  const photo = galleryPhotos[index];
  if (!photo) return;

  activePhotoIndex = index;
  lightboxImage.src = photo.src;
  lightboxImage.alt = displayCaption(photo.caption);
  lightboxCaption.textContent = photo.caption || t("Saint Thekla community photo");
  lightboxDate.textContent = formatDate(photo.createdTime);
  lightboxDate.dateTime = photo.createdTime || "";
}

function openLightbox(index) {
  updateLightbox(index);
  lightbox.hidden = false;
  document.body.classList.add("gallery-open");
  document.querySelector("[data-gallery-close]")?.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("gallery-open");
  galleryRoot
    ?.querySelector(`[data-gallery-index="${activePhotoIndex}"]`)
    ?.focus();
}

function moveLightbox(direction) {
  const nextIndex =
    (activePhotoIndex + direction + galleryPhotos.length) %
    galleryPhotos.length;
  updateLightbox(nextIndex);
}

function createPhotoCard(photo, index) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  const details = document.createElement("span");
  const caption = document.createElement("strong");
  const date = document.createElement("time");

  button.type = "button";
  button.className = "gallery-photo";
  button.dataset.galleryIndex = String(index);
  button.setAttribute("aria-label", `${t("Open photo:")} ${displayCaption(photo.caption)}`);

  image.src = photo.src;
  image.alt = displayCaption(photo.caption);
  image.loading = index < 6 ? "eager" : "lazy";

  details.className = "gallery-photo-details";
  caption.textContent = displayCaption(photo.caption);
  caption.dir = "auto";
  date.textContent = formatDate(photo.createdTime);
  date.dateTime = photo.createdTime || "";

  details.append(caption, date);
  button.append(image, details);
  button.addEventListener("click", () => openLightbox(index));
  return button;
}

function formatGalleryCount(count) {
  const formattedCount = new Intl.NumberFormat(getGalleryLocale()).format(count);
  if (getI18n()?.getLanguage() === "ar") {
    return `${formattedCount} صورة من حياة الجماعة`;
  }
  return `${formattedCount} ${t("community photos")}`;
}

function renderGalleryPhotos() {
  if (!galleryRoot || galleryPhotos.length === 0) return;

  galleryRoot.replaceChildren(
    ...galleryPhotos.map((photo, index) => createPhotoCard(photo, index)),
  );
  if (galleryCount) {
    galleryCount.textContent = formatGalleryCount(galleryPhotos.length);
  }
  if (lightbox && !lightbox.hidden) updateLightbox(activePhotoIndex);
}

async function loadGallery() {
  if (!galleryRoot) return;

  try {
    const response = await fetch("./gallery/data/photos.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Gallery data not found");

    galleryPhotos = await response.json();
    if (!Array.isArray(galleryPhotos) || galleryPhotos.length === 0) {
      throw new Error("Gallery data is empty");
    }

    renderGalleryPhotos();
  } catch (error) {
    galleryRoot.innerHTML = `
      <div class="gallery-empty">
        <h3>${t("Gallery temporarily unavailable.")}</h3>
        <p>${t("The local photo gallery is temporarily unavailable.")}</p>
      </div>
    `;
    if (galleryCount) galleryCount.textContent = t("Community gallery");
  }
}

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest("[data-gallery-close]")) {
    closeLightbox();
  } else if (event.target.closest("[data-gallery-previous]")) {
    moveLightbox(-1);
  } else if (event.target.closest("[data-gallery-next]")) {
    moveLightbox(1);
  }
});

window.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

window.addEventListener("saintthekla:languagechange", renderGalleryPhotos);
loadGallery();
