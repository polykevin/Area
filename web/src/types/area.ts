export type AreaStatus = "active" | "paused";

export type AreaTriggerType = "webhook" | "polling";

export interface Area {
  id?: number;
  name: string;
  description: string;
  actionService: string;
  actionType: string;
  actionParams: Record<string, unknown>;
  reactionService: string;
  reactionType: string;
  reactionParams: Record<string, unknown>;
  active: boolean;
}