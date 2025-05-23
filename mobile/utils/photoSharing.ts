import { Alert, Linking, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

type SharingPlatform = 'facebook' | 'instagram' | 'pinterest' | 'whatsapp' | 'email' | 'twitter';

/**
 * Handles sharing photos to different social media platforms
 * @param platform - The target platform to share to
 * @param imageUrl - The URL of the image to share
 */
export const sharePhoto = async (platform: SharingPlatform, imageUrl: string): Promise<void> => {
    try {
        switch (platform) {
            case 'facebook':
                await handleFacebookShare(imageUrl);
                break;

            case 'instagram':
                await handleInstagramShare(imageUrl);
                break;

            case 'pinterest':
                await handlePinterestShare(imageUrl);
                break;

            case 'whatsapp':
                await handleWhatsAppShare(imageUrl);
                break;

            case 'email':
                await handleEmailShare(imageUrl);
                break;

            case 'twitter':
                await handleTwitterShare(imageUrl);
                break;

            default:
                await handleDefaultShare(imageUrl);
        }
    } catch (error) {
        Alert.alert('Error', `Failed to share to ${platform}`);
    }
};

/**
 * Downloads and saves a photo to the device's photo library
 * @param imageUrl - The URL of the image to download
 * @returns Promise<string | undefined> - Returns the local URI if successful, undefined otherwise
 */
export const downloadPhoto = async (imageUrl: string): Promise<string | undefined> => {
    try {
        // Request permissions for saving to photo library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant permission to save photos');
            return undefined;
        }

        // Use the existing getFilenameFromUrl utility
        const filename = getFilenameFromUrl(imageUrl) || 'downloaded-image.jpg';
        const localUri = `${FileSystem.cacheDirectory}${filename}`;

        // Download the image
        const { uri } = await FileSystem.downloadAsync(imageUrl, localUri);

        // Save to media library
        await MediaLibrary.saveToLibraryAsync(uri);

        Alert.alert('Success', 'Image saved to your photos');

        // Clean up the cached file
        try {
            await FileSystem.deleteAsync(uri);
        } catch (cleanupError) {
            console.warn('Failed to cleanup temporary file:', cleanupError);
        }

        return uri;
    } catch (error) {
        console.error('Download Error:', error instanceof Error ? error.message : String(error));
        Alert.alert('Error', 'Failed to download the image');
        return undefined;
    }
};

// Private helper functions for each platform
const handleFacebookShare = async (imageUrl: string): Promise<void> => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
    await Linking.openURL(fbUrl);
};

const handleInstagramShare = async (imageUrl: string): Promise<void> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
        const filename = imageUrl.split('/').pop();
        const localUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.downloadAsync(imageUrl, localUri);
        await MediaLibrary.saveToLibraryAsync(localUri);
        await Linking.openURL('instagram://library?AssetPath=' + localUri);
    } else {
        Alert.alert('Permission Required', 'Please grant permission to access photos');
    }
};

const handlePinterestShare = async (imageUrl: string): Promise<void> => {
    const pinUrl = `pinterest://pin/create/link/?url=${encodeURIComponent(imageUrl)}`;
    try {
        await Linking.openURL(pinUrl);
    } catch {
        await Linking.openURL(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(imageUrl)}`);
    }
};

const handleWhatsAppShare = async (imageUrl: string): Promise<void> => {
    try {
        const cacheDir = `${FileSystem.cacheDirectory}events-slideshow/`;

        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(cacheDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
        }

        const filename = getFilenameFromUrl(imageUrl);
        const localUri = cacheDir + filename;

        // Delete existing file if present
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
            await FileSystem.deleteAsync(localUri);
        }

        // Download the file
        await FileSystem.downloadAsync(imageUrl, localUri);

        // Use expo-sharing
        await Sharing.shareAsync(localUri, {
            mimeType: 'image/jpeg',
            dialogTitle: 'Share via WhatsApp',
        });

        // Clean up
        try {
            await FileSystem.deleteAsync(localUri);
        } catch (cleanupError) {
            console.warn('Failed to cleanup temporary file:', cleanupError);
        }
    } catch (error) {
        // Fallback to text-only sharing via WhatsApp
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(imageUrl)}`;
        await Linking.openURL(whatsappUrl);
    }
};

const handleEmailShare = async (imageUrl: string): Promise<void> => {
    const emailUrl = `mailto:?subject=Check out this image&body=${encodeURIComponent(imageUrl)}`;
    await Linking.openURL(emailUrl);
};

const handleTwitterShare = async (imageUrl: string): Promise<void> => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}`;
    await Linking.openURL(twitterUrl);
};

const handleDefaultShare = async (imageUrl: string): Promise<void> => {
    await Share.share({
        url: imageUrl,
        title: 'Share Image',
        message: 'Check out this image!',
    });
};

/**
 * URL Processing Mathematics:
 * 1. String splitting: url.split('?')[0]
 *    - Splits URL at '?' character
 *    - Takes first part [0] to remove query parameters
 *
 * 2. Substring extraction: str.substring(lastIndexOf('/') + 1)
 *    - lastIndexOf('/') finds position p of last '/'
 *    - p + 1 gives start position after '/'
 *    - substring(p + 1) extracts everything after last '/'
 *
 * Example:
 * Input:  "https://example.com/photos/image.jpg?size=large"
 * Step 1: "https://example.com/photos/image.jpg"
 * Step 2: "image.jpg"
 */
const getFilenameFromUrl = (url: string): string => {
    const urlWithoutParams = url.split('?')[0];
    return urlWithoutParams.substring(urlWithoutParams.lastIndexOf('/') + 1);
};