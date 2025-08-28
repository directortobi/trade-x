import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import DerivAuthPage from './components/Auth/DerivAuthPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardApp from './components/DashboardApp';
import { useAuthStore } from './store/authStore';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/deriv-auth" 
          element={
            <ProtectedRoute>
              <DerivAuthPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardApp />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Catch all - redirect to appropriate page */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
