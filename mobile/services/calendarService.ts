/**
 * Calendar Service
 * Handles fetching events from a personal Google Calendar using iCal
 */
import { Linking, Platform } from 'react-native';
import { extractDriveLinksFromHtml, convertHtmlToFormattedText, parseLocationString, extractAttachmentLinks, extractDetailsUrl } from '../utils/htmlUtils';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import { getLanguage } from '../services/languageService';
import { processUrlForLanguage, openUrlWithCorrectDomain } from '../utils/urlUtils';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    formattedDescription?: string;  // Description with HTML formatting removed
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    formattedLocation?: {  // Parsed location information
        address: string;
        mapUrl?: string;
    };
    recurrence?: boolean;
    isHoliday?: boolean;
    attachments?: Array<{ title: string, url: string }>;  // Attachments in the description
    reminderSet?: boolean;  // Whether a reminder is set for this event
    detailsUrl?: string;  // URL to event details
}

// Personal calendar ID
const CALENDAR_ID = 'lykimq@gmail.com';

// iCal URL for personal calendar
const ICAL_URL = 'https://calendar.google.com/calendar/ical/lykimq%40gmail.com/public/basic.ics';

// Calendar embed URL with parameters for better view
const EMBED_URL = 'https://calendar.google.com/calendar/embed?src=lykimq%40gmail.com&ctz=Europe%2FParis&mode=MONTH&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1';

// Alternative public calendar REST API URL
const API_URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs&timeMin=${new Date().toISOString()}&maxResults=100&singleEvents=true&orderBy=startTime`;

// French holidays calendar ID
const FRENCH_HOLIDAYS_CALENDAR_ID = 'en.french#holiday@group.v.calendar.google.com';

// French holidays API URL - Use the public calendar endpoint
const FRENCH_HOLIDAYS_API_URL = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(FRENCH_HOLIDAYS_CALENDAR_ID)}/events?key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs&maxResults=100&singleEvents=true&orderBy=startTime`;

