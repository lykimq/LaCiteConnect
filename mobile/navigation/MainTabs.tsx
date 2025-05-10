import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeUserPage } from '../components/auth/WelcomeUserPage';
import { EventsPage } from '../components/events/EventsPage';
import { MainTabParamList } from '../types/navigation';
import { navigationStyles, tabBarColors } from '../styles/navigation.styles';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Events') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: tabBarColors.active,
                tabBarInactiveTintColor: tabBarColors.inactive,
                tabBarStyle: navigationStyles.tabBar,
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={WelcomeUserPage}
                options={{
                    title: 'Home',
                }}
            />
            <Tab.Screen
                name="Events"
                component={EventsPage}
                options={{
                    title: 'Events',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={WelcomeUserPage}
                options={{
                    title: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};