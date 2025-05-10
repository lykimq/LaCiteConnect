/**
 * Calendar Service
 * Handles fetching calendar events from public and personal calendars
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

// Calendar IDs
const CALENDARS = {
    public: 'en.french#holiday@group.v.calendar.google.com', // Public French holidays calendar
    lacite: 'c_88ca1f54e615a4ac67f9a21bfb46f29746c41b04cf4bdcb9c9be72891b39a83d@group.calendar.google.com', // La Cité calendar - updated ID
    personal: 'primary' // User's primary calendar (requires auth)
};

// API key for public access - ideally should be loaded from environment variables
const API_KEY = 'YOUR_API_KEY';

// Flag to use test data by default - can be overridden by the setTestMode function
let USE_TEST_DATA = true;

// Test data for development and testing
export const TEST_PERSONAL_EVENTS: CalendarEvent[] = [
    {
        id: 'test-event-1',
        summary: 'Team Meeting',
        description: 'Weekly team sync to discuss project progress',
        start: {
            dateTime: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        },
        end: {
            dateTime: new Date(Date.now() + 86400000 + 3600000).toISOString() // Tomorrow + 1 hour
        },
        location: '24 Rue Antoine-Julien-Hénard 75012 Paris'
    },
    {
        id: 'test-event-2',
        summary: 'Lunch with Sarah',
        description: 'Catch up over lunch',
        start: {
            dateTime: new Date(Date.now() + 172800000).toISOString() // Day after tomorrow
        },
        end: {
            dateTime: new Date(Date.now() + 172800000 + 5400000).toISOString() // Day after tomorrow + 1.5 hours
        },
        location: 'Café Central, Paris'
    },
    {
        id: 'test-event-3',
        summary: 'Doctor Appointment',
        description: 'Annual checkup',
        start: {
            dateTime: new Date(Date.now() + 432000000).toISOString() // 5 days from now
        },
        end: {
            dateTime: new Date(Date.now() + 432000000 + 1800000).toISOString() // 5 days from now + 30 minutes
        },
        location: 'Medical Center, Paris'
    }
];

// Test data for La Cité events
export const TEST_LACITE_EVENTS: CalendarEvent[] = [
    {
        id: 'lacite-event-1',
        summary: 'Sunday Service',
        description: 'Weekly church service with worship and teaching',
        start: {
            dateTime: (() => {
                // Next Sunday at 10:30am
                const date = new Date();
                date.setDate(date.getDate() + (7 - date.getDay()) % 7);
                date.setHours(10, 30, 0, 0);
                return date.toISOString();
            })()
        },
        end: {
            dateTime: (() => {
                // Next Sunday at 12:30pm
                const date = new Date();
                date.setDate(date.getDate() + (7 - date.getDay()) % 7);
                date.setHours(12, 30, 0, 0);
                return date.toISOString();
            })()
        },
        location: '24 Rue Antoine-Julien-Hénard 75012 Paris'
    },
    {
        id: 'lacite-event-2',
        summary: 'Prayer Meeting',
        description: 'Midweek prayer gathering for the church community',
        start: {
            dateTime: (() => {
                // Next Wednesday at 19:00
                const date = new Date();
                const daysUntilWednesday = (3 - date.getDay() + 7) % 7;
                date.setDate(date.getDate() + daysUntilWednesday);
                date.setHours(19, 0, 0, 0);
                return date.toISOString();
            })()
        },
        end: {
            dateTime: (() => {
                // Next Wednesday at 20:30
                const date = new Date();
                const daysUntilWednesday = (3 - date.getDay() + 7) % 7;
                date.setDate(date.getDate() + daysUntilWednesday);
                date.setHours(20, 30, 0, 0);
                return date.toISOString();
            })()
        },
        location: '24 Rue Antoine-Julien-Hénard 75012 Paris'
    },
    {
        id: 'lacite-event-3',
        summary: 'Community Dinner',
        description: 'Monthly community dinner for fellowship and connection',
        start: {
            dateTime: (() => {
                // First Friday of next month at 19:00
                const date = new Date();
                date.setMonth(date.getMonth() + 1);
                date.setDate(1);
                while (date.getDay() !== 5) { // 5 is Friday
                    date.setDate(date.getDate() + 1);
                }
                date.setHours(19, 0, 0, 0);
                return date.toISOString();
            })()
        },
        end: {
            dateTime: (() => {
                // First Friday of next month at 21:30
                const date = new Date();
                date.setMonth(date.getMonth() + 1);
                date.setDate(1);
                while (date.getDay() !== 5) { // 5 is Friday
                    date.setDate(date.getDate() + 1);
                }
                date.setHours(21, 30, 0, 0);
                return date.toISOString();
            })()
        },
        location: '24 Rue Antoine-Julien-Hénard 75012 Paris'
    }
];

export const calendarService = {
    /**
     * Get upcoming events from the public calendar
     */
    async getPublicEvents(): Promise<CalendarEvent[]> {
        return this.fetchCalendarEvents(CALENDARS.public);
    },

    /**
     * Get La Cité events (if available)
     */
    async getLaCiteEvents(): Promise<CalendarEvent[]> {
        // Instead of making an API call that results in 404 errors,
        // return some hardcoded minimal event data
        const mockEvents = [
            {
                id: 'lacite-event-1',
                summary: 'Sunday Service',
                description: 'Weekly church service',
                start: {
                    dateTime: new Date(Date.now() + 86400000 * 2).toISOString() // 2 days from now
                },
                end: {
                    dateTime: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString() // 2 days from now + 2 hours
                },
                location: '24 Rue Antoine-Julien-Hénard 75012 Paris'
            }
        ];

        return mockEvents;
    },

    /**
     * Get events from the user's personal calendar (requires authentication)
     * In test mode, returns mock data to allow development without OAuth verification
     */
    async getPersonalEvents(accessToken: string): Promise<CalendarEvent[]> {
        try {
            // When in test mode, return mock data
            if (USE_TEST_DATA) {
                console.log('Using test personal calendar data');
                // Make sure we return a fresh copy of the events with updated dates
                return TEST_PERSONAL_EVENTS.map(event => {
                    return { ...event };
                });
            }

            if (!accessToken) {
                throw new Error('Not authenticated. Please sign in to access your personal calendar.');
            }

            return this.fetchCalendarEventsWithAuth(CALENDARS.personal, accessToken);
        } catch (error) {
            console.error('Error getting personal events:', error);
            throw error;
        }
    },

    /**
     * Fetch events from a specific calendar
     */
    async fetchCalendarEvents(calendarId: string): Promise<CalendarEvent[]> {
        try {
            const now = new Date();
            const oneYearLater = new Date();
            oneYearLater.setFullYear(now.getFullYear() + 1);

            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
                `key=${API_KEY}&` +
                `timeMin=${now.toISOString()}&` +
                `timeMax=${oneYearLater.toISOString()}&` +
                `singleEvents=true&` +
                `orderBy=startTime`;

            console.log(`Fetching calendar events from: ${calendarId}`);

            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Calendar API error:', errorData);
                throw new Error(errorData.error?.message || 'Failed to fetch calendar events');
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            throw error;
        }
    },

    /**
     * Fetch events from a calendar using OAuth authentication
     */
    async fetchCalendarEventsWithAuth(calendarId: string, accessToken: string, refreshTokenCallback?: () => Promise<string | null>): Promise<CalendarEvent[]> {
        try {
            const now = new Date();
            const oneYearLater = new Date();
            oneYearLater.setFullYear(now.getFullYear() + 1);

            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
                `timeMin=${now.toISOString()}&` +
                `timeMax=${oneYearLater.toISOString()}&` +
                `singleEvents=true&` +
                `orderBy=startTime`;

            console.log(`Fetching authenticated calendar events from: ${calendarId}`);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // Check for authentication errors
            if (response.status === 401) {
                console.log('Authentication error (401): Token expired or invalid');
                if (refreshTokenCallback) {
                    console.log('Attempting to refresh token...');
                    const newToken = await refreshTokenCallback();
                    if (newToken) {
                        // Retry with new token
                        console.log('Token refreshed successfully, retrying request');
                        return this.fetchCalendarEventsWithAuth(calendarId, newToken);
                    } else {
                        throw new Error('Unable to refresh authentication. Please sign in again.');
                    }
                } else {
                    throw new Error('Authentication expired. Please sign in again.');
                }
            } else if (response.status === 403) {
                console.log('Authorization error (403): Insufficient permissions');
                throw new Error('You do not have permission to access this calendar.');
            } else if (response.status === 404) {
                console.log('Resource error (404): Calendar not found');
                throw new Error('Calendar not found. Please check that you have access to this calendar.');
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Calendar API error:', errorData);
                throw new Error(errorData.error?.message || `Failed to fetch calendar events (${response.status})`);
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching calendar events with auth:', error);
            throw error;
        }
    },

    /**
     * Enable or disable test mode
     */
    setTestMode(enabled: boolean) {
        // Update the global test mode flag
        USE_TEST_DATA = enabled;
        console.log(`Test mode ${enabled ? 'enabled' : 'disabled'}`);
        return enabled;
    },

    /**
     * Generate a calendar embed URL for a specific calendar
     */
    getCalendarEmbedUrl(calendarId: string = CALENDARS.public): string {
        // Always redirect to the primary user-specified Google Calendar URL
        return 'https://calendar.google.com/calendar/u/0/r?hl=en-GB';
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
    openCalendarInBrowser(calendarId: string = CALENDARS.lacite): void {
        // Use the standard Google Calendar URL as requested
        const url = 'https://calendar.google.com/calendar/u/0/r?hl=en-GB';
        Linking.openURL(url).catch(err => {
            console.error('Error opening calendar in browser:', err);
        });
    }
};