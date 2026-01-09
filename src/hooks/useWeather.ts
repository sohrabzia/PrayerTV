
import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
    temperature: number;
    condition: string; // Simplification, mapping code to string
    weatherCode: number;
}

export const useWeather = (latitude: number | null, longitude: number | null) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const getWeatherDescription = (code: number): string => {
        // WMO Weather interpretation codes (WW)
        if (code === 0) return 'Clear sky';
        if (code >= 1 && code <= 3) return 'Partly cloudy';
        if (code >= 45 && code <= 48) return 'Fog';
        if (code >= 51 && code <= 55) return 'Drizzle';
        if (code >= 61 && code <= 65) return 'Rain';
        if (code >= 71 && code <= 75) return 'Snow';
        if (code >= 80 && code <= 82) return 'Rain showers';
        if (code >= 95 && code <= 99) return 'Thunderstorm';
        return 'Unknown'; // Default
    };

    useEffect(() => {
        if (!latitude || !longitude) return;

        const fetchWeather = async () => {
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
                );
                const current = response.data.current_weather;
                setWeather({
                    temperature: current.temperature,
                    weatherCode: current.weathercode,
                    condition: getWeatherDescription(current.weathercode),
                });
            } catch (error) {
                console.error('Weather fetch error:', error);
            }
        };

        fetchWeather();
        // Refresh weather every 30 mins
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [latitude, longitude]);

    return { weather };
};
