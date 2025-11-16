# Copilot Instructions for zanes-puskisi

This file gives concise, actionable guidance for AI coding assistants working on this repository.

Overview

- Project: Create React App (React 19) single-page app.
- Styling: Tailwind CSS via `postcss.config.cjs` and `tailwind.config.cjs`. Global styles: `src/styles/index.css`.
- Backend: Firebase (Auth, Firestore, Storage). Firebase client config lives in `src/firebase/firebase.js`.
- Hosting: Firebase Hosting configured in `firebase.json` to serve the `build/` output.

Big picture & data flow

- Entry: `src/index.js` → `App` (`src/App.js`). `App` composes `Navbar`, `Hero`, `AdminPanel`, `ProductsGrid`, `InspirationsGrid`.
- Firestore model (discoverable from code and `seedFirestore.js`):
  - `products` collection: product docs include `name`, `description`, `price`, `imageURL`, `available`, `holidaySpecial`, `createdAt`.
  - `products/{productId}/likes` subcollection: each doc id is `user.uid`; presence indicates the user liked the product (see `ProductsGrid`).
  - `inspirations` collection: inspiration items used by `InspirationsGrid`.
  - `comments` collection: flat collection with `productId`, `name`, `message`, `createdAt`; `CommentsSection` queries by `productId`.
- Auth & permissions: Uses Firebase Google Auth (provider exported from `src/firebase/firebase.js`). UI components gate actions by checking `user` from `onAuthStateChanged` (see `App.js` and `AdminPanel.js`).

Developer workflows (key commands)

- Development server: `npm start` (CRA dev server at `http://localhost:3000`).
- Run tests: `npm test` (uses React Testing Library packages present in `package.json`).
- Production build: `npm run build` → puts static files into `build/`.
- Deploy to Firebase Hosting: use Firebase CLI (not included here): `firebase deploy --only hosting` after `npm run build`.
- Seed Firestore locally or for initial data: run `node seedFirestore.js` (edit config inside if needed).

Project-specific conventions

- Firebase config is client-side in `src/firebase/firebase.js` — this is the project's canonical config for client interactions.
- Likes implementation: create/delete a doc in `products/{id}/likes/{uid}`. The UI expects presence/absence to indicate liked state and counts the number of docs for total likes.
- Comments implementation: store comments in the `comments` collection and query by `productId` with `orderBy('createdAt','desc')`.
- AdminPanel is intentionally minimal; any product/inspiration management should be implemented behind the `user` check already present.
- Tailwind-first styling: prefer adding utility classes to existing JSX instead of creating new global CSS rules.

Integration notes & pitfalls

- `src/firebase/firebase.js` contains API keys and project IDs — these are client config values (not secret keys). When making changes that require server-side secrets (e.g., admin SDK), keep them out of this repo.
- Firestore rules and indexes are managed outside the repo; if you add complex queries you may need to create indexes in the Firebase console.
- Image uploads should use Firebase Storage (`getStorage`) and then save the file `downloadURL` to the `imageURL` field in `products`.

Useful file references

- App composition: `src/App.js`, `src/index.js`.
- Firebase: `src/firebase/firebase.js`, `seedFirestore.js`.
- Components: `src/components/ProductsGrid.js`, `src/components/InspirationsGrid.js`, `src/components/CommentsSection.js`, `src/components/AdminPanel.js`, `src/components/Navbar.js`.
- Build/deploy config: `package.json`, `firebase.json`, `public/index.html`.

Suggested assistant behaviours

- Keep changes minimal and localized: prefer small PRs that update one feature/component at a time.
- When editing Firestore access code, reference existing patterns in `ProductsGrid` and `CommentsSection` to keep consistency (collection names, timestamp usage, subcollection pattern for likes).
- If adding new build-time dependencies (e.g., for image processing), update `package.json` and document why in the PR description.

Prompt examples for change requests

- "Add an image upload form to `AdminPanel` that stores uploads to Firebase Storage and saves `imageURL` to `products` collection. Show only the modified component and helper function."
- "Refactor `ProductsGrid` to lazy-load product images. Keep identical Firestore reads and existing like/comment behavior."
- "Write a unit test for `CommentsSection` that verifies posting a comment calls Firestore `addDoc` with the correct payload (mock Firestore)."

If anything in these instructions seems incorrect or incomplete, please point to the file and I will update this guidance.
