/**
 * URL Utilities for handling and transforming URLs in the app
 */
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';

/**
 * The main URL opening function that enforces language-specific domains
 * @param url The URL to open
 * @param language The current language (e.g. 'en', 'fr')
 * @returns Promise from the browser opener
 */
export const openUrlWithCorrectDomain = async (url: string, language: string) => {
    try {
        // Process the URL to ensure it has the correct domain
        const processedUrl = processUrlForLanguage(url, language);

        // Log the URL opening
        console.log(`[urlUtils] Opening URL with WebBrowser: ${processedUrl}`);

        // Use WebBrowser which gives us more control than Linking
        return WebBrowser.openBrowserAsync(processedUrl, {
            // Basic browser settings
            createTask: true,
            showInRecents: false,
            toolbarColor: '#FF9843'
        });
    } catch (error) {
        console.error(`[urlUtils] Error opening URL:`, error);
        // Fallback to regular Linking in case of error
        try {
            return Linking.openURL(url);
        } catch (linkingError) {
            console.error(`[urlUtils] Linking fallback also failed:`, linkingError);
            throw linkingError; // Re-throw to allow caller to handle
        }
    }
};

/**
 * Ensures URL has the correct domain for the current language
 * @param url Original URL
 * @param language Current language
 * @returns URL with the correct domain for the language
 */
export const processUrlForLanguage = (url: string, language: string): string => {
    // Skip processing if not an egliselacite URL
    if (!url || !url.includes('egliselacite.com')) {
        return url;
    }

    console.log(`[urlUtils] Processing URL for ${language}: ${url}`);

    try {
        // Handle event detail URLs more directly
        if (url.includes('/event-details/')) {
            // Get the slug part - everything after /event-details/
            const parts = url.split('/event-details/');
            if (parts.length > 1) {
                const slug = parts[1].split('?')[0]; // Get the slug without query params

                // Build a fresh URL with the correct domain for the language
                const domain = language === 'fr' ? 'fr.egliselacite.com' : 'www.egliselacite.com';
                const newUrl = `https://${domain}/event-details/${slug}`;

                console.log(`[urlUtils] Rebuilt event URL: ${newUrl}`);
                return newUrl;
            }
        }

        // Handle /calendar URLs - redirect to /events2
        if (url.includes('/calendar')) {
            const fallbackUrl = language === 'fr'
                ? 'https://fr.egliselacite.com/events2'
                : 'https://www.egliselacite.com/events2';
            console.log(`[urlUtils] Calendar URL detected, redirecting to: ${fallbackUrl}`);
            return fallbackUrl;
        }

        // Check for known invalid URL patterns that cause 404 errors
        // Example: https://www.egliselacite.com/kwAKJW1JYirM3u7y5
        const invalidUrlPattern = /https:\/\/(?:www\.|fr\.)?egliselacite\.com\/[a-zA-Z0-9]{10,20}\b/;
        if (invalidUrlPattern.test(url)) {
            // Redirect to default events2 page based on language
            const fallbackUrl = language === 'fr'
                ? 'https://fr.egliselacite.com/events2'
                : 'https://www.egliselacite.com/events2';
            console.log(`[urlUtils] Invalid URL detected, redirecting to: ${fallbackUrl}`);
            return fallbackUrl;
        }

        // For other URLs, just swap the domain, careful not to duplicate the prefix
        if (language === 'fr') {
            // For French, ensure fr.egliselacite.com but prevent fr.fr. duplication
            // First check if it already has the correct domain
            if (url.includes('fr.egliselacite.com')) {
                return url; // URL already has correct domain
            }
            const processedUrl = url.replace(/(?:www\.)?egliselacite\.com/, 'fr.egliselacite.com');
            console.log(`[urlUtils] Processed to French URL: ${processedUrl}`);
            return processedUrl;
        } else {
            // For English, ensure www.egliselacite.com
            const processedUrl = url.replace(/fr\.egliselacite\.com/, 'www.egliselacite.com');
            console.log(`[urlUtils] Processed to English URL: ${processedUrl}`);
            return processedUrl;
        }
    } catch (error) {
        console.error(`[urlUtils] Error processing URL:`, error);

        // Fallback to events2 page for errors
        const fallbackUrl = language === 'fr'
            ? 'https://fr.egliselacite.com/events2'
            : 'https://www.egliselacite.com/events2';
        console.log(`[urlUtils] Error processing URL, using fallback: ${fallbackUrl}`);
        return fallbackUrl;
    }
};

/**
 * Open a URL in the default browser (for non-egliselacite URLs)
 * @param url The URL to open
 */
export const openGenericUrl = (url: string) => {
    try {
        return Linking.openURL(url);
    } catch (error) {
        console.error(`[urlUtils] Error opening generic URL:`, error);
        throw error;
    }
};

/**
 * Check if a URL can be opened by the device
 * @param url The URL to check
 * @returns Promise that resolves to a boolean
 */
export const canOpenUrl = async (url: string): Promise<boolean> => {
    try {
        const canOpen = await Linking.canOpenURL(url);
        console.log(`[urlUtils] Can open URL ${url}: ${canOpen}`);
        return canOpen;
    } catch (error) {
        console.error(`[urlUtils] Error checking if URL can be opened:`, error);
        return false;
    }
};