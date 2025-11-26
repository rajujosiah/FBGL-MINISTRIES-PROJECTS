import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import OurTeam from './pages/OurTeam';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Login from './pages/Login';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AreaManagerDashboard from './pages/dashboard/AreaManagerDashboard';
import ProjectManagerDashboard from './pages/dashboard/ProjectManagerDashboard';
import ProjectManagerDetail from './pages/dashboard/ProjectManagerDetail';
import SocialWorkerDashboard from './pages/dashboard/SocialWorkerDashboard';
import { initializeData } from './utils/dataManager';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize data (Supabase only)
    const init = async () => {
      try {
        await initializeData();
      } catch (error) {
        console.error('Failed to initialize application:', error);
        // Error will be handled by individual components
      }
    };
    init();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<OurTeam />} />
              <Route path="/team/:type/:id" element={<OurTeam />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/area-manager"
                element={
                  <ProtectedRoute allowedRoles={['area_manager']}>
                    <AreaManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/project-manager"
                element={
                  <ProtectedRoute allowedRoles={['project_manager']}>
                    <ProjectManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/project-manager/:id"
                element={
                  <ProtectedRoute allowedRoles={['area_manager', 'admin']}>
                    <ProjectManagerDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/social-worker"
                element={
                  <ProtectedRoute allowedRoles={['social_worker']}>
                    <SocialWorkerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Redirect /dashboard to appropriate role dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>Redirecting...</div>
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
