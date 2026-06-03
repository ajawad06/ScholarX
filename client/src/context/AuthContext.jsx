import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('scholarx-token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('scholarx-user') || 'null'));
  const [role, setRole] = useState(() => localStorage.getItem('scholarx-role'));

  async function login(nextRole, credentials) {
    const result = await api(`/auth/${nextRole}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    localStorage.setItem('scholarx-token', result.token);
    localStorage.setItem('scholarx-user', JSON.stringify(result.user));
    localStorage.setItem('scholarx-role', nextRole);
    setToken(result.token);
    setUser(result.user);
    setRole(nextRole);
    return result.user;
  }

  function logout() {
    localStorage.removeItem('scholarx-token');
    localStorage.removeItem('scholarx-user');
    localStorage.removeItem('scholarx-role');
    setToken(null);
    setUser(null);
    setRole(null);
  }

  function updateUser(updatedFields) {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem('scholarx-user', JSON.stringify(nextUser));
      return nextUser;
    });
  }

  const value = useMemo(() => ({ token, user, role, login, logout, updateUser }), [token, user, role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
