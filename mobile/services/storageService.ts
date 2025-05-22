import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { firebaseStorage } from '../config/firebase';

class StorageService {
    private static instance: StorageService;

    private constructor() { }

    /**
     * Get the singleton instance of the StorageService
     * @returns {StorageService} The singleton instance
     */
    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    /**
     * Fetches all image URLs from the events-slideshow folder in Firebase Storage
     * @returns Promise<string[]> Array of image URLs
     */
    public async getEventsSlideshowImages(): Promise<string[]> {
        try {
            const slideshowRef = ref(firebaseStorage, 'events-slideshow');
            const result = await listAll(slideshowRef);

            // Get download URLs for all items
            const urlPromises = result.items.map(item => getDownloadURL(item));
            const urls = await Promise.all(urlPromises);

            return urls;
        } catch (error) {
            console.error('Error fetching slideshow images:', error);
            throw error;
        }
    }
}

export const storageService = StorageService.getInstance();