import { defaultLanguage, getLanguage, setLanguage } from './languageService';

// Define content types
export type ContentType = 'home' | 'whoWeAre' | 'events' | 'donation' | 'getConnected' | 'settings';

// Interface for content API response
export interface ContentResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Import all JSON files statically
// English content
import enHome from '../database/en/home.json';
import enWhoWeAre from '../database/en/whoWeAre.json';
import enEvents from '../database/en/events.json';
import enDonation from '../database/en/donation.json';
import enGetConnected from '../database/en/getConnected.json';
import enSettings from '../database/en/settings.json';

// Import French content
import frHome from '../database/fr/home.json';
import frWhoWeAre from '../database/fr/whoWeAre.json';
import frEvents from '../database/fr/events.json';
import frDonation from '../database/fr/donation.json';
import frGetConnected from '../database/fr/getConnected.json';
import frSettings from '../database/fr/settings.json';

// Content map interface for type safety
interface ContentMap {
    [language: string]: {
        [contentType: string]: any;
    };
}

// Content map for faster lookups
const contentMap: ContentMap = {
    en: {
        home: enHome,
        whoWeAre: enWhoWeAre,
        events: enEvents,
        donation: enDonation,
        getConnected: enGetConnected,
        settings: enSettings
    },
    fr: {
        home: frHome,
        whoWeAre: frWhoWeAre,
        events: frEvents,
        donation: frDonation,
        getConnected: frGetConnected,
        settings: frSettings
    }
};

/**
 * Content Service - Handles loading and managing content from JSON files
 */
class ContentService {
    private cache: { [key: string]: any } = {};
    private currentLanguage: string = defaultLanguage;
    private initialized: boolean = false;

    /**
     * Initialize the content service
     */
    async initialize(): Promise<void> {
        if (!this.initialized) {
            // Load current language
            this.currentLanguage = await getLanguage();
            this.initialized = true;
        }
    }

    /**
     * Set the current language for content
     * @param languageCode ISO language code (e.g., 'en', 'fr')
     */
    async setLanguage(languageCode: string): Promise<void> {
        this.currentLanguage = languageCode;
        await setLanguage(languageCode);
        // Clear cache when language changes
        this.clearCache();
    }

    /**
     * Get the current language code
     * @returns current language code
     */
    getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    /**
     * Get content for the specified type in the current language
     * @param contentType Type of content to retrieve
     * @returns Promise with the content data
     */
    async getContent<T>(contentType: ContentType): Promise<ContentResponse<T>> {
        try {
            // Make sure service is initialized
            if (!this.initialized) {
                await this.initialize();
            }

            const cacheKey = `${this.currentLanguage}_${contentType}`;

            // Return from cache if available
            if (this.cache[cacheKey]) {
                return {
                    success: true,
                    data: this.cache[cacheKey]
                };
            }

            // Load content from static imports
            const content = await this.loadContent<T>(contentType);

            // Store in cache
            this.cache[cacheKey] = content;

            return {
                success: true,
                data: content
            };
        } catch (error) {
            console.error(`Error loading content for ${contentType}:`, error);
            return {
                success: false,
                error: `Failed to load ${contentType} content.`
            };
        }
    }

    /**
     * Clear the content cache
     */
    clearCache(): void {
        this.cache = {};
    }

    /**
     * Load content from the static imports map
     * @param contentType Type of content to load
     * @returns Promise with the content data
     */
    private async loadContent<T>(contentType: ContentType): Promise<T> {
        try {
            // Try to get content for current language
            if (contentMap[this.currentLanguage] &&
                contentMap[this.currentLanguage][contentType]) {
                return contentMap[this.currentLanguage][contentType] as T;
            }

            // If language-specific content is not available, fall back to English
            if (this.currentLanguage !== 'en') {
                console.log(`Falling back to English for ${contentType}`);
                return contentMap.en[contentType] as T;
            }

            throw new Error(`Content not found for ${contentType}`);
        } catch (error) {
            console.error(`Error loading ${contentType} content:`, error);
            throw error;
        }
    }
}

// Export a singleton instance
export const contentService = new ContentService();