import {
  GraduationCap,
  Home,
  LibraryBig,
  LogOut,
  Settings,
  User,
  UserRoundCheck,
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
                <Link to="/instructor/dashboard">
                  <UserRoundCheck size={18} /> Dashboard
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
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
