import { Alert, Linking } from 'react-native';

/**
 * 🔄 Pinterest Sharing via Public URL (Firebase)
 */
export const shareToPinterest = async (imageUrl: string): Promise<void> => {
    try {
        if (!imageUrl.startsWith('http')) {
            Alert.alert(
                'Pinterest Sharing',
                'Only public URLs (like Firebase image links) can be shared to Pinterest.'
            );
            return;
        }

        const encodedImageUrl = encodeURIComponent(imageUrl);
        const description = encodeURIComponent('Check out this image!');
        const pinterestWebUrl = `https://www.pinterest.com/pin-builder/?media=${encodedImageUrl}&description=${description}`;

        const canOpen = await Linking.canOpenURL(pinterestWebUrl);
        if (canOpen) {
            await Linking.openURL(pinterestWebUrl);
        } else {
            Alert.alert('Pinterest Sharing', 'Unable to open Pinterest');
        }
    } catch (error) {
        Alert.alert('Error', 'Could not share to Pinterest');
    }
};