# AGENTS.md

## Purpose
This repository is a React + Vite frontend application for Condo Swift. It contains only the client-side code under `src/` and does not include backend server implementation.

## Key facts for agents
- Frontend framework: React 19 + Vite
- Styling: Tailwind CSS v4 + daisyUI
- Routing: React Router v7
- Map UI: Leaflet via `react-leaflet`
- Auth: JWT stored by `TokenService` and managed by `src/context/AuthContext.jsx`
- API: Axios instance in `src/services/api.js` with `VITE_BASE_URL` or default to `https://condo-swift.onrender.com`

## Build & run commands
- `npm install`
- `npm run dev` — start local development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run deploy` — deploy via `gh-pages`

## Most important files and folders
- `src/main.jsx` — app bootstrapping and `AuthProvider`
- `src/context/AuthContext.jsx` — auth state, login/logout, JWT decoding
- `src/services/api.js` — shared axios client, request auth interceptor
- `src/services/*.js` — service helpers for announcements, user, badges, notifications, etc.
- `src/routers/index.jsx` — route definitions and nested route structure
- `src/components/RequireAuth.jsx` — route guard for authenticated access
- `src/components/RequireRole.jsx`, `src/components/RequireVerification.jsx` — role and verification guards
- `src/pages/announcement/*` — announcement add/edit/detail flows
- `src/components/AddressMapPreview.jsx` — location search and map pin selection

## Conventions
- Keep changes focused on frontend behavior; backend contract is inferred from service wrappers and API paths.
- Use existing service helper patterns for API calls instead of introducing raw `fetch` in page components.
- Prefer reading `src/components/AddressMapPreview.jsx` when working on map/geocoding/search issues.
- Authentication and role-based routing use `useAuthContext()`.

## Notes
- There is a `.env` file with `VITE_GOOGLEMAP_API=` but it is currently empty.
- The app uses public geocoding via AddressMapPreview; network or provider restrictions may affect search.
- `README.md` is generic Vite template documentation and not project-specific.
