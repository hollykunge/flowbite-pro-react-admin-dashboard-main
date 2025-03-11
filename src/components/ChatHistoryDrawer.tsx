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

const ChatHistoryDrawer: FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectChat,
}) => {
  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* 抽屉头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          对话历史
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <HiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* 对话列表 */}
      <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-sm">暂无对话历史</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {chat.lastMessage}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {chat.timestamp}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryDrawer;
