import { initializeLanguage } from './languageService';
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

        // Initialize content service
        await contentService.initialize();

        console.log('App services initialized successfully');
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

        // Preload common content types
        await Promise.all([
            contentService.getContent('home'),
            contentService.getContent('whoWeAre'),
            contentService.getContent('events'),
            contentService.getContent('donation'),
            contentService.getContent('getConnected')
        ]);

        console.log('Content preloaded successfully');
    } catch (error) {
        console.error('Error preloading content:', error);
    }
};