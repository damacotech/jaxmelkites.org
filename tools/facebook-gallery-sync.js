#!/usr/bin/env node
/*
  Facebook gallery sync for static FTP hosting.

  Required environment variables:
    FACEBOOK_PAGE_ID
    FACEBOOK_ACCESS_TOKEN (Page token or a user token that manages the Page)

  Optional:
    FACEBOOK_GRAPH_VERSION=v24.0
    FACEBOOK_PHOTO_LIMIT=36

  Run from the ftp-site-v2 folder:
    FACEBOOK_PAGE_ID="your-page-id" FACEBOOK_ACCESS_TOKEN="your-token" node tools/facebook-gallery-sync.js

  The script downloads Page photos into assets/facebook-gallery/ and writes gallery/data/photos.json.
*/

const fs = require("node:fs/promises");
const path = require("node:path");

const pageId = process.env.FACEBOOK_PAGE_ID;
const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const graphVersion = process.env.FACEBOOK_GRAPH_VERSION || "v24.0";
const limit = Number(process.env.FACEBOOK_PHOTO_LIMIT || "36");

if (!pageId || !accessToken) {
  console.error("Missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN.");
  process.exit(1);
}

const outputDir = path.join(process.cwd(), "assets", "facebook-gallery");
const dataFile = path.join(process.cwd(), "gallery", "data", "photos.json");

function extensionFromContentType(contentType) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  return "jpg";
}

function safeCaption(text) {
  return (text || "Saint Thekla community photo").replace(/\s+/g, " ").trim();
}

async function graphRequest(resource, params, token) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${resource}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Facebook API error ${response.status}: ${payload.error?.message || "Unknown error"}`,
    );
  }

  return payload;
}

async function resolvePageAccess() {
  const page = await graphRequest(
    pageId,
    { fields: "id,name,link" },
    accessToken,
  );

  try {
    const accounts = await graphRequest(
      "me/accounts",
      { fields: "id,name,access_token", limit: 100 },
      accessToken,
    );
    const managedPage = (accounts.data || []).find(
      (account) => account.id === page.id,
    );
    if (managedPage?.access_token) {
      return { page, token: managedPage.access_token };
    }
  } catch {
    // A Page token cannot query /me/accounts, so use it directly.
  }

  return { page, token: accessToken };
}

function selectGalleryImage(images) {
  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    images.find((image) => image.width <= 1600 && image.width >= 1000) ||
    images.find((image) => image.width <= 1600) ||
    images[0]
  );
}

async function downloadImage(url, filenameBase) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image download failed: ${response.status}`);

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const extension = extensionFromContentType(contentType);
  const filename = `${filenameBase}.${extension}`;
  const diskPath = path.join(outputDir, filename);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(diskPath, buffer);
  return `assets/facebook-gallery/${filename}`;
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.dirname(dataFile), { recursive: true });

  const { page, token: pageToken } = await resolvePageAccess();
  const payload = await graphRequest(
    `${page.id}/photos`,
    {
      type: "uploaded",
      fields: "id,name,created_time,images,link,album",
      limit,
    },
    pageToken,
  );

  if (!Array.isArray(payload.data) || payload.data.length === 0) {
    throw new Error(
      "Facebook returned no Page photos. Existing gallery files were left unchanged.",
    );
  }

  const photos = [];

  for (const photo of payload.data) {
    const bestImage = selectGalleryImage(photo.images);
    if (!bestImage?.source) continue;

    const src = await downloadImage(bestImage.source, photo.id);
    photos.push({
      src,
      caption: safeCaption(photo.name),
      facebookUrl: photo.link || `https://www.facebook.com/${photo.id}`,
      createdTime: photo.created_time || null,
      facebookId: photo.id,
      width: bestImage.width || null,
      height: bestImage.height || null,
    });
  }

  if (photos.length === 0) {
    throw new Error(
      "Facebook photos did not contain downloadable images. Existing gallery data was left unchanged.",
    );
  }

  const currentFiles = await fs.readdir(outputDir);
  const keepFiles = new Set(photos.map((photo) => path.basename(photo.src)));
  await Promise.all(
    currentFiles
      .filter((filename) => !keepFiles.has(filename))
      .map((filename) => fs.unlink(path.join(outputDir, filename))),
  );

  await fs.writeFile(dataFile, `${JSON.stringify(photos, null, 2)}\n`);
  console.log(`Synced ${photos.length} Facebook photos from ${page.name}.`);
  console.log(`Wrote ${dataFile}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
