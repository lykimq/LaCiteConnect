import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WhoWeAreContent } from '../components/WhoWeAre';
import { GetConnectedContent } from '../components/GetConnectedContent';
import { DonationContent } from '../components/DonationContent';
import { EventsContent } from '../components/EventsContent';
import { HomeContent } from '../components/HomeContent';
import { SettingsContent } from '../components/SettingsContent';
import { useTheme } from '../contexts/ThemeContext';
import { withTheming } from '../components/withTheming';

// Define the tab navigator param list
type TabParamList = {
    Home: undefined;
    WhoWeAre: undefined;
    GetConnected: undefined;
    Events: undefined;
    Donations: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Apply theming to all screens
const ThemedHomeContent = withTheming(HomeContent);
const ThemedWhoWeAreContent = withTheming(WhoWeAreContent);
const ThemedGetConnectedContent = withTheming(GetConnectedContent);
const ThemedEventsContent = withTheming(EventsContent);
const ThemedDonationContent = withTheming(DonationContent);
const ThemedSettingsContent = withTheming(SettingsContent);

export const AppNavigator = () => {
    const { themeColors } = useTheme();

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
                    tabBarStyle: {
                        backgroundColor: themeColors.card,
                        borderTopWidth: 0,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        borderTopColor: themeColors.border,
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={ThemedHomeContent}
                    options={{
                        title: 'Home',
                    }}
                />
                <Tab.Screen
                    name="WhoWeAre"
                    component={ThemedWhoWeAreContent}
                    options={{
                        title: 'Who We Are',
                    }}
                />
                <Tab.Screen
                    name="GetConnected"
                    component={ThemedGetConnectedContent}
                    options={{
                        title: 'Get Connected',
                    }}
                />
                <Tab.Screen
                    name="Events"
                    component={ThemedEventsContent}
                    options={{
                        title: 'Events',
                    }}
                />
                <Tab.Screen
                    name="Donations"
                    component={ThemedDonationContent}
                    options={{
                        title: 'Donations',
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={ThemedSettingsContent}
                    options={{
                        title: 'Settings',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};