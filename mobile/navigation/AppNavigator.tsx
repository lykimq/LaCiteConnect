import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WhoWeAreContent } from '../components/WhoWeAre';
import { GetConnectedContent } from '../components/GetConnectedContent';
import { DonationContent } from '../components/DonationContent';
import { EventsContent } from '../components/EventsContent';
import { HomeContent } from '../components/HomeContent';

// Define the tab navigator param list
type TabParamList = {
    Home: undefined;
    WhoWeAre: undefined;
    GetConnected: undefined;
    Events: undefined;
    Donations: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const AppNavigator = () => {
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
                        } else {
                            iconName = 'help-circle';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#FF9843',
                    tabBarInactiveTintColor: '#999',
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopWidth: 0,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeContent}
                    options={{
                        title: 'Home',
                    }}
                />
                <Tab.Screen
                    name="WhoWeAre"
                    component={WhoWeAreContent}
                    options={{
                        title: 'Who We Are',
                    }}
                />
                <Tab.Screen
                    name="GetConnected"
                    component={GetConnectedContent}
                    options={{
                        title: 'Get Connected',
                    }}
                />
                <Tab.Screen
                    name="Events"
                    component={EventsContent}
                    options={{
                        title: 'Events',
                    }}
                />
                <Tab.Screen
                    name="Donations"
                    component={DonationContent}
                    options={{
                        title: 'Donations',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};