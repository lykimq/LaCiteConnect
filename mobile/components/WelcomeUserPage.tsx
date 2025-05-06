import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { welcomeStyles } from '../styles/welcome.styles';
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
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error reading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            setUserData(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={welcomeStyles.safeArea}>
                <View style={welcomeStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3498DB" />
                </View>
            </SafeAreaView>
        );
    }

    if (userData) {
        return (
            <SafeAreaView style={welcomeStyles.safeArea}>
                <ScrollView style={welcomeStyles.container} contentContainerStyle={welcomeStyles.scrollContent}>
                    <View style={welcomeStyles.header}>
                        <Image
                            source={require('../assets/church-logo.png')}
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
                                onPress={() => {/* TODO: Navigate to events */ }}
                            >
                                <Text style={welcomeStyles.actionButtonText}>View Events</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={welcomeStyles.actionContainer}>
                        <TouchableOpacity
                            style={[welcomeStyles.logoutButton]}
                            onPress={handleLogout}
                        >
                            <Text style={welcomeStyles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={welcomeStyles.safeArea}>
            <ScrollView style={welcomeStyles.container} contentContainerStyle={welcomeStyles.scrollContent}>
                <View style={welcomeStyles.header}>
                    <Image
                        source={require('../assets/church-logo.png')}
                        style={welcomeStyles.logo}
                        resizeMode="contain"
                    />
                    <Text style={welcomeStyles.title}>La Cité Connect</Text>
                    <Text style={welcomeStyles.subtitle}>Your Digital Church Community</Text>
                </View>

                <View style={welcomeStyles.featuresContainer}>
                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Stay Connected</Text>
                        <Text style={welcomeStyles.featureText}>
                            Join our community and stay updated with church events, services, and activities.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Grow Together</Text>
                        <Text style={welcomeStyles.featureText}>
                            Access sermons, Bible studies, and prayer groups to strengthen your faith journey.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Serve & Share</Text>
                        <Text style={welcomeStyles.featureText}>
                            Participate in community service and share your blessings with others.
                        </Text>
                    </View>
                </View>

                <View style={welcomeStyles.actionContainer}>
                    <TouchableOpacity
                        style={[welcomeStyles.loginButton, { backgroundColor: '#3498DB' }]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={welcomeStyles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.registerButton}
                        onPress={() => { navigation.navigate('Register') }}
                    >
                        <Text style={welcomeStyles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.exploreButton}
                        onPress={() => {/* TODO: Handle guest mode */ }}
                    >
                        <Text style={welcomeStyles.exploreButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.footer}>
                    <Text style={welcomeStyles.footerText}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};