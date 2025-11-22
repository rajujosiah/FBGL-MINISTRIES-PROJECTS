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

  const login = async (username, password) => {
    // 1. Check Master Credentials first
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
    }

    // 2. Check Database for other users
    try {
      // Import dynamically to avoid circular dependencies if any, or just standard import
      const { loginUser } = require('../utils/dataManager');
      const dbUser = await loginUser(username, password);

      if (dbUser) {
        const userData = {
          username: dbUser.email, // Use email as username
          role: dbUser.role,
          name: dbUser.name,
          id: dbUser.id,
          loginTime: new Date().toISOString(),
          ...dbUser // Include other user details
        };
        setUser(userData);
        localStorage.setItem('fbgl_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Database login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }

    return { success: false, error: 'Invalid username/email or password' };
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


