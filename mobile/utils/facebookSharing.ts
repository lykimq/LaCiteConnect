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
 * Shares content to Facebook Feed
 */
export const shareToFacebookFeed = async (
    imageUrl: string,
    message?: string
): Promise<void> => {
    let tempUri: string | undefined;

    try {
        const isInstalled = await checkFacebookInstalled();
        if (!isInstalled) {
            showFacebookNotInstalledAlert();
            return;
        }

        console.log('Downloading image for Facebook share...');
        tempUri = await downloadPhotoTemp(imageUrl);
        if (!tempUri) {
            Alert.alert('Error', 'Failed to download image');
            return;
        }

        console.log('Image downloaded, proceeding with Facebook share...');
        const result = await Share.shareSingle({
            social: Social.Facebook,
            url: tempUri as string,
            type: 'image/*',
            message: message,
            appId: FB_IG_APP_ID,
        });

        console.log('Share result:', result);

    } catch (error) {
        console.error('Facebook feed share failed:', error);
        Alert.alert('Share Failed', 'Could not share to Facebook feed. Please try again.');
    } finally {
        // Clean up temp file after a short delay to ensure sharing is complete
        if (tempUri) {
            const fileToDelete = tempUri; // Capture the value in closure
            setTimeout(async () => {
                try {
                    await FileSystem.deleteAsync(fileToDelete, { idempotent: true });
                    console.log('Cleaned up temporary file:', fileToDelete);
                } catch (error) {
                    console.warn('Failed to cleanup temporary file:', error);
                }
            }, 3000);
        }
    }
};

/**
 * Shares an image to Facebook Story
 */
export const shareToFacebookStory = async (
    viewRef: any,
    backgroundImage?: string
): Promise<void> => {
    let stickerUri: string | undefined;
    let bgTempUri: string | undefined;

    try {
        const isInstalled = await checkFacebookInstalled();
        if (!isInstalled) {
            showFacebookNotInstalledAlert();
            return;
        }

        console.log('Capturing view for Facebook story...');
        stickerUri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
        });

        if (backgroundImage) {
            console.log('Downloading background image...');
            bgTempUri = await downloadPhotoTemp(backgroundImage);
        }

        if (!stickerUri) {
            throw new Error('Failed to capture view');
        }

        console.log('Proceeding with Facebook story share...');
        const result = await Share.shareSingle({
            social: Social.FacebookStories,
            stickerImage: stickerUri as string,
            appId: FB_IG_APP_ID,
            ...(bgTempUri ? {
                backgroundImage: bgTempUri,
                backgroundTopColor: '#FFFFFF',
                backgroundBottomColor: '#FFFFFF',
            } : {
                backgroundImage: stickerUri as string,
                backgroundTopColor: '#FFFFFF',
                backgroundBottomColor: '#FFFFFF',
            })
        });

        console.log('Share result:', result);

    } catch (error) {
        console.error('Facebook story share failed:', error);
        Alert.alert('Share Failed', 'Could not share to Facebook story. Please try again.');
    } finally {
        // Clean up temp files after a short delay
        setTimeout(async () => {
            if (stickerUri) {
                try {
                    await FileSystem.deleteAsync(stickerUri, { idempotent: true });
                    console.log('Cleaned up sticker file:', stickerUri);
                } catch (error) {
                    console.warn('Failed to cleanup sticker file:', error);
                }
            }
            if (bgTempUri) {
                try {
                    await FileSystem.deleteAsync(bgTempUri, { idempotent: true });
                    console.log('Cleaned up background file:', bgTempUri);
                } catch (error) {
                    console.warn('Failed to cleanup background file:', error);
                }
            }
        }, 3000);
    }
};

/**
 * Shares content to a Facebook Group
 */
export const shareToFacebookGroup = async (
    imageUrl: string,
    groupId: string,
    message?: string
): Promise<void> => {
    let tempUri: string | undefined;

    try {
        const isInstalled = await checkFacebookInstalled();
        if (!isInstalled) {
            showFacebookNotInstalledAlert();
            return;
        }

        console.log('Downloading image for Facebook group share...');
        tempUri = await downloadPhotoTemp(imageUrl);
        if (!tempUri) {
            Alert.alert('Error', 'Failed to download image');
            return;
        }

        console.log('Image downloaded, proceeding with Facebook group share...');
        const result = await Share.shareSingle({
            social: Social.Facebook,
            url: tempUri,
            type: 'image/*',
            message: `${message || ''}\n#LaCiteConnect`,
            appId: FB_IG_APP_ID,
        });

        console.log('Share result:', result);

    } catch (error) {
        console.error('Facebook group share failed:', error);
        Alert.alert('Share Failed', 'Could not share to Facebook group. Please try again.');
    } finally {
        // Clean up temp file after a short delay
        if (tempUri) {
            const fileToDelete = tempUri; // Capture the value in closure
            setTimeout(async () => {
                try {
                    await FileSystem.deleteAsync(fileToDelete, { idempotent: true });
                    console.log('Cleaned up temporary file:', fileToDelete);
                } catch (error) {
                    console.warn('Failed to cleanup temporary file:', error);
                }
            }, 3000);
        }
    }
};

/**
 * Unified Facebook sharing function that handles feed, story, and group sharing
 * @param options Configuration object for Facebook sharing
 */
export type FacebookShareOptions = {
    type: 'feed' | 'story' | 'group';
    imageUrl?: string;
    message?: string;
    groupId?: string;
    viewRef?: any;
    backgroundImage?: string;
};

export const shareToFacebook = async (options: FacebookShareOptions): Promise<void> => {
    try {
        switch (options.type) {
            case 'feed':
                if (!options.imageUrl) {
                    throw new Error('Image URL is required for feed sharing');
                }
                await shareToFacebookFeed(options.imageUrl, options.message);
                break;

            case 'story':
                if (!options.viewRef) {
                    throw new Error('ViewRef is required for story sharing');
                }
                await shareToFacebookStory(options.viewRef, options.backgroundImage);
                break;

            case 'group':
                if (!options.imageUrl || !options.groupId) {
                    throw new Error('Image URL and Group ID are required for group sharing');
                }
                await shareToFacebookGroup(options.imageUrl, options.groupId, options.message);
                break;

            default:
                throw new Error('Invalid Facebook sharing type');
        }
    } catch (error) {
        console.error('Facebook sharing failed:', error);
        Alert.alert('Share Failed', `Could not share to Facebook ${options.type}. Please try again.`);
    }
};