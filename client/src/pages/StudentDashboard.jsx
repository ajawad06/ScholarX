import { FilePlus2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { DataTable } from '../components/DataTable.jsx';
import { useAsync } from '../hooks/useAsync.js';

export function StudentDashboard() {
  const { data, error, loading } = useAsync(() => api('/students/me/dashboard'), []);

  if (loading) return <p className="page-status">Loading dashboard...</p>;
  if (error) return <p className="alert error">{error}</p>;

  return (
    <section className="page">
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--primary)',
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}>
            {data.student.profilePic ? (
              <img src={data.student.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '28px', fontWeight: '700', color: '#475569' }}>
                {data.student.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <label style={{ cursor: 'pointer', fontSize: '12px', color: 'var(--primary)', fontWeight: '600', margin: 0 }}>
            Upload Pic
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('profilePic', file);
                try {
                  await api('/students/me/profile-pic', { method: 'POST', body: fd });
                  window.location.reload();
                } catch (err) {
                  alert(err.message);
                }
              }} 
            />
          </label>
        </div>
        <div style={{ flexGrow: 1 }}>
          <p className="eyebrow">Student Dashboard</p>
          <h1>Welcome, {data.student.name}</h1>
          <p className="muted">{data.student.email} · {data.student.university} · GPA {data.student.gpa}</p>
        </div>
        <div className="toolbar">
          <Link className="button primary" to="/student/apply/exchange"><FilePlus2 size={18} /> Exchange</Link>
          <Link className="button ghost" to="/student/apply/scholarship"><FilePlus2 size={18} /> Scholarship</Link>
        </div>
      </div>
      <h2>Your Exchange Applications</h2>
      <DataTable
        rows={data.exchangeApplications}
        empty="No exchange applications found."
        columns={[
          { key: 'programName', label: 'Program' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <span className={`badge badge-${row.status.toLowerCase()}`}>{row.status}</span>
          },
          { key: 'applicationDate', label: 'Applied On' },
          { key: 'approvalDate', label: 'Approved On', render: (row) => row.approvalDate || '---' }
        ]}
      />
      <h2>Your Scholarship Applications</h2>
      <DataTable
        rows={data.scholarshipApplications}
        empty="No scholarship applications found."
        columns={[
          { key: 'scholarshipName', label: 'Scholarship' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <span className={`badge badge-${row.status.toLowerCase()}`}>{row.status}</span>
          },
          { key: 'applicationDate', label: 'Applied On' },
          { key: 'approvalDate', label: 'Approved On', render: (row) => row.approvalDate || '---' }
        ]}
      />
    </section>
  );
}
