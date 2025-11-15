import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function InspirationsGrid() {
  const [inspirations, setInspirations] = useState([]);

  useEffect(() => {
    const fetchInspirations = async () => {
      const querySnapshot = await getDocs(collection(db, "inspirations"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInspirations(items);
    };
    fetchInspirations();
  }, []);

  return (
    <section id="idejas" className="p-8 bg-green-50">
      <h2 className="text-3xl font-bold mb-6">Iedvesma</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {inspirations.map((i) => (
          <div key={i.id} className="border p-4 rounded">
            <img
              src={i.imageURL}
              alt={i.name}
              className="mb-2 w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-semibold">{i.name}</h3>
            <p>{i.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
