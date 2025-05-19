import { formatDate, formatTime } from '../../utils/dateUtils';
import { CalendarEvent } from './types';

/**
 * Format an event date string
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
 * Create filters for events based on time periods
 */
export const filterEventsByPeriod = (events: CalendarEvent[], period: 'all' | 'today' | 'tomorrow' | 'week' | 'month'): CalendarEvent[] => {
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
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate.toDateString() === today.toDateString();
            });
        case 'tomorrow':
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate.toDateString() === tomorrow.toDateString();
            });
        case 'week':
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate > today && eventDate <= nextWeek;
            });
        case 'month':
            return events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate > today && eventDate <= nextMonth;
            });
        default:
            return events;
    }
};