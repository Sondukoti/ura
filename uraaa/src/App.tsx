import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { ResearchDashboard } from './pages/ResearchDashboard';
import { SettingsPage } from './components/Settings/SettingsPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function MainApp() {
  const { authState } = useAuth();

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!authState.user) {
    return <AuthForm />;
  }

  return (
    <Routes>
      <Route path="/" element={<ResearchDashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ai-analysis" element={<AIAnalysisPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainApp />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}