import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import StudentsPage from './pages/StudentsPage';
import ContentPage from './pages/ContentPage';
import WhatsAppPage from './pages/WhatsAppPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/students"
          element={
            <AdminLayout>
              <StudentsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminLayout>
              <ContentPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/whatsapp"
          element={
            <AdminLayout>
              <WhatsAppPage />
            </AdminLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
