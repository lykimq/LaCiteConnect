import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { Alert } from 'react-native';

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
