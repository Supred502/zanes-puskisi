
## Copilot Instructions — zanes-puskisi

Short, actionable guide to get an AI coding agent productive in this CRA + Firebase repo.

Overview

- Tech: Create React App (React 19), Tailwind CSS, Firebase (Auth, Firestore, Storage).
- Styling is Tailwind-first; global utilities in `src/styles/index.css`.
- Firebase client code and helpers: `src/firebase/firebase.js` (no secrets here).

Big picture

- App entry: `src/index.js` → `src/App.js`. Main composed parts: `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`, `ProductModal`.
- Realtime data: `ProductsGrid` listens to `products` docs and the `products/{id}/likes` subcollection for like counts.
- Comments are stored in a flat `comments` collection and queried by `productId` (see `CommentsSection.js`).

Firestore model (quick)

- `products` doc fields: `name, description, price, imageURL, available, holidaySpecial, createdAt`.
- Likes: `products/{productId}/likes/{uid}` — presence = liked (UI counts via snapshot).
- Comments: collection `comments` documents: `{ productId, name, message, createdAt }`.
- `inspirations`: separate collection used by `InspirationsGrid.js`.

Key files to inspect

- `src/firebase/firebase.js` — init + helpers used across components.
- `src/components/ProductsGrid.js` — realtime listing + like toggle pattern.
- `src/components/ProductModal.js` & `CommentsSection.js` — product detail + comment reads/writes.
- `src/components/AdminPanel.js` — auth-guarded uploads (uses `getStorage()`, `uploadBytes`, `getDownloadURL`).
- `seedFirestore.js` — example documents you can use to seed Firestore locally.

Developer workflows

- Start dev server: `npm start` (CRA dev server at `http://localhost:3000`).
- Run tests: `npm test` (watch mode). Tests live under `src/components/__tests__`.
- Build: `npm run build` → `build/`.
- Deploy hosting: `firebase deploy --only hosting` (build first).
- Local seed: `node seedFirestore.js` — update the config at top of that file to point to your Firebase project.

Project conventions & guardrails

- Tailwind-first: prefer utility classes in JSX, not new global CSS unless necessary.
- Preserve Firestore schema & collection names; do not change `products`, `comments`, `inspirations`, or the `likes` subcollection without approval.
- Use `serverTimestamp()` for `createdAt` when writing documents.
- `AdminPanel` is client‑auth gated (`onAuthStateChanged`). Don’t hardcode or commit admin credentials.

Common code snippets

- Post comment: `addDoc(collection(db, 'comments'), { productId, name, message, createdAt: serverTimestamp() })`.
- Like toggle: create/delete `doc(db, 'products', id, 'likes', uid)` — see `ProductsGrid.js` for exact pattern.
- Upload flow: `getStorage()` → `uploadBytes()` → `getDownloadURL()` → write `imageURL` to `products` doc.

Agent rules

- Keep changes small and focused (one feature per PR). Add dependency entries to `package.json` with rationale.
- Never add server-side secrets or Admin SDK credentials to the repo.

Where to start (fast path)

- Open `src/App.js` → follow imports to `src/components/*` to understand UI composition.
- Inspect `src/firebase/firebase.js` for initialization details.
- Read `src/components/ProductsGrid.js` and `src/components/AdminPanel.js` to learn realtime + upload patterns.

If anything is missing or you want the instructions tuned for tests/CI/seeding, tell me which area to expand.
