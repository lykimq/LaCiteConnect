# Content Database Structure

This directory contains the content database for the La Cité Connect application. The content is organized into JSON files to make updates easier and support multiple languages.

## Directory Structure

```
database/
├── en/                  # English content
│   ├── home.json        # Home screen content
│   ├── whoWeAre.json    # Who We Are screen content
│   ├── events.json      # Events screen content
│   ├── donation.json    # Donation screen content
│   └── getConnected.json # Get Connected screen content
├── fr/                  # French content (same structure as English)
├── locales/             # Platform-specific localization files
│   └── ios/             # iOS localization files
│       ├── en.json      # English iOS localization
│       └── fr.json      # French iOS localization
└── languages.json       # Language configuration
```

## Content Structure

Each content file follows a consistent structure with a header section and content sections. Here's an example of the structure:

```json
{
  "header": {
    "title": "Section Title",
    "subtitle": "Optional subtitle text"
  },
  "sections": [
    {
      "id": "uniqueId",
      "icon": "icon-name",
      "title": "Section Title",
      "content": "Section content text"
    },
    ...
  ]
}
```

## Adding a New Language

To add a new language:

1. Create a new directory for the language code (e.g., `es` for Spanish)
2. Copy all JSON files from the `en` directory to the new language directory
3. Translate the content in the new JSON files
4. Update the `languages.json` file to include the new language:

```json
{
  "available": ["en", "fr", "es"],
  "default": "en",
  "names": {
    "en": "English",
    "fr": "Français",
    "es": "Español"
  },
  "metadata": {
    "en": {
      "name": "English",
      "nativeName": "English",
      "direction": "ltr"
    },
    "fr": {
      "name": "French",
      "nativeName": "Français",
      "direction": "ltr"
    },
    "es": {
      "name": "Spanish",
      "nativeName": "Español",
      "direction": "ltr"
    }
  }
}
```

5. Create platform-specific locale files in the `locales` directory

## Content Types

### Home Content (`home.json`)

Contains information about Sunday services, how to join in person or online, and important details visitors might want to know.

### Who We Are Content (`whoWeAre.json`)

Information about the church's vision, history, leadership team, and statements of faith.

### Events Content (`events.json`)

UI strings and configuration for the events screen. The actual events are loaded dynamically from a calendar service.

### Donation Content (`donation.json`)

Information about donating to different funds, including bank details and descriptions.

### Get Connected Content (`getConnected.json`)

Information about staying updated, social media links, volunteering, and joining small groups.

## Updating Content

To update content:

1. Locate the appropriate JSON file in the language directory
2. Edit the JSON content
3. Save the file
4. Test the changes in the app

Remember to update all language versions when making changes to ensure consistency across languages.