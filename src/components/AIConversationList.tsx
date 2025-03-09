import { useRef, useEffect, type FC } from "react";
import AIConversationMessage from "./AIConversationMessage";
import type { MessageSecurityLevel } from "./MessageInput";

/**
 * 消息类型定义
 */
interface MessageType {
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

/**
 * AI对话列表组件属性接口
 */
interface AIConversationListProps {
  /**
   * 消息列表
   */
  messages: MessageType[];
  /**
   * 消息复制回调
   */
  onCopyMessage?: (messageId: number) => void;
}

/**
 * AI对话列表组件
 *
 * 专为AI对话设计的消息列表组件，提供简洁现代的对话体验
 */
const AIConversationList: FC<AIConversationListProps> = ({
  messages,
  onCopyMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 当消息列表更新时，滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 处理消息复制
  const handleCopy = (messageId: number) => {
    if (onCopyMessage) {
      onCopyMessage(messageId);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="flex flex-col space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-500 dark:text-gray-400">
              开始新的对话吧！
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <AIConversationMessage
              key={message.id}
              message={message.content}
              messageType={message.messageType}
              isUser={message.isOwn}
              onCopy={() => handleCopy(message.id)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default AIConversationList;
