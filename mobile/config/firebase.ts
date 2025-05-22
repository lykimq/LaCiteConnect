import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
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

export { firebaseStorage };
export default app;
