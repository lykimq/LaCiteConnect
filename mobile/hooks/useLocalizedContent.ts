import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { contentService } from '../services/contentService';
import { ContentType, ContentResponse } from '../services/contentService';

/**
 * Hook to get localized content based on current language
 * This hook will automatically refresh content when language changes
 */
export function useLocalizedContent<T>(contentType: ContentType) {
    const { currentLanguage, isLoading: isLanguageLoading } = useLanguage();
    const [content, setContent] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load content whenever language changes
        const loadContent = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response: ContentResponse<T> = await contentService.getContent(contentType);

                if (response.success && response.data) {
                    setContent(response.data);
                } else {
                    setError(response.error || 'Failed to load content');
                    console.error(`Error loading ${contentType} content:`, response.error);
                }
            } catch (err) {
                setError('An unexpected error occurred');
                console.error(`Error in useLocalizedContent for ${contentType}:`, err);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [contentType, currentLanguage]); // Re-run when language changes

    return {
        content,
        isLoading: isLoading || isLanguageLoading,
        error,
        refresh: () => {
            contentService.clearCache();
            setIsLoading(true);
        }
    };
}