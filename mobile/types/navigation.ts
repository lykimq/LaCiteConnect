import { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import { WelcomeUserPage } from '../components/auth/WelcomeUserPage';

export type MainTabParamList = {
    Home: undefined;
    Events: undefined;
    Profile: undefined;
};

export type GuestTabParamList = {
    Home: undefined;
    Events: undefined;
    SignIn: undefined;
};

export type RootStackParamList = {
    // Auth Stack
    Welcome: undefined;
    Login: undefined;
    Register: undefined;

    // Main Stack
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    GuestTabs: NavigatorScreenParams<GuestTabParamList>;
    EventDetails: { eventId: string };
    EventRegistration: { eventId: string };
};

export type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;
export type EventRegistrationRouteProp = RouteProp<RootStackParamList, 'EventRegistration'>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}