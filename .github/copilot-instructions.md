## Copilot Instructions — zanes-puskisi

Short, actionable guidance to get an AI coding agent productive in this CRA + Firebase repo.

Overview

- Tech: Create React App (React 19), Tailwind CSS, Firebase (Auth, Firestore, Storage).
- Styling is Tailwind-first: `postcss.config.cjs`, `tailwind.config.cjs`, global CSS in `src/styles/index.css`.
- Firebase client code lives in `src/firebase/firebase.js` (no server secrets in repo).

Big picture

- App entry: `src/index.js` → `src/App.js`. `App` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`, and `ProductModal`.
- Firestore model (see `seedFirestore.js` for examples):
  - `products` documents: fields include `name`, `description`, `price`, `imageURL`, `available`, `holidaySpecial`, `createdAt`.
  - Likes use a subcollection: `products/{productId}/likes/{uid}` — presence of a doc means the user liked the product; UI reads snapshot counts in `ProductsGrid.js`.
  - `comments` is a flat collection with `{ productId, name, message, createdAt }` and is queried by `productId` in `CommentsSection.js`.
  - `inspirations` is a separate collection used by `InspirationsGrid.js`.

Key files & patterns (quick map)

- `src/firebase/firebase.js`: Firebase client init + helpers.
- Product flow: `src/components/ProductsGrid.js`, `src/components/ProductModal.js` (likes + product details).
- Comments: `src/components/CommentsSection.js` (query by `productId`, ordered by `createdAt`).
- Admin UI: `src/components/AdminPanel.js` (gated by `onAuthStateChanged` user state).
- Tests: `src/setupTests.js`, `src/components/__tests__/Navbar.test.js` (React Testing Library).

Developer workflows (commands)

- Run dev server: `npm start` (CRA dev server on `http://localhost:3000`).
- Run tests: `npm test` (watch mode); run after editing components with tests.
- Build: `npm run build` → `build/` directory.
- Deploy hosting: `firebase deploy --only hosting` (build first).
- Seed Firestore locally: `node seedFirestore.js` — edit its config for your Firebase project before running.

Repo-specific guidance

- Tailwind-first: prefer adding utility classes in JSX rather than new global CSS declarations.
- Firestore patterns: preserve collection names and subcollection likes pattern. Use `serverTimestamp()` for `createdAt` where appropriate.
- Do not add server-side secrets or Admin SDK configuration to the repo. Client Firebase keys are expected to be public and stored in `src/firebase/firebase.js`.

Concrete examples (copy/paste-ready)

- Toggle like: create or delete the doc at `products/{productId}/likes/{uid}`; `ProductsGrid.js` listens to snapshots to compute counts.
- Post comment: `addDoc(collection(db, 'comments'), { productId, name, message, createdAt: serverTimestamp() })` and query with `where('productId','==',id)` + `orderBy('createdAt','desc')`.
- Upload image in AdminPanel: use `getStorage()` → `uploadBytes()` → `getDownloadURL()` → write `imageURL` to the `products` doc.

Where to start (dev flow)

- Inspect `src/App.js` to see composition and which components mount by route/state.
- Open `src/firebase/firebase.js` to understand exported helpers and initialization points.
- Review `src/components/ProductsGrid.js` and `seedFirestore.js` to learn expected Firestore document shapes and real-time patterns.

PR & editing rules for agents

- Keep changes small and focused (one feature/component per PR).
- Match existing naming, collection structure, and `createdAt` usage — prefer server timestamps.
- If adding dependencies, update `package.json` and note why in the PR description.

If anything is unclear in these instructions or you need more examples, ask and I will expand the section with targeted snippets.
