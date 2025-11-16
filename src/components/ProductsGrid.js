import { db, auth } from "../firebase/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import ProductModal from "./ProductModal";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [likesMap, setLikesMap] = useState({}); // productId => liked?
  const [likesCount, setLikesCount] = useState({}); // productId => total likes

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

  // Listen for likes
  useEffect(() => {
    const unsubs = products.map((p) => {
      const likesCol = collection(db, "products", p.id, "likes");
      return onSnapshot(likesCol, (snapshot) => {
        setLikesMap((prev) => ({
          ...prev,
          [p.id]: user ? snapshot.docs.some((d) => d.id === user.uid) : false,
        }));
        setLikesCount((prev) => ({ ...prev, [p.id]: snapshot.docs.length }));
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

  const availableProducts = products.filter((p) => p.available === true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <section id="produkti" className="p-8">
        <h2 className="text-3xl font-bold mb-6">Mūsu Produkti - Pieejami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {availableProducts.map((p) => (
            <div key={p.id} className="border p-4 rounded">
              {(() => {
                const imgSrc =
                  p.imageURL ||
                  (p.images && p.images.length ? p.images[0] : null);
                if (imgSrc) {
                  return (
                    <div className="mb-2 w-full aspect-square rounded overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={p.name || "produkt"}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setSelectedProduct(p)}
                      />
                    </div>
                  );
                }
                return (
                  <div className="mb-2 w-full aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    Nav attēla
                  </div>
                );
              })()}
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

              <p className="mt-1 text-sm">Patīk: {likesCount[p.id] || 0}</p>
            </div>
          ))}
        </div>
      </section>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          user={user}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
