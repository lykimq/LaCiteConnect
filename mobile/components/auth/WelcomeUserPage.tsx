import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileImagePicker } from './ProfileImagePicker';
import { useRoute } from '@react-navigation/native';
import { HomeContent } from '../home/HomeContent';
import { WhoWeAreContent } from '../home/WhoWeAre';
type WelcomeUserPageNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
>;

type WelcomeUserPageProps = {
    navigation: WelcomeUserPageNavigationProp;
};

export const WelcomeUserPage = ({ navigation }: WelcomeUserPageProps) => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const route = useRoute();
    const isProfileTab = route.name === 'Profile';

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

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            if (navigation.getParent()) {
                navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
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
            if (navigation.getParent()) {
                navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                });
            }
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
            {isProfileTab ? (
                // Profile View
                <>
                    <View style={[welcomeStyles.profileHeader, { marginTop: 40 }]}>
                        <ProfileImagePicker
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            onImageUpdate={handleImageUpdate}
                        />
                        <Text style={welcomeStyles.welcomeText}>
                            {userData.firstName} {userData.lastName}
                        </Text>
                        <Text style={welcomeStyles.emailText}>{userData.email}</Text>
                    </View>

                    <View style={[welcomeStyles.profileSection, { marginTop: 20 }]}>
                        <Text style={welcomeStyles.sectionTitle}>Account Information</Text>
                        <View style={welcomeStyles.infoItem}>
                            <Text style={welcomeStyles.infoLabel}>Name</Text>
                            <Text style={welcomeStyles.infoValue}>
                                {userData.firstName} {userData.lastName}
                            </Text>
                        </View>
                        <View style={welcomeStyles.infoItem}>
                            <Text style={welcomeStyles.infoLabel}>Email</Text>
                            <Text style={welcomeStyles.infoValue}>{userData.email}</Text>
                        </View>
                        <View style={welcomeStyles.infoItem}>
                            <Text style={welcomeStyles.infoLabel}>Role</Text>
                            <Text style={welcomeStyles.infoValue}>{userData.role}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={welcomeStyles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={welcomeStyles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <HomeContent showProfileSection={true} userData={userData} />
            )}
        </SafeAreaView>
    );
}; const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
});

