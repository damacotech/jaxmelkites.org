FTP upload instructions
=======================

Upload the contents of this folder into the website public web root:

- index.html
- calendar.html
- bishop.html
- gallery.html
- styles.css
- script.js
- gallery.js
- assets/
- gallery/
- tools/

Requested image usage:

- assets/header-banner.jpg is used as the top header/banner.
- assets/hero-emblem.jpg is used as the main hero picture.

Homepage updates included:

- Consistent official name: Saint Thekla Melkite Catholic Community.
- Conversion-first hero with liturgy time, location, Plan Your Visit, Get Directions, and Join Flocknote.
- Upcoming Divine Liturgy dates from the public Google Calendar feed as of June 16, 2026.
- Restored standalone Calendar page with Google Calendar embed.
- Restored standalone Bishop page with official Eparchy links.
- Separated Gallery page.
- First Time Visiting section.
- Short Melkite explanation and short bishop credibility section.
- Google Maps embed.
- Stay Connected and Support the Mission sections.

Facebook gallery sync
=====================

Static FTP hosting cannot safely call Facebook directly from a visitor's browser because the Meta access token must remain private.
This package includes a real sync workflow instead:

1. Get a Meta Graph API Page access token for the church Facebook Page.
2. From the ftp-site-v2 folder, run:

   FACEBOOK_PAGE_ID="your-page-id" FACEBOOK_ACCESS_TOKEN="your-token" node tools/facebook-gallery-sync.js

3. Upload the updated assets/facebook-gallery/ folder and gallery/data/photos.json by FTP.

The public gallery page reads gallery/data/photos.json and displays those downloaded photos.
