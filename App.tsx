import React from 'react';
import { LogBox } from 'react-native';
import './global.css';
import { HomeScreen } from './src/screens/HomeScreen';

// Disable warning alerts on screen
LogBox.ignoreAllLogs();

const App = (): React.JSX.Element => {
  return <HomeScreen />;
};

export default App;
