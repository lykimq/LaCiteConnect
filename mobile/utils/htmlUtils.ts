/**
 * HTML Parsing Utilities
 * Handles HTML content in event descriptions
 */

import { Platform } from 'react-native';

/**
 * Extract Google Drive links from HTML content
 * Looks for Google Drive file and folder links
 */
export const extractDriveLinksFromHtml = (html: string): string[] => {
    if (!html) return [];

    const driveLinks: string[] = [];

    // Look for Google Drive image links - enhanced pattern detection
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    // Format 2: https://drive.google.com/uc?id=FILE_ID
    // Format 3: https://drive.google.com/open?id=FILE_ID
    const driveRegex = /https:\/\/drive\.google\.com\/(?:file\/d\/|uc\?id=|open\?id=)([a-zA-Z0-9_-]+)(?:\/view|\b|&)/g;

    let match = null;
    while ((match = driveRegex.exec(html)) !== null) {
        const fileId = match[1];
        if (fileId) {
            // Convert to direct URL that works with linking
            const directUrl = `https://drive.google.com/file/d/${fileId}/view`;
            driveLinks.push(directUrl);
            console.log(`Found Drive file: ${fileId}`);
        }
    }

    // Look for Google Drive folder links
    const driveFolderRegex = /https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/g;

    match = null;
    while ((match = driveFolderRegex.exec(html)) !== null) {
        const folderId = match[1];
        if (folderId) {
            const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
            driveLinks.push(folderUrl);
            console.log(`Found Drive folder: ${folderId}`);
        }
    }

    // Look for Google Drive links within a tags
    const aTagDriveRegex = /<a[^>]+href="(https:\/\/drive\.google\.com\/[^"]+)"[^>]*>/g;

    match = null;
    while ((match = aTagDriveRegex.exec(html)) !== null) {
        const driveUrl = match[1];

        // Extract file ID from various Drive URL formats
        let fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)\/|id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch) {
            const fileId = fileIdMatch[1] || fileIdMatch[2];
            if (fileId && !driveLinks.some(url => url.includes(fileId))) {
                const directUrl = `https://drive.google.com/file/d/${fileId}/view`;
                driveLinks.push(directUrl);
                console.log(`Found Drive file in <a> tag: ${fileId}`);
            }
        }

        // Check for folder link
        let folderIdMatch = driveUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (folderIdMatch) {
            const folderId = folderIdMatch[1];
            if (folderId && !driveLinks.some(url => url.includes(folderId))) {
                const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
                driveLinks.push(folderUrl);
                console.log(`Found Drive folder in <a> tag: ${folderId}`);
            }
        }
    }

    // For debugging
    if (driveLinks.length > 0) {
        console.log(`Found ${driveLinks.length} Drive links in HTML content`);
    }

    return driveLinks;
};

/**
 * Convert HTML to formatted plain text
 * Handles common HTML elements like <b>, <p>, <br>, etc.
 */
export const convertHtmlToFormattedText = (html: string): string => {
    if (!html) return '';

    // First decode HTML entities to avoid double processing
    let text = html
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#160;/g, " ")
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—");

    // Remove Drive link artifacts
    text = text.replace(/class="pastedDriveLink-\d+"/, '');

    // Process tables before removing tags
    text = convertTableToText(text);

    // Extract and format key-value pairs (common in event descriptions)
    const keyValuePairs = extractKeyValuePairs(text);

    // Preserve bold and italic formatting by replacing with markers
    text = text.replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<strong>(.*?)<\/strong>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '_$1_')
        .replace(/<em>(.*?)<\/em>/gi, '_$1_');

    // Replace <br> and <p> tags with newlines
    text = text.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<p[^>]*>/gi, '');  // Remove opening <p> tags

    // Handle headings
    text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n*$1*\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n*$1*\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n*$1*\n\n');

    // Handle divs with spacing
    text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');

    // Replace lists with formatted text
    text = text.replace(/<li[^>]*>\s*(.*?)\s*<\/li>/gi, '• $1\n');
    text = text.replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n');
    text = text.replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n');

    // Replace links with formatted text - keep the URL
    text = text.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)');

    // Remove all other HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // Trim extra spaces and newlines
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    // If we extracted key-value pairs, append them in a nicely formatted way
    if (keyValuePairs.length > 0) {
        const formattedPairs = keyValuePairs
            .map(pair => `${pair.key}: ${pair.value}`)
            .join('\n');

        if (!text.includes(formattedPairs)) {
            text = formattedPairs + (text ? '\n\n' + text : '');
        }
    }

    return text;
};

