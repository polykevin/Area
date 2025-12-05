export type AreaStatus = "active" | "paused";

export type AreaTriggerType = "webhook" | "polling";

export interface Area {
  id: string;
  name: string;
  description?: string;
  status: AreaStatus;
  triggerService: string;
  triggerAction: string;
  reactionService: string;
  reactionAction: string;
  createdAt: string;
  triggerType: AreaTriggerType;
}