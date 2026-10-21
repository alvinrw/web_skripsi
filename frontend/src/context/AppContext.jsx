import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('dg_logged_in') === 'true';
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dg_theme') || 'dark'; // Dark mode is default matching premium dark UI
  });

  const [sensitivity, setSensitivity] = useState(() => {
    const saved = localStorage.getItem('dg_sensitivity');
    return saved ? parseFloat(saved) : 0.85;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('dg_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dg_user');
    return saved ? JSON.parse(saved) : { name: 'Analis Forensik', id: 'DG-7782' };
  });

  // Keep HTML root class in sync with theme for CSS styling
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('dg_theme', theme);
  }, [theme]);

  // Persist history changes
  useEffect(() => {
    localStorage.setItem('dg_history', JSON.stringify(history));
  }, [history]);

  // Persist sensitivity
  useEffect(() => {
    localStorage.setItem('dg_sensitivity', sensitivity.toString());
  }, [sensitivity]);

  const login = (email, password) => {
    setIsLoggedIn(true);
    localStorage.setItem('dg_logged_in', 'true');
    const defaultUser = { name: 'Analis Forensik', id: 'DG-7782', email };
    setUser(defaultUser);
    localStorage.setItem('dg_user', JSON.stringify(defaultUser));
  };

  const register = (name, email) => {
    const newUser = { name, id: `DG-${Math.floor(1000 + Math.random() * 9000)}`, email };
    setUser(newUser);
    localStorage.setItem('dg_user', JSON.stringify(newUser));
    setIsLoggedIn(true);
    localStorage.setItem('dg_logged_in', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('dg_logged_in');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addHistory = (item) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      analyzedAt: new Date().toISOString(),
      ...item
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const value = {
    isLoggedIn,
    theme,
    sensitivity,
    history,
    user,
    login,
    register,
    logout,
    toggleTheme,
    setSensitivity,
    addHistory,
    clearHistory,
    backendUrl: 'http://localhost:5001'
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
