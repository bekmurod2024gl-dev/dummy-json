import { useState, useEffect } from "react";
import Products from "./pages/Products";
import Liked from "./pages/Liked";
import Buy from "./pages/Buy";
import { getProducts } from "./api/products";
import Users from "./pages/Users";
import Carts from "./pages/Carts";
import Posts from "./pages/Posts";
import Comments from "./pages/Comments";
import Todos from "./pages/Todos";
import Quotes from "./pages/Quotes";
import Recipes from "./pages/Recipes";
import Auth from "./pages/Auth";

const sections = [
  { id: "products", label: "Products", component: Products },
  { id: "users", label: "Users", component: Users },
  { id: "carts", label: "Carts", component: Carts },
  { id: "liked", label: "Liked", component: Liked },
  { id: "buy", label: "Buy", component: Buy },
  { id: "posts", label: "Posts", component: Posts },
  { id: "comments", label: "Comments", component: Comments },
  { id: "todos", label: "Todos", component: Todos },
  { id: "quotes", label: "Quotes", component: Quotes },
  { id: "recipes", label: "Recipes", component: Recipes },
  { id: "auth", label: "Auth", component: Auth },
];

function App() {
  const [active, setActive] = useState("products");
  const [loggedIn, setLoggedIn] = useState(false);
  const ActivePage = sections.find((item) => item.id === active)?.component;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState(() => new Set());

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProducts(data.products || []);
    };
    load();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleLike = (id) => {
    setLiked((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  if (!loggedIn) {
    return <Auth onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>DummyJSON App</h1>
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-button ${section.id === active ? "active" : ""}`}
            onClick={() => setActive(section.id)}
          >
            {section.label}
          </button>
        ))}
        <button className="nav-button" onClick={() => setLoggedIn(false)} style={{ marginTop: 20, background: "#ef4444" }}>
          Chiqish
        </button>
      </aside>
      <main className="main">
        {ActivePage ? (
          <ActivePage
            products={products}
            setProducts={setProducts}
            cart={cart}
            addToCart={addToCart}
            liked={liked}
            toggleLike={toggleLike}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
