import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomePage } from '../components/WelcomePage';
import { LoginForm } from '../components/LoginForm';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};