import {
  ClipboardList,
  GraduationCap,
  Home,
  LibraryBig,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Layout() {
  const auth = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <img src="/uploads/NUST-logo.png" alt="NUST logo" />
          <span>ScholarX</span>
        </Link>
        <nav className="nav">
          {!auth.token ? (
            <>
              <Link to="/">
                <Home size={18} /> Home
              </Link>
              <Link to="/catalog">
                <LibraryBig size={18} /> Catalog
              </Link>
              <Link to="/login">
                <GraduationCap size={18} /> Login
              </Link>
            </>
          ) : (
            <>
              {auth.role === "student" && (
                <Link to="/student/dashboard">
                  <GraduationCap size={18} /> Dashboard
                </Link>
              )}
              {auth.role === "instructor" && (
                <Link to="/instructor/applications">
                  <ClipboardList size={18} /> Applications
                </Link>
              )}
              {auth.role === "admin" && (
                <Link to="/admin">
                  <Settings size={18} /> Admin Panel
                </Link>
              )}
              <Link to="/catalog">
                <LibraryBig size={18} /> Catalog
              </Link>
              <Link to="/profile">
                <User size={18} /> Profile
              </Link>
              <button
                type="button"
                className="icon-text danger"
                onClick={auth.logout}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span>ScholarX</span>
            <p className="footer-tagline">Exchange &amp; scholarship portal</p>
          </div>
          <p className="footer-meta">
            © {new Date().getFullYear()} NUST ·{" "}
            <a href="https://nust.edu.pk" target="_blank" rel="noreferrer">
              nust.edu.pk
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
