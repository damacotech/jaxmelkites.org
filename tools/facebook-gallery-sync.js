#!/usr/bin/env node
/*
  Facebook gallery sync for static FTP hosting.

  Required environment variables:
    FACEBOOK_PAGE_ID
    FACEBOOK_ACCESS_TOKEN

  Optional:
    FACEBOOK_GRAPH_VERSION=v20.0
    FACEBOOK_PHOTO_LIMIT=60

  Run from the ftp-site-v2 folder:
    FACEBOOK_PAGE_ID="your-page-id" FACEBOOK_ACCESS_TOKEN="your-token" node tools/facebook-gallery-sync.js

  The script downloads Page photos into assets/facebook-gallery/ and writes gallery/data/photos.json.
*/

const fs = require("node:fs/promises");
const path = require("node:path");

const pageId = process.env.FACEBOOK_PAGE_ID;
const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const graphVersion = process.env.FACEBOOK_GRAPH_VERSION || "v20.0";
const limit = process.env.FACEBOOK_PHOTO_LIMIT || "60";

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

  const params = new URLSearchParams({
    type: "uploaded",
    fields: "id,name,created_time,images,link,album",
    limit,
    access_token: accessToken,
  });

  const url = `https://graph.facebook.com/${graphVersion}/${pageId}/photos?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Facebook API error ${response.status}: ${body}`);
  }

  const payload = await response.json();
  const photos = [];

  for (const photo of payload.data || []) {
    const bestImage = Array.isArray(photo.images) ? photo.images[0] : null;
    if (!bestImage?.source) continue;

    const src = await downloadImage(bestImage.source, photo.id);
    photos.push({
      src,
      caption: safeCaption(photo.name),
      facebookUrl: photo.link || `https://www.facebook.com/${photo.id}`,
      createdTime: photo.created_time || null,
      facebookId: photo.id,
    });
  }

  await fs.writeFile(dataFile, `${JSON.stringify(photos, null, 2)}\n`);
  console.log(`Synced ${photos.length} Facebook photos.`);
  console.log(`Wrote ${dataFile}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
