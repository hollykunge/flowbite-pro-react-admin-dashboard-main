import { FC, ChangeEvent, KeyboardEvent } from "react";
import { HiLightningBolt, HiOutlineLightBulb } from "react-icons/hi";

/**
 * 消息密级类型
 */
export type MessageSecurityLevel = "非密" | "秘密" | "机密";

/**
 * AI输入框组件属性接口
 */
interface AIInputBoxProps {
  /**
   * 消息内容
   */
  message: string;
  /**
   * 消息内容变化时的回调函数
   */
  onMessageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * 发送消息的回调函数
   */
  onSendMessage: () => void;
  /**
   * 消息密级
   */
  securityLevel?: MessageSecurityLevel;
  /**
   * 消息密级变化时的回调函数
   */
  onSecurityLevelChange?: (level: MessageSecurityLevel) => void;
  /**
   * 深度搜索回调
   */
  onDeepSearch?: () => void;
  /**
   * 思考模式回调
   */
  onThink?: () => void;
}

/**
 * AI输入框组件
 *
 * 统一的AI输入框组件，与AIWelcomePage中的输入框保持一致的样式和功能
 */
const AIInputBox: FC<AIInputBoxProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onDeepSearch,
  onThink,
}) => {
  /**
   * 处理键盘按键事件，按Enter键发送消息
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSendMessage();
    }
  };

  /**
   * 处理深度搜索
   */
  const handleDeepSearch = () => {
    if (onDeepSearch) {
      onDeepSearch();
    }
  };

  /**
   * 处理思考模式
   */
  const handleThink = () => {
    if (onThink) {
      onThink();
    }
  };

  return (
    <div className="w-full">
      {/* 整合的输入框和功能区容器 - 移除焦点边框效果 */}
      <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200">
        {/* 输入框区域和功能区的无分割线整合容器 */}
        <div className="flex flex-col">
          {/* 输入框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="随便问点什么"
              className="w-full bg-transparent px-6 py-4 text-gray-800 dark:text-white outline-none border-none focus:outline-none focus:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={message}
              onChange={onMessageChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 p-2 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
              onClick={onSendMessage}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          {/* 功能区 - 无分割线 */}
          <div className="flex items-center justify-start gap-2 px-4 pb-2 -mt-1">
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={handleDeepSearch}
            >
              <div className="flex items-center justify-center h-5">
                <HiLightningBolt
                  className="text-lg text-primary-600 dark:text-primary-500"
                  style={{ transform: "translateY(-1px)" }}
                />
              </div>
              <div className="flex items-center justify-center h-5">
                <span style={{ transform: "translateY(-1px)" }}>
                  关联知识库
                </span>
              </div>
            </button>
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={handleThink}
            >
              <div className="flex items-center justify-center h-5">
                <HiOutlineLightBulb
                  className="text-lg text-primary-600 dark:text-primary-500"
                  style={{ transform: "translateY(-1px)" }}
                />
              </div>
              <div className="flex items-center justify-center h-5">
                <span style={{ transform: "translateY(-1px)" }}>思考模式</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInputBox;
