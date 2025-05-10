import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeGuestPage } from '../components/auth/WelcomeGuestPage';
import { EventsPage } from '../components/events/EventsPage';
import { LoginForm } from '../components/auth/LoginForm';
import { GuestTabParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';
import { navigationStyles, tabBarColors } from '../styles/navigation.styles';
import { WhoWeAreContent } from '../components/home/WhoWeAre';
import { GetConnectedContent } from 'components/home/GetConnectedContent';
import { DonationContent } from 'components/home/DonationContent';

const Tab = createBottomTabNavigator<GuestTabParamList>();

export const GuestNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: tabBarColors.active,
                tabBarInactiveTintColor: tabBarColors.inactive,
                tabBarStyle: navigationStyles.tabBar,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={WelcomeGuestPage}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="WhoWeAre"
                component={WhoWeAreContent}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="information-circle" size={24} color={color} />
                    ),
                    title: 'Who We Are',
                }}
            />
            <Tab.Screen
                name="GetConnected"
                component={GetConnectedContent}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="people" size={24} color={color} />
                    ),
                    title: 'Get Connected',
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
                name="Donations"
                component={DonationContent}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="cash-outline" size={24} color={color} />
                    ),
                    title: 'Donations',
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