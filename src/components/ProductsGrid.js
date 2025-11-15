import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

  return (
    <section id="produkti" className="p-8">
      <h2 className="text-3xl font-bold mb-6">Mūsu Produkti</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className={`border p-4 rounded ${!p.available ? "opacity-50" : ""}`}
          >
            <img
              src={p.imageURL}
              alt={p.name}
              className="mb-2 w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="font-bold mt-2">{p.price} €</p>
            {!p.available && (
              <span className="text-red-600 font-bold">Izpārdots</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
