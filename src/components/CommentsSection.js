import React, { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";

export default function CommentsSection({ productId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(auth.currentUser);
  const [productNames, setProductNames] = useState({}); // cache productId -> name

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => setUser(u));

    // If a productId is provided, show comments for that product only.
    // Otherwise show all comments across products (most recent first).
    const q = productId
      ? query(
          collection(db, "comments"),
          where("productId", "==", productId),
          orderBy("createdAt", "desc")
        )
      : query(collection(db, "comments"), orderBy("createdAt", "desc"));

    // Use onSnapshot with an error callback so Firestore index errors trigger fallback
    let unsubscribe = null;
    let fallbackUnsub = null;

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(items);

        // When displaying comments across products, prefetch product names for any unknown productIds
        if (!productId) {
          const productIds = Array.from(
            new Set(
              snapshot.docs.map((d) => d.data().productId).filter(Boolean)
            )
          );
          productIds.forEach(async (pid) => {
            if (!pid) return;
            setProductNames((prev) => {
              if (prev[pid]) return prev;
              return { ...prev, [pid]: null };
            });
            try {
              const pDoc = await getDoc(doc(db, "products", pid));
              if (pDoc.exists()) {
                setProductNames((prev) => ({
                  ...prev,
                  [pid]: pDoc.data().name || pid,
                }));
              } else {
                setProductNames((prev) => ({ ...prev, [pid]: pid }));
              }
            } catch (e) {
              setProductNames((prev) => ({ ...prev, [pid]: pid }));
            }
          });
        }
      },
      (err) => {
        // If the query fails (e.g. missing index), fall back to listening the whole collection
        // eslint-disable-next-line no-console
        console.warn("Comments query listener error, falling back:", err);
        if (typeof unsubscribe === "function") unsubscribe();
        fallbackUnsub = onSnapshot(collection(db, "comments"), (snapshot) => {
          let items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (productId)
            items = items.filter((it) => it.productId === productId);
          items.sort((a, b) => {
            const ta = a.createdAt
              ? a.createdAt.toMillis
                ? a.createdAt.toMillis()
                : new Date(a.createdAt).getTime()
              : 0;
            const tb = b.createdAt
              ? b.createdAt.toMillis
                ? b.createdAt.toMillis()
                : new Date(b.createdAt).getTime()
              : 0;
            return tb - ta;
          });
          setComments(items);
          if (!productId) {
            const productIds = Array.from(
              new Set(items.map((d) => d.productId).filter(Boolean))
            );
            productIds.forEach(async (pid) => {
              if (!pid) return;
              if (productNames[pid]) return;
              setProductNames((prev) => ({ ...prev, [pid]: null }));
              try {
                const pDoc = await getDoc(doc(db, "products", pid));
                setProductNames((prev) => ({
                  ...prev,
                  [pid]: pDoc.exists() ? pDoc.data().name || pid : pid,
                }));
              } catch (e) {
                setProductNames((prev) => ({ ...prev, [pid]: pid }));
              }
            });
          }
        });
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      if (typeof fallbackUnsub === "function") fallbackUnsub();
      unsubscribeAuth();
    };
  }, [productId]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    const tempId = `local-${Date.now()}`;
    const optimistic = {
      id: tempId,
      productId,
      name: user.displayName,
      message: newComment,
      createdAt: new Date(),
      photoURL: user.photoURL || null,
      userId: user.uid || null,
    };
    setComments((prev) => [optimistic, ...prev]);
    setNewComment("");
    try {
      await addDoc(collection(db, "comments"), {
        productId,
        name: user.displayName,
        message: newComment,
        createdAt: serverTimestamp(),
        photoURL: user.photoURL || null,
        userId: user.uid || null,
      });
      // real listener will replace optimistic entry when snapshot arrives
    } catch (error) {
      // remove optimistic on failure
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      console.error("Error adding comment:", error);
    }
  };

  return (
    <section id="komentari" className="p-8 bg-green-50 mt-8 rounded">
      <h3 className="text-2xl font-bold mb-4">Komentāri</h3>

      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Pieslēgties ar Google, lai komentētu
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ievadiet savu komentāru"
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-32"
          >
            Iesniegt
          </button>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {comments.length === 0 && <p>Nav vēl komentāru.</p>}
        {comments.map((c) => (
          <div key={c.id} className="border p-2 rounded bg-white flex gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {c.photoURL ? (
                <img
                  src={c.photoURL}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                  {(c.name || "?")[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <p className="font-bold">{c.name}</p>
                {c.productId && (
                  <span className="text-xs text-gray-500">
                    {productNames[c.productId] || c.productId}
                  </span>
                )}
              </div>
              <p className="mt-1">{c.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
