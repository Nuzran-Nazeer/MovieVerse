import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const handleLogin = (credentials) => {
    if (credentials.username && credentials.password) {
      setIsAuthenticated(true);
    }
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleToggleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === movie.id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      }
      return [...prevFavorites, movie];
    });
  };

  const value = {
    darkMode,
    isAuthenticated,
    favorites,
    handleLogin,
    handleThemeChange,
    handleToggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; 