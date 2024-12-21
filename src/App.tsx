import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { Toaster } from '@/components/ui/toaster';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { DashboardPage } from '@/pages/dashboard';
import { PublicationsPage } from '@/pages/publications';
import { TeachingPage } from '@/pages/teaching';
import { ProfilePage } from '@/pages/profile';
import { ProtectedRoute } from '@/components/protected-route';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publications"
              element={
                <ProtectedRoute>
                  <PublicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teaching"
              element={
                <ProtectedRoute>
                  <TeachingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}