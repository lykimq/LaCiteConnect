import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Common colors
export const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    text: '#000000',
    textSecondary: '#8E8E93',
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    border: '#C6C6C8',
    white: '#FFFFFF',
    black: '#000000',
};

// Common spacing
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Common typography
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
    },
    body1: {
        fontSize: 16,
        fontWeight: '400' as const,
    },
    body2: {
        fontSize: 14,
        fontWeight: '400' as const,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
    },
};

export const commonStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5,
            },
        }),
    },

    // Typography styles
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.h3,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },

    // Button styles
    button: {
        backgroundColor: colors.primary,
        borderRadius: spacing.sm,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: {
        backgroundColor: colors.backgroundSecondary,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    buttonText: {
        color: colors.backgroundSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextSecondary: {
        color: colors.primary,
    },

    // Input styles
    inputContainer: {
        marginBottom: spacing.md,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: spacing.sm,
        padding: spacing.md,
        marginBottom: spacing.md,
        fontSize: typography.body1.fontSize,
    },

    // Error styles
    error: {
        backgroundColor: colors.error + '10',
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: spacing.sm,
        padding: spacing.md,
        marginBottom: spacing.md,
    },

    // Loading styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Feature card styles
    featureCard: {
        backgroundColor: colors.background,
        borderRadius: spacing.sm,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    featureTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    featureText: {
        ...typography.body1,
        color: colors.textSecondary,
        lineHeight: 24,
    },

    // Action container styles
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
    },

    // Footer styles
    footer: {
        marginTop: 'auto',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    footerText: {
        color: colors.textSecondary,
        textAlign: 'center',
        ...typography.caption,
    },
});