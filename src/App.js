import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductsGrid from "./components/ProductsGrid";
import InspirationsGrid from "./components/InspirationsGrid";
import AdminPanel from "./components/AdminPanel";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <Hero />
      <AdminPanel user={user} />
      <ProductsGrid />
      <InspirationsGrid />
    </div>
  );
}

export default App;
