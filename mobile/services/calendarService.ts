/**
 * Calendar Service
 * Handles fetching events from a personal Google Calendar using iCal
 */
import { Linking } from 'react-native';

interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    recurrence?: boolean;
    isHoliday?: boolean;
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
    /**
     * Get personal calendar events
     */
    async getEvents(year?: number, month?: number): Promise<CalendarEvent[]> {
        try {
            // Try using Google Calendar API first
            console.log('Attempting to fetch from Google Calendar API');
            try {
                const apiEvents = await this.fetchFromGoogleApi(year, month);
                if (apiEvents && apiEvents.length > 0) {
                    console.log(`Successfully fetched ${apiEvents.length} events from API`);
                    return apiEvents;
                }
            } catch (apiError) {
                console.error('API fetch failed, falling back to iCal', apiError);
            }

            // Fall back to iCal if API fails
            return this.fetchICalEvents(ICAL_URL, year, month);
        } catch (error) {
            console.error('All event fetch methods failed', error);
            // Return empty array to avoid crashing the app
            return [];
        }
    },

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
                location: 'France',
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

        return data.items.map((item: any) => ({
            id: item.id,
            summary: item.summary || 'Untitled Event',
            description: item.description,
            location: item.location,
            start: {
                dateTime: item.start.dateTime,
                date: item.start.date
            },
            end: {
                dateTime: item.end.dateTime,
                date: item.end.date
            },
            recurrence: item.recurrence ? true : false
        }));
    },

    /**
     * Fetch events from a public calendar using iCal format with optional filtering
     */
    async fetchICalEvents(icalUrl: string, year?: number, month?: number): Promise<CalendarEvent[]> {
        try {
            console.log(`Fetching iCal events from: ${icalUrl}`);

            const response = await fetch(icalUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch iCal data (${response.status})`);
            }

            const icalData = await response.text();

            // Parse the iCal data manually
            let events = this.parseICalData(icalData);

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
            throw error;
        }
    },

    /**
     * Parse iCal data manually
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
                const description = this.extractICalProperty(eventData, 'DESCRIPTION');
                const location = this.extractICalProperty(eventData, 'LOCATION');
                const uid = this.extractICalProperty(eventData, 'UID');
                const rrule = this.extractICalProperty(eventData, 'RRULE');

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

                // Create basic event
                const event: CalendarEvent = {
                    id: uid || `event-${i}`,
                    summary: summary || 'Untitled Event',
                    description: description || undefined,
                    location: location || undefined,
                    start: {},
                    end: {},
                    recurrence: !!rrule
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
        return EMBED_URL;
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
        Linking.openURL(EMBED_URL).catch(err => {
            console.error('Error opening calendar in browser:', err);
        });
    }
};