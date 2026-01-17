export interface SlackMessage {
  id: string;
  text: string;
  user: string | null;
  channel: string;
  threadTs?: string | null;
}
