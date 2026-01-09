import React from 'react';
import { View, LogBox } from 'react-native';
import './global.css';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';

// Disable warning alerts on screen
LogBox.ignoreAllLogs();

const App = (): React.JSX.Element => {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'settings' | 'privacy'>('home');

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Home Screen - Always mounted but hidden when not active to preserve state */}
      <View style={{ flex: 1, display: currentScreen === 'home' ? 'flex' : 'none' }}>
        <HomeScreen onOpenSettings={() => setCurrentScreen('settings')} />
      </View>

      {/* Settings Screen - Mounted only when active */}
      {currentScreen === 'settings' && (
        <SettingsScreen 
          onBack={() => setCurrentScreen('home')} 
          onOpenPrivacyPolicy={() => setCurrentScreen('privacy')}
        />
      )}

      {/* Privacy Policy Screen - Mounted only when active */}
      {currentScreen === 'privacy' && (
        <PrivacyPolicyScreen onBack={() => setCurrentScreen('settings')} />
      )}
    </View>
  );
};

export default App;
