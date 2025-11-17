[//]: # "zanes-puskisi — Copilot instructions: concise, actionable, repo-specific"

# Copilot Instructions — zanes-puskisi

Short, actionable guide to get an AI coding agent productive in this CRA + Firebase repository.

**Overview**

- **Tech**: Create React App (React 19), Tailwind CSS, Firebase (Auth, Firestore, Storage).
- **Styling**: Tailwind-first; global utilities live in `src/styles/index.css` and `index.css`.
- **Firebase helpers**: `src/firebase/firebase.js` (client SDK only; no secrets here).

**Big Picture**

- **App entry**: `src/index.js` → `src/App.js` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`, `ProductModal`.
- **Data flow**: `ProductsGrid` subscribes to `products` docs and the `products/{id}/likes` subcollection (snapshot listeners drive UI counts).
- **Comments**: stored in a flat `comments` collection and queried by `productId` in `CommentsSection.js`.

**Firestore model (discoverable patterns)**

- **`products`** docs: fields include `name`, `description`, `price`, `imageURL`, `available`, `holidaySpecial`, `createdAt`.
- **Likes**: per-user docs under `products/{productId}/likes/{uid}` — the UI treats a doc’s existence as a like. Count is done via snapshots of that subcollection.
- **Comments**: top-level `comments` collection with docs `{ productId, name, message, createdAt }`.
- **Inspirations**: separate `inspirations` collection used by the inspirations grid.

**Key files to inspect (quick map)**

- **Firebase & seeding**: `src/firebase/firebase.js`, `seedFirestore.js` (seed example docs; update config at top before running).
- **Realtime UI**: `src/components/ProductsGrid.js` (listening + like toggle logic).
- **Detail + comments**: `src/components/ProductModal.js`, `src/components/CommentsSection.js`.
- **Admin uploads**: `src/components/AdminPanel.js` (uses `getStorage()`, `uploadBytes()`, `getDownloadURL()` then writes `imageURL` to a `products` doc).
- **Styling pipeline**: `tailwind.config.cjs`, `postcss.config.cjs`, and `src/styles/index.css`.

**Developer workflows & commands**

- **Dev server**: `npm start` — CRA dev server at `http://localhost:3000`.
- **Tests**: `npm test` (watch mode). Tests are under `src/components/__tests__`.
- **Build**: `npm run build` → output in `build/` (served by Firebase Hosting for deployments).
- **Deploy**: `firebase deploy --only hosting` (run `npm run build` first).
- **Local seed**: `node seedFirestore.js` (edit the config variables at the top to point to your project).

**Project conventions & guardrails (strictly observable in code)**

- **Tailwind-first**: prefer JSX utility classes over adding global CSS.
- **Schema stability**: do not rename collections or change the `likes` subcollection pattern without approval — many components rely on these exact names.
- **Use server timestamps**: writing `createdAt` uses `serverTimestamp()` throughout the codebase.
- **Auth gating**: `AdminPanel` expects client-side auth (`onAuthStateChanged`); never embed admin credentials in source.

**Common code snippets & patterns (copyable examples)**

- **Post a comment**: `addDoc(collection(db, 'comments'), { productId, name, message, createdAt: serverTimestamp() })`.
- **Toggle like**: create/delete `doc(db, 'products', id, 'likes', uid)`; UI counts via `onSnapshot` on the likes subcollection (see `ProductsGrid.js`).
- **Upload image**: `getStorage()` → `uploadBytes()` → `getDownloadURL()` → update `products` doc with `imageURL` (see `AdminPanel.js`).

**Where to start (fast path)**

- Open `src/App.js`, follow imports into `src/components/*` to see UI composition.
- Inspect `src/firebase/firebase.js` to understand how Firebase is initialized and which helpers are available.
- Study `src/components/ProductsGrid.js` and `src/components/AdminPanel.js` to learn realtime listeners and the upload flow.

**When to ask for help or expand these instructions**

- If you need CI/test commands, or a local emulator setup (Firestore/Auth/Storage), ask and we’ll add exact `firebase emulators:start` instructions and env config steps.
- If you want code examples for migrating schema or adding server-side logic, request a scoped design first (changes to schema require careful coordination).

If anything above seems incomplete or you want extra examples (emulator steps, narrower test commands, or a PR checklist), tell me which area to expand.
