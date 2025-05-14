# Quick Guide: Building APK for La Cité Connect

## Local Build (Recommended)

```bash
# 1. Install dependencies
cd mobile
npm install
npx expo install expo-dev-client

# 2. Generate native code
npx expo prebuild --clean

# 3. Build the APK
cd android
./gradlew assembleDebug

# for release version apk
./gradlew assembleRelease

# 4. Find the APK at:
# mobile/android/app/build/outputs/apk/debug/app-debug.apk

# 5. Install on device (if connected via USB)
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## EAS Cloud Build (Alternative)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build APK in the cloud
eas build -p android --profile preview
```

For detailed instructions, see `mobile/README.md`

# 4 Copy and rename
```
find app/build/outputs -name "*.apk" | grep release

cp app/build/outputs/apk/release/app-release.apk ~/LaCiteConnect-release.apk
```