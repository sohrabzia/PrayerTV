import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { getNextPrayer, formatDuration, getPrayerTiming } from '../utils/timeUtils';
import { PrayerTimes } from '../api/aladhan';

interface CountdownTimerProps {
    timings: PrayerTimes | null;
    targetPrayer?: string | null;
}

const CountdownTimerComponent: React.FC<CountdownTimerProps> = ({ timings, targetPrayer }) => {
    const [displayData, setDisplayData] = useState({
        label: '',
        timeRemaining: '--:--:--',
        isNear: false,
        isTomorrow: false
    });

    useEffect(() => {
        if (!timings) return;

        const update = () => {
            let prayerToUse = targetPrayer;
            let timeMs = 0;
            let isTomorrow = false;
            
            if (prayerToUse) {
                const result = getPrayerTiming(timings, prayerToUse);
                timeMs = result.timeRemainingMs;
                isTomorrow = result.isTomorrow;
            } else {
                const result = getNextPrayer(timings);
                prayerToUse = result.nextPrayer;
                timeMs = result.timeRemainingMs;
                isTomorrow = result.isTomorrow;
            }

            const isNear = timeMs > 0 && timeMs <= 15 * 60 * 1000;
            
            setDisplayData({
                label: prayerToUse || '',
                timeRemaining: formatDuration(timeMs),
                isNear,
                isTomorrow
            });
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [timings, targetPrayer]);

    if (!timings) return null;

    return (
        <View className="items-center">
            {/* Label */}
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: '500',
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: displayData.isNear ? '#fcd34d' : 'rgba(255,255,255,0.5)',
                    marginBottom: 5,
                }}
            >
                {displayData.label ? (
                    displayData.isTomorrow 
                        ? `Tomorrow: ${displayData.label}` 
                        : `${displayData.isNear ? 'Approaching' : 'Until'} ${displayData.label}`
                ) : 'Prayer Times'}
            </Text>

            {/* The centerpiece - Countdown */}
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                    fontSize: 90,
                    fontWeight: '100',
                    letterSpacing: 4,
                    color: displayData.isNear ? '#feedaf' : '#ffffff',
                    textShadowColor: displayData.isNear ? 'rgba(252, 211, 77, 0.4)' : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: displayData.isNear ? 20 : 0,
                }}
            >
                {displayData.timeRemaining}
            </Text>
        </View>
    );
};

export const CountdownTimer = React.memo(CountdownTimerComponent);
