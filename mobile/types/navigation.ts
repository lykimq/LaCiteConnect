import { RouteProp } from '@react-navigation/native';
import { WelcomeUserPage } from '../components/auth/WelcomeUserPage';

export type RootStackParamList = {
    // Auth Stack
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    WelcomeUser: undefined;

    // Main Stack
    MainTabs: {
        screen?: 'Home' | 'Events' | 'Profile';
    };
    EventDetails: { eventId: string };
    EventRegistration: { eventId: string };
};

export type TabParamList = {
    Home: undefined;
    Events: undefined;
    Profile: undefined;
};

export type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;
export type EventRegistrationRouteProp = RouteProp<RootStackParamList, 'EventRegistration'>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}