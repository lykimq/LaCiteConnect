import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

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
            {showProfileSection && userData ? (
                <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                    <Text style={[welcomeStyles.title, { color: colors.text }]}>
                        Welcome to La Cité Connect
                    </Text>
                    <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                        To know Jesus and make Him known in Paris
                    </Text>
                </View>
            ) : (
                <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                    <Text style={[welcomeStyles.title, { color: colors.text }]}>
                        Our Sundays
                    </Text>
                    <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                        Join us for worship and fellowship
                    </Text>
                </View>
            )}

            <View style={welcomeStyles.featuresContainer}>
                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Our Sunday Service</Text>
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
                        />
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Join Us</Text>
                    <Text style={welcomeStyles.featureText}>
                        Every Sunday at 10:30 AM{'\n'}
                        Bilingual Service (English & French)
                    </Text>
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handleFindUs}
                    >
                        <Text style={styles.locationButtonText}>
                            24 Rue Antoine-Julien Hénard, 75012 Paris
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Join Us Online</Text>
                    <Text style={welcomeStyles.featureText}>
                        Can't make it in person? Join us online for our live stream service.
                    </Text>
                    <TouchableOpacity
                        style={styles.onlineButton}
                        onPress={handleWatchOnline}
                    >
                        <Ionicons name="videocam" size={24} color="#FFFFFF" style={styles.videoIcon} />
                        <Text style={styles.onlineButtonText}>Watch Live Stream</Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>THINGS YOU MAY WANT TO KNOW</Text>
                    <Text style={welcomeStyles.featureText}>
                        Our services are in English and French.
                        {'\n\n'}• We meet in person and online.
                        {'\n'}• Everyone is invited and welcome!
                        {'\n'}• Come as you are!

                        {'\n\n'}We love children! We have a Parents' room for babies and a Sunday school program for kids (they are also welcome to stay in the main room with their parents).

                        {'\n\n'}Our services start at 10:30am and finish around 12pm and are composed of:

                        {'\n\n'}• A time of worship and prayer
                        {'\n'}• A time of teaching/preaching
                        {'\n'}• A time of connection/fellowship
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    locationButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'center',
    },
    locationButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    videoContainer: {
        marginTop: 15,
        width: '100%',
        height: 200, // Fixed height that fits well in the card
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
        backgroundColor: '#000',
    },
    onlineButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    videoIcon: {
        marginRight: 8,
    },
});