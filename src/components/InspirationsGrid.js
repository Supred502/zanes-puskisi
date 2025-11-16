import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import ProductModal from "./ProductModal";

export default function InspirationsGrid() {
  const [sold, setSold] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("available", "==", false)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSold(items);
    });
    return () => unsub();
  }, []);

  return (
    <section id="idejas" className="p-8 bg-green-50">
      <h2 className="text-3xl font-bold mb-6">Iedvesma - Pārdoti</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sold.map((p) => (
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
                      alt={p.name}
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
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          user={auth.currentUser}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
