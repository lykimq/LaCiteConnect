/**
 * Type definitions for Events components
 * This file defines all the types and interfaces used throughout the events feature
 */

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
    header?: {
        title: string;
        subtitle: string;
    };
    tabs: Array<{               // Tab navigation options
        id: string;
        label: string;
    }>;
    ui: {
        loadingText: string;
        errorText: string;
        tryAgainText: string;
        allDayText: string;
        dateNotSpecifiedText: string;
        viewDetailsText: string;
        addToCalendarText: string;
        openMapText: string;
        filterOptions: {
            allEvents: string;
            upcoming: string;
            past: string;
            thisWeek: string;
            thisMonth: string;
            searchPlaceholder: string;
            sortBy: string;
            sortOrder: string;
        };
        noEventsText: string;
        viewOnMapText: string;
        viewFullDescriptionText: string;
        viewAttachmentText: string;
        openInBrowserText: string;
        viewAllEventsText: string;
        locationText: string;
        directionsText: string;
        readMoreText: string;
        viewLocationText: string;
        viewFilesText: string;
        closeText: string;
        eventAddedText: string;
        refreshEventsText: string;
        viewModes: {              // Text for view mode options
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