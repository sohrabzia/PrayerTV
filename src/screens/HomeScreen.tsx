import React from 'react';
import { View, Text, ActivityIndicator, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { usePrayerStatus } from '../hooks/usePrayerStatus';
import { useWeather } from '../hooks/useWeather';
import { useAzan } from '../hooks/useAzan';
import { PrayerCard } from '../components/PrayerCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { DigitalClock } from '../components/DigitalClock';
import { PRAYER_NAMES, formatTo12Hour } from '../utils/timeUtils';
import { MapPin, Thermometer, Sunset, Sunrise, Calendar } from 'lucide-react-native';
import { notificationService } from '../services/NotificationService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function HomeScreen() {
    // Hooks
    const [focusedPrayer, setFocusedPrayer] = React.useState<string | null>(null);
    const locationData = useLocation();
    const prayerData = usePrayerTimes(
        locationData.location?.lat ?? null,
        locationData.location?.lng ?? null
    );

    const statusData = usePrayerStatus(prayerData.timings);
    const { cityName } = locationData;
    const { timings, hijri, loading } = prayerData;

    // Schedule Azans when timings are updated
    React.useEffect(() => {
        if (timings) {
            notificationService.requestPermission().then((granted) => {
                if (granted) {
                    notificationService.scheduleAzans(timings);
                }
            });
        }
    }, [timings]);

    const hijriDateString = React.useMemo(() => {
        if (!hijri) return null;
        return `${hijri.day} ${hijri.month.en} ${hijri.year}`;
    }, [hijri]);

    const weatherData = useWeather(
        locationData.location?.lat ?? null, 
        locationData.location?.lng ?? null
    );
    
    // Azan side effect
    const { imminentPrayer } = useAzan(prayerData.timings);

    const displayPrayers = React.useMemo(() => 
        PRAYER_NAMES.filter(p => p !== 'Sunrise'), 
    []);

    const sunsetTime = React.useMemo(() => 
        prayerData.timings?.Maghrib ? formatTo12Hour(prayerData.timings.Maghrib) : '--:--',
    [prayerData.timings?.Maghrib]);

    const sunriseTime = React.useMemo(() => 
        prayerData.timings?.Sunrise ? formatTo12Hour(prayerData.timings.Sunrise) : '--:--',
    [prayerData.timings?.Sunrise]);

    const { nextPrayer, currentPrayer } = statusData;
    const { weather } = weatherData;

    return (
        <ImageBackground
            source={require('../../faislamMasjidbg.jpg')}
            style={{ flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            resizeMode="cover"
        >
            <View
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
            />

            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Prayer Imminent Notification Banner */}
            {imminentPrayer && (
                <View className="absolute top-0 left-0 right-0 z-50 items-center">
                    <View 
                        className="mt-6 flex-row items-center px-8 py-4 bg-emerald-600/95 rounded-2xl shadow-2xl"
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                            elevation: 10,
                        }}
                    >
                        <View className="w-2.5 h-2.5 rounded-full bg-white mr-4 shadow-white" />
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '500',
                                color: '#ffffff',
                                letterSpacing: 0.5,
                            }}
                        >
                            {imminentPrayer} Prayer is approaching in 5 minutes
                        </Text>
                    </View>
                </View>
            )}

            <View className="flex-row justify-between items-start px-12 pt-10 pb-2">
                <View className="items-start">
                    <View className="flex-row items-center bg-white/8 px-4 py-2.5 rounded-full">
                        <MapPin color="rgba(255,255,255,0.7)" size={14} strokeWidth={1.5} />
                        <Text
                            className="ml-2"
                            style={{
                                fontSize: 14,
                                fontWeight: '400',
                                color: 'rgba(255,255,255,0.9)',
                                letterSpacing: 0.3,
                            }}
                        >
                            {cityName ? cityName.split(',')[0] : 'Locating...'}
                        </Text>
                    </View>
                    <Text
                        className="mt-3 ml-1"
                        style={{
                            fontSize: 11,
                            fontWeight: '400',
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.4)',
                        }}
                    >
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Text>
                </View>

                <View className="items-end">
                    <DigitalClock />

                    <View className="flex-row items-center mt-1">
                        {weather && (
                            <View className="flex-row items-center mr-4">
                                <Thermometer size={12} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                                <Text
                                    className="ml-1.5"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: 'rgba(255,255,255,0.6)',
                                    }}
                                >
                                    {weather.temperature}°C
                                </Text>
                            </View>
                        )}

                        {/* Sunrise Timing */}
                        <View className="flex-row items-center bg-white/8 px-3 py-1.5 rounded-full mr-2">
                            <Sunrise size={12} color="rgba(255,255,100,0.8)" strokeWidth={1.5} />
                            <Text
                                className="ml-1.5"
                                style={{
                                    fontSize: 11,
                                    fontWeight: '400',
                                    color: 'rgba(255,255,255,0.7)',
                                }}
                            >
                                {sunriseTime}
                            </Text>
                        </View>

                        {/* Sunset Timing */}
                        <View className="flex-row items-center bg-white/8 px-3 py-1.5 rounded-full">
                            <Sunset size={12} color="rgba(255,200,100,0.8)" strokeWidth={1.5} />
                            <Text
                                className="ml-1.5"
                                style={{
                                    fontSize: 11,
                                    fontWeight: '400',
                                    color: 'rgba(255,255,255,0.7)',
                                }}
                            >
                                {sunsetTime}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="flex-1 justify-center items-center">
                {loading ? (
                    <View className="items-center">
                        <ActivityIndicator size="large" color="rgba(255,255,255,0.4)" />
                        <Text className="mt-4 text-white/30 uppercase tracking-[4px] text-[10px]">Updating timings...</Text>
                    </View>
                ) : (
                    <View className="items-center">
                        <CountdownTimer timings={timings} targetPrayer={focusedPrayer} />
                        
                        {hijriDateString && (
                         <View className="mt-1 px-6 py-1.5 flex-row items-center justify-center">
  <Calendar
    size={14}
    color="#FFFFFF80"
    strokeWidth={2}
    style={{ marginRight: 15 }} // mr-6 = 24px
/>


    <Text
        style={{
            fontSize: 16,
            fontWeight: '400',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: 7,
            textTransform: 'uppercase',
        }}
    >
        {hijriDateString}
    </Text>
</View>

                        )}
                    </View>
                )}
            </View>

            <View className="px-10 pb-10 w-full">
                <View className="flex-row justify-between w-full">
                    {timings && displayPrayers.map((prayer) => (
                        <PrayerCard
                            key={prayer}
                            name={prayer}
                            time={timings[prayer]}
                            isNext={prayer === nextPrayer}
                            isCurrent={prayer === currentPrayer}
                            hasPreferredFocus={prayer === nextPrayer}
                            onFocusChange={(name, focused) => {
                                if (focused) setFocusedPrayer(name);
                                else if (focusedPrayer === name) setFocusedPrayer(null);
                            }}
                        />
                    ))}
                </View>
            </View>

            <View className="absolute bottom-2 w-full items-center">
                <Text
                    style={{
                        fontSize: 9,
                        fontWeight: '300',
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.25)',
                    }}
                >
                    Designed & Developed by Soharab 
                </Text>
            </View>
        </ImageBackground>
    );
}
