# Copilot Instructions for zanes-puskisi

Concise, actionable guidance for AI coding assistants working on this Create React App + Firebase project.

Overview

- Tech: React (CRA, React 19), Tailwind CSS, Firebase (Auth, Firestore, Storage).
- Styling: `postcss.config.cjs` + `tailwind.config.cjs`; global styles in `src/styles/index.css`.
- Firebase client config: `src/firebase/firebase.js`.

Big picture & data flow

- Entry: `src/index.js` → `src/App.js`. `App` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid` and modals (e.g. `ProductModal`).
- Firestore model (see `seedFirestore.js`):
  - `products` docs: `name`, `description`, `price`, `imageURL`, `available`, `holidaySpecial`, `createdAt`.
  - Likes: `products/{productId}/likes/{uid}` — presence of a doc = liked; count docs for total likes (`ProductsGrid.js`).
  - `inspirations` collection used by `InspirationsGrid.js`.
  - `comments` flat collection with `productId`, `name`, `message`, `createdAt` (`CommentsSection.js` queries by `productId`).

Key files & patterns (quick map)

- Firebase: `src/firebase/firebase.js` (client-side config only).
- Products & likes: `src/components/ProductsGrid.js`, `src/components/ProductModal.js`.
- Comments: `src/components/CommentsSection.js` (queries `comments` by `productId` ordered by `createdAt`).
- Admin UI: `src/components/AdminPanel.js` (gated by `user` from `onAuthStateChanged`).
- Tests: `src/setupTests.js`, `src/components/__tests__/Navbar.test.js` (React Testing Library).

Developer workflows

- Dev server: `npm start` (CRA dev server at `http://localhost:3000`).
- Tests: `npm test` (uses React Testing Library). Run after changes to affected components.
- Build: `npm run build` → `build/` output.
- Deploy hosting: `firebase deploy --only hosting` (run after `npm run build`).
- Seed Firestore: `node seedFirestore.js` (edit config inside for target project).

Agent-specific guidance (do this in PRs)

- Keep changes minimal and focused: edit one component or feature per PR.
- Follow existing Firestore patterns: use the same collection names, subcollection likes pattern, and `createdAt` timestamps (prefer `serverTimestamp()` where appropriate).
- Tailwind-first: prefer adding utility classes directly in JSX over adding global CSS rules.
- Do not add server secrets or server-side admin SDK config in the repo — Firebase client keys are expected to be public.
- If you add new dev/build dependencies, update `package.json` and explain why in the PR description.

Concrete examples for common tasks

- Add image upload in `AdminPanel`: use `getStorage()` → upload → `getDownloadURL()` → save `imageURL` on `products` doc (see `src/firebase/firebase.js`).
- Toggle like: create/delete doc at `products/{id}/likes/{uid}` and refresh counts from snapshot query in `ProductsGrid`.
- Post comment: `addDoc(collection(db,'comments'), { productId, name, message, createdAt: serverTimestamp() })` and query by `productId` with `orderBy('createdAt','desc')` in `CommentsSection`.

Where to look first

- Start with `src/App.js`, `src/firebase/firebase.js`, and `src/components/ProductsGrid.js` to understand product/like flow.
- Check `seedFirestore.js` for expected document shapes.

If something seems missing or inconsistent, ask for the expected behavior and I will update these instructions.
