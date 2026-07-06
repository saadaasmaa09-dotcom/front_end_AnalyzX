import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  const [currentAnalysisId, setCurrentAnalysisId] = useState(null);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  const login = useCallback((userData, tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentAnalysisId(null);
  }, []);

  return (
    <AppContext.Provider value={{
      user, isAuthenticated,
      login, logout,
      theme, toggleTheme,
      currentAnalysisId, setCurrentAnalysisId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}