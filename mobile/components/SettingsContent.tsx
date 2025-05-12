import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsContent = () => {
    const { themeColors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: themeColors.background,
        },
        scrollView: {
            flex: 1,
        },
        header: {
            marginBottom: 20,
            marginTop: 30,
            alignItems: 'center',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeColors.text,
            marginVertical: 10,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 18,
            color: '#666',
            marginBottom: 10,
            textAlign: 'center',
        },
        section: {
            backgroundColor: themeColors.card,
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderColor: themeColors.border,
            borderWidth: 1,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.text,
            marginLeft: 10,
        },
        description: {
            fontSize: 16,
            color: themeColors.text,
            marginBottom: 16,
            opacity: 0.7,
        },
        settingItem: {
            marginVertical: 8,
        },
        infoItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        infoLabel: {
            fontSize: 16,
            color: themeColors.text,
        },
        infoValue: {
            fontSize: 16,
            color: themeColors.text,
            opacity: 0.6,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Customize your experience</Text>
                </View>

                {/* Language Settings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="language" size={22} color={themeColors.primary} />
                        <Text style={styles.sectionTitle}>Language</Text>
                    </View>
                    <Text style={styles.description}>
                        Choose your preferred language for the app
                    </Text>
                    <View style={styles.settingItem}>
                        <LanguageSelector />
                    </View>
                </View>

                {/* Theme Settings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="color-palette" size={22} color={themeColors.primary} />
                        <Text style={styles.sectionTitle}>Theme</Text>
                    </View>
                    <Text style={styles.description}>
                        Change the appearance of the app
                    </Text>
                    <View style={styles.settingItem}>
                        <ThemeSelector />
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle" size={22} color={themeColors.primary} />
                        <Text style={styles.sectionTitle}>About</Text>
                    </View>
                    <TouchableOpacity style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Version</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={18} color={themeColors.text} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={18} color={themeColors.text} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};