export type ChatRole = "user" | "bot";

export interface ChatItem {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
}
