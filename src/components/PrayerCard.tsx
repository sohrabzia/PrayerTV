import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sun, Moon, CloudSun, Sunrise, Sunset, Star, LucideIcon } from 'lucide-react-native';
import { formatTo12Hour } from '../utils/timeUtils';

interface PrayerCardProps {
    name: string;
    time: string;
    secondaryName?: string;
    secondaryTime?: string;
    isNext: boolean;
    isCurrent: boolean;
    hasPreferredFocus?: boolean;
    onFocusChange?: (name: string, focused: boolean) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
    Fajr: Moon,
    Sunrise: Sunrise,
    Dhuhr: Sun,
    Asr: CloudSun,
    Maghrib: Sunset,
    Isha: Star,
};

function PrayerCardComponent({
    name,
    time,
    secondaryName,
    secondaryTime,
    isNext,
    isCurrent,
    hasPreferredFocus = false,
    onFocusChange,
}: PrayerCardProps) {
    const [isFocused, setIsFocused] = React.useState(false);
    const Icon = ICON_MAP[name] || Sun;
    const isActive = isCurrent || isNext;

    // Convert to 12-hour format
    const displayTime = formatTo12Hour(time);

    const handleFocus = () => {
        setIsFocused(true);
        onFocusChange?.(name, true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        onFocusChange?.(name, false);
    };

    return (
        <Pressable
            focusable={true}
            hasTVPreferredFocus={hasPreferredFocus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPress={() => {}}
            className={`
                flex-1 mx-1.5 rounded-2xl justify-center py-4 px-2 items-center
                ${isFocused ? 'bg-white/20' : isCurrent ? 'bg-emerald-500/10' : isActive ? 'bg-white/12' : 'bg-white/8'}
            `}
            style={{
                minHeight: 140,
                borderWidth: isFocused ? 1 : isNext ? 1 : isCurrent ? 1 : 0,
                borderColor: isFocused ? '#ffffff' : isNext ? 'rgba(255,255,255,0.2)' : isCurrent ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                transform: [{ scale: isFocused ? 1 : 1 }],
            }}
        >
            <View className="mb-4">
                <Icon
                    size={isFocused ? 40 : 24}
                    color={isFocused || isActive ? "#ffffff" : "rgba(255,255,255,0.5)"}
                    strokeWidth={1.5}
                />
            </View>

            <View className="items-center">
                <Text
                    className="mb-2"
                    style={{
                        fontSize: isFocused ? 12 : 11,
                        fontWeight: '600',
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: isFocused || isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)',
                    }}
                >
                    {name}
                </Text>

                <Text
                    style={{
                        fontSize: isFocused ? 24 : 22,
                        fontWeight: isFocused ? '400' : '300',
                        letterSpacing: 0,
                        color: isFocused || isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    }}
                >
                    {displayTime}
                </Text>
            </View>

            {(isNext || isCurrent) && (
                <View className="absolute bottom-3 items-center">
                    <View
                        style={{
                            height: 3,
                            width: isFocused ? 30 : 20,
                            borderRadius: 1.5,
                            backgroundColor: isCurrent ? '#4ade80' : 'rgba(255,255,255,0.4)',
                        }}
                    />
                </View>
            )}
        </Pressable>
    );
}

export const PrayerCard = React.memo(PrayerCardComponent);
