import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../api.js";
import { DataTable } from "../components/DataTable.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { DEPARTMENTS } from "../constants.js";

export function AdminPanel() {
  const { data, error, loading, setData } = useAsync(
    () => api("/admin/overview"),
    [],
  );
  const [program, setProgram] = useState({
    name: "",
    duration: "",
    requirements: "",
    startDate: "",
    universityId: "",
  });
  const [scholarship, setScholarship] = useState({
    name: "",
    description: "",
    criteria: "",
    fundingOrganization: "",
    coverage: "",
    amount: "",
    deadline: "",
  });
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    nationality: "",
    contact: "",
    universityId: "",
    department: "",
    gpa: "",
  });
  const [instructor, setInstructor] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    contact: "",
    departments: [],
    universityId: "1",
  });

  function toggleInstructorDepartment(dept) {
    setInstructor((prev) => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept],
    }));
  }
  const [newUniv, setNewUniv] = useState({
    name: "",
    city: "",
    country: "",
    address: "",
  });

  if (loading) return <p className="page-status">Loading admin panel...</p>;
  if (error) return <p className="alert error">{error}</p>;

  async function refresh() {
    setData(await api("/admin/overview"));
  }

  async function create(path, payload, reset) {
    await api(path, { method: "POST", body: JSON.stringify(payload) });
    reset();
    await refresh();
  }

  async function remove(path) {
    await api(path, { method: "DELETE" });
    await refresh();
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Manage ScholarX Records</h1>
        </div>
      </div>
      <div className="admin-grid">
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            const hostUniversities = data.universities.filter(
              (u) => u.id !== 1,
            );
            const payload = {
              ...program,
              universityId:
                program.universityId || String(hostUniversities[0]?.id || ""),
            };
            create("/admin/programs", payload, () =>
              setProgram({
                name: "",
                duration: "",
                requirements: "",
                startDate: "",
                universityId: "",
              }),
            );
          }}
        >
          <h2>Add Exchange Program</h2>
          <input
            placeholder="Program Name"
            value={program.name}
            onChange={(e) => setProgram({ ...program, name: e.target.value })}
            required
          />
          <input
            placeholder="Duration"
            value={program.duration}
            onChange={(e) =>
              setProgram({ ...program, duration: e.target.value })
            }
            required
          />
          <input
            placeholder="Requirements"
            value={program.requirements}
            onChange={(e) =>
              setProgram({ ...program, requirements: e.target.value })
            }
          />
          <input
            type="date"
            value={program.startDate}
            onChange={(e) =>
              setProgram({ ...program, startDate: e.target.value })
            }
            required
          />
          <label style={{ fontSize: "13px", fontWeight: "600" }}>
            University
            <select
              value={program.universityId}
              onChange={(e) =>
                setProgram({ ...program, universityId: e.target.value })
              }
              required
            >
              {data.universities
                .filter((u) => u.id !== 1)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </label>
          <button className="button primary" type="submit">
            <Plus size={18} /> Add Program
          </button>
        </form>
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            create("/admin/scholarships", scholarship, () =>
              setScholarship({
                name: "",
                description: "",
                criteria: "",
                fundingOrganization: "",
                coverage: "",
                amount: "",
                deadline: "",
              }),
            );
          }}
        >
          <h2>Add Scholarship</h2>
          <input
            placeholder="Scholarship Name"
            value={scholarship.name}
            onChange={(e) =>
              setScholarship({ ...scholarship, name: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={scholarship.description}
            onChange={(e) =>
              setScholarship({ ...scholarship, description: e.target.value })
            }
            required
          />
          <input
            placeholder="Criteria"
            value={scholarship.criteria}
            onChange={(e) =>
              setScholarship({ ...scholarship, criteria: e.target.value })
            }
          />
          <input
            placeholder="Funding Organization"
            value={scholarship.fundingOrganization}
            onChange={(e) =>
              setScholarship({
                ...scholarship,
                fundingOrganization: e.target.value,
              })
            }
          />
          <input
            placeholder="Coverage"
            value={scholarship.coverage}
            onChange={(e) =>
              setScholarship({ ...scholarship, coverage: e.target.value })
            }
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={scholarship.amount}
            onChange={(e) =>
              setScholarship({ ...scholarship, amount: e.target.value })
            }
          />
          <input
            type="date"
            value={scholarship.deadline}
            onChange={(e) =>
              setScholarship({ ...scholarship, deadline: e.target.value })
            }
            required
          />
          <button className="button primary" type="submit">
            <Plus size={18} /> Add Scholarship
          </button>
        </form>
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            create("/admin/universities", newUniv, () =>
              setNewUniv({ name: "", city: "", country: "", address: "" }),
            );
          }}
        >
          <h2>Verify & Add University</h2>
          <input
            placeholder="University Name (e.g. Stanford University)"
            value={newUniv.name}
            onChange={(e) => setNewUniv({ ...newUniv, name: e.target.value })}
            required
          />
          <input
            placeholder="City"
            value={newUniv.city}
            onChange={(e) => setNewUniv({ ...newUniv, city: e.target.value })}
            required
          />
          <input
            placeholder="Country"
            value={newUniv.country}
            onChange={(e) =>
              setNewUniv({ ...newUniv, country: e.target.value })
            }
            required
          />
          <input
            placeholder="Website/Address"
            value={newUniv.address}
            onChange={(e) =>
              setNewUniv({ ...newUniv, address: e.target.value })
            }
            required
          />
          <button className="button primary" type="submit">
            <Plus size={18} /> Add & Verify
          </button>
        </form>
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            const payload = {
              ...instructor,
              universityId: "1", // Fixed to NUST
            };
            if (instructor.departments.length === 0) {
              alert("Select at least one department for the instructor.");
              return;
            }
            create("/admin/instructors", payload, () =>
              setInstructor({
                fname: "",
                mname: "",
                lname: "",
                email: "",
                password: "",
                contact: "",
                departments: [],
                universityId: "1",
              }),
            );
          }}
        >
          <h2>Add Instructor</h2>
          <input
            placeholder="First Name"
            value={instructor.fname}
            onChange={(e) =>
              setInstructor({ ...instructor, fname: e.target.value })
            }
            required
          />
          <input
            placeholder="Middle Name"
            value={instructor.mname}
            onChange={(e) =>
              setInstructor({ ...instructor, mname: e.target.value })
            }
          />
          <input
            placeholder="Last Name"
            value={instructor.lname}
            onChange={(e) =>
              setInstructor({ ...instructor, lname: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={instructor.email}
            onChange={(e) =>
              setInstructor({ ...instructor, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={instructor.password}
            onChange={(e) =>
              setInstructor({ ...instructor, password: e.target.value })
            }
            required
          />
          <input
            placeholder="Contact"
            value={instructor.contact}
            onChange={(e) =>
              setInstructor({ ...instructor, contact: e.target.value })
            }
            required
          />
          <fieldset
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px",
              margin: 0,
            }}
          >
            <legend
              style={{ fontSize: "13px", fontWeight: "600", padding: "0 6px" }}
            >
              Departments (select one or more)
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
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
                  }}
                >
                  <input
                    type="checkbox"
                    checked={instructor.departments.includes(dept)}
                    onChange={() => toggleInstructorDepartment(dept)}
                    style={{ width: "auto" }}
                  />
                  {dept}
                </label>
              ))}
            </div>
          </fieldset>
          <button className="button primary" type="submit">
            <Plus size={18} /> Add Instructor
          </button>
        </form>
      </div>
      <h2>Student Records</h2>
      <DataTable
        rows={data.students}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "department", label: "Department" },
          { key: "gpa", label: "GPA" },
          {
            key: "action",
            label: "Action",
            render: (row) => (
              <button
                className="mini reject"
                type="button"
                onClick={() => remove(`/admin/students/${row.id}`)}
              >
                <Trash2 size={16} /> Delete
              </button>
            ),
          },
        ]}
      />
      <h2>Instructor Records</h2>
      <DataTable
        rows={data.instructors}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "departments",
            label: "Departments",
            render: (row) => (row.departments || []).join(", ") || "—",
          },
          { key: "contact", label: "Contact" },
          {
            key: "action",
            label: "Action",
            render: (row) => (
              <button
                className="mini reject"
                type="button"
                onClick={() => remove(`/admin/instructors/${row.id}`)}
              >
                <Trash2 size={16} /> Delete
              </button>
            ),
          },
        ]}
      />
      <h2>Existing Universities</h2>
      <DataTable
        rows={data.universities}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "city", label: "City" },
          { key: "country", label: "Country" },
          {
            key: "address",
            label: "Website",
            render: (row) => (
              <a
                href={row.address}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                {row.address}
              </a>
            ),
          },
        ]}
      />
    </section>
  );
}
