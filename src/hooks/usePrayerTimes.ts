import { useState, useEffect } from 'react';
import { fetchPrayerTimes, PrayerTimes, HijriDate } from '../api/aladhan';

export const usePrayerTimes = (latitude: number | null, longitude: number | null) => {
    const [timings, setTimings] = useState<PrayerTimes | null>(null);
    const [hijri, setHijri] = useState<HijriDate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchPrayerTimes(latitude, longitude);
                setTimings(data.timings);
                setHijri(data.hijri);
                setError(null);
            } catch (err) {
                setError('Failed to load prayer times');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [latitude, longitude]);

    return { timings, hijri, loading, error };
};
