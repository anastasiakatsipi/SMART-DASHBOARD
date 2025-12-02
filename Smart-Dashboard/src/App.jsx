import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "@/auth/ProtectedRoute";
import routes from "@/routes";

function App() {
  const dashboardRoutes = routes.find((r) => r.layout === "dashboard").pages;
  const authRoutes = routes.find((r) => r.layout === "auth").pages;

  return (
    <Routes>
      
      {/* Dashboard layout */}
      <Route path="/dashboard/*" element={<Dashboard />}>
        {dashboardRoutes.map(({ path, element, roles }) => (
          <Route
            key={path}
            path={path.replace("/", "")}
            element={
              <ProtectedRoute roles={roles}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Auth layout */}
      <Route path="/auth/*" element={<Auth />}>
        {authRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path.replace("/", "")}
            element={element}
          />
        ))}
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
