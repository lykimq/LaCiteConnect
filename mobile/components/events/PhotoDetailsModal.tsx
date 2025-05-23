import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    Animated,
    GestureResponderEvent,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createPhotoDetailsModalStyles } from '../../styles/events/PhotoDetailsModal.styles';
import { sharePhoto, downloadPhoto } from '../../utils/photoSharing';
import { createImagePanResponder } from '../../utils/panGestureHandler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * PhotoDetailsModal Component
 * A modal component that displays a full-screen image viewer with sharing capabilities.
 * Features:
 * - Image zoom and pan gestures
 * - Left/right swipe navigation
 * - Social media sharing
 * - Image download functionality
 * - Platform-specific UI adjustments
 */

interface PhotoDetailsModalProps {
    visible: boolean;        // Controls modal visibility
    onClose: () => void;    // Callback when modal is closed
    images: string[];       // Array of image URLs to display
    initialIndex: number;   // Starting index in the images array
}

export const PhotoDetailsModal: React.FC<PhotoDetailsModalProps> = ({
    visible,
    onClose,
    images,
    initialIndex,
}) => {
    // Theme and styles setup
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createPhotoDetailsModalStyles);

    // State management
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [downloadingImage, setDownloadingImage] = useState(false);

    // Animation values for gestures
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    // Handle navigation
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Create pan responder
    const panResponder = createImagePanResponder({
        scale,
        translateX,
        translateY,
        onSwipeLeft: currentIndex < images.length - 1 ? handleNext : undefined,
        onSwipeRight: currentIndex > 0 ? handlePrevious : undefined,
        canSwipeLeft: currentIndex < images.length - 1,
        canSwipeRight: currentIndex > 0,
    });

    // Clean up the scale listener when component unmounts
    useEffect(() => {
        const scaleListener = scale.addListener(() => { });
        return () => {
            scale.removeListener(scaleListener);
        };
    }, []);

    // Handle background press
    const handleBackgroundPress = (event: GestureResponderEvent) => {
        // Only close if the press is directly on the background
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    /**
     * Handle sharing to different platforms
     */
    const handleShare = async (platform: 'facebook' | 'instagram' | 'pinterest' | 'whatsapp' | 'email' | 'twitter') => {
        const imageUrl = images[currentIndex];
        await sharePhoto(platform, imageUrl);
    };

    /**
     * Handle image download
     */
    const handleDownload = async () => {
        try {
            setDownloadingImage(true);
            await downloadPhoto(images[currentIndex]);
        } finally {
            setDownloadingImage(false);
        }
    };

    // Render the modal
    if (!visible || images.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                style={styles.modalOverlay}
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleBackgroundPress}
            >
                {/* Close button */}
                <TouchableOpacity
                    style={styles.closeButtonContainer}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Navigation buttons */}
                {currentIndex > 0 && (
                    <TouchableOpacity
                        style={[styles.navigationButton, styles.leftButton]}
                        onPress={handlePrevious}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {currentIndex < images.length - 1 && (
                    <TouchableOpacity
                        style={[styles.navigationButton, styles.rightButton]}
                        onPress={handleNext}
                    >
                        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {/* Photo container with zoom, pan, and swipe capabilities */}
                <Animated.View
                    style={[
                        styles.photoContainer,
                        {
                            transform: [
                                { scale },
                                { translateX },
                                { translateY },
                            ],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* Photo */}
                    <Image
                        source={{ uri: images[currentIndex] }}
                        style={styles.photo}
                    />
                </Animated.View>

                {/* Pagination dots */}
                <View style={styles.paginationContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentIndex === index && styles.activePaginationDot,
                            ]}
                        />
                    ))}
                </View>

                {/* Social Media Sharing Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.actionButtonsScroll}
                        contentInset={{ left: 20, right: 20 }}
                        contentOffset={{ x: -20, y: 0 }}
                    >
                        {/* Facebook Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#3b5998' }]}
                            onPress={() => handleShare('facebook')}
                        >
                            <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Instagram Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#C13584' }]}
                            onPress={() => handleShare('instagram')}
                        >
                            <Ionicons name="logo-instagram" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Pinterest Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#E60023' }]}
                            onPress={() => handleShare('pinterest')}
                        >
                            <Ionicons name="logo-pinterest" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* WhatsApp Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#25D366' }]}
                            onPress={() => handleShare('whatsapp')}
                        >
                            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Twitter Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#1DA1F2' }]}
                            onPress={() => handleShare('twitter')}
                        >
                            <Ionicons name="logo-twitter" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Email Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#DB4437' }]}
                            onPress={() => handleShare('email')}
                        >
                            <Ionicons name="mail" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Download Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#4285F4' }]}
                            onPress={handleDownload}
                            disabled={downloadingImage}
                        >
                            <Ionicons
                                name={downloadingImage ? "cloud-download-outline" : "download"}
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};