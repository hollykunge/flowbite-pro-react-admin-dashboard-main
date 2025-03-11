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
    | "link";
  isOwn?: boolean;
  replyTo?: {
    sender: string;
    message: string;
  };
  reactions?: string[];
  isEdited?: boolean;
  securityLevel: MessageSecurityLevel;
}
