import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform, StyleSheet } from 'react-native';
// @ts-ignore
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileImagePicker } from './ProfileImagePicker';

type WelcomeUserPageProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeUser'>;
};

export const WelcomeUserPage = ({ navigation }: WelcomeUserPageProps) => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const parsedData = JSON.parse(storedUserData);
                setUserData(parsedData);
                setProfileImage(parsedData.profilePictureUrl || null);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpdate = () => {
        // Reload user data to get the updated profile picture
        loadUserData();
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
                    <View style={styles.profileSection}>
                        <ProfileImagePicker
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            onImageUpdate={handleImageUpdate}
                            size={100}
                        />
                        <Text style={welcomeStyles.title}>Welcome, {userData.firstName}!</Text>
                    </View>
                    <Text style={welcomeStyles.subtitle}>You're connected to La Cité</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
});