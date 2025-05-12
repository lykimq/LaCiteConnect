import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { homeStyles } from '../styles/HomeContent.styles';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { STATIC_URLS } from '../config/staticData';

const { width } = Dimensions.get('window');

export const HomeContent = () => {
    const handleFindUs = () => {
        Linking.openURL(STATIC_URLS.location);
    };

    const handleWatchOnline = () => {
        Linking.openURL(STATIC_URLS.youtube);
    };

    return (
        <View style={homeStyles.container}>
            <ScrollView
                style={homeStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={homeStyles.header}>
                    <Text style={homeStyles.title}>
                        Our Sundays
                    </Text>
                    <Text style={homeStyles.subtitle}>
                        Join us for worship and fellowship
                    </Text>
                </View>

                <View style={homeStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="videocam" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={homeStyles.sectionTitle}>Our Sunday Service</Text>
                    </View>
                    <Text style={homeStyles.infoText}>
                        Take a look into one of our Sundays to see what to expect when you join us!
                    </Text>
                    <View style={{
                        marginTop: 15,
                        width: '100%',
                        height: 200,
                        borderRadius: 8,
                        overflow: 'hidden',
                        backgroundColor: '#000',
                    }}>
                        <WebView
                            source={{ uri: STATIC_URLS.youtube }}
                            style={{ flex: 1, backgroundColor: '#000' }}
                            allowsFullscreenVideo={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        />
                    </View>
                </View>

                <View style={homeStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="location" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={homeStyles.sectionTitle}>Join Us</Text>
                    </View>
                    <Text style={homeStyles.infoText}>
                        Every Sunday at 10:30 AM{'\n'}
                        Bilingual Service (English & French)
                    </Text>
                    <TouchableOpacity
                        style={homeStyles.button}
                        onPress={handleFindUs}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="map" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={homeStyles.buttonText}>
                                24 Rue Antoine-Julien Hénard, 75012 Paris
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={homeStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="globe" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={homeStyles.sectionTitle}>Join Us Online</Text>
                    </View>
                    <Text style={homeStyles.infoText}>
                        Can't make it in person? Join us online for our live stream service.
                    </Text>
                    <TouchableOpacity
                        style={homeStyles.button}
                        onPress={handleWatchOnline}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="videocam" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={homeStyles.buttonText}>Watch Live Stream</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={homeStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="information-circle" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={homeStyles.sectionTitle}>Things You May Want to Know</Text>
                    </View>
                    <View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 10 }}>Service Details</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>Our services are in English and French</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>We meet in person and online</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>Everyone is invited and welcome!</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>Come as you are!</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 10 }}>Children's Ministry</Text>
                            <Text style={homeStyles.infoText}>
                                We love children! We have a Parents' room for babies and a Sunday school program for kids (they are also welcome to stay in the main room with their parents).
                            </Text>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 10 }}>Service Schedule</Text>
                            <Text style={homeStyles.infoText}>
                                Our services start at 10:30am and finish around 12pm and are composed of:
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="musical-notes" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>A time of worship and prayer</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="book" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>A time of teaching/preaching</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="people" size={20} color="#FF9843" style={{ marginRight: 8 }} />
                                <Text style={homeStyles.infoText}>A time of connection/fellowship</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};