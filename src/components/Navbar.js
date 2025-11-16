import React, { useState, useRef, useEffect } from "react";
import { signOut, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const menuRef = useRef(null);

  // Close menu when clicking outside. Use pointerdown for reliable ordering.
  useEffect(() => {
    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleChangeName = async () => {
    const current = auth.currentUser;
    if (!current) return;
    if (!newName) return;
    try {
      await updateProfile(current, { displayName: newName });
      setEditing(false);
      setMenuOpen(false);
      setNewName("");
    } catch (err) {
      console.error("Update profile failed:", err);
    }
  };

  const scrollToId = (id, e) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (!el) {
      // fallback: update hash
      window.location.hash = id;
      return;
    }
    const header = document.querySelector("header");
    const offset = header ? header.offsetHeight : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top, behavior: "smooth" });
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch (e) {}
  };

  return (
    <header className="bg-green-100">
      <div className="p-3 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="flex items-center">
          <img
            src="/Zanes_Pušķīši.png"
            alt="Zanes Pušķīši"
            className="h-10 w-auto"
          />
        </a>

        <div className="flex items-center gap-4">
          {/* Auth actions */}
          {!user ? (
            <button
              type="button"
              onClick={handleSignIn}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Pieslēgties
            </button>
          ) : (
            <div
              className="relative"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"
                title={user.displayName || user.email}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full bg-gray-200">
                    {(user.displayName || user.email || "U")[0]}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-md z-50">
                  <div className="p-2 text-sm text-gray-700">
                    Pieslēdzies kā
                  </div>
                  <div className="px-3 pb-2 font-medium">
                    {user.displayName || user.email}
                  </div>
                  <div className="border-t" />
                  {!editing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(true);
                          setNewName(user.displayName || "");
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        Mainīt parādāmo vārdu
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        Izrakstīties
                      </button>
                    </>
                  ) : (
                    <div className="p-3">
                      <label className="block text-sm text-gray-600 mb-1">
                        Jauns parādāmais vārds
                      </label>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full border px-2 py-1 rounded mb-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="px-3 py-1"
                        >
                          Atcelt
                        </button>
                        <button
                          type="button"
                          onClick={handleChangeName}
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                          Saglabāt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="py-2 border-t border-green-200">
        <div className="max-w-6xl mx-auto flex justify-center gap-6 p-2">
          <a
            href="#produkti"
            className="font-medium"
            onClick={(e) => scrollToId("produkti", e)}
          >
            Produkti
          </a>
          <a
            href="#idejas"
            className="font-medium"
            onClick={(e) => scrollToId("idejas", e)}
          >
            Iedvesma
          </a>
          <a
            href="#komentari"
            className="font-medium"
            onClick={(e) => scrollToId("komentari", e)}
          >
            Komentāri
          </a>
        </div>
      </nav>
    </header>
  );
}
