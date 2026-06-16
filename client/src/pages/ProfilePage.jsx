import {
  User,
  Mail,
  Calendar,
  Flag,
  Phone,
  School,
  Edit2,
  Check,
  X,
  Building2,
  KeyRound,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import { DEPARTMENTS } from "../constants.js";

const CHANGE_PASSWORD_ENDPOINTS = {
  student: "/students/me/change-password",
  instructor: "/instructors/me/change-password",
  admin: "/admin/me/change-password",
};

function ChangePasswordCard({ role }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await api(CHANGE_PASSWORD_ENDPOINTS[role], {
        method: "POST",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      setMessage(res.message || "Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="form-card"
      style={{ maxWidth: "100%", width: "100%", marginTop: "24px" }}
    >
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <KeyRound size={22} /> Change Password
      </h2>
      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          alignItems: "end",
        }}
      >
        <label className="profile-item">
          <span>Current Password</span>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
            required
          />
        </label>
        <label className="profile-item">
          <span>New Password</span>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
        </label>
        <label className="profile-item">
          <span>Confirm New Password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
        </label>
        <button
          className="button primary"
          type="submit"
          disabled={loading}
          style={{ gridColumn: "1 / -1", width: "fit-content" }}
        >
          <KeyRound size={16} /> {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export function ProfilePage() {
  const { user, role, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="page">Loading...</div>;

  const handleEdit = () => {
    setForm(
      role === "instructor"
        ? {
            fname: user.fname || "",
            mname: user.mname || "",
            lname: user.lname || "",
            contact: user.contact || "",
            departments: user.departments || [],
          }
        : {
            name: user.name || "",
            dob: user.dob || "",
            nationality: user.nationality || "",
            contact: user.contact || "",
            gpa: user.gpa || "",
          },
    );
    setIsEditing(true);
  };

  const toggleDepartment = (dept) => {
    setForm((prev) => {
      const current = prev.departments || [];
      return {
        ...prev,
        departments: current.includes(dept)
          ? current.filter((d) => d !== dept)
          : [...current, dept],
      };
    });
  };

  const handleSave = async () => {
    if (
      role === "instructor" &&
      (!form.departments || form.departments.length === 0)
    ) {
      alert("Please select at least one department.");
      return;
    }
    setLoading(true);
    try {
      const endpoint =
        role === "instructor" ? "/instructors/me" : "/students/me";
      const res = await api(endpoint, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      updateUser(role === "instructor" ? res.instructor : res.student);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canEditProfile = role === "student" || role === "instructor";

  return (
    <section className="page medium">
      <div className="form-card" style={{ maxWidth: "100%", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "4px",
              }}
            >
              <User size={32} /> {user.name}&apos;s Profile
            </h1>
            <p className="muted" style={{ textTransform: "capitalize" }}>
              Role: {role}
            </p>
          </div>
          {canEditProfile &&
            (!isEditing ? (
              <button className="button ghost" onClick={handleEdit}>
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="button primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Check size={16} /> {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="button ghost"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
          }}
        >
          {role === "student" && (
            <>
              <div className="profile-item">
                <label>
                  <User size={16} /> Full Name
                </label>
                {isEditing ? (
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                ) : (
                  <p>{user.name}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <Mail size={16} /> Email
                </label>
                <p>
                  {user.email}{" "}
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    (Fixed)
                  </span>
                </p>
              </div>
              <div className="profile-item">
                <label>
                  <Calendar size={16} /> Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={form.dob ? form.dob.slice(0, 10) : ""}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                ) : (
                  <p>
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString()
                      : "Not set"}
                  </p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <Flag size={16} /> Nationality
                </label>
                {isEditing ? (
                  <input
                    value={form.nationality}
                    onChange={(e) =>
                      setForm({ ...form, nationality: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.nationality || "Not set"}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <Phone size={16} /> Contact
                </label>
                {isEditing ? (
                  <input
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.contact || "Not set"}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <School size={16} /> GPA
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={form.gpa}
                    onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                  />
                ) : (
                  <p>{user.gpa || "0.0"}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <Building2 size={16} /> Department
                </label>
                <p>
                  {user.department || "Not set"}{" "}
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    (Fixed)
                  </span>
                </p>
              </div>
              <div className="profile-item">
                <label>
                  <Building2 size={16} /> University
                </label>
                <p>{user.university || "NUST"}</p>
              </div>
            </>
          )}

          {role === "instructor" && (
            <>
              <div className="profile-item">
                <label>
                  <User size={16} /> First Name
                </label>
                {isEditing ? (
                  <input
                    value={form.fname}
                    onChange={(e) =>
                      setForm({ ...form, fname: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.fname}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <User size={16} /> Middle Name
                </label>
                {isEditing ? (
                  <input
                    value={form.mname}
                    onChange={(e) =>
                      setForm({ ...form, mname: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.mname || "-"}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <User size={16} /> Last Name
                </label>
                {isEditing ? (
                  <input
                    value={form.lname}
                    onChange={(e) =>
                      setForm({ ...form, lname: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.lname}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <Mail size={16} /> Email
                </label>
                <p>
                  {user.email}{" "}
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    (Fixed)
                  </span>
                </p>
              </div>
              <div className="profile-item">
                <label>
                  <Phone size={16} /> Contact
                </label>
                {isEditing ? (
                  <input
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.contact || "Not set"}</p>
                )}
              </div>
              <div
                className="profile-item"
                style={{ gridColumn: isEditing ? "1 / -1" : "auto" }}
              >
                <label>
                  <Building2 size={16} /> Departments
                </label>
                {isEditing ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <label
                        key={dept}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#0f172a",
                          margin: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(form.departments || []).includes(dept)}
                          onChange={() => toggleDepartment(dept)}
                          style={{ width: "auto" }}
                        />
                        {dept}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>{(user.departments || []).join(", ") || "Not set"}</p>
                )}
              </div>
              <div className="profile-item">
                <label>
                  <School size={16} /> University
                </label>
                <p>NUST</p>
              </div>
            </>
          )}

          {role === "admin" && (
            <>
              <div className="profile-item">
                <label>
                  <User size={16} /> Name
                </label>
                <p>{user.name}</p>
              </div>
              <div className="profile-item">
                <label>
                  <Mail size={16} /> Email
                </label>
                <p>{user.email}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <ChangePasswordCard role={role} />

      <style>{`
        .profile-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .profile-item > span {
          display: block;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .profile-item p {
          font-size: 1.1rem;
          font-weight: 500;
          padding: 8px 0;
        }
        .profile-item input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
        }
      `}</style>
    </section>
  );
}
