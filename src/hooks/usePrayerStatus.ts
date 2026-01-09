import { useState, useEffect } from 'react';
import { getNextPrayer } from '../utils/timeUtils';
import { PrayerTimes } from '../api/aladhan';

export const usePrayerStatus = (timings: PrayerTimes | null) => {
    const [status, setStatus] = useState({
        nextPrayer: null as string | null,
        currentPrayer: null as string | null,
    });

    useEffect(() => {
        if (!timings) return;

        const update = () => {
            const { nextPrayer, currentPrayer } = getNextPrayer(timings);
            setStatus({ nextPrayer, currentPrayer });
        };

        update();
        // Update every minute to keep current/next prayer accurate
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [timings]);

    return status;
};
