# ElderCare Charity

A web application that supports healthy aging and community care — seniors and caregivers can book volunteer visits on a calendar, log health assessments with visual trends, read wellbeing resources, rate articles, find local support groups on a map, and contact a charity coordinator. Built with Vue 3 + Vite + Bootstrap 5.

> **Live deployment (Cloudflare Pages):** https://fit5032-2026-haishi-wang-36668303-a2-basicwebapp.pages.dev

## Features

- **User accounts & roles** — sign up / log in with Firebase Auth; roles (`Senior`, `Coordinator`, `Admin`) stored in Cloud Firestore and enforced by route guards.
- **Health Portal** — log MMSE assessments, view an interactive **MMSE score trend chart** (ECharts, with an alert line at 24), export a **PDF report**, and **email a CSV report** to a recipient.
- **Resources** — evidence-based articles with **interactive rating** and a rating-distribution chart; caregiver FAQ.
- **Community** — volunteer visit requests, **booking calendar** (FullCalendar with duplicate-conflict management), and local support groups.
- **Directory** — a sortable / searchable / paginated **interactive table** of local services (also used to view patient health data for coordinators).
- **Interactive Map** — Leaflet + OpenStreetMap with location search, driving directions, and reverse geocoding.
- **Admin Dashboard** — role-protected overview for the admin: total users, user types, site activity, and a searchable registered-user table.
- **Offline support (PWA)** — an offline banner, local save queue, and a Service Worker that precaches the site so it loads and navigates without a connection.
- **Serverless endpoints** — Cloudflare Pages Functions: health statistics (`/api/stats`), server-side CSV export (`/api/export`), and email with attachment (`/api/send-email`).
- **Accessibility** — WCAG 2.1 AA pass (skip links, landmarks, labels, ARIA live regions, keyboard focus styles).

## Tech Stack

Vue 3 (Options API) · Vite · Bootstrap 5 · Vue Router 4 · Firebase Auth + Firestore · ECharts (vue-echarts) · FullCalendar · Leaflet + OpenStreetMap (+ Photon / OSRM) · jsPDF · vite-plugin-pwa · Cloudflare Pages Functions · Resend (email)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Preview the Production Build (includes Service Worker for offline testing)

```sh
npm run preview
```

### Lint

```sh
npm run lint
```

## Configuration

- **Firebase** web config lives in `src/firebase.js` (Auth + Firestore project `fit5032-haishi-wang-a3`).
- **Email (Resend)** key is read by the serverless function from the `RESEND_API_KEY` environment variable — set it locally in `.dev.vars`, and in Cloudflare Pages under **Settings → Environment variables** for production.
- **Deployment settings (Cloudflare Pages)**: build command `npm run build`, output directory `dist`, keep the default deploy command, project connected to the Git repo with `wrangler.toml` at the repo root (Pages Functions live in `functions/`).

## Data Strategy

- **User accounts & roles** → Cloud Firestore (`users/{uid}`).
- **Business data** (bookings, requests, health records, ratings) → browser `localStorage`, so the app works offline; new/changed records are also mirrored to Firestore to back the interactive charts.
- **Offline queue** (`offline_action_queue`) records actions taken while offline; a banner reports "synced" when the connection returns.