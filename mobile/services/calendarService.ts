/**
 * Calendar Service
 * Handles fetching calendar events from public and personal calendars
 */

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
    public: 'en.french#holiday@group.v.calendar.google.com', // Public calendar that works
    lacite: 'egliselacite.com_events@group.calendar.google.com', // La Cité calendar
    personal: 'primary' // User's primary calendar (requires auth)
};

// API key for public access
const API_KEY = 'AIzaSyAD5a26ZT0x89_TEu2tUXfHnaXIzmr9g1s';

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
        try {
            return await this.fetchCalendarEvents(CALENDARS.lacite);
        } catch (error) {
            console.error('Error fetching La Cité events, falling back to public calendar:', error);
            return this.getPublicEvents();
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
            const data = await response.json();

            if (data.error) {
                console.error('Calendar API error:', data.error);
                throw new Error(data.error.message);
            }

            return data.items || [];
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            throw error;
        }
    },

    /**
     * Generate a calendar embed URL for a specific calendar
     */
    getCalendarEmbedUrl(calendarId: string = CALENDARS.public): string {
        const params = new URLSearchParams({
            src: calendarId,
            showTitle: '1',
            showNav: '1',
            showDate: '1',
            showPrint: '0',
            showTabs: '1',
            showCalendars: '1',
            showTz: '1',
            mode: 'MONTH',
            height: '600'
        });

        return `https://calendar.google.com/calendar/embed?${params.toString()}`;
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

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    },

    /**
     * Open the calendar in a web browser
     */
    openCalendarInBrowser(calendarId: string = CALENDARS.lacite): void {
        const url = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarId)}`;
        // Use the Linking API to open in browser
        // This needs to be imported and used in the component
    }
};