import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions, Clipboard } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type DonationContentProps = {
    showProfileSection?: boolean;
    userData?: {
        firstName: string;
        lastName: string;
    };
};

export const DonationContent = ({ showProfileSection, userData }: DonationContentProps) => {
    const { colors } = useTheme();

    const handleCopyToClipboard = (text: string) => {
        Clipboard.setString(text);
        // You might want to add a toast notification here
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                <Text style={[welcomeStyles.title, { color: colors.text }]}>
                    Donate
                </Text>
                <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                    Give generously and with joy (2 Cor 9 : 7)
                </Text>
            </View>

            <View style={welcomeStyles.featuresContainer}>
                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Quick Donation Links</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.donationButton}
                            onPress={() => handleOpenLink('https://www.helloasso.com/associations/la-cite-eglise-chretienne-de-paris/formulaires/3')}
                        >
                            <Ionicons name="heart" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.donationButtonText}>Donate to Mission</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.donationButton}
                            onPress={() => handleOpenLink('https://www.helloasso.com/associations/la-cite-eglise-chretienne-de-paris/formulaires/1')}
                        >
                            <Ionicons name="home" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.donationButtonText}>Building Fund</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Bank Details - Mission Fund</Text>
                    <Text style={welcomeStyles.featureText}>
                        La Cité Eglise Chrétienne (Religious association 1905 - authorized to issue tax receipts)
                    </Text>
                    <View style={styles.bankDetailsContainer}>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>Account Name:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('La Cité Eglise Chrétienne')}>
                                <Text style={styles.bankDetailValue}>La Cité Eglise Chrétienne</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>IBAN:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('FR76 3000 3032 9100 0372 7230 583')}>
                                <Text style={styles.bankDetailValue}>FR76 3000 3032 9100 0372 7230 583</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>BIC/SWIFT:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('SOGEFRPP')}>
                                <Text style={styles.bankDetailValue}>SOGEFRPP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Bank Details - Building Fund</Text>
                    <Text style={welcomeStyles.featureText}>
                        For our permanent place project
                    </Text>
                    <View style={styles.bankDetailsContainer}>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>Account Name:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('La Cité Eglise Chrétienne')}>
                                <Text style={styles.bankDetailValue}>La Cité Eglise Chrétienne</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>IBAN:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('FR76 3000 3032 9100 0372 7264 436')}>
                                <Text style={styles.bankDetailValue}>FR76 3000 3032 9100 0372 7264 436</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>BIC/SWIFT:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('SOGEFRPP')}>
                                <Text style={styles.bankDetailValue}>SOGEFRPP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Les Mains Tendues De La Cité</Text>
                    <Text style={welcomeStyles.featureText}>
                        (Association 1901 - NOT authorized to issue tax receipts)
                        {'\n\n'}For caring for the poor and other biblical activities
                    </Text>
                    <View style={styles.bankDetailsContainer}>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>Account Name:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('Les Mains Tendues De La Cité')}>
                                <Text style={styles.bankDetailValue}>Les Mains Tendues De La Cité</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>IBAN:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('FR76 3000 3032 9100 0372 7277 628')}>
                                <Text style={styles.bankDetailValue}>FR76 3000 3032 9100 0372 7277 628</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankDetailLabel}>BIC/SWIFT:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard('SOGEFRPP')}>
                                <Text style={styles.bankDetailValue}>SOGEFRPP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Thank You</Text>
                    <Text style={welcomeStyles.featureText}>
                        Thank you for your obedience to God and for your generosity of heart.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    donationButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    donationButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    bankDetailsContainer: {
        marginTop: 10,
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 8,
    },
    bankDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bankDetailLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    bankDetailValue: {
        fontSize: 14,
        color: '#FF9843',
        fontWeight: '600',
    },
});