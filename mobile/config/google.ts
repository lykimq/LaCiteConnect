export const GOOGLE_CONFIG = {
    // Android client ID (installed)
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    // Web client ID (for OAuth)
    webClientId: 'YOUR_WEB_CLIENT_ID',
    // Web client secret - this is normally should not be stored in client code
    // In a production app, this should be secured in a backend service
    clientSecret: 'YOUR_CLIENT_SECRET',
    // Request scopes
    scopes: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'profile',
        'email'
    ],
    // Project ID
    projectId: 'la-cite-connect',
    // OAuth endpoints from the client secret file
    authUri: 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token'
};