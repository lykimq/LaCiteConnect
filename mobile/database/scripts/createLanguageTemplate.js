/**
 * Create Language Template Script
 *
 * This script helps create language template files based on the English content.
 * Usage: node createLanguageTemplate.js <languageCode>
 * Example: node createLanguageTemplate.js fr
 */

const fs = require('fs');
const path = require('path');

// Content types
const CONTENT_TYPES = ['home', 'whoWeAre', 'events', 'donation', 'getConnected'];

// Get language code from command line arguments
const languageCode = process.argv[2];

if (!languageCode) {
    console.error('Please specify a language code.');
    console.log('Usage: node createLanguageTemplate.js <languageCode>');
    console.log('Example: node createLanguageTemplate.js fr');
    process.exit(1);
}

// Base paths
const baseDir = path.join(__dirname, '..');
const srcDir = path.join(baseDir, 'en');
const targetDir = path.join(baseDir, languageCode);

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    console.log(`Creating directory for ${languageCode}...`);
    fs.mkdirSync(targetDir, { recursive: true });
}

// Process each content type
CONTENT_TYPES.forEach(contentType => {
    const srcFile = path.join(srcDir, `${contentType}.json`);
    const targetFile = path.join(targetDir, `${contentType}.json`);

    // Skip if target file already exists
    if (fs.existsSync(targetFile)) {
        console.log(`File already exists: ${targetFile}`);
        return;
    }

    try {
        // Read source file
        const content = fs.readFileSync(srcFile, 'utf8');
        // Write to target file
        fs.writeFileSync(targetFile, content);
        console.log(`Created ${targetFile}`);
    } catch (error) {
        console.error(`Error processing ${contentType}:`, error.message);
    }
});

console.log(`\nTemplate files for ${languageCode} have been created.`);
console.log(`You can now edit the files in ${targetDir} to add translations.`);
console.log('Remember to update the languages.json file to include the new language.');