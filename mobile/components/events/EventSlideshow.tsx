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

// Get screen width for pagination calculations
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Props interface for the EventSlideshow component
 * @property {any[]} images - Array of image sources (can be require() images)
 * @property {number} [autoPlayInterval] - Time interval in ms between slides (default: 5000ms)
 */
interface EventSlideshowProps {
    images: any[]; // Changed to any[] to accept require() images
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

    // Auto-play functionality
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < images.length - 1) {
                flatListRef.current?.scrollToIndex({
                    index: currentIndex + 1,
                    animated: true,
                });
            } else {
                // Reset to first image when reaching the end
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                });
            }
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [currentIndex, images.length, autoPlayInterval]);

    /**
     * Renders individual slide items
     * @param {Object} param0 - Item data from FlatList
     * @returns {JSX.Element} Slide view with image
     */
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.slide}>
            <Image
                source={item}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );

    // Handle scroll events for pagination animation
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
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

    return (
        <View style={styles.container}>
            {/* Main slideshow FlatList */}
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
            />

            {/* Pagination dots container */}
            <View style={styles.paginationContainer}>
                {images.map((_, index) => {
                    // Calculate animation ranges for pagination dots
                    const inputRange = [
                        (index - 1) * SCREEN_WIDTH,
                        index * SCREEN_WIDTH,
                        (index + 1) * SCREEN_WIDTH,
                    ];

                    // Animate dot width based on scroll position
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 16, 8],
                        extrapolate: 'clamp',
                    });

                    // Animate dot opacity based on scroll position
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    width: dotWidth,
                                    opacity,
                                    backgroundColor: themeColors.primary,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};
