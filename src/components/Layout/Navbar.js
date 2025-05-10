import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {
  const { darkMode, handleThemeChange } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle menu open/close
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigate to login page
  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar>
        {/* App title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
        >
          MovieVerse
        </Typography>

        {/* Navigation buttons */}
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
          <IconButton color="inherit" component={Link} to="/favorites" sx={{ mr: 1 }}>
            <FavoriteIcon />
          </IconButton>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}>
          <IconButton color="inherit" onClick={handleThemeChange} sx={{ mr: 1 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Account menu */}
        <Tooltip title="Account">
          <IconButton
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 1 }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogin}>Login</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 