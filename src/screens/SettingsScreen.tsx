import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Linking, Switch, ImageBackground, Dimensions, ViewStyle } from 'react-native';
import { Github, Shield, ArrowLeft, Volume2, VolumeX } from 'lucide-react-native';
import { settingsService, AppSettings } from '../services/SettingsService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Separate background component to prevent re-renders on focus changes to improve performance
const BackgroundLayer = React.memo(() => (
    <View style={{ position: 'absolute', top: 0, left: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
        <ImageBackground
            source={require('../../faislamMasjidbg.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)' }}
            />
        </ImageBackground>
    </View>
));

interface SettingsScreenProps {
    onBack: () => void;
    onOpenPrivacyPolicy: () => void;
}

export function SettingsScreen({ onBack, onOpenPrivacyPolicy }: SettingsScreenProps) {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [focusedItem, setFocusedItem] = useState<string | null>(null);

    React.useEffect(() => {
        settingsService.getSettings().then(setSettings);
    }, []);

    const toggleAdhan = useCallback(async () => {
        const newSettings = await settingsService.toggleAdhan();
        setSettings(newSettings);
    }, []);

    const openLink = useCallback((url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }, []);

    if (!settings) return null;

    // Dynamic focus styles
    const getFocusStyle = (itemId: string): ViewStyle => {
        const isFocused = focusedItem === itemId;
        return {
            transform: [{ scale: isFocused ? 1.02 : 1 }],
            borderColor: isFocused ? '#ffffff' : 'rgba(255,255,255,0.1)',
            backgroundColor: isFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
            borderWidth: isFocused ? 2 : 1,
            elevation: isFocused ? 10 : 0,
            // Android TV shadow simulation
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isFocused ? 0.3 : 0,
            shadowRadius: 4.65,
        };
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <BackgroundLayer />

            <View className="flex-1 px-20 py-16">
                {/* Header Actions */}
                <View className="flex-row items-center mb-12">
                    <Pressable
                        onPress={onBack}
                        onFocus={() => setFocusedItem('back')}
                        onBlur={() => setFocusedItem(null)} // Optional cleanup
                        focusable={true}
                        hasTVPreferredFocus={true}
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                borderRadius: 9999,
                                marginRight: 24,
                                borderWidth: 2,
                            },
                            focusedItem === 'back' ? {
                                borderColor: '#ffffff',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                transform: [{ scale: 1.05 }]
                            } : {
                                borderColor: 'transparent',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        ]}
                    >
                        <ArrowLeft color={focusedItem === 'back' ? "white" : "rgba(255,255,255,0.7)"} size={24} />
                        <Text className={`ml-3 text-lg font-medium ${focusedItem === 'back' ? 'text-white' : 'text-white/70'}`}>Back</Text>
                    </Pressable>
                    <Text className="text-white text-4xl font-light tracking-wider">Settings</Text>
                </View>

                {/* Settings Content */}
                <View className="flex-1 space-y-8">
                    {/* Adhan Toggle */}
                    <Pressable
                        onPress={toggleAdhan}
                        onFocus={() => setFocusedItem('adhan')}
                        focusable={true}
                        style={[
                            { 
                                padding: 32, 
                                borderRadius: 24, 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                            },
                            getFocusStyle('adhan')
                        ]}
                    >
                        <View className="flex-row items-center">
                            <View className={`p-4 rounded-2xl mr-6 ${settings.isAdhanEnabled ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {settings.isAdhanEnabled ? (
                                    <Volume2 color="#10b981" size={28} />
                                ) : (
                                    <VolumeX color="#ef4444" size={28} />
                                )}
                            </View>
                            <View>
                                <Text className="text-white text-2xl font-medium mb-1">Adhan Sound</Text>
                                <Text className="text-white/40 text-lg">
                                    {settings.isAdhanEnabled ? 'Playing sound at prayer times' : 'Sound is muted'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.isAdhanEnabled}
                            onValueChange={toggleAdhan}
                            trackColor={{ false: '#3f3f46', true: '#10b981' }}
                            thumbColor={settings.isAdhanEnabled ? '#fff' : '#a1a1aa'}
                            focusable={false} // Switch itself shouldn't be focusable on TV, parent Pressable handles it
                        />
                    </Pressable>

                    {/* Links Row */}
                    <View className="flex-row space-x-8 mt-6">
                        {/* GitHub Link */}
                        <Pressable
                            onPress={() => openLink('https://github.com/sohrabzia/PrayerTV')}
                            onFocus={() => setFocusedItem('github')}
                            focusable={true}
                            style={[
                                getFocusStyle('github'),
                                { flex: 1, padding: 32, borderRadius: 24, flexDirection: 'row', alignItems: 'center' }
                            ]}
                        >
                            <View className="bg-white/10 p-4 rounded-2xl mr-6">
                                <Github color="white" size={28} />
                            </View>
                            <View>
                                <Text className="text-white text-2xl font-medium mb-1">Source Code</Text>
                                <Text className="text-white/40 text-lg">View on GitHub</Text>
                            </View>
                        </Pressable>

                        {/* Privacy Policy Link */}
                        <Pressable
                            onPress={onOpenPrivacyPolicy}
                            onFocus={() => setFocusedItem('privacy')}
                            focusable={true}
                            style={[
                                getFocusStyle('privacy'),
                                { flex: 1, padding: 32, borderRadius: 24, flexDirection: 'row', alignItems: 'center' }
                            ]}
                        >
                            <View className="bg-white/10 p-4 rounded-2xl mr-6">
                                <Shield color="white" size={28} />
                            </View>
                            <View>
                                <Text className="text-white text-2xl font-medium mb-1">Privacy Policy</Text>
                                <Text className="text-white/40 text-lg">Read our policy</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/* Footer */}
                <View className="items-center mt-auto pt-8">
                    <Text className="text-white/20 text-sm tracking-[0.2em] uppercase">
                        Made by Soharab
                    </Text>
                </View>
            </View>
        </View>
    );
}
