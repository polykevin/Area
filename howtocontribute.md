#  How to contribute: Adding a New Service
This document explains how to add a new service integration to the backend (Google, GitHub, Discord, Notion, etc.).

A service in this project can expose:

- Actions (triggers, e.g. “new email”, “new issue”)

- Reactions (effects, e.g. “send email”, “create issue”)

- Hooks (cron-based or web polling logic)

- OAuth authentication (if required)

##  1. Create the Service folder
All services live in:
```bash
backend/src/services
```
Create a new folder named after your service:
```bash
backend/src/services/<service-name>
```
Example:
```bash
backend/src/services/google
```

---

##  2. Required folder structure
Inside your service folder, you must follow this structure:
```php-template
<service-name>/
├── actions/
│   └── *.action.ts
├── reactions/
│   └── *.reaction.ts
├── hooks/
│   └── *.hook.ts
├── <service-name>.service.ts
├── <service-name>.module.ts
├── <service-name>.integration.ts
├── <service-name>.interface.ts
```
**Folder responsibilities**
| Folder / File      | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `actions/`         | Trigger definitions (e.g. `new_issue`, `new_email`)        |
| `reactions/`       | Reaction definitions (e.g. `create_issue`, `send_message`) |
| `hooks/`           | Polling / cron logic that emits events                     |
| `*.service.ts`     | API client + business logic                                |
| `*.module.ts`      | NestJS module definition                                   |
| `*.integration.ts` | Registers actions, reactions, hooks                        |
| `*.interface.ts`   | Optional: shared types/interfaces                          |


---

##  3. Service class (service-name.service.ts)
This file contains:
- API client setup
- Token usage (via ServiceAuthRepository)
- All external API calls
Example skeleton:
```ts
import { Injectable } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';

@Injectable()
export class MyService {
  constructor(private authRepo: ServiceAuthRepository) {}

  async someApiCall(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'myservice');
    if (!auth) throw new Error('Service not connected');
    // call external API here
  }
  // add some utility functions for the service
  // like listNewEmails, sendMessages, ...
}

```
---

##  4. Actions (actions/*.action.ts)
Actions define what triggers an AREA
Each action must include:
- id
- name
- displayName
- description
- input
- match(payload,params)

Example:

```ts
export const newItemAction = {
  id: 'new_item',
  name: 'new_item',
  displayName: 'New Item Created',
  description: 'Triggers when a new item is created',

  input: [
    {
      key: 'author',
      label: 'Author',
      type: 'string',
      required: false,
    },
    // or you can leave this empty if it has no params
  ],

  match: (payload, params) => {
    if (!params) return true;
    if (params.author && payload.author !== params.author) return false;
    return true;
  },
};

```
---

##  5. Reaction (reactions/*.reaction.ts)
Reaction define what happens when an action fires.
Each reaction must include:
- id
- name
- displayName
- description
- input
- execute(...) function

Example:

```ts
export const createItemReaction = {
  id: 'create_item',
  name: 'create_item',
  displayName: 'Create Item',
  description: 'Creates a new item',

  input: [
    {
      key: 'title',
      label: 'Title',
      type: 'string',
      required: true,
    },
    // leave empty if it has no params
  ],

  execute: async ({ token, params, myService }) => {
    if (!token) throw new Error('Service not connected');

    await myService.createItem(token.userId, params.title);

    return { success: true };
  },
};
```
---

##  6. Hooks (hooks/*.hook.ts)
Hooks are cron jobs that poll external APIs and emit events.

Rules:
- Use @Cron(...)
- Call engine.emitHookEvent(...)
- Persist state using ServiceAuthRepository.metadata if needed

Example:

```ts
@Injectable()
export class NewItemHook {
  private engine: AutomationEngine;

  constructor(
    private myService: MyService,
    private authRepo: ServiceAuthRepository,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/30 * * * * *')
  async poll() {
    if (!this.engine) return;

    const users = await this.authRepo.findUsersWithService('myservice');

    for (const user of users) {
      const items = await this.myService.listNewItems(user.userId);

      for (const item of items) {
        await this.engine.emitHookEvent({
          userId: user.userId,
          actionService: 'myservice',
          actionType: 'new_item',
          payload: item,
        });
      }
    }
  }
}
```
---

##  7. Integration File (service-name.integration.ts)
This file registers everything into the platform.

Required fields:
- id
- displayName
- color
- iconKey
- instance
- actions
- reactions
- hooks

Example:

```ts
import { newItemAction } from './actions/new-item.action';
import { createItemReaction } from './reactions/create-item.reaction';
import { NewItemHook } from './hooks/new-item.hook';

export function myServiceIntegration(myService, authRepo, engine, newItemHook) {
  return {
    id: 'myservice',
    displayName: 'My Service',
    color: '#000000',
    iconKey: 'myservice',

    instance: {
      myService,
      authRepo,
      engine,
    },

    actions: [newItemAction],
    reactions: [createItemReaction],
    hooks: [newItemHook],
  };
}
```
---

##  8. Module File (service-name.module.ts)
Standard NestJS module:
```ts
@Module({
  imports: [],
  providers: [
    MyService,
    ServiceAuthRepository,
    NewItemHook,
  ],
  exports: [
    MyService,
    NewItemHook,
  ],
})
export class MyServiceModule {}
```
---

##  9. Register OAuth (If needed)
### 9.1 Oauth Factory
Edit
```bash
backend/src/auth/oauth.factory.ts
```
Add your service provider:
```ts
case 'myservice':
  return new MyServiceOAuthProvider();
```
### 9.2 OAuth Provider
Create a new provider in:
```bash
backend/src/auth/providers/
```
Example:
```bash
myservice.oauth.ts
```
This file handles:
- Authorization URL
- Token exchange
- User profile fetch
---

## Done !

If you did everything correctly and added the right api key the .env.
Your new service is now working and running in our app.