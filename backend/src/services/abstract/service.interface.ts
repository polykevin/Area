export type ParamType = string;

export interface InputFieldDefinition {
  key: string;
  type: ParamType;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helpText?: string;
}

export interface ActionDefinition<Payload = any, Params = any> {
  id: string;
  name: string;

  displayName: string;
  description: string;

  input?: InputFieldDefinition[];

  match: (payload: Payload, params: Params) => boolean;
}

export interface ReactionDefinition<Instance = any, Token = any, Params = any, Event = any> {
  id: string;
  name: string;

  displayName: string;
  description: string;

  input?: InputFieldDefinition[];

  execute: (ctx: {
    token: Token;
    params: Params;
    event: Event;
  } & Instance) => Promise<any>;
}

export interface ServiceDefinition<Instance = any, ActionPayload = any, ActionParams = any> {
  id: string;
  displayName: string;

  color: string;
  iconKey: string;

  instance: Instance;

  actions: ActionDefinition<ActionPayload, ActionParams>[];
  reactions: ReactionDefinition<Instance>[];
}
