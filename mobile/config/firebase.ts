import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';
import {
    FIREBASE_API_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MOBILE_SDK_APP_ID,
    FIREBASE_PACKAGE_NAME,
} from '@env';

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    appId: FIREBASE_MOBILE_SDK_APP_ID,
    android: {
        clientId: FIREBASE_PACKAGE_NAME,
    }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

// Test function to verify storage access
export const testStorageAccess = async () => {
    try {
        const photosRef = ref(firebaseStorage, 'events-slideshow');
        const result = await listAll(photosRef);
        console.log('Storage access successful:', result);
        return true;
    } catch (error) {
        console.error('Error testing storage access:', error);
        throw error;
    }
}

// Test storage access after initialization
testStorageAccess()
    .then(success => {
        if (success) {
            console.log('Storage access successful');
        } else {
            console.error('Storage access failed');
        }
    })
    .catch(error => {
        console.error('Error testing storage access:', error);
        throw error;
    });

export { firebaseStorage };
export default app;
