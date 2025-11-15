import { db, auth } from "../firebase/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [likesMap, setLikesMap] = useState({}); // productId => liked?

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => setUser(u));

    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, []);

  // Listen for likes for all products
  useEffect(() => {
    const unsubs = products.map((p) => {
      const likesCol = collection(db, "products", p.id, "likes");
      return onSnapshot(likesCol, (snapshot) => {
        setLikesMap((prev) => ({
          ...prev,
          [p.id]: user ? snapshot.docs.some((d) => d.id === user.uid) : false,
        }));
      });
    });
    return () => unsubs.forEach((unsub) => unsub());
  }, [products, user]);

  const toggleLike = async (productId) => {
    if (!user) return;

    const likeDoc = doc(db, "products", productId, "likes", user.uid);
    if (likesMap[productId]) {
      await deleteDoc(likeDoc);
    } else {
      await setDoc(likeDoc, { liked: true });
    }
  };

  return (
    <section id="produkti" className="p-8">
      <h2 className="text-3xl font-bold mb-6">Mūsu Produkti</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className={`border p-4 rounded relative ${
              !p.available ? "opacity-50" : ""
            }`}
          >
            <img
              src={p.imageURL}
              alt={p.name}
              className="mb-2 w-full h-48 object-cover rounded"
            />

            <div
              className="absolute top-2 right-2 px-2 py-1 rounded text-white text-sm font-bold"
              style={{ backgroundColor: p.available ? "green" : "red" }}
            >
              {p.available ? "Pieejams" : "Izpārdots"}
            </div>

            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="font-bold mt-2">{p.price} €</p>

            {user && (
              <button
                onClick={() => toggleLike(p.id)}
                className={`mt-2 px-2 py-1 rounded text-white ${
                  likesMap[p.id] ? "bg-red-500" : "bg-blue-500"
                }`}
              >
                {likesMap[p.id] ? "Patīk" : "Like"}
              </button>
            )}
            <p className="mt-1 text-sm">
              {/* Optionally display total likes */}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
