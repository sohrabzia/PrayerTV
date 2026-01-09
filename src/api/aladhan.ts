import axios from 'axios';

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export interface HijriDate {
    day: string;
    month: {
        number: number;
        en: string;
        ar: string;
    };
    year: string;
    designation: {
        abbreviated: string;
        expanded: string;
    };
}

export interface PrayerData {
    timings: PrayerTimes;
    hijri: HijriDate;
}

export const fetchPrayerTimes = async (latitude: number, longitude: number, date: Date = new Date()): Promise<PrayerData> => {
    try {
        const timestamp = Math.floor(date.getTime() / 1000);
        // Method 4: Umm al-Qura University, Makkah
        const method = 4; // This is a good default
        const url = `http://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

        console.log('Fetching prayer times from:', url);
        const response = await axios.get(url);

        if (response.data.code === 200) {
            return {
                timings: response.data.data.timings,
                hijri: response.data.data.date.hijri
            };
        }
        throw new Error('Failed to fetch prayer times');
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        // Return dummy data or throw
        throw error;
    }
};
