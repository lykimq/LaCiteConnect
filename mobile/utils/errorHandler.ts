import { Alert } from 'react-native';

export const handleApiError = (error: any) => {
    console.error('API Error:', error);

    let message = 'An unexpected error occurred';

    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }

    Alert.alert('Error', message);
};