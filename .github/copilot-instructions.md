## Copilot Instructions — zanes-puskisi

Short, actionable guidance to get an AI coding agent productive in this CRA + Firebase repo.

Overview

- Tech: Create React App (React 19), Tailwind CSS, Firebase (Auth, Firestore, Storage).
- Styling is Tailwind-first: `postcss.config.cjs`, `tailwind.config.cjs`, global CSS in `src/styles/index.css`.
- Firebase client code and helpers live in `src/firebase/firebase.js` (no server secrets in repo).

Big picture

- App entry: `src/index.js` → `src/App.js`. `App` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`, and `ProductModal`.
- Data flows:
  - `ProductsGrid.js` uses Firestore realtime listeners to show product data and counts from the `products/{id}/likes` subcollection.
  - Comments are stored in a flat `comments` collection and queried by `productId` in `CommentsSection.js`.
  - `AdminPanel.js` performs image uploads (Firebase Storage) and writes `imageURL` to `products` docs.

Firestore model (see `seedFirestore.js` for examples)

- `products` documents: `name`, `description`, `price`, `imageURL`, `available`, `holidaySpecial`, `createdAt`.
- Likes: `products/{productId}/likes/{uid}` — a document's existence indicates a like; UI counts via snapshot listeners.
- Comments: flat collection `{ productId, name, message, createdAt }`, queried with `where('productId','==', id)` + `orderBy('createdAt','desc')`.
- `inspirations`: separate collection used by `InspirationsGrid.js`.

Key files & patterns

- `src/firebase/firebase.js`: initialization and small helpers used across components.
- `src/components/ProductsGrid.js`: real-time product listing, likes handling, listens to subcollection snapshots.
- `src/components/ProductModal.js`: product details + comments hook-up.
- `src/components/CommentsSection.js`: reads/writes `comments` collection and shows recent messages.
- `src/components/AdminPanel.js`: guarded by `onAuthStateChanged`, handles uploads via `getStorage()`.

Developer workflows (commands)

- Start dev server: `npm start` (CRA dev server at `http://localhost:3000`).
- Run tests: `npm test` (watch mode). Use after editing components with tests.
- Build for deployment: `npm run build` → `build/` directory.
- Deploy hosting: `firebase deploy --only hosting` (run `npm run build` first).
- Seed Firestore locally: `node seedFirestore.js` — update config inside that file to point to your Firebase project.

Project-specific conventions

- Tailwind-first: prefer adding utility classes in JSX components rather than creating new global CSS rules. See `src/styles/index.css` for base utilities.
- Firestore naming: preserve `products`, `inspirations`, `comments`, and the `products/{id}/likes` subcollection pattern.
- Timestamps: use `serverTimestamp()` for `createdAt` when writing documents.
- Auth gating: `AdminPanel.js` relies on `onAuthStateChanged` — avoid bypassing client auth checks in UI-only logic.

Concrete examples (copy/paste-ready)

- Toggle like (create/delete doc): see `src/components/ProductsGrid.js` for implementation pattern.
- Post comment: `addDoc(collection(db, 'comments'), { productId, name, message, createdAt: serverTimestamp() })`.
- Upload image flow: `getStorage()` → `uploadBytes()` → `getDownloadURL()` → set `imageURL` on the `products` doc (see `AdminPanel.js`).

Agent rules and PR guidance

- Keep changes small and focused (one feature/component per PR).
- Preserve collection names and realtime patterns; don't refactor Firestore schema without explicit human approval.
- If you add dependencies, add them to `package.json` and briefly explain why in the PR body.
- Do not add server-side secrets or Admin SDK credentials to the repo; client Firebase config belongs in `src/firebase/firebase.js`.

Where to start

- Read `src/App.js` for component composition and mounting order.
- Open `src/firebase/firebase.js` to see how Firestore and Storage are initialized.
- Inspect `src/components/ProductsGrid.js` and `seedFirestore.js` to understand expected document shapes and listeners.

If anything is unclear or you want more examples/snippets, tell me which area to expand (tests, CI, or data seeding) and I will extend this file.
