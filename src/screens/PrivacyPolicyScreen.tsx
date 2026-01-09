import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PrivacyPolicyScreenProps {
    onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
    const [focusedItem, setFocusedItem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <View style={{ flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#000000' }}>
            {/* Header */}
            <View className="flex-row items-center px-20 py-8 bg-black z-10">
                <Pressable
                    onPress={onBack}
                    onFocus={() => setFocusedItem('back')}
                    onBlur={() => setFocusedItem(null)}
                    hasTVPreferredFocus={true}
                    className={`flex-row items-center px-6 py-3 rounded-full mr-6 ${focusedItem === 'back' ? 'bg-white/30 scale-105' : 'bg-white/10'}`}
                    style={{
                        borderWidth: 2,
                        borderColor: focusedItem === 'back' ? '#ffffff' : 'transparent',
                    }}
                >
                    <ArrowLeft color={focusedItem === 'back' ? "white" : "rgba(255,255,255,0.7)"} size={24} />
                    <Text className={`ml-3 text-lg font-medium ${focusedItem === 'back' ? 'text-white' : 'text-white/70'}`}>Back</Text>
                </Pressable>
                <Text className="text-white text-3xl font-light tracking-wider">Privacy Policy</Text>
            </View>

            {/* WebView Container */}
            <View className="flex-1 w-full relative">
                <WebView
                    source={{ uri: 'https://prayertv.pages.dev/' }}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    containerStyle={{ backgroundColor: '#000000' }}
                    onLoadEnd={() => setIsLoading(false)}
                    showsVerticalScrollIndicator={true}
                    bounces={false}
                />
                
                {isLoading && (
                    <View className="absolute inset-0 flex bg-black items-center justify-center">
                        <ActivityIndicator size="large" color="#c4a661" />
                    </View>
                )}
            </View>
        </View>
    );
}
