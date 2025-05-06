import { createTheme } from '@mui/material/styles';

/**
 * Application Theme Configuration
 * Defines the global styling and theming for the application:
 * - Color palette for consistent branding
 * - Typography settings for text styling
 * - Component-specific theme overrides
 * - Responsive design breakpoints
 */
const theme = createTheme({
    // Color palette configuration
    palette: {
        primary: {
            main: '#1976d2', // Primary brand color
            light: '#42a5f5', // Lighter shade for hover states
            dark: '#1565c0', // Darker shade for active states
        },
        secondary: {
            main: '#9c27b0', // Secondary brand color
            light: '#ba68c8', // Lighter shade for hover states
            dark: '#7b1fa2', // Darker shade for active states
        },
        error: {
            main: '#d32f2f', // Error state color
        },
        warning: {
            main: '#ed6c02', // Warning state color
        },
        info: {
            main: '#0288d1', // Information state color
        },
        success: {
            main: '#2e7d32', // Success state color
        },
        background: {
            default: '#f5f5f5', // Default background color
            paper: '#ffffff', // Paper/surface background color
        },
    },

    // Typography configuration
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
        },
    },

    // Component-specific theme overrides
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable uppercase transformation
                    borderRadius: 8, // Custom border radius
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Custom border radius
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Custom shadow
                },
            },
        },
    },
});

export default theme;