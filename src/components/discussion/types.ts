import type { MessageSecurityLevel } from "../MessageInput";

/**
 * 消息类型定义
 * @interface MessageType
 */
export interface MessageType {
  id: number;
  sender: string;
  avatarSrc: string;
  content: string;
  time: string;
  status?: string;
  messageType:
    | "text"
    | "image"
    | "file"
    | "voice"
    | "video"
    | "location"
    | "link"
    | "vote"
    | "task"
    | "relay";
  isOwn?: boolean;
  replyTo?: {
    sender: string;
    message: string;
  };
  reactions?: string[];
  isEdited?: boolean;
  securityLevel: MessageSecurityLevel;
  voteData?: {
    title: string;
    description?: string;
    options: Array<{
      id: number;
      text: string;
      votes: number;
      voted?: boolean;
    }>;
    totalVotes: number;
    deadline?: string;
    hasVoted: boolean;
  };
  taskData?: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "in-progress" | "completed";
    progress?: number;
    assignees: Array<{
      id: number;
      name: string;
      avatar: string;
      status?: "pending" | "in-progress" | "completed";
    }>;
    attachments?: Array<{
      id: number;
      name: string;
      type: "image" | "document" | "spreadsheet" | "pdf";
      size?: string;
    }>;
    tags?: string[];
  };
  relayData?: {
    title: string;
    description?: string;
    deadline?: string;
    participants: Array<{
      id: number;
      name: string;
      avatar: string;
      content: string;
      time: string;
    }>;
    totalParticipants: number;
    maxParticipants?: number;
    status: "ongoing" | "completed";
    tags?: string[];
  };
}
