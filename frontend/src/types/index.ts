// src/types/index.ts
export interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}