export const calendarService = {
    // Track current language
    currentLanguage: 'en',

    // Cached events that need URL updating when language changes
    cachedEvents: [] as CalendarEvent[],

    // Debug mode flag to enable verbose logging
    DEBUG_MODE: true,

    // Initialize language
    async initialize() {
        try {
            this.currentLanguage = await getLanguage();
            console.log('[CalendarService] Calendar service initialized with language:', this.currentLanguage);
            if (this.DEBUG_MODE) {
                console.log('[CalendarService] Debug mode is ENABLED');
            }
        } catch (error) {
            console.error('[CalendarService] Error initializing calendar service language:', error);
        }
    },

    /**
     * Update the service language and refresh event URLs
     */
    async updateLanguage(language: string) {
        try {
            console.log(`[CalendarService] Language change requested: ${this.currentLanguage} -> ${language}`);

            // Skip if language is the same
            if (this.currentLanguage === language) {
                console.log(`[CalendarService] Language is already set to ${language}, no change needed`);
                return;
            }

            // Store previous language for logging
            const previousLanguage = this.currentLanguage;

            // Update the language
            this.currentLanguage = language;
            console.log(`[CalendarService] Calendar service language updated to: ${language}`);

            // Log the event cache status
            console.log(`[CalendarService] Event cache size before updating: ${this.cachedEvents.length}`);

            // Update all cached events' URLs to match the new language
            if (this.cachedEvents.length > 0) {
                console.log(`[CalendarService] Updating URLs for ${this.cachedEvents.length} cached events`);

                // Process each event to update its URL
                this.cachedEvents = this.cachedEvents.map(event => {
                    // Only process events with descriptions or existing URLs
                    if (event.description || event.detailsUrl) {
                        console.log(`[CalendarService] Updating URL for event: ${event.summary}`);

                        try {
                            // Clear the existing detailsUrl
                            const existingUrl = event.detailsUrl;

                            if (existingUrl) {
                                console.log(`[CalendarService] Existing URL: ${existingUrl}`);

                                try {
                                    // Parse the URL
                                    const urlObj = new URL(existingUrl);
                                    const path = urlObj.pathname + urlObj.search;

                                    // Create a new URL with the correct domain for the new language
                                    const domain = language === 'fr' ? 'fr.egliselacite.com' : 'www.egliselacite.com';
                                    const newUrl = `https://${domain}${path}`;

                                    // Update the event's URL
                                    event.detailsUrl = newUrl;
                                    console.log(`[CalendarService] Updated URL: ${newUrl}`);
                                } catch (urlError) {
                                    console.error(`[CalendarService] Error updating URL domain:`, urlError);
                                }
                            }
                            // If no URL exists but we have a description, extract a new one
                            else if (event.description) {
                                console.log(`[CalendarService] No URL exists, extracting from description for ${event.summary}`);

                                // Process the event again to extract a fresh URL
                                const freshEvent = this.processEventData({
                                    id: event.id,
                                    summary: event.summary,
                                    description: event.description,
                                    start: event.start,
                                    end: event.end,
                                    location: event.location
                                }, true);

                                // Copy the new URL to the original event
                                event.detailsUrl = freshEvent.detailsUrl;
                                console.log(`[CalendarService] Extracted new URL: ${event.detailsUrl || 'none'}`);
                            }
                        } catch (error) {
                            console.error(`[CalendarService] Error updating URL for event ${event.summary}:`, error);
                        }
                    }

                    return event;
                });

                console.log(`[CalendarService] Finished updating all cached event URLs`);
            } else {
                console.log(`[CalendarService] No cached events to update`);
            }

            console.log(`[CalendarService] Language change complete: ${previousLanguage} -> ${language}`);
        } catch (error) {
            console.error(`[CalendarService] Error updating language to ${language}:`, error);
        }
    },

    /**
     * Ensure URL domain matches the current language
     * @param url The URL to check and possibly modify
     * @returns URL with the correct domain based on current language
     */
    ensureUrlMatchesLanguage(url: string): string {
        // Use the centralized URL processing utility
        return processUrlForLanguage(url, this.currentLanguage);
    },

    /**
     * Get event details URL with guaranteed language matching
     * @param event The calendar event
     * @returns URL that matches the current language preference
     */
    getEventDetailsUrl(event: CalendarEvent): string | null {
        if (this.DEBUG_MODE) {
            console.log(`[CalendarService] getEventDetailsUrl called for event "${event.summary}"`);
            console.log(`[CalendarService] Current language: ${this.currentLanguage}`);
        }

        try {
            // Try to find a direct URL in the description first
            if (event.description) {
                // Look for language-specific URLs in the description
                const urlRegex = this.currentLanguage === 'fr'
                    ? /https:\/\/fr\.egliselacite\.com\/event-details\/[a-zA-Z0-9-_]+/g
                    : /https:\/\/www\.egliselacite\.com\/event-details\/[a-zA-Z0-9-_]+/g;

                // Find all matching URLs in the description
                const matches = event.description.match(urlRegex);

                if (matches && matches.length > 0) {
                    // Use the first URL that matches the current language
                    console.log(`[CalendarService] Found direct ${this.currentLanguage} URL in description: ${matches[0]}`);
                    return matches[0];
                }

                // If no language-specific URL found, look for any event details URL
                const genericUrlRegex = /https:\/\/(?:www\.|fr\.)?egliselacite\.com\/event-details\/[a-zA-Z0-9-_]+/g;
                const genericMatches = event.description.match(genericUrlRegex);

                if (genericMatches && genericMatches.length > 0) {
                    const url = genericMatches[0];
                    // Convert to correct language domain
                    const domainToUse = this.currentLanguage === 'fr' ? 'fr.egliselacite.com' : 'www.egliselacite.com';

                    // Extract the event slug and rebuild URL with correct domain
                    try {
                        const parts = url.split('/event-details/');
                        if (parts.length > 1) {
                            const slug = parts[1].split('?')[0]; // Get slug without query params
                            const finalUrl = `https://${domainToUse}/event-details/${slug}`;
                            console.log(`[CalendarService] Converted generic URL to language-specific: ${finalUrl}`);
                            return finalUrl;
                        }
                    } catch (e) {
                        console.error('[CalendarService] Error extracting slug from URL:', e);
                    }

                    // Fallback to simple domain replacement
                    const correctDomainUrl = this.currentLanguage === 'fr'
                        ? url.replace(/(?:www\.)?egliselacite\.com/, 'fr.egliselacite.com')
                        : url.replace(/fr\.egliselacite\.com/, 'www.egliselacite.com');

                    console.log(`[CalendarService] Converted URL domain: ${correctDomainUrl}`);
                    return correctDomainUrl;
                }
            }

            // If no URL found in description, check if event has a detailsUrl already
            if (event.detailsUrl) {
                // Convert existing URL to correct language domain
                const correctDomainUrl = this.processUrlForLanguage(event.detailsUrl);
                console.log(`[CalendarService] Using existing URL with corrected domain: ${correctDomainUrl}`);
                return correctDomainUrl;
            }

            // No URL found, use a fallback to events listing page
            const fallbackUrl = this.currentLanguage === 'fr'
                ? 'https://fr.egliselacite.com/events'
                : 'https://www.egliselacite.com/events';

            console.log(`[CalendarService] No URL found, using fallback: ${fallbackUrl}`);
            return fallbackUrl;
        } catch (error) {
            console.error(`[CalendarService] Error in getEventDetailsUrl:`, error);

            // Final fallback - just return a language-appropriate base URL
            const fallbackUrl = this.currentLanguage === 'fr'
                ? 'https://fr.egliselacite.com/events'
                : 'https://www.egliselacite.com/events';

            console.log(`[CalendarService] Using fallback URL: ${fallbackUrl}`);
            return fallbackUrl;
        }
    },

    /**
     * Process URL to ensure it has correct domain for current language
     */
    processUrlForLanguage(url: string): string {
        // Skip if not egliselacite URL
        if (!url || !url.includes('egliselacite.com')) {
            return url;
        }

        try {
            // Handle event detail URLs specifically
            if (url.includes('/event-details/')) {
                // Extract the slug
                const parts = url.split('/event-details/');
                if (parts.length > 1) {
                    const slug = parts[1].split('?')[0]; // Get slug without query params
                    const domain = this.currentLanguage === 'fr' ? 'fr.egliselacite.com' : 'www.egliselacite.com';
                    return `https://${domain}/event-details/${slug}`;
                }
            }

            // Generic domain replacement
            return this.currentLanguage === 'fr'
                ? url.replace(/(?:www\.)?egliselacite\.com/, 'fr.egliselacite.com')
                : url.replace(/fr\.egliselacite\.com/, 'www.egliselacite.com');
        } catch (error) {
            console.error('[CalendarService] Error processing URL:', error);
            return url;
        }
    },

    /**
     * Get personal calendar events
     */
    async getEvents(year?: number, month?: number): Promise<CalendarEvent[]> {
        try {
            // Initialize language if needed
            if (!this.isInitialized) {
                await this.initialize();
                this.isInitialized = true;
            }

            // Try using Google Calendar API first
            console.log('Attempting to fetch from Google Calendar API');
            try {
                const apiEvents = await this.fetchFromGoogleApi(year, month);
                if (apiEvents && apiEvents.length > 0) {
                    console.log(`Successfully fetched ${apiEvents.length} events from API`);

                    // Validate and fix URLs before caching
                    const validatedEvents = this.validateEventUrls(apiEvents);
                    this.cachedEvents = validatedEvents; // Cache events for language updates
                    return validatedEvents;
                }
            } catch (apiError) {
                console.error('API fetch failed, falling back to iCal', apiError);
            }

            // Fall back to iCal if API fails
            const icalEvents = await this.fetchICalEvents(ICAL_URL, year, month);

            // Validate and fix URLs before caching
            const validatedEvents = this.validateEventUrls(icalEvents);
            this.cachedEvents = validatedEvents; // Cache events for language updates
            return validatedEvents;
        } catch (error) {
            console.error('All event fetch methods failed', error);
            // Return empty array to avoid crashing the app
            return [];
        }
    },

    // Track initialization status
    isInitialized: false,

    /**
     * Get French public holidays
     */
    async getFrenchHolidays(year?: number, month?: number): Promise<CalendarEvent[]> {
        try {
            console.log('Fetching French public holidays');
            const currentYear = year || new Date().getFullYear();
            let nextYear = currentYear;

            // If we're filtering by month, use exact month range
            if (month !== undefined) {
                // Build URL with year and month filter
                const startDate = new Date(currentYear, month, 1);
                const endDate = new Date(currentYear, month + 1, 0); // Last day of month

                const timeMin = startDate.toISOString();
                const timeMax = endDate.toISOString();

                const url = `${FRENCH_HOLIDAYS_API_URL}&timeMin=${timeMin}&timeMax=${timeMax}`;

                return await this.fetchHolidaysFromApi(url);
            }

            // Otherwise get full year(s)
            nextYear = currentYear + 1;
            const timeMin = `${currentYear}-01-01T00:00:00Z`;
            const timeMax = `${nextYear}-12-31T23:59:59Z`;

            const url = `${FRENCH_HOLIDAYS_API_URL}&timeMin=${timeMin}&timeMax=${timeMax}`;

            return await this.fetchHolidaysFromApi(url);
        } catch (error) {
            console.error('Error fetching French holidays:', error);
            // If API fails, use hardcoded list of major French holidays
            return this.getHardcodedFrenchHolidays(year, month);
        }
    },

    /**
     * Helper method to fetch holidays from API with error handling
     */
    async fetchHolidaysFromApi(url: string): Promise<CalendarEvent[]> {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`French holidays API request failed with status ${response.status}`);
                throw new Error(`French holidays API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data.items || !Array.isArray(data.items)) {
                throw new Error('Invalid French holidays API response format');
            }

            // Map and mark as holidays
            return data.items.map((item: any) => ({
                id: item.id,
                summary: item.summary || 'Holiday',
                description: item.description || 'French Public Holiday',
                formattedDescription: 'French Public Holiday',
                location: 'France',
                formattedLocation: { address: 'France' },
                start: {
                    dateTime: item.start.dateTime,
                    date: item.start.date
                },
                end: {
                    dateTime: item.end.dateTime,
                    date: item.end.date
                },
                isHoliday: true
            }));
        } catch (error) {
            console.error('Failed to fetch holidays from API:', error);
            throw error;
        }
    },

    /**
     * Get hardcoded French holidays as fallback
     */
    getHardcodedFrenchHolidays(year?: number, month?: number): CalendarEvent[] {
        const currentYear = year || new Date().getFullYear();

        // List of major French holidays
        const holidays = [
            { name: "Jour de l'An", month: 0, day: 1 },
            { name: "Lundi de Pâques", month: 3, day: 10 },
            { name: "Fête du Travail", month: 4, day: 1 },
            { name: "Victoire 1945", month: 4, day: 8 },
            { name: "Ascension", month: 4, day: 18 },
            { name: "Lundi de Pentecôte", month: 4, day: 29 },
            { name: "Fête Nationale", month: 6, day: 14 },
            { name: "Assomption", month: 7, day: 15 },
            { name: "Toussaint", month: 10, day: 1 },
            { name: "Armistice 1918", month: 10, day: 11 },
            { name: "Noël", month: 11, day: 25 }
        ];

        let filteredHolidays = holidays;

        // Filter by month if provided
        if (month !== undefined) {
            filteredHolidays = holidays.filter(holiday => holiday.month === month);
        }

        return filteredHolidays.map((holiday, index) => {
            const dateStr = `${currentYear}-${(holiday.month + 1).toString().padStart(2, '0')}-${holiday.day.toString().padStart(2, '0')}`;

            return {
                id: `holiday-${currentYear}-${index}`,
                summary: holiday.name,
                description: 'French Public Holiday',
                location: 'France',
                start: {
                    date: dateStr
                },
                end: {
                    date: dateStr
                },
                isHoliday: true
            };
        });
    },

    /**
     * Process event data from API response
     */
    processEventData(item: any, forceRefreshUrl: boolean = false): CalendarEvent {
        // Process the description to extract images and format text
        const description = item.description || '';

        // Log the raw description for debugging
        if (description.includes('drive.google.com')) {
            console.log('Event with Google Drive link found:', item.summary);
            console.log('Description excerpt:', description.substring(0, Math.min(300, description.length)));
        }

        // Process formatted description for display
        const formattedDescription = convertHtmlToFormattedText(description);

        // Extract attachment links
        const attachments = extractAttachmentLinks(description);

        // IMPORTANT - LANGUAGE CONTROL
        // Force language-specific URL extraction
        console.log(`[CalendarService] Processing event "${item.summary}" with language ${this.currentLanguage}`);

        // Extract details URL if present, using current language preference
        let detailsUrl = null;

        if (description) {
            try {
                // Extract all URLs from the description, preferring language-appropriate ones
                const { extractDetailsUrl } = require('../utils/htmlUtils');
                detailsUrl = extractDetailsUrl(description, this.currentLanguage);

                if (detailsUrl) {
                    console.log(`[CalendarService] Extracted raw URL for "${item.summary}": ${detailsUrl}`);

                    // Force the URL to match the current language
                    try {
                        // Get domain and path separately
                        const urlObj = new URL(detailsUrl);
                        const path = urlObj.pathname + urlObj.search;

                        // Set the domain based on language
                        const domain = this.currentLanguage === 'fr' ? 'fr.egliselacite.com' : 'www.egliselacite.com';

                        // Create a new URL with the correct domain
                        detailsUrl = `https://${domain}${path}`;

                        console.log(`[CalendarService] FORCED language-specific URL for "${item.summary}": ${detailsUrl}`);
                    } catch (urlError) {
                        console.error(`[CalendarService] Error processing URL domain for ${item.summary}:`, urlError);
                    }
                }
            } catch (error) {
                console.error(`[CalendarService] Error extracting URL for ${item.summary}:`, error);
            }
        }

        if (detailsUrl) {
            console.log(`[CalendarService] Final details URL for event ${item.summary}: ${detailsUrl}`);

            // Verify the URL has the correct domain
            const hasFrenchDomain = detailsUrl.includes('fr.egliselacite.com');
            const shouldHaveFrenchDomain = this.currentLanguage === 'fr';

            if (hasFrenchDomain !== shouldHaveFrenchDomain) {
                console.error(`[CalendarService] URL domain mismatch for ${item.summary}`);
                console.error(`[CalendarService] URL: ${detailsUrl}, language: ${this.currentLanguage}`);
            }
        } else {
            console.log(`[CalendarService] No URL found for event "${item.summary}"`);
        }

        // Process location
        const formattedLocation = parseLocationString(item.location || '');

        // Log extracted content
        if (attachments.length > 0) {
            console.log(`Extracted ${attachments.length} attachments from event: ${item.summary}`);
        }

        // Create the event object with all processed data
        const event: CalendarEvent = {
            id: item.id || `event-${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
            summary: item.summary || 'No title',
            description: description,
            formattedDescription: formattedDescription || '',
            start: {
                dateTime: item.start?.dateTime,
                date: item.start?.date
            },
            end: {
                dateTime: item.end?.dateTime,
                date: item.end?.date
            },
            location: item.location,
            formattedLocation: formattedLocation,
            attachments: attachments.length > 0 ? attachments : undefined,
            recurrence: item.recurrence ? true : false,
            detailsUrl: detailsUrl || undefined
        };

        return event;
    },

    /**
     * Attempt to fetch events from Google Calendar API with optional filtering
     */
    async fetchFromGoogleApi(year?: number, month?: number): Promise<CalendarEvent[]> {
        let url = API_URL;

        // If year and month are provided, add time filters
        if (year !== undefined && month !== undefined) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0); // Last day of month

            url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs&timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&maxResults=100&singleEvents=true&orderBy=startTime`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid API response format');
        }

        // Always process with the current language
        const events = data.items.map((item: any) => this.processEventData(item, true));
        console.log(`Processed ${events.length} events with current language: ${this.currentLanguage}`);
        return events;
    },

    /**
     * Fetch events from a public calendar using iCal format with optional filtering
     */
    async fetchICalEvents(icalUrl: string, year?: number, month?: number): Promise<CalendarEvent[]> {
        try {
            console.log(`Fetching iCal events from: ${icalUrl}`);

            // Add timeout and retry logic
            const fetchWithTimeout = async (url: string, timeoutMs = 10000, retries = 3): Promise<Response> => {
                let lastError;

                for (let attempt = 0; attempt < retries; attempt++) {
                    try {
                        // Use AbortController to implement timeout
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

                        const response = await fetch(url, {
                            signal: controller.signal,
                            headers: {
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache'
                            }
                        });

                        clearTimeout(timeoutId);

                        if (!response.ok) {
                            throw new Error(`Failed to fetch iCal data (${response.status})`);
                        }

                        return response;
                    } catch (error) {
                        console.warn(`Attempt ${attempt + 1}/${retries} failed:`, error);
                        lastError = error;

                        // Wait a bit before retrying (exponential backoff)
                        if (attempt < retries - 1) {
                            const delayMs = Math.min(1000 * Math.pow(2, attempt), 8000);
                            await new Promise(resolve => setTimeout(resolve, delayMs));
                        }
                    }
                }

                throw lastError || new Error('Failed to fetch calendar after multiple attempts');
            };

            const response = await fetchWithTimeout(icalUrl);
            const icalData = await response.text();

            if (!icalData || icalData.trim().length === 0) {
                console.error('Received empty iCal data');
                throw new Error('Calendar service returned empty data');
            }

            console.log(`Successfully retrieved iCal data (${icalData.length} bytes)`);

            // Parse the iCal data manually
            let events = this.parseICalData(icalData);

            if (events.length === 0) {
                console.warn('No events found in iCal data');
            } else {
                console.log(`Successfully parsed ${events.length} events from iCal data`);
            }

            // Filter by year and month if provided
            if (year !== undefined && month !== undefined) {
                events = events.filter(event => {
                    const eventDate = event.start.dateTime
                        ? new Date(event.start.dateTime)
                        : event.start.date
                            ? new Date(event.start.date)
                            : null;

                    if (!eventDate) return false;

                    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
                });
            }

            return events;
        } catch (error) {
            console.error('Error fetching iCal events:', error);
            // Include more diagnostic information in the error
            const errorMessage = error instanceof Error
                ? `Calendar service error: ${error.message}`
                : 'Unknown calendar service error';

            throw new Error(errorMessage);
        }
    },

    /**
     * Parse iCal data manually with enhanced processing
     */
    parseICalData(icalData: string): CalendarEvent[] {
        try {
            const events: CalendarEvent[] = [];
            console.log('Parsing iCal data...');

            // Simple regex-based parsing for iCal format
            const eventBlocks = icalData.split('BEGIN:VEVENT');
            console.log(`Found ${eventBlocks.length - 1} event blocks in iCal data`);

            // Skip the first entry as it's the header
            for (let i = 1; i < eventBlocks.length; i++) {
                const block = eventBlocks[i];
                const endIndex = block.indexOf('END:VEVENT');

                if (endIndex === -1) continue;

                const eventData = block.substring(0, endIndex);

                // Extract event details using regex
                const summary = this.extractICalProperty(eventData, 'SUMMARY');
                let description = this.extractICalProperty(eventData, 'DESCRIPTION');
                const location = this.extractICalProperty(eventData, 'LOCATION');
                const uid = this.extractICalProperty(eventData, 'UID');
                const rrule = this.extractICalProperty(eventData, 'RRULE');

                // Special handling for descriptions - decode escaped characters
                if (description) {
                    // Replace escaped characters
                    description = description
                        .replace(/\\n/g, '\n')
                        .replace(/\\,/g, ',')
                        .replace(/\\;/g, ';')
                        .replace(/\\\\/g, '\\')
                        .replace(/\\N/g, '\n');

                    // Log if the description contains Google Drive links
                    if (description.includes('drive.google.com')) {
                        console.log(`Event ${i} (${summary}) has Google Drive link(s)`);
                        console.log('Description excerpt:', description.substring(0, Math.min(300, description.length)));
                    }
                }

                // Get start and end dates
                let dtstart = this.extractICalProperty(eventData, 'DTSTART');
                let dtend = this.extractICalProperty(eventData, 'DTEND');

                // Handle additional date format variations
                if (!dtstart) {
                    dtstart = this.extractICalProperty(eventData, 'DTSTART;VALUE=DATE');
                }
                if (!dtend) {
                    dtend = this.extractICalProperty(eventData, 'DTEND;VALUE=DATE');
                }

                // Skip if we couldn't find a start date
                if (!dtstart) {
                    console.log(`Event ${i} (${summary}) skipped - no start date found`);
                    continue;
                }

                const startDate = this.parseICalDate(dtstart);

                // Only log, but include all events regardless of date
                if (startDate) {
                    const month = startDate.getMonth() + 1; // 0-indexed to 1-indexed
                    const year = startDate.getFullYear();
                    console.log(`Event ${i}: ${summary} - Date: ${startDate.toISOString()} (Month: ${month}, Year: ${year})`);
                }

                // Process the description to extract format text
                const formattedDescription = description ? convertHtmlToFormattedText(description) : undefined;
                const attachments = description ? extractAttachmentLinks(description) : [];

                // Extract details URL if present, using current language preference
                const detailsUrl = description ? extractDetailsUrl(description, this.currentLanguage) : null;

                // Process location
                const formattedLocation = location ? parseLocationString(location) : undefined;

                // Log extracted content for debugging
                if (attachments.length > 0) {
                    console.log(`Extracted ${attachments.length} attachments from event: ${summary}`);
                }

                if (detailsUrl) {
                    console.log(`Found details URL for event ${summary}: ${detailsUrl}`);
                }

                // Create basic event
                const event: CalendarEvent = {
                    id: uid || `event-${i}`,
                    summary: summary || 'Untitled Event',
                    description: description || undefined,
                    formattedDescription: formattedDescription,
                    location: location || undefined,
                    formattedLocation: formattedLocation,
                    start: {},
                    end: {},
                    recurrence: !!rrule,
                    attachments: attachments.length > 0 ? attachments : undefined,
                    detailsUrl: detailsUrl || undefined
                };

                // Process date format
                if (dtstart) {
                    // Check if it's an all-day event (no time component)
                    if (dtstart.length === 8 || dtstart.indexOf('T') === -1) {
                        // Ensure proper formatting for date-only events
                        const year = dtstart.substring(0, 4);
                        const month = dtstart.substring(4, 6);
                        const day = dtstart.substring(6, 8);
                        const formattedDate = `${year}-${month}-${day}`;
                        event.start.date = formattedDate;
                    } else {
                        event.start.dateTime = this.formatICalDateTime(dtstart);
                    }
                }

                if (dtend) {
                    if (dtend.length === 8 || dtend.indexOf('T') === -1) {
                        // Ensure proper formatting for date-only events
                        const year = dtend.substring(0, 4);
                        const month = dtend.substring(4, 6);
                        const day = dtend.substring(6, 8);
                        const formattedDate = `${year}-${month}-${day}`;
                        event.end.date = formattedDate;
                    } else {
                        event.end.dateTime = this.formatICalDateTime(dtend);
                    }
                } else if (event.start.date) {
                    // Default end date to same as start for all-day events
                    event.end.date = event.start.date;
                } else if (event.start.dateTime) {
                    // Default end time to 1 hour after start
                    const endTime = new Date(event.start.dateTime);
                    endTime.setHours(endTime.getHours() + 1);
                    event.end.dateTime = endTime.toISOString();
                }

                // Add the event
                events.push(event);

                // Handle recurring events - add next 10 occurrences for repeating events
                if (rrule && startDate) {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);

                    // Naive implementation of simple recurring events
                    // For weekly events
                    if (rrule.includes('FREQ=WEEKLY')) {
                        for (let j = 1; j <= 10; j++) {
                            const futureDate = new Date(startDate);
                            futureDate.setDate(futureDate.getDate() + (j * 7));

                            // Only add future occurrences
                            if (futureDate >= now) {
                                const recurringEvent: CalendarEvent = {
                                    ...event,
                                    id: `${event.id}_recur_${j}`,
                                    summary: `${event.summary}${event.recurrence ? ' (Recurring)' : ''}`,
                                    start: {},
                                    end: {}
                                };

                                if (event.start.dateTime) {
                                    recurringEvent.start.dateTime = futureDate.toISOString();
                                } else if (event.start.date) {
                                    const futureDateStr = futureDate.toISOString().split('T')[0];
                                    recurringEvent.start.date = futureDateStr;
                                }

                                // Calculate end date/time based on duration of original event
                                if (event.end.dateTime && event.start.dateTime) {
                                    const originalStart = new Date(event.start.dateTime);
                                    const originalEnd = new Date(event.end.dateTime);
                                    const duration = originalEnd.getTime() - originalStart.getTime();

                                    const futureEndDate = new Date(futureDate.getTime() + duration);
                                    recurringEvent.end.dateTime = futureEndDate.toISOString();
                                } else if (event.end.date && event.start.date) {
                                    const futureDateStr = futureDate.toISOString().split('T')[0];
                                    recurringEvent.end.date = futureDateStr;
                                }

                                events.push(recurringEvent);
                            }
                        }
                    }

                    // For monthly events
                    if (rrule.includes('FREQ=MONTHLY')) {
                        for (let j = 1; j <= 10; j++) {
                            const futureDate = new Date(startDate);
                            futureDate.setMonth(futureDate.getMonth() + j);

                            // Only add future occurrences
                            if (futureDate >= now) {
                                const recurringEvent: CalendarEvent = {
                                    ...event,
                                    id: `${event.id}_recur_${j}`,
                                    summary: `${event.summary}${event.recurrence ? ' (Recurring)' : ''}`,
                                    start: {},
                                    end: {}
                                };

                                if (event.start.dateTime) {
                                    recurringEvent.start.dateTime = futureDate.toISOString();
                                } else if (event.start.date) {
                                    const futureDateStr = futureDate.toISOString().split('T')[0];
                                    recurringEvent.start.date = futureDateStr;
                                }

                                // Calculate end date/time based on duration of original event
                                if (event.end.dateTime && event.start.dateTime) {
                                    const originalStart = new Date(event.start.dateTime);
                                    const originalEnd = new Date(event.end.dateTime);
                                    const duration = originalEnd.getTime() - originalStart.getTime();

                                    const futureEndDate = new Date(futureDate.getTime() + duration);
                                    recurringEvent.end.dateTime = futureEndDate.toISOString();
                                } else if (event.end.date && event.start.date) {
                                    const futureDateStr = futureDate.toISOString().split('T')[0];
                                    recurringEvent.end.date = futureDateStr;
                                }

                                events.push(recurringEvent);
                            }
                        }
                    }
                }
            }

            // Sort events by start date
            events.sort((a, b) => {
                const dateA = a.start.dateTime ? new Date(a.start.dateTime) : new Date(a.start.date || "");
                const dateB = b.start.dateTime ? new Date(b.start.dateTime) : new Date(b.start.date || "");
                return dateA.getTime() - dateB.getTime();
            });

            // Log months found
            const months = new Set();
            events.forEach(event => {
                const eventDate = event.start.dateTime
                    ? new Date(event.start.dateTime)
                    : event.start.date
                        ? new Date(event.start.date)
                        : null;

                if (eventDate) {
                    const month = eventDate.getMonth() + 1; // 0-indexed to 1-indexed
                    const year = eventDate.getFullYear();
                    months.add(`${year}-${month}`);
                }
            });

            console.log('Months found in events:', [...months].sort().join(', '));
            console.log(`Parsed ${events.length} calendar events in total (including expanded recurring events)`);

            return events;
        } catch (error) {
            console.error('Error parsing iCal data:', error);
            return [];
        }
    },

    /**
     * Extract a property from an iCal event string
     */
    extractICalProperty(eventData: string, property: string): string | null {
        // More flexible regex to handle various property formats
        const regex = new RegExp(`${property}(?:;[^:]*)?:([^\\r\\n]+)`, 'i');
        const match = eventData.match(regex);
        return match ? match[1] : null;
    },

    /**
     * Parse an iCal date string to Date object
     */
    parseICalDate(icalDate: string | null): Date | null {
        if (!icalDate) return null;

        // Clean up the date string
        const cleanDate = icalDate.replace(/[^0-9TZ]/g, '');

        // Handle date-only format (YYYYMMDD)
        if (cleanDate.length === 8 || !cleanDate.includes('T')) {
            const year = parseInt(cleanDate.substring(0, 4));
            const month = parseInt(cleanDate.substring(4, 6)) - 1; // JS months are 0-indexed
            const day = parseInt(cleanDate.substring(6, 8));
            return new Date(year, month, day);
        }

        // Handle datetime format (YYYYMMDDTHHmmssZ)
        if (cleanDate.includes('T')) {
            const year = parseInt(cleanDate.substring(0, 4));
            const month = parseInt(cleanDate.substring(4, 6)) - 1;
            const day = parseInt(cleanDate.substring(6, 8));

            // Check if there's enough characters for time
            let hour = 0, minute = 0, second = 0;
            if (cleanDate.length >= 11) {
                hour = parseInt(cleanDate.substring(9, 11));
                if (cleanDate.length >= 13) {
                    minute = parseInt(cleanDate.substring(11, 13));
                    if (cleanDate.length >= 15) {
                        second = parseInt(cleanDate.substring(13, 15));
                    }
                }
            }

            // Check if it's UTC time (ends with Z)
            if (cleanDate.endsWith('Z')) {
                return new Date(Date.UTC(year, month, day, hour, minute, second));
            }

            return new Date(year, month, day, hour, minute, second);
        }

        return null;
    },

    /**
     * Format iCal date to ISO string for API compatibility
     */
    formatICalDateTime(icalDate: string): string {
        if (!icalDate) return new Date().toISOString();

        // Clean up the date string
        const cleanDate = icalDate.replace(/[^0-9TZ]/g, '');

        // Handle datetime format (YYYYMMDDTHHmmssZ)
        if (cleanDate.includes('T')) {
            const year = parseInt(cleanDate.substring(0, 4));
            const month = parseInt(cleanDate.substring(4, 6)) - 1;
            const day = parseInt(cleanDate.substring(6, 8));

            // Check if there's enough characters for time
            let hour = 0, minute = 0, second = 0;
            if (cleanDate.length >= 11) {
                hour = parseInt(cleanDate.substring(9, 11));
                if (cleanDate.length >= 13) {
                    minute = parseInt(cleanDate.substring(11, 13));
                    if (cleanDate.length >= 15) {
                        second = parseInt(cleanDate.substring(13, 15));
                    }
                }
            }

            // Check if it's UTC time (ends with Z)
            let date;
            if (cleanDate.endsWith('Z')) {
                date = new Date(Date.UTC(year, month, day, hour, minute, second));
            } else {
                date = new Date(year, month, day, hour, minute, second);
            }

            return date.toISOString();
        }

        // Handle date-only format (YYYYMMDD)
        const year = parseInt(cleanDate.substring(0, 4));
        const month = parseInt(cleanDate.substring(4, 6)) - 1;
        const day = parseInt(cleanDate.substring(6, 8));
        const date = new Date(year, month, day);
        return date.toISOString();
    },

    /**
     * Get the calendar embed URL
     */
    getCalendarEmbedUrl(): string {
        // Check if we need to apply language-specific modifications
        if (this.DEBUG_MODE) {
            console.log(`[CalendarService] Getting calendar embed URL with language: ${this.currentLanguage}`);
        }

        // For now, there's no language-specific calendar embed URL,
        // but if needed, we could modify EMBED_URL based on language here
        const embedUrl = EMBED_URL;

        if (this.DEBUG_MODE) {
            console.log(`[CalendarService] Calendar embed URL: ${embedUrl}`);
        }

        return embedUrl;
    },

    /**
     * Generate a URL to add an event to the user's Google Calendar
     */
    generateAddToCalendarUrl(event: CalendarEvent): string {
        let startTime, endTime;

        if (event.start.dateTime) {
            startTime = new Date(event.start.dateTime).toISOString().replace(/-|:|\.\d+/g, '');
        } else if (event.start.date) {
            startTime = event.start.date.replace(/-/g, '');
        } else {
            startTime = new Date().toISOString().replace(/-|:|\.\d+/g, '');
        }

        if (event.end.dateTime) {
            endTime = new Date(event.end.dateTime).toISOString().replace(/-|:|\.\d+/g, '');
        } else if (event.end.date) {
            endTime = event.end.date.replace(/-/g, '');
        } else {
            const end = new Date();
            end.setHours(end.getHours() + 1);
            endTime = end.toISOString().replace(/-|:|\.\d+/g, '');
        }

        const details = event.description || '';
        const location = event.location || '';

        // Create a Google Calendar add event URL that redirects to the desired calendar view after adding
        const baseUrl = 'https://calendar.google.com/calendar/r';
        const returnUrl = encodeURIComponent('https://calendar.google.com/calendar/u/0/r?hl=en-GB');

        return `${baseUrl}?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&pli=1&sf=true&output=xml&rru=${returnUrl}`;
    },

    /**
     * Open the calendar in a web browser
     */
    openCalendarInBrowser(): void {
        try {
            // Get the embed URL for the calendar
            const embedUrl = this.getCalendarEmbedUrl();

            if (this.DEBUG_MODE) {
                console.log(`[CalendarService] Opening calendar in browser: ${embedUrl}`);
            }

            // Use our centralized URL opening utility
            openUrlWithCorrectDomain(embedUrl, this.currentLanguage).catch(err => {
                console.error('[CalendarService] Error opening calendar in browser:', err);
            });
        } catch (error) {
            console.error('[CalendarService] Error preparing calendar URL for browser:', error);
        }
    },

    /**
     * Add a reminder for an event
     * Uses expo-notifications to schedule local notifications
     */
    async addEventReminder(event: CalendarEvent, minutesBefore: number = 30): Promise<boolean> {
        try {
            console.log(`Setting reminder for ${event.summary} ${minutesBefore} minutes before`);

            // Request permissions first
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permission not granted');
                return false;
            }

            const eventDate = event.start.dateTime
                ? new Date(event.start.dateTime)
                : event.start.date
                    ? new Date(event.start.date)
                    : null;

            if (!eventDate) {
                console.error('Cannot set reminder: Invalid event date');
                return false;
            }

            // Calculate the notification time (minutes before event)
            const reminderTime = new Date(eventDate.getTime() - (minutesBefore * 60 * 1000));

            // Don't schedule if the reminder time is in the past
            if (reminderTime <= new Date()) {
                console.log('Reminder time is in the past, not scheduling');
                return false;
            }

            // Create the notification content
            const notificationContent = {
                title: event.summary,
                body: `Event starting in ${minutesBefore} minutes${event.formattedLocation ? ` at ${event.formattedLocation.address}` : ''}`,
                data: { eventId: event.id }
            };

            // Schedule notification using @ts-ignore to bypass type checking issues
            // @ts-ignore
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: notificationContent,
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: reminderTime
                },
            });

            console.log(`Reminder set for: ${eventDate.toLocaleString()}, notification ID: ${notificationId}`);
            return true;
        } catch (error) {
            console.error('Error setting reminder:', error);
            return false;
        }
    },

    /**
     * Add event to device calendar
     * Uses expo-calendar to add events to the device's calendar
     */
    async addToDeviceCalendar(event: CalendarEvent): Promise<boolean> {
        try {
            console.log(`Adding ${event.summary} to device calendar`);

            // Request calendar permissions
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                console.log('Calendar permission not granted');
                return false;
            }

            // Get available calendars
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

            // Find default calendar
            let defaultCalendarId;

            // On iOS, find first writable calendar
            if (Platform.OS === 'ios') {
                const defaultCalendar = calendars.find(cal => cal.allowsModifications);
                defaultCalendarId = defaultCalendar?.id;
            }
            // On Android, find first calendar owned by the user
            else {
                const defaultCalendar = calendars.find(cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER);
                defaultCalendarId = defaultCalendar?.id;
            }

            if (!defaultCalendarId) {
                console.error('No writable calendar found');
                return false;
            }

            // Create the event in the device calendar
            const eventId = await Calendar.createEventAsync(defaultCalendarId, {
                title: event.summary,
                startDate: event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date || ''),
                endDate: event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date || ''),
                notes: event.formattedDescription || event.description,
                location: event.formattedLocation?.address || event.location,
                alarms: [{ relativeOffset: -30 }] // Default 30-minute reminder
            });

            console.log(`Event added to device calendar with ID: ${eventId}`);
            return true;
        } catch (error) {
            console.error('Error adding to device calendar:', error);
            return false;
        }
    },

    /**
     * Get base URL for the current language
     * @returns Base URL string for current language
     */
    getBaseUrl(): string {
        const baseUrl = this.currentLanguage === 'fr'
            ? 'https://fr.egliselacite.com'
            : 'https://www.egliselacite.com';

        if (this.DEBUG_MODE) {
            console.log(`[CalendarService] Getting base URL for language ${this.currentLanguage}: ${baseUrl}`);
        }

        return baseUrl;
    },

    /**
     * Validate and ensure all events have language-appropriate URLs
     * @param events List of events to validate
     * @returns Events with validated URLs
     */
    validateEventUrls(events: CalendarEvent[]): CalendarEvent[] {
        if (this.DEBUG_MODE) {
            console.log(`[CalendarService] Validating URLs for ${events.length} events`);
        }

        return events.map(event => {
            // Skip events without URLs
            if (!event.detailsUrl) {
                return event;
            }

            try {
                // Check if URL matches current language
                const hasFrenchDomain = event.detailsUrl.includes('fr.egliselacite.com');
                const shouldHaveFrenchDomain = this.currentLanguage === 'fr';

                if (hasFrenchDomain !== shouldHaveFrenchDomain) {
                    console.log(`[CalendarService] URL domain mismatch for event ${event.summary}`);
                    console.log(`[CalendarService] Current: ${event.detailsUrl}`);

                    try {
                        // Parse the URL
                        const urlObj = new URL(event.detailsUrl);
                        const path = urlObj.pathname + urlObj.search;

                        // Create a new URL with the correct domain
                        const domain = this.currentLanguage === 'fr' ? 'fr.egliselacite.com' : 'www.egliselacite.com';
                        const newUrl = `https://${domain}${path}`;

                        // Update the event's URL
                        event.detailsUrl = newUrl;
                        console.log(`[CalendarService] Fixed URL: ${newUrl}`);
                    } catch (urlError) {
                        console.error(`[CalendarService] Error fixing URL domain:`, urlError);
                    }
                }
            } catch (error) {
                console.error(`[CalendarService] Error validating URL for ${event.summary}:`, error);
            }

            return event;
        });
    }
};