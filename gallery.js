const galleryRoot = document.querySelector("[data-gallery]");

async function loadGallery() {
  if (!galleryRoot) return;

  try {
    const response = await fetch("./gallery/data/photos.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Gallery data not found");

    const photos = await response.json();
    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error("Gallery data is empty");
    }

    galleryRoot.innerHTML = photos
      .map((photo) => {
        const caption = photo.caption || "Saint Thekla community photo";
        const link = photo.facebookUrl || photo.src;
        return `
          <a class="gallery-photo" href="${link}" target="_blank" rel="noopener noreferrer">
            <img src="${photo.src}" alt="${caption}" loading="lazy">
            <span>${caption}</span>
          </a>
        `;
      })
      .join("");
  } catch (error) {
    galleryRoot.innerHTML = `
      <div class="gallery-empty">
        <h3>Gallery is ready for Facebook photos.</h3>
        <p>Run <code>tools/facebook-gallery-sync.js</code> to pull photos from the Facebook Page and generate <code>gallery/data/photos.json</code>.</p>
      </div>
    `;
  }
}

loadGallery();
