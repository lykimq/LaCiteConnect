import { StyleSheet, Dimensions } from 'react-native';
import { CustomThemeColors } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createEventSlideshowStyles = (themeColors: CustomThemeColors) => StyleSheet.create({
    container: {
        height: 200,
        marginVertical: 16,
    },
    slide: {
        width: SCREEN_WIDTH,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        padding: 10,
        backgroundColor: 'transparent',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 16,
        width: '100%',
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});