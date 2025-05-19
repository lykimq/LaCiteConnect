import React from 'react';
import { View, Text } from 'react-native';
import WebView from 'react-native-webview';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/events/EventsContent.styles';
import { EventsContent } from './types';

interface CalendarViewProps {
    calendarUrl: string;
    calendarError: string | null;
    content: EventsContent | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    calendarUrl,
    calendarError,
    content
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);

    return (
        <View style={styles.calendarContainer}>
            <WebView
                source={{ uri: calendarUrl }}
                style={styles.calendar}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={(e) => {
                    console.error('WebView error:', e.nativeEvent);
                }}
                injectedJavaScript={`
          // Make calendar more mobile-friendly
          const style = document.createElement('style');
          style.textContent = \`
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
          \`;
          document.head.appendChild(style);
        `}
            />
            {calendarError && (
                <Text style={styles.errorText}>{calendarError}</Text>
            )}
        </View>
    );
};