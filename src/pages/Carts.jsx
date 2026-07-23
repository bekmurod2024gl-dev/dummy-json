import { useEffect, useState } from "react";
import { getCarts, addCart, updateCart, deleteCart } from "../api/carts";

function Carts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ userId: "", productId: "", quantity: "" });

  const loadCarts = async () => {
    setLoading(true);
    try {
      const data = await getCarts();
      setCarts(data.carts || []);
    } catch (err) {
      console.error("Cartlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ userId: "", productId: "", quantity: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const products = [
        { id: Number(formData.productId), quantity: Number(formData.quantity) },
      ];

      if (editingId) {
        // PUT — mavjud cartni yangilash
        const updated = await updateCart(editingId, { merge: true, products });
        setCarts((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...updated } : c))
        );
      } else {
        // POST — yangi cart qo'shish
        const created = await addCart({ userId: Number(formData.userId), products });

        // dummyjson har doim bir xil id qaytaradi (masalan doim 20),
        // shuning uchun frontendda o'zimiz unique id beramiz
        const uniqueId =
          carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

        setCarts((prev) => [...prev, { ...created, id: uniqueId }]);
      }

      resetForm();
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
    }
  };

  const handleEdit = (cart) => {
    setEditingId(cart.id);
    setFormData({
      userId: cart.userId,
      productId: cart.products?.[0]?.id || "",
      quantity: cart.products?.[0]?.quantity || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      await deleteCart(id);
      setCarts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Carts</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) resetForm();
          }}
        >
          {showForm ? "Bekor qilish" : "+ Yangi Cart"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ marginBottom: "1rem", padding: "1rem" }}
        >
          {!editingId && (
            <div style={{ marginBottom: "0.5rem" }}>
              <label>User ID: </label>
              <input
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Product ID: </label>
            <input
              type="number"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Quantity: </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Yangilash" : "Qo'shish"}
          </button>
        </form>
      )}

      {loading && <div className="loading">Loading carts...</div>}

      <div className="grid grid-3">
        {carts.map((cart) => (
          <div key={cart.id} className="card list-item">
            <h3>Cart #{cart.id}</h3>
            <div>User: {cart.userId}</div>
            <div>Total: ${cart.total}</div>
            <div>Products: {cart.products?.length || 0}</div>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => handleEdit(cart)}>
                Tahrirlash
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(cart.id)}>
                O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carts;