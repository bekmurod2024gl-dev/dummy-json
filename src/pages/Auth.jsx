import { useState } from "react";
import { login, register } from "../api/auth";

// 🔐 Maxsus admin login (dummyjson orqali emas, lokal tekshiruv)
const SUPER_ADMIN_USERNAME = "bobomurod";
const SUPER_ADMIN_PASSWORD = "jumaboyevAdmin1234";

function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_ATTEMPTS = 3;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("Username va passwordni kiriting");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // 🔐 LOGIN
      // =========================
      if (mode === "login") {
        // =========================
        // 👑 SUPER ADMIN — API'siz, lokal tekshiruv
        // =========================
        if (
          username === SUPER_ADMIN_USERNAME &&
          password === SUPER_ADMIN_PASSWORD
        ) {
          localStorage.removeItem("loginAttempts");
          localStorage.removeItem("loginBlocked");

          onLoginSuccess({
            id: 0,
            username: SUPER_ADMIN_USERNAME,
            firstName: "Bobomurod",
            lastName: "Jumaboyev",
            email: "bobomurod@admin.local",
            image: "",
            isAdmin: true,
          });

          setLoading(false);
          return;
        }

        const attempts = Number(
          localStorage.getItem("loginAttempts") || 0
        );

        const loginBlocked =
          localStorage.getItem("loginBlocked") === "true";

        // 🔒 3 martadan keyin bloklash
        if (loginBlocked) {
          throw new Error(
            "Login bloklangan. 3 marta noto'g'ri urinish qilindi."
          );
        }

        // 👇 DUMMYJSON API ORQALI LOGIN
        const data = await login({
          username,
          password,
        });

        // Login muvaffaqiyatli bo'lsa urinishlarni tozalash
        localStorage.removeItem("loginAttempts");

        // 👤 ODDIY USER (dummyjson orqali kirgan)
        onLoginSuccess({
          ...data,
          isAdmin: false,
        });
      }

      // =========================
      // 📝 REGISTER
      // =========================
      else {
        const data = await register({
          username,
          password,
        });

        console.log("Register:", data);

        setMessage(
          "Ro'yxatdan o'tish muvaffaqiyatli!"
        );
      }
    } catch (error) {
      console.error(error);

      // ❌ LOGIN XATOSI
      if (mode === "login") {
        const attempts = Number(
          localStorage.getItem("loginAttempts") || 0
        );

        const newAttempts = attempts + 1;

        localStorage.setItem(
          "loginAttempts",
          String(newAttempts)
        );

        if (newAttempts >= MAX_ATTEMPTS) {
          localStorage.setItem(
            "loginBlocked",
            "true"
          );

          setMessage(
            "3 marta noto'g'ri login qilindi. Login bloklandi."
          );
        } else {
          setMessage(
            `Username yoki password noto'g'ri. Qolgan urinishlar: ${
              MAX_ATTEMPTS - newAttempts
            }`
          );
        }
      } else {
        setMessage(
          error.response?.data?.message ||
            error.message ||
            "Xatolik yuz berdi"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full-page">
      <div className="auth-container">
        <h1 className="auth-title">
          DummyJSON App
        </h1>

        <div className="auth-box">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${
                mode === "login"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Kirish
            </button>

            <button
              type="button"
              className={`auth-tab ${
                mode === "register"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >
            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Username"
              disabled={loading}
              className="auth-input"
            />

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              disabled={loading}
              className="auth-input"
            />

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Yuklanmoqda...
                </>
              ) : mode === "login" ? (
                "Kirish"
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </button>
          </form>

          {message && (
            <div className="auth-error">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;