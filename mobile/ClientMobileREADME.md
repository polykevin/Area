# client_mobile (how to run)

- i installed flutter and android-platform-tools
- change ip address in api_client.dart to the local one
- connect to the android device with adb connect localhost:5555 (at least for my emulator)
- flutter pub get (for installing dependencies)
- flutter run -d localhost:5555 (to install the apk and run it)

# TO DO:

- integrate with the backend (not ready yet)
- make the design in figma
- integrate with docker