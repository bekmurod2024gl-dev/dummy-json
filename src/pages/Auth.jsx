import { useState } from "react";

function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@gmail\.com$/.test(email);
  };

  const validatePassword = (password) => {
    const digitCount = (password.match(/[0-9]/g) || []).length;
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    return digitCount >= 4 && letterCount >= 4;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!validateEmail(email)) {
      setMessage("Email nimadur@gmail.com formatida bo'lishi kerak");
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Parolda kamida 4 ta raqam va 4 ta harf bo'lishi kerak");
      return;
    }

    setLoading(true);

    // Backend hali tayyor emas, shuning uchun DummyJSON o'rniga
    // vaqtincha mock (soxta) muvaffaqiyatli javob qaytariladi.
    setTimeout(() => {
      const fakeData = {
        username: email,
        message: mode === "login" ? "Kirish muvaffaqiyatli (mock)" : "Ro'yxatdan o'tish muvaffaqiyatli (mock)",
      };

      console.log("Mock javob:", fakeData);

      setMessage(JSON.stringify(fakeData));
      setLoading(false);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 600);

  
  };

  return (
    <div className="auth-full-page">
      <div className="auth-container">
        <h1 className="auth-title">DummyJSON App</h1>
        <div className="auth-box">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Kirish
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Ro'yxatdan o'tish
            </button>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Gmail: nimadur@gmail.com"
              disabled={loading}
              className="auth-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol: 4 raqam + 4 harf (Masalan: test1234)"
              disabled={loading}
              className="auth-input"
            />
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Yuklanmoqda...
                </>
              ) : mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
          </form>
          {message && <div className="auth-error">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Auth;