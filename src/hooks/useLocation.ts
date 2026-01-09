import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

export const useLocation = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [cityName, setCityName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getLocation = async () => {
            console.log('Starting location detection...');

            // 1. Try IP Geolocation services (most reliable for TV)
            const ipServices = [
                {
                    url: 'http://ip-api.com/json',
                    parse: (data: any) => ({
                        lat: data.lat,
                        lng: data.lon,
                        city: `${data.city}, ${data.country}`,
                        success: data.status === 'success'
                    })
                },
                {
                    url: 'https://ipapi.co/json/',
                    parse: (data: any) => ({
                        lat: data.latitude,
                        lng: data.longitude,
                        city: `${data.city}, ${data.country_name}`,
                        success: !!data.latitude
                    })
                }
            ];

            for (const service of ipServices) {
                try {
                    console.log(`Trying IP geolocation: ${service.url}`);
                    const res = await axios.get(service.url, { timeout: 10000 });
                    const parsed = service.parse(res.data);

                    if (parsed.success && parsed.lat && parsed.lng) {
                        setLocation({ lat: parsed.lat, lng: parsed.lng });
                        setCityName(parsed.city);
                        console.log('Location found via IP:', parsed.city);
                        return;
                    }
                } catch (e) {
                    console.warn(`IP service ${service.url} failed:`, e);
                }
            }

            // 2. Fallback to GPS (less reliable on TV but worth trying)
            if (Platform.OS === 'android') {
                try {
                    console.log('Trying GPS fallback...');
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        Geolocation.getCurrentPosition(
                            position => {
                                console.log('GPS location found');
                                setLocation({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                });
                                setCityName('My Location');
                            },
                            gpsError => {
                                console.log('GPS Error:', gpsError.code, gpsError.message);
                                setDefaultLocation();
                            },
                            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                        );
                        return;
                    }
                } catch (err) {
                    console.warn('GPS permission error:', err);
                }
            }

            // 3. Ultimate fallback
            setDefaultLocation();
        };

        const setDefaultLocation = () => {
            console.log('Using default location (Makkah)');
            setLocation({ lat: 21.4225, lng: 39.8262 });
            setCityName('Makkah (Default)');
            setError('Could not detect location. Using Makkah as default.');
        };

        getLocation();
    }, []);

    return { location, cityName, error };
};
