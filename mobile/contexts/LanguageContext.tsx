import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLanguage, setLanguage, getLanguageMetadata } from '../services/languageService';
import { contentService } from '../services/contentService';

interface LanguageContextType {
    currentLanguage: string;
    setAppLanguage: (languageCode: string) => Promise<void>;
    isLoading: boolean;
    languageName: string;
}

// Create a context with default values
const LanguageContext = createContext<LanguageContextType>({
    currentLanguage: 'en',
    setAppLanguage: async () => { },
    isLoading: true,
    languageName: 'English'
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
    children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>('en');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Load the current language on initial render
        const initializeLanguage = async () => {
            setIsLoading(true);
            try {
                const lang = await getLanguage();
                setCurrentLanguage(lang);
                await contentService.setLanguage(lang);
            } catch (error) {
                console.error('Error initializing language:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeLanguage();
    }, []);

    const setAppLanguage = async (languageCode: string) => {
        if (languageCode === currentLanguage) {
            console.log(`[LanguageContext] No change needed, language already set to: ${languageCode}`);
            return;
        }

        console.log(`[LanguageContext] Setting app language: ${currentLanguage} -> ${languageCode}`);
        setIsLoading(true);

        try {
            // Update language in storage and services
            console.log(`[LanguageContext] Saving language to storage: ${languageCode}`);
            await setLanguage(languageCode);

            console.log(`[LanguageContext] Updating content service language: ${languageCode}`);
            await contentService.setLanguage(languageCode);

            console.log(`[LanguageContext] Updating calendar service language`);
            // Import dynamically to avoid circular dependencies
            const { calendarService } = require('../services/calendarService');
            await calendarService.updateLanguage(languageCode);

            // Clear content cache
            console.log(`[LanguageContext] Clearing content cache`);
            contentService.clearCache();

            // Update state to trigger re-renders
            console.log(`[LanguageContext] Updating state to trigger re-renders`);
            setCurrentLanguage(languageCode);

            console.log(`[LanguageContext] Language change complete: ${languageCode}`);
        } catch (error) {
            console.error(`[LanguageContext] Error setting app language to ${languageCode}:`, error);
            throw error; // Rethrow to allow handling by caller
        } finally {
            setIsLoading(false);
        }
    };

    // Get the display name of the current language
    const languageName = getLanguageMetadata(currentLanguage).nativeName;

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                setAppLanguage,
                isLoading,
                languageName
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};