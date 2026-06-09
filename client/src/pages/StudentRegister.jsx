import { Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  dob: "",
  nationality: "",
  contact: "",
  universityId: "1",
  gpa: "",
};

export function StudentRegister() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/students/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page narrow">
      <form className="form-card" onSubmit={submit}>
        <h1>Student Registration</h1>
        {error && <p className="alert error">{error}</p>}
        <label>
          Full Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
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
        <label>
          Date of Birth
          <input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            required
          />
        </label>
        <label>
          Nationality
          <input
            value={form.nationality}
            onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            required
          />
        </label>
        <label>
          Contact
          <input
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />
        </label>
        <label>
          GPA
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={form.gpa}
            onChange={(e) => setForm({ ...form, gpa: e.target.value })}
            required
          />
        </label>
        <button className="button primary" type="submit">
          <Save size={18} /> Register
        </button>
      </form>
    </section>
  );
}