/**
 * Extract key-value pairs from HTML content
 * Often event descriptions have formatted fields like "Event Name: XYZ"
 */
const extractKeyValuePairs = (html: string): Array<{ key: string, value: string }> => {
    const pairs: Array<{ key: string, value: string }> = [];

    // Look for <strong>Key:</strong> Value pattern
    const strongKeyRegex = /<strong>([^:]+):<\/strong>\s*([^<]+)/g;
    let match: RegExpExecArray | null;

    while ((match = strongKeyRegex.exec(html)) !== null) {
        if (match[1] && match[2]) {
            pairs.push({
                key: match[1].trim(),
                value: match[2].trim()
            });
        }
    }

    // Look for <b>Key:</b> Value pattern
    const bKeyRegex = /<b>([^:]+):<\/b>\s*([^<]+)/g;
    match = null;

    while ((match = bKeyRegex.exec(html)) !== null) {
        if (match[1] && match[2]) {
            pairs.push({
                key: match[1].trim(),
                value: match[2].trim()
            });
        }
    }

    // Look for Key: Value pattern in text (common in event descriptions)
    const textKeyRegex = /^([A-Za-z\s]+):\s*(.+)$/gm;
    match = null;

    while ((match = textKeyRegex.exec(html)) !== null) {
        // Make sure we're not inside an HTML tag
        if (match[0].indexOf('<') === -1 && match[0].indexOf('>') === -1) {
            if (match[1] && match[2]) {
                pairs.push({
                    key: match[1].trim(),
                    value: match[2].trim()
                });
            }
        }
    }

    return pairs;
};

/**
 * Convert HTML tables to formatted text
 */
const convertTableToText = (html: string): string => {
    // Replace each table with a text representation
    return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
        // Extract rows
        const rows: string[][] = [];
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
            const cells: string[] = [];
            const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
            let cellMatch;

            while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
                // Clean the cell content of HTML tags
                const cellContent = cellMatch[1].replace(/<[^>]*>/g, '').trim();
                cells.push(cellContent);
            }

            if (cells.length > 0) {
                rows.push(cells);
            }
        }

        // Convert rows to text
        if (rows.length === 0) return '';

        return rows.map(row => row.join(' | ')).join('\n');
    });
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
 * Extract attachment links from HTML content
 * Focuses on Google Drive links and regular attachments
 */
