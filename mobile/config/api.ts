import { Platform } from 'react-native';

// API Configuration
const DEV_IP = '192.168.1.29';
const DEV_PORT = '3000';
const API_VERSION = 'v1';

// Use localhost for web and IP for mobile
const BASE_URL = Platform.OS === 'web'
    ? `http://localhost:${DEV_PORT}`
    : `http://${DEV_IP}:${DEV_PORT}`;

export const API_BASE_URL = `${BASE_URL}/api/${API_VERSION}`;

// Helper function to get the current API URL
export const getApiUrl = () => {
    console.log('Current API URL:', API_BASE_URL);
    return API_BASE_URL;
};