import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuestTabParamList } from '../../types/navigation';

type WelcomeGuestPageProps = {
    navigation: NativeStackNavigationProp<GuestTabParamList, 'Home'>;
};

export const WelcomeGuestPage = ({ navigation }: WelcomeGuestPageProps) => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Welcome to La Cité Connect
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Join our community and stay connected with church events and activities
                    </Text>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('Events')}
                    >
                        <Text style={styles.buttonText}>View Events</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.card }]}
                        onPress={() => navigation.navigate('SignIn')}
                    >
                        <Text style={[styles.buttonText, { color: colors.primary }]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        gap: 15,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});