/**
 * HTML Parsing Utilities
 * Handles HTML content in event descriptions
 */

/**
 * Extract image URLs from HTML content
 * Looks for <img> tags and Google Drive image links
 */
export const extractImagesFromHtml = (html: string): string[] => {
    if (!html) return [];

    const images: string[] = [];

    // Extract <img> tags
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        if (match[1]) {
            images.push(match[1]);
        }
    }

    // Look for Google Drive image links
    // Format: https://drive.google.com/file/d/FILE_ID/view or https://drive.google.com/uc?id=FILE_ID
    const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([^\/]+)\/view|https:\/\/drive\.google\.com\/uc\?id=([^&\s]+)/g;
    while ((match = driveRegex.exec(html)) !== null) {
        const fileId = match[1] || match[2];
        if (fileId) {
            // Convert to direct image URL
            images.push(`https://drive.google.com/uc?export=view&id=${fileId}`);
        }
    }

    return images;
};

/**
 * Convert HTML to formatted plain text
 * Handles common HTML elements like <b>, <p>, <br>, etc.
 */
export const convertHtmlToFormattedText = (html: string): string => {
    if (!html) return '';

    // Replace <br> and <p> tags with newlines
    let text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n');

    // Replace lists with formatted text
    text = text.replace(/<li>\s*(.*?)\s*<\/li>/gi, '• $1\n');

    // Remove all other HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Trim extra spaces and newlines
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return text;
};

/**
 * Extract location details from location string
 * Can handle Google Maps links and addresses
 */
export const parseLocationString = (location: string): { address: string, mapUrl?: string } => {
    if (!location) return { address: '' };

    // Check if it's a Google Maps URL
    if (location.includes('maps.google.com') || location.includes('goo.gl/maps')) {
        // Try to extract the address from the URL
        const address = location.includes('q=')
            ? decodeURIComponent(location.split('q=')[1].split('&')[0])
            : location;

        return {
            address: address,
            mapUrl: location
        };
    }

    // Regular address
    return { address: location };
};

/**
 * Check if a string contains a Google Drive link
 */
export const containsDriveLink = (text: string): boolean => {
    return /https:\/\/drive\.google\.com\//.test(text);
};

/**
 * Extract calendar attachment links
 * Look for Google Calendar attachment references in the description
 */
export const extractAttachmentLinks = (description: string): Array<{ title: string, url: string }> => {
    if (!description) return [];

    const links: Array<{ title: string, url: string }> = [];

    // Look for attachment patterns in Google Calendar descriptions
    const attachmentRegex = /\[([^\]]+)\]\s*\(([^)]+)\)/g;
    let match;

    while ((match = attachmentRegex.exec(description)) !== null) {
        if (match[1] && match[2]) {
            links.push({
                title: match[1],
                url: match[2]
            });
        }
    }

    return links;
};