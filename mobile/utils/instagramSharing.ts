import { Alert, Platform, Linking } from 'react-native';
import Share, { Social, ShareSingleOptions } from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import { downloadPhoto } from './downloadSharing';

let hasInstagramInstalled = false;

/**
 * Checks if Instagram is installed
 */
export const checkInstagramInstalled = async () => {
    try {
        if (Platform.OS === 'ios') {
            hasInstagramInstalled = await Linking.canOpenURL('instagram://');
        } else {
            const { isInstalled } = await Share.isPackageInstalled('com.instagram.android');
            hasInstagramInstalled = isInstalled;
        }
        return hasInstagramInstalled;
    } catch (error) {
        console.error('Error checking Instagram:', error);
        return false;
    }
};

/**
 * Shares an image to Instagram Stories
 * @param viewRef React ref to the view to be captured
 * @param backgroundImage Optional background image URL
 */
export const shareToInstagramStory = async (
    viewRef: any,
    backgroundImage?: string
): Promise<void> => {
    try {
        // First check if Instagram is installed
        const isInstalled = await checkInstagramInstalled();
        if (!isInstalled) {
            const storeUrl = Platform.select({
                ios: 'https://apps.apple.com/app/instagram/id389801252',
                android: 'market://details?id=com.instagram.android',
                default: 'https://instagram.com'
            });

            Alert.alert(
                'Instagram Not Found',
                'Please install Instagram app to share photos.',
                [
                    {
                        text: 'Install Instagram',
                        onPress: () => Linking.openURL(storeUrl)
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
            return;
        }

        // Capture the view
        const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
        });

        // If background image is provided, download it
        let bgUri: string | undefined;
        if (backgroundImage) {
            bgUri = await downloadPhoto(backgroundImage);
        }

        // Share to Instagram Stories
        await Share.shareSingle({
            social: Social.InstagramStories,
            stickerImage: uri,
            backgroundTopColor: '#FFFFFF',
            backgroundBottomColor: '#FFFFFF',
            backgroundImage: bgUri,
            appId: '0', // Replace with your Facebook App ID
        });

    } catch (error) {
        console.error('Instagram share failed:', error);
        Alert.alert('Share Failed', 'Could not share to Instagram. Please try again.');
    }
};

/**
 * Shares an image to Instagram Feed
 * @param imageUrl URL of the image to share
 */
export const shareToInstagramFeed = async (imageUrl: string): Promise<void> => {
    try {
        const isInstalled = await checkInstagramInstalled();
        if (!isInstalled) {
            Alert.alert('Instagram Not Found', 'Please install Instagram to share photos.');
            return;
        }

        const localUri = await downloadPhoto(imageUrl);
        if (!localUri) {
            Alert.alert('Error', 'Failed to download image');
            return;
        }

        await Share.shareSingle({
            social: Social.Instagram,
            url: localUri,
            type: 'image/*',
        });

    } catch (error) {
        console.error('Instagram share failed:', error);
        Alert.alert('Share Failed', 'Could not share to Instagram. Please try again.');
    }
};
