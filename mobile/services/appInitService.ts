import { initializeLanguage, getLanguage } from './languageService';
import { initializeTheme } from './themeService';
import { contentService } from './contentService';

/**
 * Initialize all app services and settings
 * Should be called at app startup
 */
export const initializeApp = async (): Promise<void> => {
    try {
        console.log('Initializing app services...');

        // Initialize language settings
        await initializeLanguage();

        // Get current language for content
        const currentLanguage = await getLanguage();

        // Initialize theme settings
        await initializeTheme();

        // Initialize content service with current language
        await contentService.initialize();
        await contentService.setLanguage(currentLanguage);

        console.log(`App services initialized successfully. Language set to: ${currentLanguage}`);
    } catch (error) {
        console.error('Error initializing app services:', error);
    }
};

/**
 * Preload content for faster initial rendering
 * This can be called after app initialization
 */
export const preloadContent = async (): Promise<void> => {
    try {
        console.log('Preloading content...');

        // Get current language
        const currentLanguage = await getLanguage();
        console.log(`Preloading content for language: ${currentLanguage}`);

        // Preload common content types
        await Promise.all([
            contentService.getContent('home'),
            contentService.getContent('whoWeAre'),
            contentService.getContent('events'),
            contentService.getContent('donation'),
            contentService.getContent('getConnected'),
            contentService.getContent('settings')
        ]);

        console.log('Content preloaded successfully');
    } catch (error) {
        console.error('Error preloading content:', error);
    }
};