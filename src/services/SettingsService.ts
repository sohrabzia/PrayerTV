import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@prayer_tv_settings';

export interface AppSettings {
    isAdhanEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    isAdhanEnabled: true,
};

// In-memory fallback if AsyncStorage is not linked/available
let inMemorySettings: AppSettings | null = null;

const isStorageAvailable = () => {
    try {
        return !!AsyncStorage && typeof AsyncStorage.getItem === 'function';
    } catch {
        return false;
    }
};

export const settingsService = {
    async getSettings(): Promise<AppSettings> {
        if (!isStorageAvailable()) {
            return inMemorySettings || DEFAULT_SETTINGS;
        }

        try {
            const data = await AsyncStorage.getItem(SETTINGS_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error reading settings:', error);
        }
        return DEFAULT_SETTINGS;
    },

    async saveSettings(settings: AppSettings): Promise<void> {
        inMemorySettings = settings;
        
        if (!isStorageAvailable()) {
            return;
        }

        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    },

    async toggleAdhan(): Promise<AppSettings> {
        const settings = await this.getSettings();
        const newSettings = { ...settings, isAdhanEnabled: !settings.isAdhanEnabled };
        await this.saveSettings(newSettings);
        return newSettings;
    }
};
