import { useEffect, useRef, useState } from 'react';
import Sound from 'react-native-sound';
import { PrayerTimes } from '../api/aladhan';
import { parseTime, PRAYER_NAMES } from '../utils/timeUtils';

// Enable playback in silence mode
Sound.setCategory('Playback');

// Main prayer times to play Azan for (excluding Sunrise)
const AZAN_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const useAzan = (timings: PrayerTimes | null) => {
    const playedRef = useRef<Set<string>>(new Set());
    const notifiedRef = useRef<Set<string>>(new Set());
    const soundRef = useRef<Sound | null>(null);
    const [imminentPrayer, setImminentPrayer] = useState<string | null>(null);

    useEffect(() => {
        // Reset refs at midnight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - now.getTime();

        const midnightTimeout = setTimeout(() => {
            playedRef.current.clear();
            notifiedRef.current.clear();
        }, timeUntilMidnight);

        return () => clearTimeout(midnightTimeout);
    }, []);

    useEffect(() => {
        if (!timings) return;

        const checkAndPlayAzan = () => {
            const now = new Date();
            const currentMinute = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            let foundImminent = null;

            for (const prayer of AZAN_PRAYERS) {
                const prayerTimeStr = timings[prayer];
                if (!prayerTimeStr) continue;

                const prayerTime = parseTime(prayerTimeStr);
                const diffMins = Math.floor((prayerTime.getTime() - now.getTime()) / 60000);
                const todayKey = `${prayer}-${now.toDateString()}`;

                // Notification - 5 minutes before
                if (diffMins === 5 && !notifiedRef.current.has(todayKey)) {
                    foundImminent = prayer;
                    // Auto-clear notification after some time or just keep it for the minute
                }

                // Azan - Exactly at prayer time
                const prayerMinute = prayerTimeStr.substring(0, 5);
                if (currentMinute === prayerMinute && !playedRef.current.has(todayKey)) {
                    playedRef.current.add(todayKey);
                    playAzan();
                    break;
                }
            }
            
            setImminentPrayer(foundImminent);
        };

        const playAzan = () => {
            // Stop any currently playing sound
            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.release();
            }

            // Load and play the azan audio from the app bundle
            const sound = new Sound('azanaudio.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('Failed to load azan audio:', error);
                    return;
                }

                sound.setVolume(1.0);
                sound.play((success) => {
                    if (!success) {
                        console.log('Azan playback failed');
                    }
                    sound.release();
                });
            });

            soundRef.current = sound;
        };

        // Check immediately
        checkAndPlayAzan();

        // Check every second
        const interval = setInterval(checkAndPlayAzan, 1000);

        return () => {
            clearInterval(interval);
            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.release();
            }
        };
    }, [timings]);

    // Return a function to manually trigger azan (for testing)
    const triggerAzan = () => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.release();
        }

        const sound = new Sound('azanaudio.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load azan audio:', error);
                return;
            }

            sound.setVolume(1.0);
            sound.play(() => sound.release());
        });

        soundRef.current = sound;
    };

    return { triggerAzan, imminentPrayer };
};
