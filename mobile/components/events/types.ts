/**
 * Type definitions for Events components
 * This file defines all the types and interfaces used throughout the events feature
 */

// View modes for displaying events - either calendar or list
export type ViewMode = 'calendar' | 'list';

// Types for sorting and filtering options
export type SortOrder = 'asc' | 'desc'; // Ascending or descending sort order
export type EventCategory = 'all' | 'upcoming' | 'past' | 'thisWeek' | 'thisMonth'; // Categories for filtering events
export type SortBy = 'date' | 'title'; // Fields to sort events by

/**
 * Filter options for events
 * Used to control how events are filtered and sorted in the UI
 */
export interface FilterOptions {
    category: EventCategory;  // Time period category
    sortBy: SortBy;           // Field to sort by
    sortOrder: SortOrder;     // Sort direction
    searchQuery: string;      // Text to search for in events
}

/**
 * Main event interface that defines the structure of a calendar event
 * Compatible with Google Calendar API response format
 */
export interface CalendarEvent {
    id: string;                 // Unique identifier for the event
    summary: string;            // Event title
    description?: string;       // Full event description (may contain HTML)
    formattedDescription?: string; // Processed description without HTML
    start: {
        dateTime?: string;      // Start time for timed events
        date?: string;          // Start date for all-day events
    };
    end: {
        dateTime?: string;      // End time for timed events
        date?: string;          // End date for all-day events
    };
    location?: string;          // Location string (may contain address and map URL)
    formattedLocation?: {       // Processed location information
        address: string;
        mapUrl?: string;
    };
    recurrence?: boolean;       // Whether this is a recurring event
    attachments?: Array<{ title: string, url: string }>; // File attachments
    detailsUrl?: string;        // URL to view event details externally
}

/**
 * Interface for the localized content used in the Events components
 * Contains all text strings that are displayed to the user
 */
export interface EventsContent {
    header: {
        title: string;          // Main header title
        subtitle: string;       // Subtitle for the events screen
    };
    tabs: Array<{               // Tab navigation options
        id: string;
        label: string;
    }>;
    ui: {                       // All UI text strings
        loadingText: string;
        errorText: string;
        calendarErrorText: string;
        noEventsText: string;
        addToCalendarText: string;
        viewOnMapText: string;
        viewFullDescriptionText: string;
        viewAttachmentText: string;
        openInBrowserText: string;
        dateNotSpecifiedText: string;
        allDayText: string;
        viewAllEventsText: string;
        locationText: string;
        directionsText: string;
        readMoreText: string;
        viewLocationText: string;
        viewFilesText: string;
        viewDetailsText: string;
        closeText: string;
        eventAddedText: string;
        refreshEventsText: string;
        tryAgainText: string;
        openCalendarText: string;
        calendarViewText: string;
        listViewText: string;
        filterText: string;
        todayText: string;
        upcomingText: string;
        pastText: string;
        allText: string;
        filterModalTitle: string;
        searchPlaceholder: string;
        filterSectionTitle: string;
        filterOptions: {         // Text for filter options
            allEvents: string;
            upcoming: string;
            thisWeek: string;
            thisMonth: string;
            pastEvents: string;
        };
        sortSectionTitle: string;
        sortByLabel: string;
        sortOptions: {           // Text for sort options
            date: string;
            title: string;
            location: string;
            oldestFirst: string;
            newestFirst: string;
        };
        sortOrderLabel: string;
        applyFiltersText: string;
        quickViewText: string;
        monthViewText: string;
        quickPeriodOptions: {     // Text for quick period filter options
            allEvents: string;
            today: string;
            tomorrow: string;
            nextSevenDays: string;
            nextThirtyDays: string;
        };
        viewModes: {              // Text for view mode options
            calendar: string;
            list: string;
        };
    };
    months: string[];             // Localized month names
}

/**
 * Utility function to identify Google Drive attachments based on URL
 * @param url The URL to check
 * @returns Boolean indicating if the URL is a Google Drive attachment
 */
export const isDriveAttachment = (url: string): boolean => {
    return url.includes('drive.google.com');
};