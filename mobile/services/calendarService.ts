/**
 * Calendar Service
 * Handles fetching events from a personal Google Calendar
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
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
}

// Personal calendar ID
const CALENDAR_ID = 'lykimq@gmail.com';

// iCal URL for personal calendar
const ICAL_URL = 'https://calendar.google.com/calendar/ical/lykimq%40gmail.com/public/basic.ics';

// Calendar embed URL with parameters for better view
const EMBED_URL = 'https://calendar.google.com/calendar/embed?src=lykimq%40gmail.com&ctz=Europe%2FParis&mode=MONTH&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1';

export const calendarService = {
    /**
     * Get personal calendar events
     */
    async getEvents(): Promise<CalendarEvent[]> {
        return this.fetchICalEvents(ICAL_URL);
    },

    /**
     * Fetch events from a public calendar using iCal format
     */
    async fetchICalEvents(icalUrl: string): Promise<CalendarEvent[]> {
        try {
            console.log(`Fetching iCal events from: ${icalUrl}`);

            const response = await fetch(icalUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch iCal data (${response.status})`);
            }

            const icalData = await response.text();

            // Parse the iCal data manually
            return this.parseICalData(icalData);
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
            const now = new Date();

            // Calculate date 12 months from now instead of just one year
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 12);

            // Simple regex-based parsing for iCal format
            const eventBlocks = icalData.split('BEGIN:VEVENT');

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

                // Get start and end dates
                const dtstart = this.extractICalProperty(eventData, 'DTSTART');
                const dtend = this.extractICalProperty(eventData, 'DTEND');

                // Skip past events
                const startDate = this.parseICalDate(dtstart);
                if (startDate && startDate < now) continue;

                // Skip events too far in the future (more than 12 months)
                if (startDate && startDate > futureDate) continue;

                const event: CalendarEvent = {
                    id: uid || `event-${i}`,
                    summary: summary || 'Untitled Event',
                    description: description || undefined,
                    location: location || undefined,
                    start: {},
                    end: {}
                };

                // Process date format
                if (dtstart) {
                    // Check if it's an all-day event (no time component)
                    if (dtstart.length === 8) {
                        const formattedDate = `${dtstart.substring(0, 4)}-${dtstart.substring(4, 6)}-${dtstart.substring(6, 8)}`;
                        event.start.date = formattedDate;
                    } else {
                        event.start.dateTime = this.formatICalDateTime(dtstart);
                    }
                }

                if (dtend) {
                    if (dtend.length === 8) {
                        const formattedDate = `${dtend.substring(0, 4)}-${dtend.substring(4, 6)}-${dtend.substring(6, 8)}`;
                        event.end.date = formattedDate;
                    } else {
                        event.end.dateTime = this.formatICalDateTime(dtend);
                    }
                }

                events.push(event);
            }

            // Sort events by start date
            events.sort((a, b) => {
                const dateA = a.start.dateTime ? new Date(a.start.dateTime) : new Date(a.start.date || "");
                const dateB = b.start.dateTime ? new Date(b.start.dateTime) : new Date(b.start.date || "");
                return dateA.getTime() - dateB.getTime();
            });

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
        const regex = new RegExp(`${property}(?:[;][^:]*)?:([^\\r\\n]+)`, 'i');
        const match = eventData.match(regex);
        return match ? match[1] : null;
    },

    /**
     * Parse an iCal date string to Date object
     */
    parseICalDate(icalDate: string | null): Date | null {
        if (!icalDate) return null;

        // Handle date-only format (YYYYMMDD)
        if (icalDate.length === 8) {
            const year = parseInt(icalDate.substring(0, 4));
            const month = parseInt(icalDate.substring(4, 6)) - 1; // JS months are 0-indexed
            const day = parseInt(icalDate.substring(6, 8));
            return new Date(year, month, day);
        }

        // Handle datetime format (YYYYMMDDTHHmmssZ)
        if (icalDate.includes('T')) {
            // Remove any non-numeric chars except T and Z
            const cleaned = icalDate.replace(/[^0-9TZ]/g, '');
            const year = parseInt(cleaned.substring(0, 4));
            const month = parseInt(cleaned.substring(4, 6)) - 1;
            const day = parseInt(cleaned.substring(6, 8));
            const hour = parseInt(cleaned.substring(9, 11));
            const minute = parseInt(cleaned.substring(11, 13));
            const second = parseInt(cleaned.substring(13, 15));

            // Check if it's UTC time (ends with Z)
            if (cleaned.endsWith('Z')) {
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

        // Handle datetime format (YYYYMMDDTHHmmssZ)
        if (icalDate.includes('T')) {
            // Remove any non-numeric chars except T and Z
            const cleaned = icalDate.replace(/[^0-9TZ]/g, '');
            const year = parseInt(cleaned.substring(0, 4));
            const month = parseInt(cleaned.substring(4, 6)) - 1;
            const day = parseInt(cleaned.substring(6, 8));
            const hour = parseInt(cleaned.substring(9, 11));
            const minute = parseInt(cleaned.substring(11, 13));
            const second = parseInt(cleaned.substring(13, 15));

            // Check if it's UTC time (ends with Z)
            let date;
            if (cleaned.endsWith('Z')) {
                date = new Date(Date.UTC(year, month, day, hour, minute, second));
            } else {
                date = new Date(year, month, day, hour, minute, second);
            }

            return date.toISOString();
        }

        // Handle date-only format (YYYYMMDD)
        const year = parseInt(icalDate.substring(0, 4));
        const month = parseInt(icalDate.substring(4, 6)) - 1;
        const day = parseInt(icalDate.substring(6, 8));
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