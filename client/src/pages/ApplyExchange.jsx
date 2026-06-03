import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { ApplicationForm } from './ApplicationForm.jsx';

export function ApplyExchange() {
  const navigate = useNavigate();
  return (
    <ApplicationForm
      title="Exchange Program Application"
      itemKey="programs"
      selectName="programId"
      optionLabel={(item) => `${item.name} (Starts: ${item.startDate})`}
      onSubmit={async (formData) => {
        await api('/students/me/exchange-applications', { method: 'POST', body: formData });
        navigate('/student/dashboard');
      }}
    />
  );
}
