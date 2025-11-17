import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";

export default function CommentsSection({ productId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => setUser(u));

    if (!productId) return;

    // Correct path: products/{productId}/comments
    const commentsRef = collection(db, "products", productId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (err) => {
        console.error("Comments listener error:", err);
      }
    );

    return () => {
      unsubscribe();
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
    if (!newComment || !productId) return;

    try {
      await addDoc(collection(db, "products", productId, "comments"), {
        message: newComment,
        name: user.displayName,
        photoURL: user.photoURL || null,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setNewComment("");
    } catch (error) {
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
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
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
              <p className="font-bold">{c.name}</p>
              <p className="mt-1">{c.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
