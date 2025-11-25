FROM cirrusci/flutter:latest

WORKDIR /app

COPY . .

RUN flutter pub get

RUN flutter build apk --release

CMD cp /app/build/app/outputs/flutter-apk/app-release.apk /shared/client.apk
