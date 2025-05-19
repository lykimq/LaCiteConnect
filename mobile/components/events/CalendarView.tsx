/**
 * CalendarView Component
 *
 * Displays a web-based calendar view of events using a WebView.
 * Renders an embedded calendar that shows events visually on a calendar interface.
 * Injects custom CSS to make the calendar more mobile-friendly.
 */
import React from 'react';
import { View, Text } from 'react-native';
import WebView from 'react-native-webview';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { EventsContent } from './types';
import { createCalendarViewStyles, getCalendarInjectionScript } from '../../styles/events/CalendarView.styles';

/**
 * Props for the CalendarView component
 */
interface CalendarViewProps {
    calendarUrl: string;            // URL of the calendar to display (e.g., Google Calendar embed URL)
    calendarError: string | null;   // Error message if calendar fails to load
    content: EventsContent | null;  // Localized content strings
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    calendarUrl,
    calendarError,
    content
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createCalendarViewStyles);

    return (
        <View style={styles.calendarContainer}>
            {/* WebView Calendar - Embeds external calendar */}
            <WebView
                source={{ uri: calendarUrl }}
                style={styles.calendar}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={(e) => {
                    console.error('WebView error:', e.nativeEvent);
                }}
                injectedJavaScript={getCalendarInjectionScript()}
            />

            {/* Error Message - Displayed if calendar fails to load */}
            {calendarError && (
                <Text style={styles.errorText}>{calendarError}</Text>
            )}
        </View>
    );
};