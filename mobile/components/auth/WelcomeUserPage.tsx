import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform, Alert } from 'react-native';
// @ts-ignore
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WelcomeUserPageProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeUser'>;
};

type UserData = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
};

export const WelcomeUserPage = ({ navigation }: WelcomeUserPageProps) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserData = async () => {
            try {
                setLoading(true);
                const storedUserData = await AsyncStorage.getItem('userData');
                const token = await AsyncStorage.getItem('token');

                if (storedUserData && token) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error reading user data:', error);
                Alert.alert('Error', 'Could not load user data.');
            } finally {
                setLoading(false);
            }
        };

        checkUserData();
    }, []);

    const handleLogout = async () => {
        try {
            // Clear user data and token
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('token');
            setUserData(null);

            // Navigate to the Welcome screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Logout Error', 'Could not complete logout process.');
        }
    };

    const handleViewEvents = () => {
        try {
            // Navigate to the Events screen
            navigation.navigate('Events');
        } catch (error) {
            console.error('Error navigating to Events:', error);
            Alert.alert('Navigation Error', 'Could not navigate to Events page.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={welcomeStyles.safeArea}>
                <View style={welcomeStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF9843" />
                </View>
            </SafeAreaView>
        );
    }

    if (!userData) {
        // Navigate to Welcome screen after a slight delay
        setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        }, 100);

        return (
            <SafeAreaView style={welcomeStyles.safeArea}>
                <View style={welcomeStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF9843" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={welcomeStyles.safeArea}>
            <ScrollView
                style={welcomeStyles.container}
                contentContainerStyle={welcomeStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={welcomeStyles.header}>
                    <Image
                        source={require('../../assets/church-logo.png')}
                        style={welcomeStyles.logo}
                        resizeMode="contain"
                    />
                    <Text style={welcomeStyles.title}>Welcome, {userData.firstName}!</Text>
                    <Text style={welcomeStyles.subtitle}>You're connected to La Cité</Text>
                </View>

                <View style={welcomeStyles.featuresContainer}>
                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Your Profile</Text>
                        <Text style={welcomeStyles.featureText}>
                            Name: {userData.firstName} {userData.lastName}
                            {'\n'}Email: {userData.email}
                            {'\n'}Role: {userData.role}
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Quick Actions</Text>
                        <TouchableOpacity
                            style={welcomeStyles.actionButton}
                            onPress={() => {/* TODO: Navigate to profile */ }}
                        >
                            <Text style={welcomeStyles.actionButtonText}>View Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={welcomeStyles.actionButton}
                            onPress={handleViewEvents}
                        >
                            <Text style={welcomeStyles.actionButtonText}>View Events</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={welcomeStyles.actionContainer}>
                    <TouchableOpacity
                        style={welcomeStyles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={welcomeStyles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};