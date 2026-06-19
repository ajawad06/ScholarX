import { api } from "../api.js";
import { DataTable } from "../components/DataTable.jsx";
import { useAsync } from "../hooks/useAsync.js";

export function Catalog() {
  const { data, error, loading } = useAsync(() => api("/catalog"), []);

  if (loading) return <p className="page-status">Loading catalog...</p>;
  if (error) return <p className="alert error">{error}</p>;

  const getUniversityName = (id) => {
    const uni = data.universities.find((u) => u.id === Number(id));
    return uni
      ? `${uni.name} (${uni.city}, ${uni.country})`
      : `University ${id}`;
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Programs and Scholarships</h1>
        </div>
      </div>
      <h2>Exchange Programs</h2>
      <DataTable
        rows={data.programs}
        columns={[
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
        ]}
      />
      <h2>Scholarships</h2>
      <DataTable
        rows={data.scholarships}
        columns={[
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
        ]}
      />
    </section>
  );
}
