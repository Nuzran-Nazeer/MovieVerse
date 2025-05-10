import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CategoryIcon from '@mui/icons-material/Category';
import Tooltip from '@mui/material/Tooltip';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {
  const { darkMode, handleThemeChange } = useAppContext();
  const location = useLocation();

  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
        >
          MovieVerse
        </Typography>
        <Tooltip title="Search Movies">
          <IconButton
            color="inherit"
            component={Link}
            to="/search"
            sx={{ mr: 1, ...(location.pathname === '/search' && { bgcolor: 'rgba(255,255,255,0.15)' }) }}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Browse Movies">
          <IconButton color="inherit" component={Link} to="/browse" sx={{ mr: 1 }}>
            <CategoryIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Favorites">
          <IconButton color="inherit" component={Link} to="/favorites">
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}>
          <IconButton color="inherit" onClick={handleThemeChange} sx={{ ml: 1 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 