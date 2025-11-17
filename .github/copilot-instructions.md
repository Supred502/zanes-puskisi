[//]: # "zanes-puskisi — Copilot instructions: concise, actionable, repo-specific"

# Copilot Instructions — zanes-puskisi

Concise, actionable notes to get an AI coding agent productive in this CRA + Firebase app.

Overview

- Tech stack: Create React App (React 19), Tailwind CSS, Firebase (v12+ modular SDK: Auth, Firestore, Storage).
- Key exports: `src/firebase/firebase.js` exports `auth`, `db`, `storage`, `googleProvider`.

Big picture

- Single-page React app: `src/index.js` → `src/App.js` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`, `ProductModal`.
- Firestore is the source of truth; UI uses realtime `onSnapshot` listeners (see `ProductsGrid`, `CommentsSection`).
- Storage stores product images; uploads use `uploadBytes` → `getDownloadURL` and write `images` array into `products` docs.

Data model & important patterns

- `products` documents: { name, description, price, images, imageURL?, available, holidaySpecial, tiktokLink, createdAt }.
- Likes: stored as a per-product subcollection `products/{productId}/likes/{uid}` (doc existence = liked). `ProductsGrid` uses a single `collectionGroup('likes')` listener to aggregate counts — do not replace with many per-product listeners.
- Comments: UI reads/writes comments under `products/{productId}/comments` (see `src/components/CommentsSection.js`). Note: `seedFirestore.js` contains a demo top-level `comments` collection — if you use that script, adapt comments to product-specific paths.
- `inspirations` is a separate collection used by `InspirationsGrid`.

Code conventions & gotchas

- Use Firebase modular APIs (import from `firebase/firestore`, `firebase/storage`, etc.).
- Use `serverTimestamp()` for `createdAt` when writing documents.
- Admin flows require auth: `AdminPanel` renders only for signed-in users (use `auth.onAuthStateChanged`).
- Image handling: UI uses `URL.createObjectURL` for previews — code revokes object URLs on unmount (see `AdminPanel.js`). Preserve that lifecycle when modifying image upload UI.
- Product deletion: `ProductModal` may delete storage objects and then delete product, likes, and comments in background — be careful when changing deletion logic to avoid orphaned likes/comments.

Developer workflows

- Dev server: `npm start` (CRA dev server at `http://localhost:3000`).
- Tests: `npm test` (watch mode). There are no heavy test suites by default.
- Build: `npm run build` → `build/` directory.
- Deploy hosting: `firebase deploy --only hosting` (run `npm run build` first).
- Seed Firestore: `node seedFirestore.js` — update the `firebaseConfig` in that file before running (it contains example keys). When seeding, prefer creating product documents first, then write comments to `products/{productId}/comments` if you want the UI to display them.

Key files to inspect (fast map)

- `src/firebase/firebase.js` — firebase initialization and exports.
- `src/components/ProductsGrid.js` — product list + likes aggregation; shows why `collectionGroup('likes')` is used.
- `src/components/AdminPanel.js` — image upload flow, object URL management, `addDoc(collection(db,'products'), ...)`.
- `src/components/ProductModal.js` — editing, replacing/deleting images, background cleanup of likes/comments.
- `src/components/CommentsSection.js` — reads/writes `products/{productId}/comments` and handles Google sign-in.
- `seedFirestore.js` — example seeding script (adjust paths/config before using).

When editing or adding features

- Do not rename collections or the `likes` subcollection pattern; many components depend on exact paths.
- Prefer a single `collectionGroup('likes')` listener for likes aggregation to avoid many watch targets.
- If changing upload storage paths, keep `getStoragePathFromUrl` logic in sync (used to best-effort delete storage objects by URL).

If anything is unclear or you want a shorter quick-reference or a longer walkthrough (emulator setup, CI, PR checklist), tell me which area to expand.
