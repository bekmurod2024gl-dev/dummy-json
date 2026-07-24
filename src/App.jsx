import { useState } from "react";

import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";

import Products from "./pages/Products";
import Liked from "./pages/Liked";
import LikedPanel from "./pages/LikedPanel";
import Buy from "./pages/Buy";
import CartPanel from "./pages/CartPanel";
import Posts from "./pages/Posts";
import Users from "./pages/Users";
import Recipes from "./pages/Recipes";
import Quotes from "./pages/Quotes";
import Todos from "./pages/Todos";
import Comments from "./pages/Comments";

function App() {
  const [user, setUser] = useState(null);

  // ---- Umumiy ma'lumotlar ----
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // [{...product, quantity}]
  const [liked, setLiked] = useState(new Set());

  // Cart/Liked panellarida tanlangan element
  const [selectedCartProduct, setSelectedCartProduct] = useState(null);
  const [selectedLikedProduct, setSelectedLikedProduct] = useState(null);

  // Faol tab
  const [activeTab, setActiveTab] = useState("products");

  // =========================
  // CART FUNKSIYALARI
  // =========================
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    setSelectedCartProduct((prev) =>
      prev && prev.id === id
        ? { ...prev, quantity: prev.quantity + 1 }
        : prev
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    setSelectedCartProduct((prev) => {
      if (!prev || prev.id !== id) return prev;
      const newQty = prev.quantity - 1;
      return newQty > 0 ? { ...prev, quantity: newQty } : null;
    });
  };

  // =========================
  // LIKE FUNKSIYASI
  // =========================
  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    setSelectedLikedProduct((prev) =>
      prev && prev.id === id ? null : prev
    );
  };

  // =========================
  // AUTH
  // =========================
  if (!user) {
    return (
      <Auth
        onLoginSuccess={(userData) => {
          console.log("LOGIN USER:", userData);
          setUser(userData);
        }}
      />
    );
  }

  if (user.isAdmin === true) {
    return <AdminPanel user={user} onLogout={() => setUser(null)} />;
  }

  // =========================
  // MENYU
  // =========================
  const menuItems = [
    { key: "products", label: "🛍 Mahsulotlar" },
    { key: "buy", label: "🛒 Savat" },
    { key: "liked", label: "❤️ Saqlanganlar" },
    { key: "posts", label: "📝 Posts" },
    { key: "recipes", label: "🍲 Retseptlar" },
    { key: "users", label: "👥 Users" },
    { key: "todos", label: "✅ Todos" },
    { key: "comments", label: "💬 Comments" },
    { key: "quotes", label: "💡 Quotes" },
  ];

  const likedProducts = products.filter((p) => liked.has(p.id));

  const renderContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <Buy
                cart={cart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            </div>
            <CartPanel
              cartItems={cart}
              selectedProduct={selectedCartProduct}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onSelectProduct={setSelectedCartProduct}
            />
          </div>
        );

      case "liked":
        return (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <Liked
                products={products}
                liked={liked}
                toggleLike={toggleLike}
                addToCart={addToCart}
              />
            </div>
            <LikedPanel
              likedItems={likedProducts}
              onSelect={setSelectedLikedProduct}
              onUnlike={toggleLike}
            />
          </div>
        );

      case "posts":
        return <Posts />;

      case "recipes":
        return <Recipes />;

      case "users":
        return <Users />;

      case "todos":
        return <Todos />;

      case "comments":
        return <Comments />;

      case "quotes":
        return <Quotes />;

      default:
        return (
          <Products
            products={products}
            setProducts={setProducts}
            addToCart={addToCart}
            liked={liked}
            toggleLike={toggleLike}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      {/* NAVBAR */}
      <header
        style={{
          background: "white",
          padding: "16px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <h2 style={{ margin: 0 }}>🛍 DummyJSON App</h2>

        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: activeTab === item.key ? "#0f172a" : "#e2e8f0",
                color: activeTab === item.key ? "white" : "#0f172a",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>👤 {user.username}</span>
          <button
            onClick={() => setUser(null)}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            🚪 Chiqish
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ padding: 30 }}>{renderContent()}</main>
    </div>
  );
}

export default App;