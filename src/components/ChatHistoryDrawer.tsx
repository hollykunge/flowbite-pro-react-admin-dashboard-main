import { FC } from "react";
import { HiX } from "react-icons/hi";

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
  }[];
  onSelectChat: (chatId: string) => void;
}

/**
 * 聊天历史抽屉组件
 *
 * 显示用户的历史对话记录，支持选择历史对话继续交流
 * 采用精致无分割线设计，提供流畅的视觉体验
 */
const ChatHistoryDrawer: FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectChat,
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-30 w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* 抽屉标题 */}
        <div className="px-4 py-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            历史对话
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 聊天历史列表 - 精致无分割线设计 */}
        <div className="flex-1 overflow-y-auto py-2 px-1">
          {chatHistory.length > 0 ? (
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-[180px] group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-1">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm">暂无历史对话</p>
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button className="w-full py-2 px-4 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors duration-200 text-sm font-medium flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            新建对话
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryDrawer;
