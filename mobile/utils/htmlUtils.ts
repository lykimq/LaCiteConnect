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
    let match: RegExpExecArray | null;
    while ((match = imgRegex.exec(html)) !== null) {
        if (match[1]) {
            images.push(match[1]);
        }
    }

    // Look for Google Drive image links - enhanced pattern detection
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    // Format 2: https://drive.google.com/uc?id=FILE_ID
    // Format 3: https://drive.google.com/open?id=FILE_ID
    const driveRegex = /https:\/\/drive\.google\.com\/(?:file\/d\/|uc\?id=|open\?id=)([a-zA-Z0-9_-]+)(?:\/view|\b|&)/g;

    match = null;
    while ((match = driveRegex.exec(html)) !== null) {
        const fileId = match[1];
        if (fileId) {
            // Convert to direct image URL that works with Image component
            images.push(`https://drive.google.com/uc?export=view&id=${fileId}`);
            console.log(`Found Drive image: ${fileId}`);
        }
    }

    // Look for Google Drive folder links that may contain images
    // For folders, we can't directly get images but we can extract the folder ID for reference
    const driveFolderRegex = /https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/g;

    match = null;
    while ((match = driveFolderRegex.exec(html)) !== null) {
        const folderId = match[1];
        if (folderId) {
            // Use a placeholder image that indicates a folder of images
            // In a real implementation, you might want to use the Google Drive API to list folder contents
            console.log(`Found Drive folder: ${folderId}`);

            // Add a special placeholder image URL that we can detect in the UI
            images.push(`https://drive.google.com/thumbnail?id=${folderId}&authuser=0`);
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
            if (fileId && !images.some(url => url.includes(fileId))) {
                images.push(`https://drive.google.com/uc?export=view&id=${fileId}`);
                console.log(`Found Drive image in <a> tag: ${fileId}`);
            }
        }

        // Check for folder link
        let folderIdMatch = driveUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (folderIdMatch) {
            const folderId = folderIdMatch[1];
            if (folderId && !images.some(url => url.includes(folderId))) {
                images.push(`https://drive.google.com/thumbnail?id=${folderId}&authuser=0`);
                console.log(`Found Drive folder in <a> tag: ${folderId}`);
            }
        }
    }

    // For debugging
    if (images.length > 0) {
        console.log(`Found ${images.length} images in HTML content`);
    }

    return images;
};

/**
 * Convert HTML to formatted plain text
 * Handles common HTML elements like <b>, <p>, <br>, etc.
 * Enhanced to preserve more formatting from HTML
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
    text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n$1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n$1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n$1\n\n');

    // Handle divs with spacing
    text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');

    // Replace lists with formatted text
    text = text.replace(/<li[^>]*>\s*(.*?)\s*<\/li>/gi, '• $1\n');
    text = text.replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n');
    text = text.replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n');

    // Replace links with formatted text - keep the URL
    text = text.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2');

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
 * Extract calendar attachment links
 * Look for Google Calendar attachment references in the description
 */
export const extractAttachmentLinks = (description: string): Array<{ title: string, url: string }> => {
    if (!description) return [];

    const links: Array<{ title: string, url: string }> = [];

    // Look for attachment patterns in Google Calendar descriptions
    // Format: [title](url) - Markdown style links
    const attachmentRegex = /\[([^\]]+)\]\s*\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = attachmentRegex.exec(description)) !== null) {
        if (match[1] && match[2]) {
            links.push({
                title: match[1],
                url: match[2]
            });
        }
    }

    // Also look for regular HTML links
    const htmlLinkRegex = /<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/g;
    let htmlMatch: RegExpExecArray | null;

    while ((htmlMatch = htmlLinkRegex.exec(description)) !== null) {
        // Always check if htmlMatch is not null before using it
        if (htmlMatch) {
            const url = htmlMatch[1];
            const title = htmlMatch[2];

            if (url && title) {
                // Skip Google Drive links that we're already handling for images
                if (!url.includes('drive.google.com') ||
                    (!url.includes('/file/d/') && !url.includes('/folders/') && !url.includes('id='))) {

                    // Check if this URL is already in the links array
                    if (!links.some(link => link.url === url)) {
                        links.push({
                            title: title,
                            url: url
                        });
                    }
                }
            }
        }
    }

    // For debugging
    if (links.length > 0) {
        console.log(`Found ${links.length} attachment links in description`);
    }

    return links;
};