import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Storage key for language setting
const LANGUAGE_STORAGE_KEY = 'APP_LANGUAGE';

// Default language code
export const defaultLanguage = 'en';

// Available language codes
export const availableLanguages = ['en', 'fr'];

// Language metadata
export interface LanguageMetadata {
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
}

// Language metadata map
export const languageMetadata: { [key: string]: LanguageMetadata } = {
    en: {
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
    },
    fr: {
        name: 'French',
        nativeName: 'Français',
        direction: 'ltr',
    },
};

/**
 * Get the current language from storage
 * @returns The language code (e.g., 'en', 'fr')
 */
export const getLanguage = async (): Promise<string> => {
    try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (storedLanguage && availableLanguages.includes(storedLanguage)) {
            return storedLanguage;
        }

        // Return default language if not found or invalid
        return defaultLanguage;
    } catch (error) {
        console.error('Error getting language setting:', error);
        return defaultLanguage;
    }
};

/**
 * Set the application language
 * @param languageCode The language code to set
 */
export const setLanguage = async (languageCode: string): Promise<void> => {
    try {
        // Validate language code
        if (!availableLanguages.includes(languageCode)) {
            console.error(`Invalid language code: ${languageCode}`);
            return;
        }

        // Save language code to storage
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

        // Update RTL setting for the UI
        const metadata = languageMetadata[languageCode];
        if (metadata) {
            I18nManager.forceRTL(metadata.direction === 'rtl');
        }

        console.log(`Language set to: ${languageCode}`);
    } catch (error) {
        console.error('Error setting language:', error);
    }
};

/**
 * Get language metadata for a language code
 * @param languageCode The language code
 * @returns Language metadata
 */
export const getLanguageMetadata = (languageCode: string): LanguageMetadata => {
    return languageMetadata[languageCode] || languageMetadata[defaultLanguage];
};

/**
 * Initialize language settings
 */
export const initializeLanguage = async (): Promise<void> => {
    const currentLanguage = await getLanguage();
    const metadata = getLanguageMetadata(currentLanguage);

    // Set RTL direction if needed
    if (metadata.direction === 'rtl' && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
    } else if (metadata.direction === 'ltr' && I18nManager.isRTL) {
        I18nManager.forceRTL(false);
    }
};