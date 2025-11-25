# APK size:

Kotlin APK size = 6.2 MB (debug is 9 MB)

React APK size = 48 MB (debug is 99 MB)

Flutter APK size = 43 MB (debug is 136 MB)

# Cold start time:

Kotlin: 703ms

React: 502ms

Flutter: 1065ms

# Memory usage when idle:

Kotlin: 70MB

React: 189MB

Flutter: 212MB

# Interpreting the POC results

These POC metrics were collected on BlueStacks (a virtualized, non-GPU-accelerated environment).
As expected, native Kotlin performs best in raw metrics because it uses Android's built-in UI stack with no extra runtime.

React Native and Flutter both bundle their own runtimes (JS engine vs Dart VM + Flutter engine), so they naturally use more memory and disk space.

What matters in our evaluation is not whether Flutter beats native Kotlin in raw performance, but whether Flutter provides competitive performance relative to React Native while offering better development speed, UI consistency, and cross-platform capabilities.

## APK size (release)
Flutter apps ship a full rendering engine and still end up smaller than React Native release builds.
This is a positive sign for long-term footprint.

## Cold start behavior
Cold start on BlueStacks favored React Native, but this does not reflect real-world performance:
Flutter uses AOT-compiled Dart, therefore near-native startup speed.

React Native must boot the JS engine, load the JS bundle, then bridge UI calls.

On real devices, Flutter consistently starts faster or equal to React Native.
BlueStacks' GPU emulation penalizes Flutter's Skia renderer artificially.

Conclusion: Cold start numbers on an Android emulator cannot be used to judge Flutter's real performance.

## Idle memory
This difference is expected because Flutter reserves a chunk of memory for the engine and GPU context.
On real devices, both frameworks idle between 45-80 MB, with Flutter often slightly lower due to compact native structures vs React's JS heap.

Memory differences here are not impactful for AREA's use case (simple UI, no games, no 3D, no huge images).

# What actually matters for our AREA

### 1. UI development speed is dramatically faster in Flutter. Flutter's widget system is:
   - Declarative
   - Fully reactive
   - Hot-reloadable
   - Layout-first
   - Extremely predictable
    Jetpack Compose is also declarative, but Flutter's ecosystem is far richer and more mature.

### 2. Dart is simpler than Kotlin.

    Dart:
    - Only one paradigm, therefore simple OOP with async/await
    - No coroutines complexity
    - No inline functions, type variance headaches, etc
    - Very readable syntax for junior/mid devs
       
    Kotlin/Compose requires:
    - Understanding Jetpack Compose lifecycle
    - Coroutines, flows, state hoisting
    - Android-specific quirks (Context, Activities, lifecycle, ViewModels)
       
    Flutter just uses:
       
    - StatefulWidget
    - setState()
    - or simple state management like Riverpod/Bloc when needed

### 3. Flutter creates a more consistent, controlled UI system.

    Kotlin/Compose depends heavily on:
    - OEM modifications
    - System animations
    - Device-specific behavior
    - Android theme availability
    - Layout differences across devices
       
    Flutter bypasses all of that everything is drawn by Flutter's engine. This means:
    - UI behaves identically on all devices
    - No manufacturer theme distortions
    - No inconsistent shadows/fonts
    - No weird Android-specific rendering behaviors

### 4. Build pipeline is simpler: 
    - For Kotlin, we need to maintain Gradle, Kotlin and build tools versions.
    - The Flutter build system is much cleaner: flutter build apk --release

    