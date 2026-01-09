import { PrayerTimes } from '../api/aladhan';

export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const parseTime = (timeStr: string): Date => {
    const d = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    d.setHours(hours, minutes, 0, 0);
    return d;
};

/**
 * Convert 24-hour time string (HH:MM) to 12-hour format with AM/PM
 */
export const formatTo12Hour = (timeStr: string): string => {
    if (!timeStr || timeStr === '--:--') return timeStr;

    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr.substring(0, 2); // Remove any timezone info

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes} ${period}`;
};

export const getNextPrayer = (timings: PrayerTimes) => {
    const now = new Date();
    let nextPrayer = null;
    let nextPrayerTime = null;
    let currentPrayer = null;

    // Check today's prayers
    for (let i = 0; i < PRAYER_NAMES.length; i++) {
        const prayer = PRAYER_NAMES[i];
        const timeStr = timings[prayer];
        const time = parseTime(timeStr);

        if (time > now) {
            nextPrayer = prayer;
            nextPrayerTime = time;
            currentPrayer = i > 0 ? PRAYER_NAMES[i - 1] : 'Isha'; // Logic for 'Isha' of prev day not handled perfectly here but ok for display
            break;
        }
    }

    // If no next prayer found today, it's Fajr tomorrow
    if (!nextPrayer) {
        nextPrayer = 'Fajr';
        const timeStr = timings['Fajr'];
        const time = parseTime(timeStr);
        time.setDate(time.getDate() + 1);
        nextPrayerTime = time;
        currentPrayer = 'Isha';
    }

    const diffMs = nextPrayerTime!.getTime() - now.getTime();
    const isTomorrow = nextPrayerTime!.getDate() !== now.getDate();

    return {
        nextPrayer,
        nextPrayerTime,
        currentPrayer,
        timeRemainingMs: diffMs,
        isTomorrow
    };
};

export const formatDuration = (ms: number): string => {
    if (ms < 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const getPrayerTiming = (timings: PrayerTimes, prayerName: string) => {
    const now = new Date();
    const timeStr = timings[prayerName];
    if (!timeStr) return { timeRemainingMs: 0, isTomorrow: false };

    let targetTime = parseTime(timeStr);
    let isTomorrow = false;

    // If the prayer time has already passed today, assume it's for tomorrow
    if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
        isTomorrow = true;
    }

    return {
        timeRemainingMs: targetTime.getTime() - now.getTime(),
        isTomorrow
    };
};
