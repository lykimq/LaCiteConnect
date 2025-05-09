import { StyleSheet, Platform, Dimensions } from 'react-native';
import { commonStyles, colors, spacing, typography } from './common.styles';

const { width } = Dimensions.get('window');

export const eventStyles = StyleSheet.create({
    eventCard: {
        ...commonStyles.featureCard,
        marginBottom: spacing.md,
    },
    eventImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: spacing.sm,
        borderTopRightRadius: spacing.sm,
    },
    eventContent: {
        padding: spacing.md,
    },
    eventTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    eventDate: {
        ...typography.body2,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    eventTime: {
        ...typography.body2,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    eventLocation: {
        ...typography.body2,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    eventParticipants: {
        ...typography.body2,
        color: colors.textSecondary,
    },
    eventDescription: {
        ...typography.body1,
        color: colors.text,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
    },
    eventDetails: {
        ...commonStyles.container,
        padding: spacing.md,
    },
    eventHeader: {
        marginBottom: spacing.lg,
    },
    eventImageLarge: {
        width: '100%',
        height: 300,
        borderRadius: spacing.sm,
        marginBottom: spacing.md,
    },
    eventInfo: {
        marginBottom: spacing.lg,
    },
    eventInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    eventInfoLabel: {
        ...typography.body2,
        color: colors.textSecondary,
        width: 100,
    },
    eventInfoValue: {
        ...typography.body2,
        color: colors.text,
        flex: 1,
    },
    eventActions: {
        ...commonStyles.actionContainer,
    },
    registerButton: {
        ...commonStyles.button,
        backgroundColor: colors.primary,
    },
    registerButtonText: {
        ...typography.button,
        color: colors.white,
    },
    errorContainer: {
        ...commonStyles.error,
        marginBottom: spacing.md,
        padding: spacing.md,
        alignItems: 'center',
    },
    errorText: {
        ...typography.body2,
        color: colors.error,
        textAlign: 'center',
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
    loadingContainer: {
        ...commonStyles.loadingContainer,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.md,
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: spacing.sm,
        marginHorizontal: spacing.sm,
    },
    actionButtonText: {
        ...typography.button,
        color: colors.white,
    },
});