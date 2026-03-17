# Google Forms Lite (monorepo)

Simplified Google Forms clone: create forms, fill them, view responses.

## Requirements

- Node.js (recommended: 18+)

## Install

From the repo root:

```bash
npm install
```

## Run (dev)

Runs GraphQL server and React client together:

```bash
npm run dev
```

- **Server**: `http://localhost:4000/` (GraphQL endpoint)
- **Client**: Vite will print the URL (usually `http://localhost:5173/`)

## Project structure

- `client`: React + TypeScript + Redux Toolkit (RTK Query) + React Router
- `server`: Node.js + Apollo GraphQL server (in-memory store)

## Notes

- Data is stored **in memory** (will reset after server restart).
- Optional env var for client:
  - `client/.env`: `VITE_GRAPHQL_URL=http://localhost:4000/`

