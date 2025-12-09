FROM ghcr.io/cirruslabs/flutter:3.38.4

WORKDIR /app

COPY pubspec.yaml pubspec.lock ./

RUN flutter pub get

COPY . .

RUN flutter pub get --offline

RUN flutter build apk --release

CMD cp /app/build/app/outputs/flutter-apk/app-release.apk /shared/client.apk
