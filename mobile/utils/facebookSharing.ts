import { Alert, Platform, Linking } from 'react-native';
import Share, { Social } from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { FB_IG_APP_ID } from '@env';

let hasFacebookInstalled = false;

/**
 * Extracts a clean filename from a URL
 */
const getFilenameFromUrl = (url: string): string => {
    try {
        const rawFilename = url.split('/').pop() || 'image.jpg';
        const filenameWithoutQuery = rawFilename.split('?')[0];
        const cleanFilename = filenameWithoutQuery
            .replace(/[^a-zA-Z0-9._-]/g, '')
            .replace(/_+/g, '_')
            .substring(0, 50);

        if (!cleanFilename.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return `${cleanFilename}.jpg`;
        }

        return cleanFilename;
    } catch (error) {
        console.warn('Error generating filename:', error);
        return 'image.jpg';
    }
};

/**
 * Downloads a photo temporarily
 */
const downloadPhotoTemp = async (imageUrl: string): Promise<string | undefined> => {
    try {
        console.log('Starting temporary photo download:', imageUrl);

        // Generate a safe filename with timestamp to avoid conflicts
        const timestamp = new Date().getTime();
        const baseFilename = getFilenameFromUrl(imageUrl);
        const filename = `${timestamp}_${baseFilename}`;
        const tempUri = `${FileSystem.cacheDirectory}${filename}`;
        console.log('Downloading to:', tempUri);

        // Download the image
        const downloadResult = await FileSystem.downloadAsync(imageUrl, tempUri);
        console.log('Download complete:', downloadResult.uri);

        // Verify the downloaded file
        const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
        if (!fileInfo.exists || (fileInfo as any).size === 0) {
            throw new Error('Downloaded file is invalid or empty');
        }

        return downloadResult.uri;

    } catch (error) {
        console.error('Download Error:', error instanceof Error ? error.message : String(error));
        console.error('Full error:', error);
        return undefined;
    }
};

/**
 * Checks if Facebook is installed
 */
export const checkFacebookInstalled = async () => {
    try {
        if (Platform.OS === 'ios') {
            hasFacebookInstalled = await Linking.canOpenURL('fb://');
        } else {
            const { isInstalled } = await Share.isPackageInstalled('com.facebook.katana');
            hasFacebookInstalled = isInstalled;
        }
        return hasFacebookInstalled;
    } catch (error) {
        console.error('Error checking Facebook:', error);
        return false;
    }
};

/**
 * Shows Facebook not installed alert
 */
const showFacebookNotInstalledAlert = () => {
    const storeUrl = Platform.select({
        ios: 'https://apps.apple.com/app/facebook/id284882215',
        android: 'market://details?id=com.facebook.katana',
        default: 'https://facebook.com'
    });

    Alert.alert(
        'Facebook Not Found',
        'Please install Facebook app to share photos.',
        [
            {
                text: 'Install Facebook',
                onPress: () => Linking.openURL(storeUrl)
            },
            { text: 'Cancel', style: 'cancel' }
        ]
    );
};

/**
 * Type of Facebook share
 */
export type FacebookShareType = 'feed' | 'story' | 'reel' | 'group';

/**
 * Unified Facebook sharing function that handles all types of sharing
 */
