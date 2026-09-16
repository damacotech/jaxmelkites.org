FTP upload instructions
=======================

Upload the contents of this folder into the website public web root:

- index.html
- calendar.html
- bulletins.html
- bishop.html
- gallery.html
- styles.css
- script.js
- bulletins.js
- gallery.js
- assets/
- bulletins/
- requestprayer/
- gallery/
- tools/

Requested image usage:

- assets/header-banner.jpg is used as the top header/banner.
- assets/hero-emblem.jpg is used as the main hero picture.

Homepage updates included:

- Consistent official name: Saint Thekla Melkite Catholic Community.
- Conversion-first hero with liturgy time, location, Plan Your Visit, Get Directions, and Join Flocknote.
- Upcoming Divine Liturgy dates are generated automatically from the every-other-Sunday schedule so past dates disappear.
- Restored standalone Calendar page with Google Calendar embed.
- Added standalone Bulletins page with dated PDF preview.
- Restored standalone Bishop page with official Eparchy links.
- Separated Gallery page.
- First Time Visiting section.
- Short Melkite explanation and short bishop credibility section.
- Google Maps embed.
- Stay Connected and Support the Mission sections.

Facebook gallery sync
=====================

Static FTP hosting cannot safely call Facebook directly from a visitor's browser because the Meta access token must remain private.
This package includes a real sync workflow and 36 locally downloaded Page photos:

1. Get a Meta Graph API access token for an account that manages the Page, or use a Page access token.
2. From the ftp-site-v2 folder, run:

   FACEBOOK_PAGE_ID="100485784851211" FACEBOOK_ACCESS_TOKEN="your-token" node tools/facebook-gallery-sync.js

3. Upload the updated assets/facebook-gallery/ folder and gallery/data/photos.json by FTP.

The script securely derives a Page token in memory when given a managing user's token. It never writes the token to disk.
The public gallery reads gallery/data/photos.json and opens each locally hosted image in an on-site photo viewer.

Bulletin uploads
================

Static FTP hosting cannot list PDF files automatically, so each bulletin needs one data entry.

1. Upload the PDF into:

   assets/bulletins/

2. Use this filename pattern:

   YYYY-MM-DD-short-title.pdf

3. Add the bulletin to:

   bulletins/data/bulletins.json

Example:

[
  {
    "date": "2026-08-02",
    "title": "Divine Liturgy Bulletin",
    "description": "Sunday Divine Liturgy bulletin.",
    "pdf": "assets/bulletins/2026-08-02-divine-liturgy.pdf"
  }
]

The Bulletins page sorts entries by date and previews the selected PDF directly on the website.

Automatic GitHub updates
========================

The GitHub repository includes .github/workflows/sync-facebook-gallery.yml.
It checks Facebook every five minutes and commits only when the gallery changes.

In GitHub, add the token at:

Settings > Secrets and variables > Actions > New repository secret

Name the secret:

FACEBOOK_ACCESS_TOKEN

Never paste the access token into this website folder or commit it to Git.

Prayer requests
===============
Upload requestprayer/index.html with the updated HTML pages, styles.css, and script.js.
The /requestprayer address redirects to https://jaxmelkites.flocknote.com/signup/274375.
The fixed header includes a prayer button on every page, also visible with the mobile menu closed.
