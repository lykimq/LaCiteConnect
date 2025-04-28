export const config = {
    api: {
        baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    },
    auth: {
        google: {
            expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || 'YOUR_GOOGLE_EXPO_CLIENT_ID',
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_GOOGLE_IOS_CLIENT_ID',
            androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_GOOGLE_WEB_CLIENT_ID',
        },
        facebook: {
            appId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
        },
        apple: {
            serviceId: process.env.EXPO_PUBLIC_APPLE_SERVICE_ID || 'YOUR_APPLE_SERVICE_ID',
        },
    },
};