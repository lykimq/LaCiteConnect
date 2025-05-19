// Type definitions for Events components

// View modes
export type ViewMode = 'calendar' | 'list';

// Add new types for sorting and filtering
export type SortOrder = 'asc' | 'desc';
export type EventCategory = 'all' | 'upcoming' | 'past' | 'thisWeek' | 'thisMonth';
export type SortBy = 'date' | 'title';

export interface FilterOptions {
    category: EventCategory;
    sortBy: SortBy;
    sortOrder: SortOrder;
    searchQuery: string;
}

// Event interface
export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    formattedDescription?: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    formattedLocation?: {
        address: string;
        mapUrl?: string;
    };
    recurrence?: boolean;
    attachments?: Array<{ title: string, url: string }>;
    detailsUrl?: string;
}

// Events content interface from JSON
export interface EventsContent {
    header: {
        title: string;
        subtitle: string;
    };
    tabs: Array<{
        id: string;
        label: string;
    }>;
    ui: {
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
        filterOptions: {
            allEvents: string;
            upcoming: string;
            thisWeek: string;
            thisMonth: string;
            pastEvents: string;
        };
        sortSectionTitle: string;
        sortByLabel: string;
        sortOptions: {
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
        quickPeriodOptions: {
            allEvents: string;
            today: string;
            tomorrow: string;
            nextSevenDays: string;
            nextThirtyDays: string;
        };
        viewModes: {
            calendar: string;
            list: string;
        };
    };
    months: string[];
}

// Add this function to identify Google Drive attachments
export const isDriveAttachment = (url: string): boolean => {
    return url.includes('drive.google.com');
};