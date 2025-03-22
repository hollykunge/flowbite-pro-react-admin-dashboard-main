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
    | "relay"
    | "knowledge"
    | "document"
    | "notice";
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
    id: number;
    title: string;
    description?: string;
    createdAt?: string;
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
  knowledgeData?: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    author: string;
    authorAvatar: string;
    createdAt: string;
    lastUpdated?: string;
    viewCount?: number;
    attachments?: Array<{
      id: number;
      name: string;
      type: string;
      size?: string;
    }>;
    relatedTopics?: string[];
  };
  documentData?: {
    title: string;
    content?: string;
    fileType: "word" | "excel" | "ppt" | "pdf" | "other";
    fileSize?: string;
    pageCount?: number;
    lastEditor: string;
    lastEditorAvatar: string;
    lastEditTime: string;
    collaborators?: Array<{
      id: number;
      name: string;
      avatar: string;
      role: "editor" | "viewer" | "owner";
    }>;
    status: "editing" | "viewing" | "locked";
    version?: string;
    commentCount?: number;
  };
  noticeData?: {
    title: string;
    content: string;
    type: "welcome" | "rules" | "announcement" | "event";
    importance: "normal" | "important" | "urgent";
    expireDate?: string;
    attachments?: Array<{
      id: number;
      name: string;
      type: string;
      size?: string;
    }>;
    requireConfirmation?: boolean;
    confirmedBy?: Array<{
      id: number;
      name: string;
      avatar: string;
      time: string;
    }>;
  };
}
