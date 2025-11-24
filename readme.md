#  AREA Project – Action ↔ REAction  
Automation platform inspired by IFTTT / Zapier

---

##  Introduction

The AREA project aims to build a platform that connects multiple online services (Google, Outlook, GitHub, Dropbox, etc.) using a system of **Actions** and **REActions**.  
A user can configure automated workflows called **AREA**:

> **When** an *Action* happens  
> **Then** execute a *REAction*

AREA workflows are triggered automatically through a **hook system**.

---

#  Project Architecture

The platform is composed of **three main modules**:

###  1. Application Server
- Contains **100% of the business logic**
- Exposes a **REST API**
- Handles:
  - user management
  - service binding
  - actions
  - reactions
  - AREA creation
  - hook execution

###  2. Web Client
- Browser-based UI
- Communicates with the server via the REST API
- Contains **no** business logic

###  3. Mobile Client
- Android / Windows Mobile app
- Displays screens & forwards requests to the server
- Must allow configuring the server URL

 **Web & mobile clients are purely visual interfaces. No business logic is allowed.**

---

#  User Management

The platform requires complete user handling.

###  Registration
- Via standard registration (email + password)
- Or via third-party OAuth2 providers:
  - Google
  - X / Twitter
  - Facebook
  - etc.

###  Authentication
- Username/password authentication (handled by the server)
- OAuth2 authentication (handled on client side, then validated by server)
- Third-party accounts must be linked to a local system user

###  Admin Panel
- Allows managing all platform users

---

#  Services

Users can subscribe to multiple external services.  
Each service may offer:

- **Actions** (detectable events)
- **REActions** (tasks to execute)

Most services will require OAuth2 identification.

### Example service types
- Google
- Facebook
- Instagram
- X / Twitter
- Dropbox
- OneDrive
- GitHub
- Gmail / Outlook / Mail RFC
- RSS / Feedly
- Internal Timer service

---

#  Action Components (Triggers)

An **Action** is an event detected by a service.

### Social networks
- New post in a group
- New private message received
- Post containing a specific hashtag
- New follower
- A user likes your post

### Cloud storage
- New file in a directory
- File shared with the user

### Email
- Email received from a specific sender
- Email containing a specific keyword

### Timer
- Current date matches DD/MM
- Current time matches HH:MM
- “In X days it will be Y”

---

#  REAction Components (Task Execution)

Examples:

### Social platforms
- Post a message
- Add a new friend/follower

### Cloud platforms
- Add a file in a folder
- Share a file with another user

### Email
- Send an email to a specific recipient

### Scripting
- Run a custom script or operation

---

#  AREA (Automation Workflows)

An AREA = **Action** + **REAction**

Examples:

###  Gmail →  OneDrive
- **Action:** email received with attachment  
- **REAction:** save attachment to OneDrive

###  GitHub →  Teams
- **Action:** issue created  
- **REAction:** send Teams message

---

#  Hooks

Hooks are responsible for:

1. Listening for events from all Actions  
2. Checking if the condition is satisfied  
3. Making sure the event is not repeated  
4. Triggering the appropriate REActions  

Example:

- List user projects
- Detect if a project ends in less than H hours
- Ensure this is the *first time* this condition is met
- Execute all related REActions

---

#  Docker Compose Requirements

Your project must include a **docker-compose.yml** with at least **three services**:

- `server` (exposes port 8080)
- `client_mobile`
- `client_web` (exposes port 8081)

### Required constraints

- `client_web` depends on both `client_mobile` **and** `server`
- `client_mobile` builds and outputs its APK into a **shared volume**
- `client_web` must serve:
  - `http://localhost:8081/client.apk`
- `server` must serve:
  - `http://localhost:8080/about.json`

---

#  `about.json` Format (Mandatory)

Expected server response:

```json
{
  "client": {
    "host": "CLIENT_IP_ADDRESS"
  },
  "server": {
    "current_time": 1531680780,
    "services": [
      {
        "name": "facebook",
        "actions": [
          { "name": "new_message_in_group", "description": "A new message is posted in the group" },
          { "name": "new_message_inbox", "description": "A new private message is received by the user" },
          { "name": "new_like", "description": "The user gains a like from one of their messages" }
        ],
        "reactions": [
          { "name": "like_message", "description": "The user likes a message" }
        ]
      }
    ]
  }
}
```

## Authors

KATARY Maryse
GOULMOT Lisa
POLY Kevin
MOURENS Paul
BURGA Vlad
