# Bulletin PDF Folder

Place bulletin PDF files in this folder.

Recommended file name format:

```text
YYYY-MM-DD-short-title.pdf
```

Example:

```text
2026-08-02-divine-liturgy.pdf
```

Then add a matching entry to `bulletins/data/bulletins.json`:

```json
{
  "date": "2026-08-02",
  "title": "Divine Liturgy Bulletin",
  "description": "Sunday Divine Liturgy bulletin.",
  "pdf": "assets/bulletins/2026-08-02-divine-liturgy.pdf"
}
```
