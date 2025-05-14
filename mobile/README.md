# Building an APK for La Cité Connect

This guide provides step-by-step instructions for building an Android APK from the La Cité Connect React Native application.

## Prerequisites

- Node.js (v16 or newer)
- JDK 11 or newer
- Android Studio with Android SDK installed
- Android SDK Build-Tools, Platform Tools, and Platform SDK
- A physical Android device (optional, for testing)

## Setup Environment

1. Ensure your environment variables are set correctly:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

## Building the APK

### Step 1: Install Dependencies

```bash
# Navigate to the mobile folder
cd mobile

# Install dependencies
npm install

# Install Expo Dev Client
npx expo install expo-dev-client

# Install EAS CLI (optional, for Expo Application Services builds)
npm install -g eas-cli
```

### Step 2: Generate Native Code

```bash
# Generate native Android code from the Expo project
npx expo prebuild
```

### Step 3: Build Debug APK

```bash
# Navigate to the Android folder
cd android

# Build the APK using Gradle
./gradlew assembleDebug
```

The APK will be generated at:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Build Release APK (Optional)

To build a release version (optimized, signed APK):

1. Generate a signing key if you don't have one:
```bash
keytool -genkey -v -keystore laciteconnect.keystore -alias laciteconnect -keyalg RSA -keysize 2048 -validity 10000
```

2. Create a `keystore.properties` file in the `android` directory:
```
storeFile=path/to/laciteconnect.keystore
storePassword=your-store-password
keyAlias=laciteconnect
keyPassword=your-key-password
```

3. Build the release APK:
```bash
./gradlew assembleRelease
```

The release APK will be at:
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

## Installing the APK on a Device

### Using ADB

1. Connect your Android device via USB and enable USB debugging
2. Verify the device is detected:
```bash
adb devices
```
3. Install the APK:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Alternative Methods

1. Transfer the APK file to your device using email, cloud storage, or USB transfer
2. On your device, navigate to the APK file and tap to install
3. You may need to enable "Install from Unknown Sources" in your device settings

## Using EAS Build (Alternative Method)

If you prefer using Expo's cloud build services:

1. Configure your `eas.json` file (already done):
```json
{
  "cli": {
    "version": ">= 3.13.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

2. Login to your Expo account:
```bash
eas login
```

3. Build the APK in the cloud:
```bash
eas build -p android --profile preview
```

4. Follow the link provided to download the APK once it's built

## Troubleshooting

- **Build Failures**: Make sure your Android SDK, build tools, and Node.js are up to date
- **Device Compatibility**: The minimum Android SDK version is set in `android/app/build.gradle`
- **APK Installation Issues**: Enable "Install from Unknown Sources" on your device
- **Missing Dependencies**: If you get errors about missing dependencies, run `npm install` and then `npx expo prebuild` again

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Developers Guide](https://developer.android.com/guide)