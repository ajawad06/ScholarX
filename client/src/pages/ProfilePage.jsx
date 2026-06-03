import { User, Mail, Calendar, Flag, Phone, School } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export function ProfilePage() {
  const { user, role } = useAuth();

  if (!user) return <div className="page">Loading...</div>;

  return (
    <section className="page narrow">
      <div className="form-card">
        <h1 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <User size={32} /> {user.name}'s Profile
        </h1>
        <p
          className="muted"
          style={{ textTransform: "capitalize", marginBottom: "24px" }}
        >
          Role: {role}
        </p>

        <div style={{ display: "grid", gap: "20px" }}>
          <div className="profile-item">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#64748b",
              }}
            >
              <Mail size={16} /> Email
            </label>
            <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
              {user.email}
            </p>
          </div>

          {user.dob && (
            <div className="profile-item">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#64748b",
                }}
              >
                <Calendar size={16} /> Date of Birth
              </label>
              <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                {new Date(user.dob).toLocaleDateString()}
              </p>
            </div>
          )}

          {user.nationality && (
            <div className="profile-item">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#64748b",
                }}
              >
                <Flag size={16} /> Nationality
              </label>
              <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                {user.nationality}
              </p>
            </div>
          )}

          {user.contact && (
            <div className="profile-item">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#64748b",
                }}
              >
                <Phone size={16} /> Contact
              </label>
              <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                {user.contact}
              </p>
            </div>
          )}

          {user.universityId && (
            <div className="profile-item">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#64748b",
                }}
              >
                <School size={16} /> University ID
              </label>
              <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                #{user.universityId}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
