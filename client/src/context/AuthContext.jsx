import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("scholarx-token"),
  );
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("scholarx-user") || "null"),
  );
  const [role, setRole] = useState(() =>
    sessionStorage.getItem("scholarx-role"),
  );

  async function login(nextRole, credentials) {
    const result = await api(`/auth/${nextRole}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    sessionStorage.setItem("scholarx-token", result.token);
    sessionStorage.setItem("scholarx-user", JSON.stringify(result.user));
    sessionStorage.setItem("scholarx-role", nextRole);
    setToken(result.token);
    setUser(result.user);
    setRole(nextRole);
    return result.user;
  }

  function logout() {
    sessionStorage.removeItem("scholarx-token");
    sessionStorage.removeItem("scholarx-user");
    sessionStorage.removeItem("scholarx-role");
    setToken(null);
    setUser(null);
    setRole(null);
  }

  function updateUser(updatedFields) {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      sessionStorage.setItem("scholarx-user", JSON.stringify(nextUser));
      return nextUser;
    });
  }

  const value = useMemo(
    () => ({ token, user, role, login, logout, updateUser, setUser }),
    [token, user, role],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
