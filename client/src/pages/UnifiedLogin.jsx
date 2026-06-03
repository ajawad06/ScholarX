import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function UnifiedLogin() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await auth.login(role, form);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-page">
      <form className="form-card compact" onSubmit={submit}>
        <h1 style={{ marginBottom: "8px" }}>Portal Login</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "24px",
            padding: "8px",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
          }}
        >
          {["student", "instructor", "admin"].map((r) => (
            <label
              key={r}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: role === r ? "700" : "500",
                color: role === r ? "var(--primary)" : "#64748b",
              }}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
                style={{ cursor: "pointer" }}
              />
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </label>
          ))}
        </div>

        {error && <p className="alert error">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>

        <button className="button primary" type="submit">
          <LogIn size={18} /> Login as{" "}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>

        {role === "student" && (
          <p className="muted" style={{ marginTop: "16px" }}>
            New student?{" "}
            <Link
              to="/student/register"
              style={{ color: "var(--primary)", fontWeight: "600" }}
            >
              Register here
            </Link>
          </p>
        )}
      </form>
    </section>
  );
}
