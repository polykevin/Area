# How to run the POC on Bluestacks (have not tested on a phone):

- Enable ADB in Bluestacks Settings
- adb devices
- adb connect 127.0.0.1:5555

# KotlinPOC:

- cd POCmobile/KotlinPOC
- ./gradlew clean
- ./gradlew installDebug
- adb shell am start -n com.example.kotlinpoc/.MainActivity

# ReactNativeLoginPOC:

- npm install (for dependencies)
- cd POCmobile/ReactNativeLoginPOC/android
- echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
- terminal 1: npx react-native start
- terminal 2: npx react-native run-android --device 127.0.0.1:5555

# flutterloginpoc:

- cd POCmobile/flutterloginpoc
- flutter pub get
- flutter run -d 127.0.0.1:5555

email: test@area.com, password: 123456 => login success!