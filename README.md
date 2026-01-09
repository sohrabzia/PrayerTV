# PrayerTV 🕋

A premium, minimalist Prayer Times application specifically designed for **Android TV** and **Google TV**. Built with React Native, this app provides a serene and distraction-free experience for monitoring prayer timings in a communal or home setting.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Android%20TV%20%7C%20Google%20TV-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76.5-61dafb.svg)

## ✨ Features

- **📺 TV Optimized UI**: Designed from the ground up for large screens with focusable elements and high-contrast typography.
- **🕌 Beautiful Aesthetics**: Features a stunning high-definition background of the Faisal Masjid, providing a spiritual ambiance.
- **🕒 Real-time Countdown**: A precise countdown timer to the next prayer service.
- **📅 Dual Calendar**: Displays both Gregorian and Hijri dates (fetched directly from reliable sources).
- **🕋 Accurate Timings**: Integrates with the Aladhan API to provide highly accurate prayer times based on your location.
- **🔇 Minimalist Design**: No clutter, no ads, no complex menus—just the information you need, elegantly presented.
- **🎵 Athan Integration**: High-quality audio support for prayer calls.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **API**: [Aladhan API](https://aladhan.com/prayer-times-api)

## 📸 Preview

_The application features a dark, semi-transparent overlay on a masjid background, with golden accents for the current prayer and clean white typography for the schedule._

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Android Studio & SDK
- React Native Development Environment

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sohrabzia/PrayerTV.git
   cd PrayerTV
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run on Emulator/Device**:
   ```bash
   npx react-native run-android
   ```

## 🏗️ Project Structure

- `src/api`: API integration and data fetching logic.
- `src/components`: Reusable UI components (PrayerCards, Countdown, etc.).
- `src/hooks`: Custom React hooks for prayer time logic and countdowns.
- `src/screens`: Main application screens (Home).
- `assets`: Image and audio resources.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by **Soharab Zia**
