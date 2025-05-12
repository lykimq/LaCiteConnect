import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createWhoWeAreStyles } from '../styles/ThemedStyles';

const { width } = Dimensions.get('window');

// Define the who we are content interface
interface WhoWeAreContent {
    header: {
        title: string;
        subtitle: string;
    };
    sections: Array<{
        id: string;
        icon: string;
        title: string;
        content?: string;
        links?: Array<{
            text: string;
            url: string;
        }>;
        values?: string[];
        itemIcon?: string;
        team?: Array<{
            image: string;
            firstName: string;
            lastName: string;
        }>;
        buttonText?: string;
        buttonIcon?: string;
    }>;
}

export const WhoWeAreContent = () => {
    const [content, setContent] = useState<WhoWeAreContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createWhoWeAreStyles);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await contentService.getContent<WhoWeAreContent>('whoWeAre');

            if (response.success && response.data) {
                setContent(response.data);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading who we are content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#FF3B30' }}>{error || 'Content not available'}</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, padding: 10, backgroundColor: themeColors.primary, borderRadius: 8 }}
                    onPress={loadContent}
                >
                    <Text style={{ color: '#FFFFFF' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderSection = (section: WhoWeAreContent['sections'][0], index: number) => {
        switch (section.id) {
            case 'ourChurch':
                return (
                    <View key={section.id} style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            {section.content?.split('(NCMI)').map((part, i) => {
                                if (i === 0) {
                                    return <React.Fragment key={i}>{part}(
                                        <Text
                                            style={{ color: themeColors.primary, textDecorationLine: 'underline' }}
                                            onPress={() => Linking.openURL('https://ncmi.net/')}
                                        >
                                            NCMI
                                        </Text>
                                        )</React.Fragment>;
                                }
                                return <React.Fragment key={i}>{part}</React.Fragment>;
                            })}
                        </Text>
                    </View>
                );
            case 'ourCulture':
                return (
                    <View key={section.id} style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            {section.values?.map((value, i) => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Ionicons name={section.itemIcon as any} size={20} color={themeColors.primary} style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 14, color: themeColors.text }}>{value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'ourEldershipTeam':
                return (
                    <View key={section.id} style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15 }}>
                            {section.team?.map((member, i) => (
                                <View key={i} style={{ width: (width - 60) / 2, alignItems: 'center', marginBottom: 20, marginHorizontal: 5 }}>
                                    <Image
                                        source={getTeamImage(member.image)}
                                        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                                        resizeMode="cover"
                                    />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: themeColors.text, textAlign: 'center' }}>{member.firstName}</Text>
                                    <Text style={{ fontSize: 14, color: themeColors.text, opacity: 0.7, textAlign: 'center' }}>{member.lastName}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'ourStatement':
                return (
                    <View key={section.id} style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            {section.content}
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: themeColors.primary,
                                paddingVertical: 12,
                                paddingHorizontal: 15,
                                borderRadius: 8,
                                marginTop: 15,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                            onPress={() => Linking.openURL(STATIC_URLS.statements)}
                        >
                            <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                                {section.buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return (
                    <View key={section.id} style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            {section.content}
                        </Text>
                    </View>
                );
        }
    };

    // Helper function to get team member images
    const getTeamImage = (imageName: string) => {
        switch (imageName) {
            case 'fred-vanessa.png':
                return require('../assets/team/fred-vanessa.png');
            case 'nathanael-camille.png':
                return require('../assets/team/nathanael-camille.png');
            case 'marius-simona.png':
                return require('../assets/team/marius-simona.png');
            case 'louis-rebecca.png':
                return require('../assets/team/louis-rebecca.png');
            default:
                return require('../assets/team/fred-vanessa.png'); // Default fallback
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                {content.sections.map(renderSection)}
            </ScrollView>
        </View>
    );
};