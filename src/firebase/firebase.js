import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcT6NgqXUQV4Ztjt3MIcqyQgdeJmqTshk",
  authDomain: "zanes-puskisi-web.firebaseapp.com",
  projectId: "zanes-puskisi-web",
  storageBucket: "zanes-puskisi-web.firebasestorage.app",
  messagingSenderId: "406838089052",
  appId: "1:406838089052:web:cdfe0362db80cf7b021d99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
