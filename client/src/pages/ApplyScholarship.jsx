import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { ApplicationForm } from './ApplicationForm.jsx';

export function ApplyScholarship() {
  const navigate = useNavigate();
  return (
    <ApplicationForm
      title="Scholarship Application"
      itemKey="scholarships"
      selectName="scholarshipId"
      optionLabel={(item) => `${item.name} (Deadline: ${item.deadline})`}
      onSubmit={async (formData) => {
        await api('/students/me/scholarship-applications', { method: 'POST', body: formData });
        navigate('/student/dashboard');
      }}
    />
  );
}
