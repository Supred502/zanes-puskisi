[//]: # "zanes-puskisi — Copilot instructions: concise, actionable, repo-specific"

# Copilot Instructions — zanes-puskisi

Short, actionable guide to get an AI coding agent productive in this CRA + Firebase repo.

**Overview**

- **Tech**: Create React App (React 19), Tailwind CSS, Firebase (Auth, Firestore, Storage).
- **Styling**: Tailwind-first; global utilities are in `src/styles/index.css` and `src/index.css`.
- **Firebase helpers**: `src/firebase/firebase.js` exports `auth`, `db`, `storage`, `googleProvider` (client SDK only — no secrets in repo).

**Big picture & architecture**

- Single-page React app: `src/index.js` → `src/App.js` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`, `ProductModal`.
- Firestore is the primary data source: UI uses realtime snapshot listeners (`onSnapshot`) to drive product lists and like counts.
- Storage holds product images; `AdminPanel` uploads files then writes `imageURL` or `images` arrays into `products` docs.

**Firestore data model (practical patterns)**

- `products` documents: `{ name, description, price, imageURL, images, available, holidaySpecial, createdAt }`.
- Likes: per-user docs under `products/{productId}/likes/{uid}` — existence = liked. UI counts via snapshot listeners. `ProductsGrid` uses a `collectionGroup('likes')` listener to aggregate counts efficiently.
- Comments: top-level `comments` collection with `{ productId, name, message, createdAt }` and queried by `productId` in `CommentsSection.js`.
- `inspirations` collection stores static inspiration items shown in `InspirationsGrid.js`.

**Key files to inspect (quick map)**

- `src/firebase/firebase.js` — Firebase app + exports.
- `seedFirestore.js` — example seeding script (edit the config before running).
- `src/components/ProductsGrid.js` — realtime listeners for `products` and a `collectionGroup('likes')` optimization; toggles likes with `setDoc`/`deleteDoc`.
- `src/components/AdminPanel.js` — image upload flow (`uploadBytes` → `getDownloadURL`) then `addDoc(collection(db,'products'), {...})`.
- `src/components/ProductModal.js`, `src/components/CommentsSection.js` — comment posting / querying patterns.

**Developer workflows & common commands**

- Dev server: `npm start` (CRA dev server at `http://localhost:3000`).
- Tests: `npm test` (watch mode). Tests live under `src/components/__tests__` if present.
- Build: `npm run build` → `build/` directory.
- Deploy: `firebase deploy --only hosting` (run `npm run build` first).
- Seed Firestore locally: `node seedFirestore.js` after replacing the config keys in that file.

**Project-specific conventions & guardrails**

- Tailwind-first: prefer inline utility classes in JSX; avoid adding global CSS unless necessary.
- Do not rename collections or the `likes` subcollection pattern — many components rely on exact names.
- Use `serverTimestamp()` for `createdAt` on writes (used throughout code).
- `AdminPanel` is client-auth gated (`onAuthStateChanged`); do not commit admin credentials.

**Common code snippets & copyable patterns**

- Post a comment:
  `addDoc(collection(db, 'comments'), { productId, name, message, createdAt: serverTimestamp() })`
- Toggle like (ProductsGrid):
  `const likeDoc = doc(db, 'products', productId, uid); await setDoc(likeDoc, { liked: true })` or `await deleteDoc(likeDoc)`
- Upload images (AdminPanel):
  `uploadBytes(ref, file).then(() => getDownloadURL(ref))` then write `images` or `imageURL` into the `products` doc.

**Where to start (fast path for edits or features)**

- Open `src/App.js` to see UI composition.
- Inspect `src/firebase/firebase.js` for exported helpers.
- For feed & likes behavior, study `src/components/ProductsGrid.js` (collectionGroup usage + defensive error handling comments).
- For uploads and form behavior, study `src/components/AdminPanel.js` (objectURL lifecycle, Promise.all uploads, form resets).

**If you need more**

- For emulator guidance or CI/test automation, ask and we will add `firebase emulators:start` steps and CI snippets.
- For a PR checklist or more examples, tell me which area to expand.

——
If any section is unclear or you want alternate formatting (short quick-reference or longer walkthrough), tell me which area to expand.
