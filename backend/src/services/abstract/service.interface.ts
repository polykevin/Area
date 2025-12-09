export interface ActionDefinition<Payload = any, Params = any> {
  id: string;
  name: string;
  match: (payload: Payload, params: Params) => boolean;
}

export interface ReactionDefinition<
  Instance = any,
  Token = any,
  Params = any,
  Event = any,
> {
  id: string;
  name: string;
  execute: (
    ctx: {
      token: Token;
      params: Params;
      event: Event;
    } & Instance,
  ) => Promise<any>;
}

export interface ServiceDefinition<
  Instance = any,
  ActionPayload = any,
  ActionParams = any,
> {
  id: string;
  displayName: string;
  instance: Instance;
  actions: ActionDefinition<ActionPayload, ActionParams>[];
  reactions: ReactionDefinition<Instance>[];
  hooks?: unknown[];
}
