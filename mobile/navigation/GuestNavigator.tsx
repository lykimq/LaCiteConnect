import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeGuestPage } from '../components/auth/WelcomeGuestPage';
import { EventsPage } from '../components/events/EventsPage';
import { LoginForm } from '../components/auth/LoginForm';
import { GuestTabParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<GuestTabParamList>();

export const GuestNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={WelcomeGuestPage}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Events"
                component={EventsPage}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SignIn"
                component={LoginForm}
                options={{
                    tabBarLabel: 'Sign In',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'log-in' : 'log-in-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};