import { useEffect, useState } from "react";

import {
  getUsers,
  searchUsers,
  getRandomUser,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // =========================
  // GET USERS
  // =========================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data.users || []);
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error
      );

      alert(
        "Users yuklashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAGE LOAD
  // =========================

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        return loadUsers();
      }

      setLoading(true);

      const data = await searchUsers(query);

      setUsers(data.users || []);
    } catch (error) {
      console.error(
        "SEARCH ERROR:",
        error
      );

      alert(
        "User qidirishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RANDOM USER
  // =========================

  const handleRandom = async () => {
    try {
      setLoading(true);

      const user = await getRandomUser();

      setUsers([user]);
    } catch (error) {
      console.error(
        "RANDOM USER ERROR:",
        error
      );

      alert(
        "Random user olishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // POST + PUT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // PUT
      if (editingId) {
        const updatedUser =
          await updateUser(
            editingId,
            formData
          );

        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingId
              ? {
                  ...user,
                  ...updatedUser,
                }
              : user
          )
        );

        alert(
          "User muvaffaqiyatli yangilandi!"
        );
      }

      // POST
      else {
        const newUser =
          await createUser(formData);

        setUsers((prev) => [
          {
            ...newUser,
            id:
              newUser.id ||
              Date.now(),
          },
          ...prev,
        ]);

        alert(
          "User muvaffaqiyatli qo'shildi!"
        );
      }

      // Formani tozalash
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });

      setEditingId(null);

      setShowForm(false);
    } catch (error) {
      console.error(
        "POST / PUT ERROR:",
        error
      );

      alert(
        "User saqlashda xatolik yuz berdi"
      );
    }
  };

  // =========================
  // EDIT USER
  // =========================

  const handleEdit = (user) => {
    setEditingId(user.id);

    setFormData({
      firstName:
        user.firstName || "",

      lastName:
        user.lastName || "",

      email:
        user.email || "",

      phone:
        user.phone || "",
    });

    setShowForm(true);
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== id
        )
      );

      alert(
        "User muvaffaqiyatli o'chirildi!"
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        "User o'chirishda xatolik yuz berdi"
      );
    }
  };

  // =========================
  // ADD USER
  // =========================

  const handleAddUser = () => {
    setEditingId(null);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    setShowForm(true);
  };

  return (
    <div>

      {/* HEADER */}

      <div className="page-header">

        <h2 className="section-title">
          Users
        </h2>

        <button
          className="buy-btn"
          onClick={handleAddUser}
        >
          Add User
        </button>

      </div>

      {/* SEARCH */}

      <div className="card controls">

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search users..."
        />

        <button
          onClick={handleSearch}
        >
          Search
        </button>

        <button
          onClick={handleRandom}
        >
          🎲 Random User
        </button>

        <button
          onClick={loadUsers}
        >
          🔄 All Users
        </button>

      </div>

      {/* FORM */}

      {showForm && (

        <div className="card user-form">

          <h3>
            {editingId
              ? "Edit User"
              : "Add New User"}
          </h3>

          <form
            onSubmit={handleSubmit}
          >

            <input
              name="firstName"
              value={
                formData.firstName
              }
              onChange={handleChange}
              placeholder="First name"
              required
            />

            <input
              name="lastName"
              value={
                formData.lastName
              }
              onChange={handleChange}
              placeholder="Last name"
              required
            />

            <input
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <input
              name="phone"
              value={
                formData.phone
              }
              onChange={handleChange}
              placeholder="Phone"
            />

            <div className="actions">

              <button
                type="submit"
                className="buy-btn"
              >
                {editingId
                  ? "Update User"
                  : "Create User"}
              </button>

              <button
                type="button"
                className="buy-btn"
                onClick={() => {
                  setShowForm(false);

                  setEditingId(null);
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {/* LOADING */}

      {loading && (

        <div className="loading">
          Loading users...
        </div>

      )}

      {/* USERS */}

      <div className="grid grid-3">

        {users.map((user) => (

          <div
            key={user.id}
            className="card list-item"
          >

            <h3>
              {user.firstName}{" "}
              {user.lastName}
            </h3>

            <div>
              📧 {user.email}
            </div>

            <div>
              📞 {user.phone}
            </div>

            <div>
              🏢{" "}
              {user.company?.name ||
                "No company"}
            </div>

            {/* ACTIONS */}

            <div className="actions">

              {/* PUT */}

              <button
                className="buy-btn"
                onClick={() =>
                  handleEdit(user)
                }
              >
                ✏️ Edit
              </button>

              {/* DELETE */}

              <button
                className="buy-btn"
                onClick={() =>
                  handleDelete(
                    user.id
                  )
                }
              >
                🗑️ Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Users;