export const extractAttachmentLinks = (description: string): Array<{ title: string, url: string }> => {
    if (!description) return [];

    const attachments: Array<{ title: string, url: string }> = [];

    // Regular links in <a> tags
    const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;

    let match;
    while ((match = linkRegex.exec(description)) !== null) {
        const url = match[1];
        const title = match[2].trim();

        attachments.push({ title, url });
    }

    // Links outside of <a> tags using pattern matching
    const urlPatterns = [
        // HTTP/HTTPS URLs
        /https?:\/\/[^\s<>()"\[\]{}]+\.[^\s<>()"\[\]{}]+/g,
        // Drive-specific URLs
        /drive\.google\.com\/[^\s<>()"\[\]{}]+/g,
        // Docs URLs
        /docs\.google\.com\/[^\s<>()"\[\]{}]+/g
    ];

    for (const pattern of urlPatterns) {
        let matches;
        while ((matches = pattern.exec(description)) !== null) {
            const url = matches[0];

            // Skip if this URL is already in attachments
            if (attachments.some(a => a.url === url)) continue;

            // For other URLs, add as an attachment with the domain as title
            try {
                const domain = new URL(url).hostname.replace('www.', '');
                attachments.push({
                    title: `Link to ${domain}`,
                    url
                });
            } catch {
                attachments.push({
                    title: 'Link',
                    url
                });
            }
        }
    }

    return attachments;
};

/**
 * Extract "Details:" URL from event description
 * Specifically looks for URLs that appear after keywords indicating event details
 * or direct links to event pages on egliselacite.com domains
 */
export const extractDetailsUrl = (description: string): string | null => {
    if (!description) return null;

    // Clean and normalize the description to handle various formatting issues
    const normalizedDescription = description
        .replace(/\r\n/g, '\n')  // Normalize line breaks
        .replace(/\s+/g, ' ')    // Normalize multiple spaces
        .trim();

    try {
        // First priority: Look specifically for egliselacite.com event details URLs
        const eventDetailUrlPattern = /(https?:\/\/(?:www\.)?(?:fr\.)?egliselacite\.com\/event-details[^\s\n<>]+)/i;
        const eventUrlMatch = normalizedDescription.match(eventDetailUrlPattern);

        if (eventUrlMatch && eventUrlMatch[1]) {
            const url = cleanUrl(eventUrlMatch[1]);
            console.log('Found event details URL via direct pattern match:', url);
            return url;
        }

        // Second approach: look for common patterns like "Details:" followed by a URL
        const keywordPattern = /(?:(?:link\s*)?details|more\s*info|information|for\s*details|learn\s*more|find out more|event\s*details)[:\s-]*\s*(https?:\/\/[^\s\n<>]+)/i;
        const match = normalizedDescription.match(keywordPattern);

        if (match && match[1]) {
            const url = cleanUrl(match[1]);
            console.log('Found event details URL via keyword pattern:', url);
            return url;
        }

        // Third approach: look for URLs containing event-specific keywords
        const eventUrlPattern = /(https?:\/\/[^\s\n<>]*(?:event|registration|signup|details)[^\s\n<>]*)/i;
        const secondMatch = normalizedDescription.match(eventUrlPattern);

        if (secondMatch && secondMatch[1]) {
            const url = cleanUrl(secondMatch[1]);
            console.log('Found event details URL via URL content pattern:', url);
            return url;
        }

        // Fourth approach: look for URLs after a line break following "Details" on its own line
        const detailsLinePattern = /details:?\s*\n+\s*(https?:\/\/[^\s\n<>]+)/i;
        const thirdMatch = normalizedDescription.match(detailsLinePattern);

        if (thirdMatch && thirdMatch[1]) {
            const url = cleanUrl(thirdMatch[1]);
            console.log('Found event details URL via line break pattern:', url);
            return url;
        }

        // Last attempt: look for any egliselacite.com domain URL that might be relevant
        const domainPattern = /(https?:\/\/(?:www\.)?(?:fr\.)?egliselacite\.com\/[^\s\n<>]+)/i;
        const fourthMatch = normalizedDescription.match(domainPattern);

        if (fourthMatch && fourthMatch[1]) {
            const url = cleanUrl(fourthMatch[1]);
            console.log('Found event details URL via domain match:', url);
            return url;
        }
    } catch (error) {
        console.error('Error extracting details URL:', error);
    }

    return null;
};

/**
 * Helper function to clean and validate URLs
 */
const cleanUrl = (url: string): string => {
    // Remove any trailing characters that aren't part of the URL
    let cleanedUrl = url.trim();

    // Fix common issues with URLs
    cleanedUrl = cleanedUrl
        .replace(/[.,;:]+$/, '')  // Remove punctuation at end
        .replace(/'|"|>|<|\)|\(|\]|\[/g, ''); // Remove quotes, brackets

    // Handle HTML entity-encoded URLs
    cleanedUrl = cleanedUrl
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // If the URL is from egliselacite.com but doesn't have the event-details path, fix it
    if (cleanedUrl.match(/egliselacite\.com\/(?!event-details)/i) &&
        !cleanedUrl.includes('/event-details')) {
        console.log('Fixing URL to include event-details path:', cleanedUrl);
        // Try to extract the last part of the URL to use as the event ID
        const parts = cleanedUrl.split('/');
        const eventId = parts[parts.length - 1];
        if (eventId && eventId.length > 0) {
            // Reconstruct with the event-details format
            const domain = cleanedUrl.includes('fr.egliselacite') ?
                'https://fr.egliselacite.com' : 'https://www.egliselacite.com';
            cleanedUrl = `${domain}/event-details/${eventId}`;
        }
    }

    // Ensure the URL is properly encoded
    try {
        // Use URL constructor to validate and potentially fix the URL
        const urlObj = new URL(cleanedUrl);
        // Return the properly formatted URL
        return urlObj.toString();
    } catch (e) {
        console.error('Invalid URL detected, returning original:', cleanedUrl);
        return cleanedUrl; // Return the original cleaned URL if parsing fails
    }
};