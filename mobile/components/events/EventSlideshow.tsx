/**
 * EventSlideshow Component
 * A reusable slideshow component for displaying event images with auto-play functionality
 * and pagination indicators. Supports both mobile and web platforms.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    Platform,
    FlatList,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventSlideshowStyles } from '../../styles/events/EventSlideshow.styles';
import { PhotoDetailsModal } from './PhotoDetailsModal';

// Get screen width for pagination calculations
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Props interface for the EventSlideshow component
 * @property {string[]} images - Array of image URLs
 * @property {number} [autoPlayInterval] - Time interval in ms between slides (default: 5000ms)
 */
interface EventSlideshowProps {
    images: string[];
    autoPlayInterval?: number;
}

/**
 * EventSlideshow Component
 * Displays a horizontal slideshow of images with auto-play functionality and pagination dots
 */
export const EventSlideshow: React.FC<EventSlideshowProps> = ({
    images,
    autoPlayInterval = 5000,
}) => {
    // Theme and styles setup
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventSlideshowStyles);

    // State and refs for slideshow control
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    // Photo modal state
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [currentIndex, images.length, autoPlayInterval]);

    // Handle photo tap
    const handlePhotoTap = (index: number) => {
        setSelectedPhotoIndex(index);
        setShowPhotoModal(true);
    };

    /**
     * Renders individual slide items
     * @param {Object} param0 - Item data from FlatList
     * @returns {JSX.Element} Slide view with image
     */
    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity
            style={[styles.slide, { width: SCREEN_WIDTH }]}
            onPress={() => handlePhotoTap(index)}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    // Handle scroll events for pagination animation
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
    );

    // Update current index when visible items change
    const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    // Configuration for determining when an item is considered "viewable"
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (!images.length) return null;

    /**
     * Renders pagination dots for the slideshow
     * @returns {JSX.Element} View containing pagination dots
     */
    const renderPaginationDots = () => (
        <View style={styles.paginationContainer}>
            {images.map((_, index) => {
                const inputRange = [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ];

                // Scale for the pagination dots
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [1, 1.5, 1],
                    extrapolate: 'clamp',
                });

                // Opacity for the pagination dots
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                // Render the pagination dot
                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.paginationDot,
                            {
                                opacity,
                                transform: [{ scale }],
                                backgroundColor:
                                    currentIndex === index
                                        ? themeColors.primary
                                        : themeColors.secondary,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.slideshowContainer}>
                {/* Slideshow container */}
                <Animated.FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    keyExtractor={(_, index) => index.toString()}
                    getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                />
                {renderPaginationDots()}
            </View>

            {/* Photo Details Modal */}
            <PhotoDetailsModal
                visible={showPhotoModal}
                onClose={() => setShowPhotoModal(false)}
                images={images}
                initialIndex={selectedPhotoIndex}
            />
        </View>
    );
};
