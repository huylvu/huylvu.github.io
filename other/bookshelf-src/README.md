# Personal Bookshelf Source

This folder stores the source code of the personal bookshelf page shown at:

- `/other/bookshelf`

## Update your reading list

Edit data in:

- `src/books.js`

Each shelf has:

- `name`: shelf label
- `items`: papers/books in that shelf

Each item includes:

- `title`, `author`, `year`, `source`, `type`
- `pages` (controls spine width/height)
- `rating` (star count on spine)
- `link` (optional external URL)
- `mainMessage`, `abstract` (shown when clicked)

## Build and deploy to website

From this directory:

```bash
npm install
npm run build -- --base /other/bookshelf/
rm -rf ../bookshelf/*
cp -R dist/* ../bookshelf/
```