export const shareToFacebook = async (
    options: {
        type: FacebookShareType;
        imageUrl?: string;
        viewRef?: any;
        message?: string;
        groupId?: string;
        backgroundImage?: string;
    }
): Promise<void> => {
    let tempUri: string | undefined;
    let bgTempUri: string | undefined;

    try {
        const isInstalled = await checkFacebookInstalled();
        if (!isInstalled) {
            showFacebookNotInstalledAlert();
            return;
        }

        // Handle different sharing types
        switch (options.type) {
            case 'feed':
                if (!options.imageUrl) {
                    throw new Error('Image URL is required for feed sharing');
                }
                console.log('Downloading image for Facebook feed...');
                tempUri = await downloadPhotoTemp(options.imageUrl);
                if (!tempUri) {
                    Alert.alert('Error', 'Failed to download image');
                    return;
                }

                console.log('Proceeding with Facebook feed share...');
                // For feed, we use the generic share which opens Facebook's share dialog
                await Share.open({
                    url: tempUri as string,
                    type: 'image/*',
                    title: 'Share to Facebook',
                    message: options.message || '',
                    failOnCancel: false,
                });
                break;

            case 'reel':
                if (!options.imageUrl) {
                    throw new Error('Image URL is required for reel sharing');
                }
                console.log('Downloading image for Facebook reel...');
                tempUri = await downloadPhotoTemp(options.imageUrl);
                if (!tempUri) {
                    Alert.alert('Error', 'Failed to download image');
                    return;
                }

                console.log('Proceeding with Facebook reel share...');
                await Share.shareSingle({
                    social: Social.Facebook,
                    url: tempUri as string,
                    type: 'image/*',
                    message: options.message,
                    appId: FB_IG_APP_ID,
                });
                break;

            case 'story':
                if (!options.viewRef) {
                    throw new Error('ViewRef is required for story sharing');
                }
                console.log('Capturing view for Facebook story...');
                tempUri = await captureRef(options.viewRef, {
                    format: 'png',
                    quality: 1,
                });

                if (options.backgroundImage) {
                    console.log('Downloading background image...');
                    bgTempUri = await downloadPhotoTemp(options.backgroundImage);
                }

                if (!tempUri) {
                    throw new Error('Failed to capture view');
                }

                console.log('Proceeding with Facebook story share...');
                await Share.shareSingle({
                    social: Social.FacebookStories,
                    stickerImage: tempUri as string,
                    appId: FB_IG_APP_ID,
                    ...(bgTempUri ? {
                        backgroundImage: bgTempUri,
                        backgroundTopColor: '#FFFFFF',
                        backgroundBottomColor: '#FFFFFF',
                    } : {
                        backgroundImage: tempUri as string,
                        backgroundTopColor: '#FFFFFF',
                        backgroundBottomColor: '#FFFFFF',
                    })
                });
                break;

            case 'group':
                if (!options.imageUrl || !options.groupId) {
                    throw new Error('Image URL and Group ID are required for group sharing');
                }
                console.log('Downloading image for Facebook group share...');
                tempUri = await downloadPhotoTemp(options.imageUrl);
                if (!tempUri) {
                    Alert.alert('Error', 'Failed to download image');
                    return;
                }

                console.log('Proceeding with Facebook group share...');
                await Share.shareSingle({
                    social: Social.Facebook,
                    url: tempUri as string,
                    type: 'image/*',
                    message: `${options.message || ''}\n#LaCiteConnect`,
                    appId: FB_IG_APP_ID,
                });
                break;

            default:
                throw new Error('Invalid Facebook sharing type');
        }

    } catch (error) {
        console.error('Facebook share failed:', error);
        Alert.alert('Share Failed', `Could not share to Facebook ${options.type}. Please try again.`);
    } finally {
        // Clean up temp files after a short delay
        setTimeout(async () => {
            if (tempUri) {
                const fileToDelete = tempUri;
                try {
                    await FileSystem.deleteAsync(fileToDelete, { idempotent: true });
                    console.log('Cleaned up temporary file:', fileToDelete);
                } catch (error) {
                    console.warn('Failed to cleanup temporary file:', error);
                }
            }
            if (bgTempUri) {
                const fileToDelete = bgTempUri;
                try {
                    await FileSystem.deleteAsync(fileToDelete, { idempotent: true });
                    console.log('Cleaned up background file:', fileToDelete);
                } catch (error) {
                    console.warn('Failed to cleanup background file:', error);
                }
            }
        }, 3000);
    }
};

// Export individual functions for backward compatibility
export const shareToFacebookFeed = async (imageUrl: string, message?: string): Promise<void> => {
    return shareToFacebook({ type: 'feed', imageUrl, message });
};

export const shareToFacebookStory = async (viewRef: any, backgroundImage?: string): Promise<void> => {
    return shareToFacebook({ type: 'story', viewRef, backgroundImage });
};

export const shareToFacebookGroup = async (imageUrl: string, groupId: string, message?: string): Promise<void> => {
    return shareToFacebook({ type: 'group', imageUrl, groupId, message });
};