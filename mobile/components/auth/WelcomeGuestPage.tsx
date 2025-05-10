import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuestTabParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';
import { HomeContent } from '../home/HomeContent';

type WelcomeGuestPageProps = {
    navigation: NativeStackNavigationProp<GuestTabParamList, 'Home'>;
};

export const WelcomeGuestPage = ({ navigation }: WelcomeGuestPageProps) => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={welcomeStyles.safeArea}>
            <HomeContent />
        </SafeAreaView>
    );
};