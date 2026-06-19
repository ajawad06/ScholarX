import { Trash2 } from "lucide-react";
import { api } from "../api.js";
import { DataTable } from "../components/DataTable.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useAuth } from "../context/AuthContext.jsx";

export function Catalog() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { data, error, loading, setData } = useAsync(() => api("/catalog"), []);

  if (loading) return <p className="page-status">Loading catalog...</p>;
  if (error) return <p className="alert error">{error}</p>;

  const getUniversityName = (id) => {
    const uni = data.universities.find((u) => u.id === Number(id));
    return uni
      ? `${uni.name} (${uni.city}, ${uni.country})`
      : `University ${id}`;
  };

  async function remove(path) {
    try {
      await api(path, { method: "DELETE" });
      setData(await api("/catalog"));
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    }
  }

  const adminAction = (basePath) => ({
    key: "action",
    label: "Action",
    render: (row) => (
      <button
        className="mini reject"
        type="button"
        onClick={() => remove(`${basePath}/${row.id}`)}
      >
        <Trash2 size={16} /> Delete
      </button>
    ),
  });

  const programColumns = [
    { key: "name", label: "Name" },
    { key: "duration", label: "Duration" },
    { key: "requirements", label: "Requirements" },
    {
      key: "startDate",
      label: "Start Date",
      render: (row) => (
        <span style={{ whiteSpace: "nowrap" }}>{row.startDate}</span>
      ),
    },
    {
      key: "universityId",
      label: "University",
      render: (row) => getUniversityName(row.universityId),
    },
  ];

  const scholarshipColumns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "fundingOrganization", label: "Funding Org." },
    { key: "coverage", label: "Coverage" },
    {
      key: "amount",
      label: "Amount",
      render: (row) =>
        row.amount ? `$${Number(row.amount).toLocaleString()}` : "---",
    },
    {
      key: "deadline",
      label: "Deadline",
      render: (row) => (
        <span style={{ whiteSpace: "nowrap" }}>{row.deadline}</span>
      ),
    },
  ];

  if (isAdmin) {
    programColumns.push(adminAction("/admin/programs"));
    scholarshipColumns.push(adminAction("/admin/scholarships"));
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Programs and Scholarships</h1>
        </div>
      </div>
      <h2>Exchange Programs</h2>
      <DataTable rows={data.programs} columns={programColumns} />
      <h2>Scholarships</h2>
      <DataTable rows={data.scholarships} columns={scholarshipColumns} />
    </section>
  );
}
