import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';

const { width } = Dimensions.get('window');

type HomeContentProps = {
    showProfileSection?: boolean;
    userData?: {
        firstName: string;
        lastName: string;
    };
};

export const HomeContent = ({ showProfileSection, userData }: HomeContentProps) => {
    const { colors } = useTheme();

    const handleFindUs = () => {
        Linking.openURL('https://maps.google.com/?q=24+Rue+Antoine-Julien+Hénard+75012+Paris');
    };

    const handleWatchOnline = () => {
        Linking.openURL('https://www.youtube.com/watch?v=SmPZrx7W1Eo');
    };

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                <Text style={[welcomeStyles.title, { color: colors.text }]}>
                    {showProfileSection && userData ? 'Welcome to La Cité Connect' : 'Our Sundays'}
                </Text>
                <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                    {showProfileSection && userData
                        ? 'To know Jesus and make Him known in Paris'
                        : 'Join us for worship and fellowship'}
                </Text>
            </View>

            <View style={welcomeStyles.featuresContainer}>
                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="videocam" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Sunday Service</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Take a look into one of our Sundays to see what to expect when you join us!
                    </Text>
                    <View style={styles.videoContainer}>
                        <WebView
                            source={{ uri: 'https://www.youtube.com/embed/SmPZrx7W1Eo' }}
                            style={styles.video}
                            allowsFullscreenVideo={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            androidLayerType="hardware"
                            androidHardwareAccelerationDisabled={false}
                        />
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Join Us</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Every Sunday at 10:30 AM{'\n'}
                        Bilingual Service (English & French)
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleFindUs}
                    >
                        <Ionicons name="map" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>
                            24 Rue Antoine-Julien Hénard, 75012 Paris
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="globe" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Join Us Online</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Can't make it in person? Join us online for our live stream service.
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleWatchOnline}
                    >
                        <Ionicons name="videocam" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>Watch Live Stream</Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="information-circle" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Things You May Want to Know</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>Service Details</Text>
                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>Our services are in English and French</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>We meet in person and online</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>Everyone is invited and welcome!</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>Come as you are!</Text>
                            </View>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>Children's Ministry</Text>
                            <Text style={styles.infoText}>
                                We love children! We have a Parents' room for babies and a Sunday school program for kids (they are also welcome to stay in the main room with their parents).
                            </Text>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>Service Schedule</Text>
                            <Text style={styles.infoText}>
                                Our services start at 10:30am and finish around 12pm and are composed of:
                            </Text>
                            <View style={styles.infoItem}>
                                <Ionicons name="musical-notes" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>A time of worship and prayer</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="book" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>A time of teaching/preaching</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="people" size={20} color="#FF9843" style={styles.infoIcon} />
                                <Text style={styles.infoText}>A time of connection/fellowship</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardIcon: {
        marginRight: 10,
    },
    videoContainer: {
        marginTop: 15,
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
        backgroundColor: '#000',
    },
    actionButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    infoContainer: {
        marginTop: 10,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#2C3E50',
        flex: 1,
    },
});