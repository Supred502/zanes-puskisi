// seedFirestore.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// 🔑 Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDcT6NgqXUQV4Ztjt3MIcqyQgdeJmqTshk",
  authDomain: "zanes-puskisi-web.firebaseapp.com",
  projectId: "zanes-puskisi-web",
  storageBucket: "zanes-puskisi-web.firebasestorage.app",
  messagingSenderId: "406838089052",
  appId: "1:406838089052:web:cdfe0362db80cf7b021d99",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  try {
    // ---------- Products ----------
    const productsRef = collection(db, "products");
    const products = [
      {
        name: "Tulip Bouquet",
        description: "Hand-made bouquet with fresh tulips",
        price: 25,
        imageURL: "https://example.com/tulip.jpg",
        available: true,
      },
      {
        name: "Rose Arrangement",
        description: "Elegant roses for any occasion",
        price: 40,
        imageURL: "https://example.com/rose.jpg",
        available: true,
      },
      {
        name: "Holiday Pine Wreath",
        description: "Festive wreath perfect for Christmas",
        price: 30,
        imageURL: "https://example.com/holiday-wreath.jpg",
        available: true,
      },
    ];

    for (const p of products) {
      await addDoc(productsRef, { ...p, createdAt: serverTimestamp() });
    }

    // ---------- Sold-Out / Inspiration ----------
    const inspirationsRef = collection(db, "inspirations");
    const inspirations = [
      {
        name: "Custom Daisy Arrangement",
        description: "Previously made special order",
        imageURL: "https://example.com/daisy.jpg",
      },
      {
        name: "Sold Out Orchid Basket",
        description: "Inspiration from a sold-out item",
        imageURL: "https://example.com/orchid.jpg",
      },
      {
        name: "Holiday Red & Gold Centerpiece",
        description: "Festive inspiration for your home",
        imageURL: "https://example.com/holiday-special.jpg",
      },
    ];

    for (const i of inspirations) {
      await addDoc(inspirationsRef, { ...i, createdAt: serverTimestamp() });
    }

    // ---------- Comments ----------
    const commentsRef = collection(db, "comments");
    const comments = [
      {
        productId: "TULIP_PRODUCT_ID", // replace with real product ID later
        name: "Anna",
        message: "Absolutely beautiful bouquet!",
      },
      {
        productId: "HOLIDAY_WREATH_ID",
        name: "Marta",
        message: "I love the festive wreath, perfect for Christmas!",
      },
    ];

    for (const c of comments) {
      await addDoc(commentsRef, { ...c, createdAt: serverTimestamp() });
    }

    console.log("✅ Firestore seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
  }
}

seed();
