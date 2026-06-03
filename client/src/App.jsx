import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { AdminPanel } from "./pages/AdminPanel.jsx";
import { ApplyExchange } from "./pages/ApplyExchange.jsx";
import { ApplyScholarship } from "./pages/ApplyScholarship.jsx";
import { Catalog } from "./pages/Catalog.jsx";
import { Home } from "./pages/Home.jsx";
import { InstructorDashboard } from "./pages/InstructorDashboard.jsx";
import { ReviewApplications } from "./pages/ReviewApplications.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import { StudentRegister } from "./pages/StudentRegister.jsx";
import { UnifiedLogin } from "./pages/UnifiedLogin.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Protected({ role, children }) {
  const auth = useAuth();
  if (!auth.token || auth.role !== role)
    return <Navigate to="/login" replace />;
  return children;
}

function UserProtected({ children }) {
  const auth = useAuth();
  if (!auth.token) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/login" element={<UnifiedLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route
          path="/student/dashboard"
          element={
            <Protected role="student">
              <StudentDashboard />
            </Protected>
          }
        />
        <Route
          path="/student/apply/exchange"
          element={
            <Protected role="student">
              <ApplyExchange />
            </Protected>
          }
        />
        <Route
          path="/student/apply/scholarship"
          element={
            <Protected role="student">
              <ApplyScholarship />
            </Protected>
          }
        />
        <Route
          path="/instructor/dashboard"
          element={
            <Protected role="instructor">
              <InstructorDashboard />
            </Protected>
          }
        />
        <Route
          path="/instructor/applications"
          element={
            <Protected role="instructor">
              <ReviewApplications />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected role="admin">
              <AdminPanel />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <UserProtected>
              <ProfilePage />
            </UserProtected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
