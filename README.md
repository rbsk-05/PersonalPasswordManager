# Personal Password Manager

A secure, local-only password manager built with React Native (Expo) for personal use.

## Features

- 🔐 **PIN-based Security**: Set a personal PIN to access the app
- 🔒 **AES Encryption**: All passwords are encrypted using AES encryption
- 📱 **Simple Interface**: Clean, modern dark-themed UI
- 💾 **Local Storage**: All data stored locally on your device
- 📋 **Quick Copy**: One-tap password copying to clipboard
- ⚙️ **PIN Management**: Change your app PIN anytime

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rbsk-05/PersonalPasswordManager.git
cd PersonalPasswordManager
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npx expo start
```

## Usage

### First Launch
- Set your 4-6 digit PIN when prompted
- Confirm the PIN

### Adding Passwords
1. Navigate to the "Profile" tab
2. Fill in the service name, username, and password
3. Tap "Add Password"

### Viewing Passwords
- All saved passwords appear on the "Passwords" tab
- Tap "Copy" to copy a password to clipboard
- Tap "Delete" to remove a password entry

### Changing PIN
1. Go to the "Profile" tab
2. Enter your new PIN twice
3. Tap "Change PIN"

## Security

- PIN is stored securely using `expo-secure-store`
- Passwords are encrypted with AES using the PIN as the key
- All data is stored locally on your device
- No internet connection required

## Tech Stack

- **React Native** (Expo)
- **TypeScript**
- **React Navigation** (Stack & Bottom Tabs)
- **expo-secure-store** (PIN storage)
- **AsyncStorage** (Encrypted password storage)
- **crypto-js** (AES encryption)

## Warning

⚠️ **Important**: If you forget your PIN, you will lose access to all stored passwords. There is no recovery mechanism. Consider backing up your data regularly.

## License

This is a personal project for individual use.
