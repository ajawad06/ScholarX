import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";

export function ApplicationForm({
  title,
  itemKey,
  selectName,
  optionLabel,
  onSubmit,
}) {
  const navigate = useNavigate();
  const { data, error, loading } = useAsync(async () => {
    const [catalog, dashboard] = await Promise.all([
      api("/catalog"),
      api("/students/me/dashboard"),
    ]);
    return { catalog, dashboard };
  }, []);
  const [selected, setSelected] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [studentIdCard, setStudentIdCard] = useState(null);
  const [personalStatement, setPersonalStatement] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [recommendationLetter, setRecommendationLetter] = useState(null);

  if (loading) return <p className="page-status">Loading form...</p>;
  if (error) return <p className="alert error">{error}</p>;

  const items = data.catalog[itemKey];
  const student = data.dashboard.student;
  const value = selected || String(items[0]?.id || "");

  async function submit(event) {
    event.preventDefault();
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append(selectName, value);

      if (!studentIdCard) {
        throw new Error("Student ID card is required.");
      }
      formData.append("studentIdCard", studentIdCard);

      if (!transcript) {
        throw new Error("Transcript is required.");
      }
      formData.append("transcript", transcript);

      if (itemKey === "programs") {
        if (!personalStatement || !recommendationLetter) {
          throw new Error(
            "All required exchange program documents (Personal Statement, Transcript, Recommendation Letter) must be uploaded.",
          );
        }
        formData.append("personalStatement", personalStatement);
        formData.append("recommendationLetter", recommendationLetter);
      }

      await onSubmit(formData);
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  return (
    <section className="page medium">
      <form className="form-card" onSubmit={submit}>
        <div className="split" style={{ alignItems: "center" }}>
          <div>
            <p className="eyebrow">Application Form</p>
            <h1>{title}</h1>
          </div>
          <button
            type="button"
            className="button ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {submitError && <p className="alert error">{submitError}</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            background: "#f8fafc",
            padding: "24px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
          }}
        >
          <label>
            Full Name
            <input value={student.name} readOnly />
          </label>
          <label>
            Email Address
            <input value={student.email} readOnly />
          </label>
          <label>
            Date of Birth
            <input type="date" value={student.dob || ""} readOnly />
          </label>
          <label>
            Nationality
            <input value={student.nationality || ""} readOnly />
          </label>
          <label style={{ gridColumn: "span 2" }}>
            Contact Number
            <input value={student.contact || ""} readOnly />
          </label>
        </div>

        <label style={{ marginTop: "10px" }}>
          Select Opportunity
          <select
            name={selectName}
            value={value}
            onChange={(event) => setSelected(event.target.value)}
            required
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {optionLabel(item)}
              </option>
            ))}
          </select>
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <label>
            Student ID Card (PDF/Image)
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setStudentIdCard(e.target.files[0])}
              required
            />
          </label>
          <label>
            Latest Transcript (PDF/Image)
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setTranscript(e.target.files[0])}
              required
            />
          </label>
          {itemKey === "programs" && (
            <>
              <label>
                Personal Statement (PDF/Image)
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setPersonalStatement(e.target.files[0])}
                  required
                />
              </label>
              <label>
                Recommendation Letter (PDF/Image)
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setRecommendationLetter(e.target.files[0])}
                  required
                />
              </label>
            </>
          )}
        </div>

        <div className="toolbar" style={{ marginTop: "10px" }}>
          <button className="button primary" type="submit">
            <Send size={18} /> Submit Application
          </button>
        </div>
      </form>
    </section>
  );
}
