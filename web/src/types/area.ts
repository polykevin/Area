export type AreaStatus = "active" | "paused";

export type AreaTriggerType = "webhook" | "polling";

export interface Area {
  name: string;
  description: string;
  actionService: string;
  actionType: string;
  actionParams: any;
  reactionService: string;
  reactionType: string;
  reactionParams: any;
  active: boolean;
}