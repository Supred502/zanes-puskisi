import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import useLikes from "../hooks/useLikes";
import ProductModal from "./ProductModal";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      },
      (err) => {
        // Handle permission/index errors gracefully in UI during development
        // eslint-disable-next-line no-console
        console.warn("Products listener error:", err);
        setProducts([]);
      }
    );

    return () => {
      unsubscribeProducts();
    };
  }, []);

  // useLikes hook provides likesMap, likesCount, toggleLike and user
  const {
    likesMap,
    likesCount,
    toggleLike,
    user: hookUser,
  } = useLikes(products);

  // keep local user in sync with hook (so we can pass it to ProductModal)
  useEffect(() => setUser(hookUser), [hookUser]);

  // toggleLike provided by hook

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
