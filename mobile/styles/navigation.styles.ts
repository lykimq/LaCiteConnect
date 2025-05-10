import { StyleSheet } from 'react-native';

export const navigationStyles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: 5,
        paddingTop: 5,
    },
});

export const tabBarColors = {
    active: '#FF9843',
    inactive: '#7F8C8D',
} as const;