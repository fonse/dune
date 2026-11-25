# Atreides Ledger

A private, in-memory companion for tracking the treachery cards revealed and won during a Dune board game. No account, backend, or browser storage is used; refreshing the page starts a fresh ledger.

## Run locally

- Use Node.js 18 or newer.
- Install dependencies with `npm install`.
- Start the development server with `npm run dev`.
- Create a production build with `npm run build`.

Choose a card when it enters auction, then assign it to the winning faction. Use the remove control on a hand card when it is discarded.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that builds and deploys the site on every push to `master`. In the GitHub repository, open **Settings → Pages** and set the publishing source to **GitHub Actions**. After the workflow completes, the site will be available at `https://fonse.github.io/dune/`.
