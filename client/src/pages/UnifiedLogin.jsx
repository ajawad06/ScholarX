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
      } else if (role === "instructor") {
        navigate("/instructor/applications");
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

        <div className="role-switch">
          {["student", "instructor", "admin"].map((r) => (
            <label
              key={r}
              className={`role-option ${role === r ? "active" : ""}`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
              />
              {r}
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
