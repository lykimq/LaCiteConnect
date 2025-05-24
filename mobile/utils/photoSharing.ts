import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Share, { Social } from 'react-native-share';
import { Alert, Linking, Platform } from 'react-native';

export { Social };  // Re-export Social type

/**
 * Extracts a clean filename from a URL and ensures it's not too long
 */
const getFilenameFromUrl = (url: string): string => {
    try {
        // Extract filename from URL
        const rawFilename = url.split('/').pop() || 'image.jpg';

        // Remove query parameters and tokens
        const filenameWithoutQuery = rawFilename.split('?')[0];

        // Clean up the filename - remove special characters and limit length
        const cleanFilename = filenameWithoutQuery
            .replace(/[^a-zA-Z0-9._-]/g, '')  // Remove special characters
            .replace(/_+/g, '_')               // Replace multiple underscores with single
            .substring(0, 50);                 // Limit length to 50 characters

        // Ensure it has a proper extension
        if (!cleanFilename.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return `${cleanFilename}.jpg`;
        }

        console.log('Generated filename:', cleanFilename);
        return cleanFilename;
    } catch (error) {
        console.warn('Error generating filename:', error);
        return 'image.jpg';
    }
};

/**
 * Downloads and saves a photo to the device's photo library
 */
export const downloadPhoto = async (imageUrl: string): Promise<string | undefined> => {
    let tempUri: string | undefined;

    try {
        console.log('Starting photo download:', imageUrl);

        // Request permissions for saving to photo library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant permission to save photos');
            return undefined;
        }

        // Generate a safe filename
        const filename = getFilenameFromUrl(imageUrl);
        tempUri = `${FileSystem.cacheDirectory}${filename}`;
        console.log('Downloading to:', tempUri);

        // Ensure the cache directory exists
        const dirInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory!);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory!, { intermediates: true });
        }

        // Download the image
        const downloadResult = await FileSystem.downloadAsync(imageUrl, tempUri);
        console.log('Download complete');

        // Verify the downloaded file
        const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
        if (!fileInfo.exists || (fileInfo as any).size === 0) {
            throw new Error('Downloaded file is invalid or empty');
        }

        console.log('Saving to library...');
        // Save to media library with error handling
        try {
            const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
            console.log('Successfully created asset:', asset);

            // Create an album and add the asset to it (optional)
            try {
                const album = await MediaLibrary.getAlbumAsync('LaCiteConnect');
                if (album === null) {
                    await MediaLibrary.createAlbumAsync('LaCiteConnect', asset, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                }
            } catch (albumError) {
                console.warn('Failed to add to album:', albumError);
                // Don't throw here as the image is still saved
            }

            Alert.alert('Success', 'Image saved to your photos');
            return downloadResult.uri;
        } catch (saveError) {
            console.error('Failed to save to library:', saveError);
            throw new Error('Failed to save image to library');
        }

    } catch (error) {
        console.error('Download Error:', error instanceof Error ? error.message : String(error));
        console.error('Full error:', error);
        Alert.alert('Error', 'Failed to download the image');
        return undefined;
    } finally {
        // Clean up temp file
        if (tempUri) {
            try {
                await FileSystem.deleteAsync(tempUri, { idempotent: true });
                console.log('Cleaned up temporary file');
            } catch (cleanupError) {
                console.warn('Failed to cleanup temporary file:', cleanupError);
            }
        }
    }
};

/**
 * Downloads and converts an image to Base64
 */
