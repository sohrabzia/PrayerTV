import { useState, useEffect } from 'react';
import { getNextPrayer, formatDuration } from '../utils/timeUtils';
import { PrayerTimes } from '../api/aladhan';

export const useCountdown = (timings: PrayerTimes | null) => {
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState('--:--:--');
    const [isNearPrayer, setIsNearPrayer] = useState(false);

    useEffect(() => {
        if (!timings) return;

        const update = () => {
            const { nextPrayer: next, currentPrayer: current, timeRemainingMs } = getNextPrayer(timings);
            setNextPrayer(next);
            setCurrentPrayer(current);
            setTimeRemaining(formatDuration(timeRemainingMs));
            setIsNearPrayer(timeRemainingMs > 0 && timeRemainingMs <= 15 * 60 * 1000);
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [timings]);

    return { nextPrayer, currentPrayer, timeRemaining, isNearPrayer };
};
