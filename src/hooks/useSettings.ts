import { useState, useEffect } from 'react';
import { settingsService, AppSettings } from '../services/SettingsService';

export const useSettings = () => {
    const [settings, setSettings] = useState<AppSettings | null>(null);

    const refreshSettings = async () => {
        const s = await settingsService.getSettings();
        setSettings(s);
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return { settings, refreshSettings };
};
