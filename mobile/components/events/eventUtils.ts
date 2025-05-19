/**
 * Event Utility Functions
 *
 * This file contains helper functions for working with calendar events,
 * such as formatting dates and filtering events based on time periods.
 */
import { formatDate, formatTime } from '../../utils/dateUtils';
import { CalendarEvent } from './types';

/**
 * Format an event date string for display in UI
 *
 * This function takes a CalendarEvent and returns a formatted date string that is
 * appropriate for the event type (all-day event or timed event).
 *
 * @param event - The calendar event to format
 * @param allDayText - Localized text for "All Day" label
 * @param dateNotSpecifiedText - Localized text for "Date not specified" label
 * @returns Formatted date string ready for display
 */
export const formatEventDate = (event: CalendarEvent, allDayText: string = 'All Day', dateNotSpecifiedText: string = 'Date not specified'): string => {
    if (event.start.date) {
        // This is an all-day event
        return `${formatDate(new Date(event.start.date))} • ${allDayText}`;
    } else if (event.start.dateTime) {
        // This is a timed event
        return `${formatDate(new Date(event.start.dateTime))} • ${formatTime(new Date(event.start.dateTime))} - ${formatTime(new Date(event.end.dateTime || ''))}`;
    }
    return dateNotSpecifiedText;
};

/**
 * Filter events based on specified time periods
 *
 * This function filters an array of events based on the provided time period:
 * - 'all': Returns all events
 * - 'today': Returns events happening today
 * - 'tomorrow': Returns events happening tomorrow
 * - 'week': Returns events happening within the next 7 days
 * - 'month': Returns events happening within the next 30 days
 *
 * @param events - Array of calendar events to filter
 * @param period - Time period to filter by ('all', 'today', 'tomorrow', 'week', 'month')
 * @returns Filtered array of events matching the specified time period
 */
export const filterEventsByPeriod = (events: CalendarEvent[], period: 'all' | 'today' | 'tomorrow' | 'week' | 'month'): CalendarEvent[] => {
    // Calculate reference dates for filtering
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    switch (period) {
        case 'today':
            // Filter events occurring today
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate.toDateString() === today.toDateString();
            });
        case 'tomorrow':
            // Filter events occurring tomorrow
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate.toDateString() === tomorrow.toDateString();
            });
        case 'week':
            // Filter events occurring within the next 7 days
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate > today && eventDate <= nextWeek;
            });
        case 'month':
            // Filter events occurring within the next 30 days
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate > today && eventDate <= nextMonth;
            });
        default:
            // Return all events if no specific filter is applied
            return events;
    }
};