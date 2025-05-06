import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeUserPage } from '../components/WelcomeUserPage';
import { LoginForm } from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { WelcomePage } from '../components/WelcomePage';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    WelcomeUser: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Welcome" component={WelcomePage} />
                <Stack.Screen name="Login" component={LoginForm} />
                <Stack.Screen name="Register" component={RegisterForm} />
                <Stack.Screen name="WelcomeUser" component={WelcomeUserPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};