export const downloadImageAsBase64 = async (imageUrl: string): Promise<string | undefined> => {
    try {
        console.log('Downloading image as Base64:', imageUrl);

        // Download to temporary file first
        const filename = getFilenameFromUrl(imageUrl);
        const tempUri = `${FileSystem.cacheDirectory}${filename}`;

        console.log('Downloading to temp location:', tempUri);
        const { uri } = await FileSystem.downloadAsync(imageUrl, tempUri);

        // Convert to Base64
        console.log('Converting to Base64...');
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Clean up temp file
        try {
            await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch (cleanupError) {
            console.warn('Failed to cleanup temp file:', cleanupError);
        }

        console.log('Successfully converted to Base64');
        return base64;
    } catch (error) {
        console.error('Base64 conversion error:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);
        Alert.alert('Error', 'Failed to process the image');
        return undefined;
    }
};

/**
 * Saves a Base64 image to the device's photo library
 */
export const saveBase64ToLibrary = async (base64Image: string): Promise<boolean> => {
    try {
        console.log('Requesting media library permissions...');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        console.log('Permission status:', status);

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow photo access');
            return false;
        }

        // Create temporary file from Base64
        const tempUri = `${FileSystem.cacheDirectory}temp_image.jpg`;
        console.log('Creating temporary file:', tempUri);

        await FileSystem.writeAsStringAsync(tempUri, base64Image, {
            encoding: FileSystem.EncodingType.Base64,
        });

        console.log('Saving to library...');
        const asset = await MediaLibrary.saveToLibraryAsync(tempUri);
        console.log('File saved to library. Asset:', asset);

        // Clean up temp file
        try {
            await FileSystem.deleteAsync(tempUri, { idempotent: true });
        } catch (cleanupError) {
            console.warn('Failed to cleanup temp file:', cleanupError);
        }

        Alert.alert('Saved', 'Image saved to your gallery');
        return true;
    } catch (error) {
        console.error('Save error:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);
        Alert.alert('Error', 'Failed to save image');
        return false;
    }
};

/**
 * Shares a Base64 image via WhatsApp
 */
export const shareBase64ToWhatsApp = async (base64Image: string): Promise<void> => {
    try {
        console.log('Preparing to share via WhatsApp');

        await Share.shareSingle({
            message: 'Check out this image!',
            url: `data:image/jpeg;base64,${base64Image}`,
            type: 'image/jpeg',
            social: Social.Whatsapp,
        });

        console.log('Share request completed');
    } catch (error) {
        console.error('WhatsApp share error:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);
        Alert.alert('Error', 'Could not share to WhatsApp');
    }
};

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

/**
 * Combined action: Download → Save to gallery → Share to WhatsApp using Base64
 */
export const handleDownloadSaveAndShare = async (imageUrl: string): Promise<void> => {
    console.log('Starting combined download, save, and share process...');
    console.log('Image URL:', imageUrl);

    const base64Image = await downloadImageAsBase64(imageUrl);
    if (!base64Image) {
        console.error('Failed to download and convert image');
        return;
    }

    console.log('Successfully converted to Base64');
    const saved = await saveBase64ToLibrary(base64Image);

    if (saved) {
        console.log('Successfully saved to library, proceeding to share');
        await shareBase64ToWhatsApp(base64Image);
    } else {
        console.error('Failed to save to library');
    }
};

/**
 * Generic share function that supports multiple platforms
 */
export const sharePhoto = async (platform: Social | 'generic' | 'pinterest', imageUrl: string): Promise<void> => {
    try {
        console.log('=== Share Photo Debug ===');
        console.log('Platform:', platform);
        console.log('Image URL:', imageUrl);

        if (!imageUrl) {
            throw new Error('No image URL provided');
        }

        if (platform === 'pinterest') {
            console.log('Initiating Pinterest sharing...');
            await shareToPinterest(imageUrl);
            return;
        }

        if (platform === Social.Whatsapp) {
            console.log('Initiating WhatsApp sharing...');
            const base64Image = await downloadImageAsBase64(imageUrl);
            if (!base64Image) {
                throw new Error('Failed to convert image to Base64');
            }
            await shareBase64ToWhatsApp(base64Image);
            return;
        }

        // For other platforms, use generic share
        console.log('Using generic share...');
        await Share.open({
            url: imageUrl,
            type: 'image/jpeg',
            title: 'Share Image',
        });

    } catch (error) {
        console.error('=== Share Photo Error ===');
        console.error('Platform:', platform);
        console.error('Error type:', error instanceof Error ? 'Error object' : typeof error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Full error:', error);
        Alert.alert('Error', `Failed to share to ${platform}`);
    }
};