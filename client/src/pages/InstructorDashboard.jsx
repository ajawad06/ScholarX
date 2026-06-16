import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { AuthMedia } from '../components/AuthMedia.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function InstructorDashboard() {
  const { user, updateUser } = useAuth();

  return (
    <section className="page narrow">
      <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
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
            {user?.profilePic ? (
              <AuthMedia
                path={user.profilePic}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '28px', fontWeight: '700', color: '#475569' }}>
                {user?.name?.charAt(0).toUpperCase() || 'I'}
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
                  const res = await api('/instructors/me/profile-pic', { method: 'POST', body: fd });
                  updateUser({ profilePic: res.profilePic });
                } catch (err) {
                  alert(err.message);
                }
              }} 
            />
          </label>
        </div>
        <div style={{ flexGrow: 1, minWidth: '200px' }}>
          <p className="eyebrow">Instructor Dashboard</p>
          <h1>Welcome, {user?.name}</h1>
          <p className="muted" style={{ marginBottom: '16px' }}>{(user?.departments || []).join(', ') || 'No departments assigned'} · University ID {user?.universityId}</p>
          <Link className="button primary" to="/instructor/applications"><ClipboardList size={18} /> Review Applications</Link>
        </div>
      </div>
    </section>
  );
}
