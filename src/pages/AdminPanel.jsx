import { useState } from "react";
import Products from "./Products";
import Users from "./Users";
import Carts from "./Carts";
import Comments from "./Comments";
import Posts from "./Posts";

const quickActionStyle = {
  padding: "14px 10px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 14,
  textAlign: "center",
};

function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Admin panelida Products ko'rsatish uchun kerakli state
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState(new Set());

  // Admin uchun "Buy" kerak emas, shuning uchun bo'sh funksiya
  const addToCart = () => {};

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
  };

  const menuItems = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "orders", label: "🛒 Orders" },
    { key: "products", label: "📦 Products" },
    { key: "users", label: "👷 Workers" },
    { key: "comments", label: "💬 Comments" },
    { key: "posts", label: "📝 Posts" },
    { key: "settings", label: "⚙️ Settings" },
  ];

  const adminSince = "2026-yil, Iyul";

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <Products
            products={products}
            setProducts={setProducts}
            addToCart={addToCart}
            liked={liked}
            toggleLike={toggleLike}
          />
        );
      case "users":
        return <Users />;
      case "orders":
        return <Carts />;
      case "comments":
        return <Comments />;
      case "posts":
        return <Posts />;
      case "settings":
        return (
          <>
            {/* ADMIN PROFILE CARD */}
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "white",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {user.firstName?.[0] || user.username?.[0]?.toUpperCase()}
              </div>

              <div>
                <h2 style={{ margin: 0 }}>
                  {user.firstName} {user.lastName}
                </h2>
                <p style={{ margin: "4px 0", opacity: 0.8 }}>
                  @{user.username} &nbsp;•&nbsp; {user.email}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "#22c55e",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  👑 Super Admin
                </span>
              </div>
            </div>

            {/* ADMIN DETAILS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div className="admin-card">
                <h3>🆔 Foydalanuvchi ID</h3>
                <h2>{user.id}</h2>
              </div>

              <div className="admin-card">
                <h3>📅 Admin bo'lgan sana</h3>
                <h2 style={{ fontSize: 20 }}>{adminSince}</h2>
              </div>

              <div className="admin-card">
                <h3>🔐 Ruxsat darajasi</h3>
                <h2 style={{ fontSize: 20 }}>To'liq huquq</h2>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="admin-card" style={{ marginTop: 20 }}>
              <h2>⚡ Tezkor amallar</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <button
                  onClick={() => setActiveTab("products")}
                  style={quickActionStyle}
                >
                  📦 Mahsulot qo'shish
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  style={quickActionStyle}
                >
                  👷 Xodim qo'shish
                </button>

                <button
                  onClick={() => setActiveTab("posts")}
                  style={quickActionStyle}
                >
                  📝 Post yozish
                </button>

                <button
                  onClick={() => setActiveTab("comments")}
                  style={quickActionStyle}
                >
                  💬 Izohlarni ko'rish
                </button>
              </div>
            </div>

            {/* SYSTEM INFO */}
            <div className="admin-card" style={{ marginTop: 20 }}>
              <h2>🖥️ Tizim holati</h2>
              <div style={{ marginTop: 12, lineHeight: 2 }}>
                <div>🟢 Server holati: <strong>Ishlayapti</strong></div>
                <div>🗄️ Ma'lumotlar bazasi: <strong>dummyjson.com</strong></div>
                <div>🔄 Oxirgi yangilanish: <strong>Bugun</strong></div>
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            {/* ADMIN PROFILE MINI CARD */}
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "white",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {user.firstName?.[0] || user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                  Xush kelibsiz, {user.firstName || user.username}! 👋
                </div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Bugungi holatni quyida ko'rib chiqing
                </div>
              </div>
            </div>

            {/* STATISTICS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              <div className="admin-card">
                <h3>💰 Total Sales</h3>
                <h2>$24,580</h2>
              </div>

              <div className="admin-card">
                <h3>🛒 Total Orders</h3>
                <h2>1,245</h2>
              </div>

              <div className="admin-card">
                <h3>👥 Total Users</h3>
                <h2>5,632</h2>
              </div>

              <div className="admin-card">
                <h3>📦 Products</h3>
                <h2>194</h2>
              </div>
            </div>

            {/* SALES */}
            <div className="admin-card" style={{ marginTop: 30 }}>
              <h2>📈 Sales Analytics</h2>
              <div
                style={{
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f8fafc",
                  marginTop: 20,
                  borderRadius: 10,
                }}
              >
                Sales Chart
              </div>
            </div>

            {/* RECENT ORDERS */}
            <div className="admin-card" style={{ marginTop: 30 }}>
              <h2>🛒 Recent Orders</h2>
              <table style={{ width: "100%", marginTop: 20 }}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#1001</td>
                    <td>John Doe</td>
                    <td>$120</td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>#1002</td>
                    <td>Alex</td>
                    <td>$250</td>
                    <td>Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex" }}>
      {/* ADMIN SIDEBAR */}
      <aside style={{ width: 250, background: "#0f172a", color: "white", padding: 20 }}>
        <h2>🛍 Admin Panel</h2>

        <div style={{ marginTop: 30 }}>
          {menuItems.map((item) => (
            <p
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: 6,
                background: activeTab === item.key ? "#1e293b" : "transparent",
              }}
            >
              {item.label}
            </p>
          ))}
        </div>

        <button
          onClick={onLogout}
          style={{
            marginTop: 40,
            padding: 12,
            width: "100%",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* ADMIN MAIN */}
      <main style={{ flex: 1, padding: 30 }}>
        {/* NAVBAR */}
        <header
          style={{
            background: "white",
            padding: 20,
            borderRadius: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <h1>{menuItems.find((m) => m.key === activeTab)?.label || "Dashboard"}</h1>
          <div>🔔 &nbsp; 👤 {user.username}</div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;