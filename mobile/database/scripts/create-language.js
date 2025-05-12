/**
 * Script to create a new language template by copying files from English
 *
 * Usage: node create-language.js <language-code>
 * Example: node create-language.js es
 */

const fs = require('fs');
const path = require('path');

// Get language code from command line
const languageCode = process.argv[2];
if (!languageCode) {
    console.error('Error: No language code provided.');
    console.error('Usage: node create-language.js <language-code>');
    console.error('Example: node create-language.js es');
    process.exit(1);
}

// Define paths
const databaseRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(databaseRoot, 'en');
const targetDir = path.join(databaseRoot, languageCode);
const languagesFile = path.join(databaseRoot, 'languages.json');

// Check if language directory already exists
if (fs.existsSync(targetDir)) {
    console.error(`Error: Language directory "${languageCode}" already exists.`);
    process.exit(1);
}

// Create the target directory
fs.mkdirSync(targetDir, { recursive: true });

// Copy all files from English to new language directory
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    // Read the file content
    const content = fs.readFileSync(sourcePath, 'utf8');

    // Write to the new file
    fs.writeFileSync(targetPath, content);
    console.log(`Created: ${targetPath}`);
});

// Update languages.json if it exists
if (fs.existsSync(languagesFile)) {
    try {
        const languagesData = JSON.parse(fs.readFileSync(languagesFile, 'utf8'));

        // Check if language is already in the file
        if (languagesData.available.includes(languageCode)) {
            console.warn(`Warning: Language "${languageCode}" is already in languages.json`);
        } else {
            // Add the new language
            languagesData.available.push(languageCode);

            // If name is not provided, use the language code
            languagesData.names[languageCode] = languageCode.toUpperCase();

            // Add metadata with default values
            languagesData.metadata[languageCode] = {
                name: languageCode.toUpperCase(),
                nativeName: languageCode.toUpperCase(),
                direction: 'ltr'
            };

            // Write the updated file
            fs.writeFileSync(languagesFile, JSON.stringify(languagesData, null, 2));
            console.log(`Updated: ${languagesFile}`);
        }
    } catch (error) {
        console.error('Error updating languages.json:', error.message);
    }
}

console.log(`\nLanguage template for "${languageCode}" created successfully.`);
console.log('Next steps:');
console.log('1. Translate the content in the new JSON files');
console.log('2. Update the language metadata in languages.json');
console.log('3. Create platform-specific locale files if needed');