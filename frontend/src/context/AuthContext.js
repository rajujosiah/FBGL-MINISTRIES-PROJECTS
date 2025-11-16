import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Master credentials - stored in memory (simple authentication without Supabase)
const MASTER_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'admin@fbgl2024',
    role: 'admin',
    name: 'Admin User'
  },
  area_manager: {
    username: 'areamanager',
    password: 'area@fbgl2024',
    role: 'area_manager',
    name: 'Area Manager'
  },
  project_manager: {
    username: 'projectmanager',
    password: 'project@fbgl2024',
    role: 'project_manager',
    name: 'Project Manager'
  },
  social_worker: {
    username: 'socialworker',
    password: 'social@fbgl2024',
    role: 'social_worker',
    name: 'Social Worker'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('fbgl_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('fbgl_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Find matching credentials
    const credentials = Object.values(MASTER_CREDENTIALS).find(
      cred => cred.username === username && cred.password === password
    );

    if (credentials) {
      const userData = {
        username: credentials.username,
        role: credentials.role,
        name: credentials.name,
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('fbgl_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fbgl_user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


