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
        if (languageCode === currentLanguage) return;

        setIsLoading(true);
        try {
            // Update language in storage and services
            await setLanguage(languageCode);
            await contentService.setLanguage(languageCode);

            // Clear content cache
            contentService.clearCache();

            // Update state to trigger re-renders
            setCurrentLanguage(languageCode);
        } catch (error) {
            console.error('Error setting app language:', error);
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