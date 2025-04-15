import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import Login from './pages/Login';
import Dashboard from './pages/DashBoard';

/**
 * Main application component
 * Sets up the application structure with:
 * - Theme provider for Material-UI styling
 * - Authentication context for user state
 * - React Router for navigation
 * - Base styles with CssBaseline
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Normalize CSS styles */}
      <CssBaseline />
      {/* Provide authentication context to all components */}
      <AuthProvider>
        {/* Set up routing */}
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            {/* Protected route */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Default route redirects to login */}
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
