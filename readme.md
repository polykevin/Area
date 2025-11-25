#  AREA – Action ↔ REAction  
Automation platform inspired by IFTTT / Zapier

##  Introduction

AREA is a web and mobile app that aims to build a platform that connects multiple online services (Google, Outlook, GitHub, Dropbox, etc.) using a system of **Actions** and **REActions**.  
A user can configure automated workflows called **AREA**:

> **When** an *Action* happens  
> **Then** execute a *REAction*

AREA workflows are triggered automatically through a **hook system**.

---

## Usage

The project uses Docker Compose with the following services:

- **server**: Runs the backend on port 8080.
- **client_mobile**: Builds the Flutter APK and writes it to the shared volume.
- **client_web**: Serves the web interface on port 8081.
- **db**: PostgreSQL database service.

Start all services:

```bash
docker compose up --build
```

Access URLs:

- Server: `http://localhost:8080`
- Web client: `http://localhost:8081`
- Mobile APK: `http://localhost:8081/client.apk`


---

## Architecture

The project includes:

- **Backend**: TypeScript + Express server, handles actions, reactions, and workflows
- **Mobile Client**: Flutter Android app
- **Web Client**: React/Next.js or similar frontend
- **Database**: PostgreSQL
- **Docker Compose**: orchestrates all services

Project structure:

```
area/
├── backend/       # Express API server
├── web/           # Web client
├── mobile/        # Flutter Android client
├── docker-compose.yml
└── README.md
```

---

## More
- [Comparative study](comparative.md)
---

## Authors & Contacts

Katary Maryse: maryse.katary@epitech.eu

Goulmot Lisa: lisa.goulmot@epitech.eu

Mourens Paul: paul.mourens@epitech.eu

Burga Vlad: vlad.burga@epitech.eu

Poly Kevin: kevin.poly@epitech.eu
