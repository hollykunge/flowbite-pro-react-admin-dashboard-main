import React from "react";
import MessageItem from "./MessageItem";
import type { MessageSecurityLevel } from "./MessageInput";

/**
 * 消息数据接口
 */
interface Message {
  id: string;
  content: string;
  sender: string;
  isMine: boolean;
  time: string;
  securityLevel: MessageSecurityLevel;
}

/**
 * 消息列表组件属性接口
 */
interface MessageListProps {
  /**
   * 消息数组
   */
  messages: Message[];
}

/**
 * 消息列表组件
 *
 * 显示消息列表，每条消息包含密级标签
 */
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-2 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          content={message.content}
          sender={message.sender}
          isMine={message.isMine}
          time={message.time}
          securityLevel={message.securityLevel}
        />
      ))}
    </div>
  );
};

export default MessageList;
