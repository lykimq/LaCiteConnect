import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuestTabParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';

type WelcomeGuestPageProps = {
    navigation: NativeStackNavigationProp<GuestTabParamList, 'Home'>;
};

export const WelcomeGuestPage = ({ navigation }: WelcomeGuestPageProps) => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={welcomeStyles.safeArea}>
            <ScrollView
                contentContainerStyle={welcomeStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={welcomeStyles.header}>
                    <Text style={[welcomeStyles.title, { color: colors.text }]}>
                        Welcome to La Cité Connect
                    </Text>
                    <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                        Join our community and stay connected with church events and activities
                    </Text>
                </View>

                <View style={welcomeStyles.actionContainer}>
                    <TouchableOpacity
                        style={welcomeStyles.actionButton}
                        onPress={() => navigation.navigate('Events')}
                    >
                        <Text style={welcomeStyles.actionButtonText}>View Events</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.registerButton}
                        onPress={() => navigation.navigate('SignIn')}
                    >
                        <Text style={welcomeStyles.registerButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};