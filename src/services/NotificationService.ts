import notifee, { 
  AndroidImportance, 
  AndroidNotificationSetting, 
  TimestampTrigger, 
  TriggerType 
} from '@notifee/react-native';
import { PrayerTimes } from '../api/aladhan';
import { parse, set, addDays, isAfter } from 'date-fns';
import { settingsService } from './SettingsService';

class NotificationService {
  constructor() {
    this.bootstrap();
  }

  async bootstrap() {
    // Create the channel (required for Android)
    await notifee.createChannel({
      id: 'azan',
      name: 'Azan Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'azanaudio', // Needs to be in res/raw/azanaudio.mp3
    });
  }

  async requestPermission() {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= AndroidNotificationSetting.ENABLED) {
      console.log('Permission granted');
      return true;
    }
    return false;
  }

  async scheduleAzans(timings: PrayerTimes) {
    if (!timings) return;

    const settings = await settingsService.getSettings();
    const { isAdhanEnabled } = settings;

    // Clear existing triggers to avoid duplicates
    await notifee.cancelAllNotifications();

    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = new Date();

    for (const name of prayerNames) {
      const timeStr = timings[name];
      if (!timeStr) continue;

      try {
        const [hours, minutes] = timeStr.split(':').map(Number);
        let scheduleDate = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });

        // If the prayer time has already passed today (or is right now), schedule it for tomorrow
        if (!isAfter(scheduleDate, now)) {
          scheduleDate = addDays(scheduleDate, 1);
        }

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: scheduleDate.getTime(),
          alarmManager: {
            allowWhileIdle: true,
          },
        };

        await notifee.createTriggerNotification(
          {
            id: name.toLowerCase(),
            title: 'Azan Time',
            body: `It is time for ${name} prayer`,
            android: {
              channelId: 'azan',
              importance: AndroidImportance.HIGH,
              sound: isAdhanEnabled ? 'azanaudio' : undefined,
              pressAction: {
                id: 'default',
              },
              fullScreenAction: {
                id: 'default',
              },
            },
          },
          trigger
        );
        console.log(`Scheduled ${name} for ${scheduleDate}`);
      } catch (error) {
        console.error(`Error scheduling ${name}:`, error);
      }
    }
  }
}

export const notificationService = new NotificationService();
