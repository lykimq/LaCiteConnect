import { StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Styles for the calendar view component
 * Contains both React Native styles and the CSS for the embedded calendar
 */

// CSS to make the calendar more mobile-friendly
export const calendarCss = `
  .fc-toolbar-title { font-size: 1.2em !important; }
  .fc-button { padding: 0.2em 0.4em !important; }
  .fc-event { padding: 2px !important; }
  .fc-daygrid-day-number { font-size: 0.9em !important; }
  .fc-col-header-cell-cushion { font-size: 0.9em !important; }
  .fc-list-day-cushion { font-size: 0.9em !important; }
  .fc-event-title { font-size: 0.9em !important; }
  .fc-event-time { font-size: 0.8em !important; }
  @media (max-width: 768px) {
      .fc-toolbar { flex-direction: column !important; }
      .fc-toolbar-chunk { margin: 4px 0 !important; }
  }
`;

// Function to generate the JavaScript injection string
export const getCalendarInjectionScript = () => {
    return `
    // Make calendar more mobile-friendly by injecting custom CSS
    const style = document.createElement('style');
    style.textContent = \`${calendarCss}\`;
    document.head.appendChild(style);
  `;
};

// React Native styles for the container components
export const createCalendarViewStyles = (themeColors: ReturnType<typeof useTheme>['themeColors']) => StyleSheet.create({
    calendarContainer: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    calendar: {
        flex: 1,
    },
    errorText: {
        color: themeColors.error,
        padding: 16,
        textAlign: 'center',
    }
});