import type { FC, FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { useState } from "react";
import { HiOutlineArrowUp } from "react-icons/hi";
import { FiPaperclip } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";

/**
 * 消息密级类型
 */
export type MessageSecurityLevel = "非密" | "秘密" | "机密";

/**
 * 现代消息输入组件属性接口
 */
interface ModernMessageInputProps {
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
  securityLevel: MessageSecurityLevel;
  /**
   * 消息密级变化时的回调函数
   */
  onSecurityLevelChange: (level: MessageSecurityLevel) => void;
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
 * 现代风格消息输入组件
 *
 * 提供现代UI风格的消息输入组件，包含深度搜索、思考模式等功能
 */
const ModernMessageInput: FC<ModernMessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onDeepSearch,
  onThink,
}) => {
  const [activeMode, setActiveMode] = useState<"none" | "search" | "think">(
    "none",
  );

  /**
   * 处理表单提交事件
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  /**
   * 处理键盘按键事件，按Enter键发送消息
   */
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  /**
   * 处理深度搜索模式切换
   */
  const handleDeepSearch = () => {
    const newMode = activeMode === "search" ? "none" : "search";
    setActiveMode(newMode);
    if (newMode === "search" && onDeepSearch) {
      onDeepSearch();
    }
  };

  /**
   * 处理思考模式切换
   */
  const handleThink = () => {
    const newMode = activeMode === "think" ? "none" : "think";
    setActiveMode(newMode);
    if (newMode === "think" && onThink) {
      onThink();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center rounded-full bg-gray-900/90 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-gray-800/90">
        {/* 左侧功能按钮 */}
        <div className="flex items-center space-x-2 pr-3">
          <button
            type="button"
            className={`flex items-center rounded-full p-1.5 ${
              activeMode === "search"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={handleDeepSearch}
          >
            <BiSearch className="mr-1 size-4" />
            <span className="text-sm">DeepSearch</span>
          </button>
          
          <button
            type="button"
            className={`flex items-center rounded-full p-1.5 ${
              activeMode === "think"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={handleThink}
          >
            <BsLightbulb className="mr-1 size-4" />
            <span className="text-sm">Think</span>
          </button>
        </div>

        {/* 输入框 */}
        <input
          type="text"
          className="flex-1 rounded-full bg-transparent text-sm text-white placeholder:text-gray-400 focus:outline-none"
          placeholder="随便问点什么"
          value={message}
          onChange={onMessageChange}
          onKeyPress={handleKeyPress}
        />

        {/* 右侧功能按钮 */}
        <div className="flex items-center space-x-2 pl-3">
          <button
            type="button"
            className="rounded-full p-1.5 text-gray-400 hover:text-gray-300"
            title="附加文件"
          >
            <FiPaperclip className="size-5" />
          </button>
          
          <button
            type="submit"
            className="rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
            title="发送消息"
          >
            <HiOutlineArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModernMessageInput;
