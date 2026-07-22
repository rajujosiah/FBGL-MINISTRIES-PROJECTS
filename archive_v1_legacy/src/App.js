import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Public Pages
import Home from './pages/Home';
import Team from './pages/Team';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeam from './pages/admin/AdminTeam';
import AccessControl from './pages/admin/AccessControl';
import BlogManager from './pages/admin/BlogManager';
import SampleDataManager from './pages/admin/SampleDataManager';

// Dashboard Pages
import ManagerDashboard from './pages/dashboard/ManagerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/team" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminTeam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/access-control" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AccessControl />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <BlogManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/sample-data" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SampleDataManager />
                  </ProtectedRoute>
                } 
              />

              {/* Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <ManagerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;