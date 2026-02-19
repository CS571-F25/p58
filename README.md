# Clash Cache

Clash Cache is a React + Vite web app for exploring Clash Royale deck and leaderboard data, backed by Firebase Cloud Functions and Firestore.

## 🖼️ App Preview

> Replace this placeholder with a screenshot of your app.

![App screenshot placeholder](./docs/app-screenshot.png)

## Features

- Browse deck-related pages (`Explore`, `Build`, and `Cache`).
- View leaderboard experiences (`Global` and `Friends`).
- Serve data through Firebase HTTP endpoints.
- Keep top-player leaderboard and deck data refreshed with scheduled Cloud Functions.

## Tech Stack

- **Frontend:** React, Vite, React Router, React Bootstrap
- **Backend:** Firebase Cloud Functions (Node.js)
- **Database:** Firestore

## Project Structure

- `src/` – React app source code
- `functions/` – Firebase Cloud Functions for data ingestion and APIs
- `public/` – Static assets
- `docs/` – Generated/static deployment assets

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Firebase CLI (for backend deployment)

### Install dependencies

```bash
npm install
cd functions && npm install
```

### Run frontend locally

```bash
npm run dev
```

### Build frontend

```bash
npm run build
```

## Firebase Functions Notes

The backend uses a secret API key for Clash Royale API access:

- `CLASH_API_KEY`

Set it with Firebase CLI before deploying functions:

```bash
firebase functions:secrets:set CLASH_API_KEY
```

## Available Scripts (root)

- `npm run dev` – Start Vite dev server
- `npm run build` – Build production frontend
- `npm run preview` – Preview production build locally

## License

Add your preferred license details here.
