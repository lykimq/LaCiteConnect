import { Alert, Linking, Platform } from 'react-native';
import Share, { Social } from 'react-native-share';

/**
 * Shares an image to Facebook using multiple fallback methods
 * @param imageUrl The URL of the image to share
 * @param message Optional message to share with the image
 */
export const shareToFacebook = async (imageUrl: string, message: string = 'Check out this image!'): Promise<void> => {
    try {
        // Validate URL first
        if (!imageUrl.startsWith('http')) {
            Alert.alert('Facebook Sharing', 'Only public URLs can be shared to Facebook.');
            return;
        }

        // On iOS, prefer web sharing as it's more reliable
        if (Platform.OS === 'ios') {
            await shareViaWeb(imageUrl, message);
            return;
        }

        // Try native sharing via react-native-share (primarily for Android)
        try {
            await Share.shareSingle({
                social: Social.Facebook,
                url: imageUrl,
                type: 'image/jpeg',
                message: message
            });
            return;
        } catch (nativeError) {
            console.log('Native Facebook sharing failed, falling back to web:', nativeError);
            await shareViaWeb(imageUrl, message);
        }
    } catch (error) {
        console.error('Facebook share error:', error);
        Alert.alert(
            'Error',
            'Could not share to Facebook. Please make sure you have the Facebook app installed or try again later.'
        );
    }
};

/**
 * Helper function to share via web browser
 */
async function shareViaWeb(imageUrl: string, message: string): Promise<void> {
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const encodedMessage = encodeURIComponent(message);
    const timestamp = new Date().getTime();

    // Basic sharer URL (more reliable than dialog API)
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedImageUrl}&quote=${encodedMessage}&t=${timestamp}`;

    try {
        const canOpen = await Linking.canOpenURL(shareUrl);
        if (canOpen) {
            await Linking.openURL(shareUrl);
        } else {
            Alert.alert('Facebook Sharing', 'Unable to open Facebook share dialog.');
        }
    } catch (error) {
        console.error('Web sharing failed:', error);
        throw error; // Let the main function handle the error
    }
};