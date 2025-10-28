import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import WhatsAppLogin from './pages/WhatsAppLogin';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import AdminDashboard from './pages/AdminDashboard';
import StudentsPage from './pages/StudentsPage';
import ContentPage from './pages/ContentPage';
import WhatsAppPage from './pages/WhatsAppPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentSettings from './pages/StudentSettings';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { mockAuth } from './services/mockAuth';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const user = mockAuth.getCurrentUser();
  const isAdmin = user?.role === 'admin';
  return isAdmin ? <>{children}</> : <Navigate to="/admin" replace />;
}

function ProtectedStudentRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/whatsapp-login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/whatsapp-login" element={<WhatsAppLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <StudentsPage />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <ContentPage />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/whatsapp"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <WhatsAppPage />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedStudentRoute>
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </ProtectedStudentRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedStudentRoute>
              <StudentLayout>
                <StudentSettings />
              </StudentLayout>
            </ProtectedStudentRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
