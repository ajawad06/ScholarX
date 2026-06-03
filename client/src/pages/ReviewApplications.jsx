import { Check, Search, X } from "lucide-react";
import { useState } from "react";
import { api } from "../api.js";
import { DataTable } from "../components/DataTable.jsx";
import { useAsync } from "../hooks/useAsync.js";

export function ReviewApplications() {
  const [search, setSearch] = useState("");
  const { data, error, loading, setData } = useAsync(
    () => api(`/instructors/applications?search=${encodeURIComponent(search)}`),
    [search],
  );

  async function act(type, id, action) {
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
          { key: "gpa", label: "GPA" },
          { key: "university", label: "University" },
          { key: "programName", label: "Program" },
          {
            key: "documents",
            label: "Documents",
            render: (row) => (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {row.studentIdCard && (
                  <a
                    href={row.studentIdCard}
                    target="_blank"
                    rel="noreferrer"
                    className="button ghost"
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      minHeight: "auto",
                      display: "inline-flex",
                      width: "fit-content",
                    }}
                  >
                    ID Card
                  </a>
                )}
                {row.personalStatement && (
                  <a
                    href={row.personalStatement}
                    target="_blank"
                    rel="noreferrer"
                    className="button ghost"
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      minHeight: "auto",
                      display: "inline-flex",
                      width: "fit-content",
                    }}
                  >
                    Statement
                  </a>
                )}
                {row.transcript && (
                  <a
                    href={row.transcript}
                    target="_blank"
                    rel="noreferrer"
                    className="button ghost"
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      minHeight: "auto",
                      display: "inline-flex",
                      width: "fit-content",
                    }}
                  >
                    Transcript
                  </a>
                )}
                {row.recommendationLetter && (
                  <a
                    href={row.recommendationLetter}
                    target="_blank"
                    rel="noreferrer"
                    className="button ghost"
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      minHeight: "auto",
                      display: "inline-flex",
                      width: "fit-content",
                    }}
                  >
                    Rec Letter
                  </a>
                )}
              </div>
            ),
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
          { key: "gpa", label: "GPA" },
          { key: "university", label: "University" },
          { key: "scholarshipName", label: "Scholarship" },
          {
            key: "documents",
            label: "Documents",
            render: (row) => (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {row.studentIdCard && (
                  <a
                    href={row.studentIdCard}
                    target="_blank"
                    rel="noreferrer"
                    className="button ghost"
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      minHeight: "auto",
                      display: "inline-flex",
                      width: "fit-content",
                    }}
                  >
                    ID Card
                  </a>
                )}
                {row.transcript && (
                  <a
                    href={row.transcript}
                    target="_blank"
                    rel="noreferrer"
                    className="button ghost"
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      minHeight: "auto",
                      display: "inline-flex",
                      width: "fit-content",
                    }}
                  >
                    Transcript
                  </a>
                )}
              </div>
            ),
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
