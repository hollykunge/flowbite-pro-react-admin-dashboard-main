import React from "react";
import type { MessageSecurityLevel } from "./MessageInput";

/**
 * 消息项组件属性接口
 */
interface MessageItemProps {
  /**
   * 消息内容
   */
  content: string;
  /**
   * 发送者名称
   */
  sender: string;
  /**
   * 是否为当前用户发送的消息
   */
  isMine: boolean;
  /**
   * 发送时间
   */
  time: string;
  /**
   * 消息密级
   */
  securityLevel: MessageSecurityLevel;
}

/**
 * 消息项组件
 *
 * 显示单条消息，包括发送者、内容、时间和密级标签
 */
const MessageItem: React.FC<MessageItemProps> = ({
  content,
  sender,
  isMine,
  time,
  securityLevel,
}) => {
  /**
   * 根据密级获取对应的样式
   */
  const getSecurityLevelStyle = () => {
    switch (securityLevel) {
      case "非密":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500";
      case "秘密":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500";
      case "机密":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500";
      default:
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500";
    }
  };

  return (
    <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-xl rounded-lg px-3 py-1 ${
          isMine
            ? "rounded-br-none bg-blue-500 text-white"
            : "rounded-bl-none bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
        }`}
      >
        {/* 发送者名称 */}
        {!isMine && <div className="mb-1 font-semibold">{sender}</div>}

        {/* 消息内容 */}
        <div className="whitespace-pre-wrap break-words">{content}</div>

        {/* 底部区域：时间和密级标签 */}
        <div className="mt-1 flex items-end justify-between">
          {/* 发送时间 */}
          <div className="text-xs opacity-70">{time}</div>

          {/* 密级标签 */}
          <div
            className={`ml-2 rounded-md px-2 py-0.5 text-xs font-medium ${getSecurityLevelStyle()}`}
          >
            {securityLevel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
