import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomePage } from '../components/auth/WelcomePage';
import { LoginForm } from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';
import { EventRegistrationPage } from '../components/events/EventRegistrationPage';
import { EventDetailsPage } from '../components/events/EventDetailsPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainTabs } from './MainTabs';
import { GuestNavigator } from './GuestNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { colors } = useTheme();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
        }
    };

    if (isAuthenticated === null) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
                initialRouteName="Welcome"
            >
                <Stack.Screen
                    name="Welcome"
                    component={WelcomePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginForm}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterForm}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="GuestTabs"
                    component={GuestNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EventDetails"
                    component={EventDetailsPage}
                    options={{ title: 'Event Details' }}
                />
                <Stack.Screen
                    name="EventRegistration"
                    component={EventRegistrationPage}
                    options={{ title: 'Register for Event' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};