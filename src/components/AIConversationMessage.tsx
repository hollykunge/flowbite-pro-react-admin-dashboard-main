import type { FC } from "react";

/**
 * AI对话消息组件属性接口
 */
interface AIConversationMessageProps {
  /**
   * 消息内容
   */
  message: string;
  /**
   * 消息类型
   */
  messageType?: 
    | "text"
    | "image"
    | "file"
    | "voice"
    | "video"
    | "location"
    | "link";
  /**
   * 是否为用户自己发送的消息
   */
  isUser?: boolean;
  /**
   * 复制按钮点击事件处理函数
   */
  onCopy?: () => void;
}

/**
 * AI对话消息组件
 *
 * 专为AI对话设计的消息组件，简洁现代的设计风格，适合长文本显示
 */
const AIConversationMessage: FC<AIConversationMessageProps> = ({
  message,
  messageType = "text",
  isUser = false,
  onCopy,
}) => {

  /**
   * 复制消息内容
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      if (onCopy) onCopy();
    });
  };

  /**
   * 渲染消息内容
   */
  const renderMessageContent = () => {
    switch (messageType) {
      case "image":
        return (
          <div className="mb-2 max-w-sm overflow-hidden rounded-lg">
            <img
              src={message}
              alt="图片消息"
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        );
      case "file":
        return (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
            <svg
              className="size-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M15 2H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm-3.5 12h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3z" />
            </svg>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {message}
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-none whitespace-pre-wrap break-words prose prose-sm text-gray-900 dark:prose-invert dark:text-white">
            {message}
          </div>
        );
    }
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-3xl ${isUser ? "order-2" : "order-1"}`}>
        <div className="flex items-start gap-2.5">
          <div
            className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-3 ${
                isUser
                  ? "rounded-tr-none bg-primary-600 text-white dark:bg-primary-500"
                  : "rounded-tl-none bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {renderMessageContent()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="rounded p-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConversationMessage;
