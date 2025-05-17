import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { WhoWeAreContent } from '../components/WhoWeAre';
import { GetConnectedContent } from '../components/GetConnectedContent';
import { DonationContent } from '../components/DonationContent';
import { EventsContent } from '../components/EventsContent';
import { HomeContent } from '../components/HomeContent';
import { SettingsContent } from '../components/SettingsContent';
import { useTheme } from '../contexts/ThemeContext';
import { withTheming } from '../components/withTheming';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageAwareScreen } from '../components/LanguageAwareScreen';

// Main tab navigation routes
export type MainTabParamList = {
    Home: undefined;
    WhoWeAre: undefined;
    GetConnected: undefined;
    Events: undefined;
    Donations: undefined;
    Settings: undefined;
};

// Use the MainTabParamList for type safety
const Tab = createBottomTabNavigator<MainTabParamList>();

// Apply theming to all screens and make them language-aware
const ThemedHomeContent = withTheming((props) => (
    <LanguageAwareScreen>
        <HomeContent {...props} />
    </LanguageAwareScreen>
));

const ThemedWhoWeAreContent = withTheming((props) => (
    <LanguageAwareScreen>
        <WhoWeAreContent {...props} />
    </LanguageAwareScreen>
));

const ThemedGetConnectedContent = withTheming((props) => (
    <LanguageAwareScreen>
        <GetConnectedContent {...props} />
    </LanguageAwareScreen>
));

const ThemedEventsContent = withTheming((props) => (
    <LanguageAwareScreen>
        <EventsContent {...props} />
    </LanguageAwareScreen>
));

const ThemedDonationContent = withTheming((props) => (
    <LanguageAwareScreen>
        <DonationContent {...props} />
    </LanguageAwareScreen>
));

const ThemedSettingsContent = withTheming((props) => (
    <LanguageAwareScreen>
        <SettingsContent {...props} />
    </LanguageAwareScreen>
));

// Localized tab titles
const getLocalizedTabTitles = (language: string) => {
    if (language === 'fr') {
        return {
            home: 'Accueil',
            whoWeAre: 'Qui Sommes-Nous',
            getConnected: 'Restez Connectés',
            events: 'Événements',
            donations: 'Dons',
            settings: 'Paramètres'
        };
    }

    // Default English
    return {
        home: 'Home',
        whoWeAre: 'Who We Are',
        getConnected: 'Get Connected',
        events: 'Events',
        donations: 'Donations',
        settings: 'Settings'
    };
};

// Navigation-specific styles defined locally since they're only used here
const createNavigatorStyles = (colors: any) => ({
    tabBarStyle: {
        backgroundColor: colors.card,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderTopColor: colors.border,
    }
});

export const AppNavigator = () => {
    const { themeColors } = useTheme();
    const { currentLanguage } = useLanguage();

    // Get localized tab titles
    const tabTitles = getLocalizedTabTitles(currentLanguage);

    // Create styles with current theme colors
    const styles = createNavigatorStyles(themeColors);

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Events') {
                            iconName = focused ? 'calendar' : 'calendar-outline';
                        } else if (route.name === 'WhoWeAre') {
                            iconName = 'information-circle';
                        } else if (route.name === 'GetConnected') {
                            iconName = 'people';
                        } else if (route.name === 'Donations') {
                            iconName = 'cash-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        } else {
                            iconName = 'help-circle';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: themeColors.primary,
                    tabBarInactiveTintColor: themeColors.text,
                    tabBarStyle: styles.tabBarStyle,
                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={ThemedHomeContent}
                    options={{
                        title: tabTitles.home,
                    }}
                />
                <Tab.Screen
                    name="WhoWeAre"
                    component={ThemedWhoWeAreContent}
                    options={{
                        title: tabTitles.whoWeAre,
                    }}
                />
                <Tab.Screen
                    name="GetConnected"
                    component={ThemedGetConnectedContent}
                    options={{
                        title: tabTitles.getConnected,
                    }}
                />
                <Tab.Screen
                    name="Events"
                    component={ThemedEventsContent}
                    options={{
                        title: tabTitles.events,
                    }}
                />
                <Tab.Screen
                    name="Donations"
                    component={ThemedDonationContent}
                    options={{
                        title: tabTitles.donations,
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={ThemedSettingsContent}
                    options={{
                        title: tabTitles.settings,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};