import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
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
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
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

    const toggleSection = (sectionId: string) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
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

    const renderSectionContent = (section: WhoWeAreContent['sections'][0]) => {
        const isExpanded = expandedSection === section.id;

        if (!isExpanded) return null;

        switch (section.id) {
            case 'ourChurch':
                return (
                    <View>
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
                    <View>
                        <View style={{ marginTop: 10 }}>
                            {section.values?.map((value, i) => (
                                <View key={i} style={styles.valueItem}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.itemIcon as any} size={22} color={themeColors.primary} style={{ marginRight: 10 }} />
                                        <Text style={styles.valueText}>{value}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'ourEldershipTeam':
                return (
                    <View>
                        <View style={styles.teamGrid}>
                            {section.team?.map((member, i) => (
                                <View key={i} style={styles.teamMemberCard}>
                                    <Image
                                        source={getTeamImage(member.image)}
                                        style={styles.teamMemberImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.teamMemberInfo}>
                                        <Text style={styles.teamMemberName}>{member.firstName}</Text>
                                        <Text style={styles.teamMemberLastName}>{member.lastName}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'ourStatement':
                return (
                    <View>
                        <Text style={styles.paragraph}>
                            {section.content}
                        </Text>
                        <TouchableOpacity
                            style={styles.downloadButton}
                            onPress={() => Linking.openURL(STATIC_URLS.statements)}
                        >
                            <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.downloadButtonText}>
                                {section.buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return (
                    <View>
                        <Text style={styles.paragraph}>
                            {section.content}
                        </Text>
                    </View>
                );
        }
    };

    const renderSection = (section: WhoWeAreContent['sections'][0], index: number) => {
        const isExpanded = expandedSection === section.id;
        return (
            <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.id)}
                    activeOpacity={0.6}
                >
                    <View style={styles.sectionHeaderContent}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={themeColors.text}
                    />
                </TouchableOpacity>
                {renderSectionContent(section)}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.header}>
                    <Ionicons name="people-circle" size={60} color={themeColors.primary} />
                    <View style={styles.headerDivider} />
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