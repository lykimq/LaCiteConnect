import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Clipboard } from 'react-native';
import { donationStyles } from '../styles/DonationContent.styles';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS, BANK_DETAILS } from '../config/staticData';

export const DonationContent = () => {
    const handleCopyToClipboard = (text: string) => {
        Clipboard.setString(text);
        // You might want to add a toast notification here
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={donationStyles.container}>
            <ScrollView
                style={donationStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={donationStyles.header}>
                    <Text style={donationStyles.title}>
                        Donate
                    </Text>
                    <Text style={donationStyles.subtitle}>
                        Give generously and with joy (2 Cor 9 : 7)
                    </Text>
                </View>

                <View style={donationStyles.cardContainer}>
                    <Text style={donationStyles.sectionTitle}>Quick Donation Links</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#FF9843',
                                paddingVertical: 12,
                                paddingHorizontal: 15,
                                borderRadius: 8,
                                flex: 1,
                                marginHorizontal: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => handleOpenLink(STATIC_URLS.donate.mission)}
                        >
                            <Ionicons name="heart" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={donationStyles.buttonText}>Donate to Mission</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#FF9843',
                                paddingVertical: 12,
                                paddingHorizontal: 15,
                                borderRadius: 8,
                                flex: 1,
                                marginHorizontal: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => handleOpenLink(STATIC_URLS.donate.building)}
                        >
                            <Ionicons name="home" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={donationStyles.buttonText}>Building Fund</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={donationStyles.cardContainer}>
                    <Text style={donationStyles.sectionTitle}>Bank Details - Mission Fund</Text>
                    <Text style={donationStyles.paragraph}>
                        {BANK_DETAILS.missionFund.description}
                    </Text>
                    <View style={{ marginTop: 10, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Account Name:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.missionFund.accountName)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.missionFund.accountName}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>IBAN:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.missionFund.iban)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.missionFund.iban}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>BIC/SWIFT:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.missionFund.bic)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.missionFund.bic}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={donationStyles.cardContainer}>
                    <Text style={donationStyles.sectionTitle}>Bank Details - Building Fund</Text>
                    <Text style={donationStyles.paragraph}>
                        {BANK_DETAILS.buildingFund.description}
                    </Text>
                    <View style={{ marginTop: 10, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Account Name:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.buildingFund.accountName)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.buildingFund.accountName}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>IBAN:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.buildingFund.iban)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.buildingFund.iban}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>BIC/SWIFT:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.buildingFund.bic)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.buildingFund.bic}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={donationStyles.cardContainer}>
                    <Text style={donationStyles.sectionTitle}>Les Mains Tendues De La Cité</Text>
                    <Text style={donationStyles.paragraph}>
                        {BANK_DETAILS.lesMainsTendues.description}
                    </Text>
                    <View style={{ marginTop: 10, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>Account Name:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.lesMainsTendues.accountName)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.lesMainsTendues.accountName}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>IBAN:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.lesMainsTendues.iban)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.lesMainsTendues.iban}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#666', fontWeight: '500' }}>BIC/SWIFT:</Text>
                            <TouchableOpacity onPress={() => handleCopyToClipboard(BANK_DETAILS.lesMainsTendues.bic)}>
                                <Text style={{ fontSize: 14, color: '#FF9843', fontWeight: '600' }}>{BANK_DETAILS.lesMainsTendues.bic}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={donationStyles.cardContainer}>
                    <Text style={donationStyles.sectionTitle}>Thank You</Text>
                    <Text style={donationStyles.paragraph}>
                        Thank you for your obedience to God and for your generosity of heart.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};