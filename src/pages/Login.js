import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  useTheme,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Login = () => {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('This is just a demo login page. No actual login functionality is implemented.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        pt: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <AccountCircleIcon
            sx={{
              fontSize: 60,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          {error && (
            <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Email field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 