import { Check, Search, X } from "lucide-react";
import { useState } from "react";
import { api, openApplicationDocument } from "../api.js";
import { DataTable } from "../components/DataTable.jsx";
import { useAsync } from "../hooks/useAsync.js";

function DocumentButton({ label, type, id, field }) {
  return (
    <button
      type="button"
      className="button ghost"
      style={{
        fontSize: "11px",
        padding: "4px 8px",
        minHeight: "auto",
        display: "inline-flex",
        width: "fit-content",
      }}
      onClick={async () => {
        try {
          await openApplicationDocument(type, id, field);
        } catch (err) {
          alert(`Could not open document: ${err.message}`);
        }
      }}
    >
      {label}
    </button>
  );
}

function exchangeDocuments(row) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {row.studentIdCard && (
        <DocumentButton
          label="ID Card"
          type="exchange"
          id={row.id}
          field="studentIdCard"
        />
      )}
      {row.personalStatement && (
        <DocumentButton
          label="Statement"
          type="exchange"
          id={row.id}
          field="personalStatement"
        />
      )}
      {row.transcript && (
        <DocumentButton
          label="Transcript"
          type="exchange"
          id={row.id}
          field="transcript"
        />
      )}
      {row.recommendationLetter && (
        <DocumentButton
          label="Rec Letter"
          type="exchange"
          id={row.id}
          field="recommendationLetter"
        />
      )}
    </div>
  );
}

function scholarshipDocuments(row) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {row.studentIdCard && (
        <DocumentButton
          label="ID Card"
          type="scholarship"
          id={row.id}
          field="studentIdCard"
        />
      )}
      {row.transcript && (
        <DocumentButton
          label="Transcript"
          type="scholarship"
          id={row.id}
          field="transcript"
        />
      )}
    </div>
  );
}

export function ReviewApplications() {
  const [search, setSearch] = useState("");
  const { data, error, loading, setData } = useAsync(
    () => api(`/instructors/applications?search=${encodeURIComponent(search)}`),
    [search],
  );

  async function act(type, id, action) {
    try {
      await api(`/instructors/applications/${type}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setData((current) => ({
        exchangeApplications: current.exchangeApplications.filter(
          (item) => !(type === "exchange" && item.id === id),
        ),
        scholarshipApplications: current.scholarshipApplications.filter(
          (item) => !(type === "scholarship" && item.id === id),
        ),
      }));
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    }
  }

  const actionColumn = (type) => ({
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="row-actions">
        <button
          className="mini approve"
          type="button"
          onClick={() => act(type, row.id, "Approved")}
        >
          <Check size={16} /> Approve
        </button>
        <button
          className="mini reject"
          type="button"
          onClick={() => act(type, row.id, "Rejected")}
        >
          <X size={16} /> Reject
        </button>
      </div>
    ),
  });

  if (loading) return <p className="page-status">Loading applications...</p>;
  if (error) return <p className="alert error">{error}</p>;

  return (
    <section className="page">
      <div className="page-heading split">
        <div>
          <p className="eyebrow">Review</p>
          <h1>Pending Applications</h1>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or opportunity"
          />
        </label>
      </div>
      <h2>Exchange Program Applications</h2>
      <DataTable
        rows={data.exchangeApplications}
        empty="No pending exchange applications."
        columns={[
          { key: "studentName", label: "Student" },
          { key: "department", label: "Department" },
          { key: "gpa", label: "GPA" },
          { key: "university", label: "University" },
          { key: "programName", label: "Program" },
          {
            key: "documents",
            label: "Documents",
            render: exchangeDocuments,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span className={`badge badge-${row.status.toLowerCase()}`}>
                {row.status}
              </span>
            ),
          },
          actionColumn("exchange"),
        ]}
      />
      <h2>Scholarship Applications</h2>
      <DataTable
        rows={data.scholarshipApplications}
        empty="No pending scholarship applications."
        columns={[
          { key: "studentName", label: "Student" },
          { key: "department", label: "Department" },
          { key: "gpa", label: "GPA" },
          { key: "university", label: "University" },
          { key: "scholarshipName", label: "Scholarship" },
          {
            key: "documents",
            label: "Documents",
            render: scholarshipDocuments,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span className={`badge badge-${row.status.toLowerCase()}`}>
                {row.status}
              </span>
            ),
          },
          actionColumn("scholarship"),
        ]}
      />
    </section>
  );
}
