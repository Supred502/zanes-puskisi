import { auth, googleProvider } from "./firebase/firebase";
import { signInWithPopup } from "firebase/auth";

function App() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Zanes Pušķīši</h1>
      <button
        onClick={loginWithGoogle}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default App;
