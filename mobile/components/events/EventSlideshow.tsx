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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EventSlideshowProps {
    images: any[]; // Changed to any[] to accept require() images
    autoPlayInterval?: number;
}

export const EventSlideshow: React.FC<EventSlideshowProps> = ({
    images,
    autoPlayInterval = 5000,
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventSlideshowStyles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < images.length - 1) {
                flatListRef.current?.scrollToIndex({
                    index: currentIndex + 1,
                    animated: true,
                });
            } else {
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                });
            }
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [currentIndex, images.length, autoPlayInterval]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.slide}>
            <Image
                source={item}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View style={styles.container}>
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
            <View style={styles.paginationContainer}>
                {images.map((_, index) => {
                    const inputRange = [
                        (index - 1) * SCREEN_WIDTH,
                        index * SCREEN_WIDTH,
                        (index + 1) * SCREEN_WIDTH,
                    ];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 16, 8],
                        extrapolate: 'clamp',
                    });

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
