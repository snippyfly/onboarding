import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts (stubs until Phase 3)
import CustomerShell from './layouts/CustomerShell';
import OpsShell from './layouts/OpsShell';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EnterprisePage from './pages/EnterprisePage';
import ApiDetailPage from './pages/ApiDetailPage';
import UserManagementPage from './pages/UserManagementPage';
import TenantManagementPage from './pages/ops/TenantManagementPage';
import OpsEnterprisePage from './pages/ops/OpsEnterprisePage';
import IsvAuthorizationPage from './pages/ops/IsvAuthorizationPage';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={user.defaultPath} replace />;
  return children || <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Customer platform routes */}
          <Route element={<ProtectedRoute><CustomerShell /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/api" element={<ApiDetailPage />} />
            <Route path="/users" element={<UserManagementPage />} />
          </Route>

          {/* Ops platform routes */}
          <Route element={<ProtectedRoute allowedRole="admin"><OpsShell /></ProtectedRoute>}>
            <Route path="/ops/tenants" element={<TenantManagementPage />} />
            <Route path="/ops/enterprises" element={<OpsEnterprisePage />} />
            <Route path="/ops/isv" element={<IsvAuthorizationPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
