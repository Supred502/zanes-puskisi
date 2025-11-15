import {
  collection,
  addDoc,
  query,
  where,
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

    const q = query(
      collection(db, "comments"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(items);
    });

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
    if (!newComment) return;

    try {
      await addDoc(collection(db, "comments"), {
        productId,
        name: user.displayName,
        message: newComment,
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
          <div key={c.id} className="border p-2 rounded bg-white">
            <p className="font-bold">{c.name}</p>
            <p>{c.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
