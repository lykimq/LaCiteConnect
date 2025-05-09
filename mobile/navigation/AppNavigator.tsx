import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WelcomePage } from '../components/auth/WelcomePage';
import { LoginForm } from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { WelcomeUserPage } from '../components/auth/WelcomeUserPage';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';
import { EventRegistrationPage } from '../components/events/EventRegistrationPage';
import { EventDetailsPage } from '../components/events/EventDetailsPage';
import { EventsPage } from '../components/events/EventsPage';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tab Navigator for authenticated users
const MainTabs = () => {
    const { colors } = useTheme();

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
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
            })}
        >
            <Tab.Screen
                name="Home"
                component={WelcomeUserPage}
                options={{
                    title: 'Home',
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Events"
                component={EventsPage}
                options={{
                    title: 'Events',
                    headerShown: true
                }}
            />
            <Tab.Screen
                name="Profile"
                component={WelcomeUserPage}
                options={{
                    title: 'Profile',
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
    const { colors } = useTheme();

    React.useEffect(() => {
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
        // Show loading screen or splash screen here
        return null;
    }

    // Use a single Stack Navigator with conditional rendering for auth/main screens
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
            >
                {isAuthenticated ? (
                    // Authenticated Routes
                    <>
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
                        {/* Access to auth screens for logout flows */}
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
                    </>
                ) : (
                    // Unauthenticated Routes
                    <>
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
                            name="WelcomeUser"
                            component={WelcomeUserPage}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Events"
                            component={EventsPage}
                            options={{
                                title: 'Events',
                                headerShown: true
                            }}
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
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};