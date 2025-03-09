import { Button } from "flowbite-react";
import type { FC, FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { BiSend } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FiFile } from "react-icons/fi";
import { AiOutlineAudio } from "react-icons/ai";

/**
 * 消息密级类型
 */
export type MessageSecurityLevel = "非密" | "秘密" | "机密";

/**
 * 消息输入组件属性接口
 */
interface MessageInputProps {
  /**
   * 消息内容
   */
  message: string;
  /**
   * 消息内容变化时的回调函数
   */
  onMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
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
}

/**
 * 消息输入组件
 *
 * 提供消息输入、表情选择和图片上传功能的表单组件
 */
const MessageInput: FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  securityLevel,
  onSecurityLevelChange,
}) => {
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
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  /**
   * 处理密级变更事件
   */
  const handleSecurityLevelChange = (level: MessageSecurityLevel) => {
    onSecurityLevelChange(level);
  };

  return (
    <form onSubmit={handleSubmit} className="my-3 w-full">
      <div className="rounded-lg border border-gray-200 bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-shadow duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        {/* 消息输入区域 */}
        <div className="px-4 py-3">
          <textarea
            id="chat"
            rows={1}
            className="block w-full resize-none border-0 bg-transparent p-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-gray-400"
            placeholder="输入您的消息..."
            value={message}
            onChange={onMessageChange}
            onKeyPress={handleKeyPress}
          ></textarea>
        </div>

        {/* 功能按钮和发送按钮区域 */}
        <div className="flex items-center justify-between border-t border-gray-200 p-1 dark:border-gray-700">
          {/* 左侧功能按钮 */}
          <div className="flex flex-wrap items-center space-x-1">
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              title="上传图片"
            >
              <HiOutlinePhotograph />
              <span className="sr-only">上传图片</span>
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              title="添加表情"
            >
              <MdOutlineEmojiEmotions />
              <span className="sr-only">添加表情</span>
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              title="添加文件"
            >
              <FiFile />
              <span className="sr-only">添加文件</span>
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              title="录制语音"
            >
              <AiOutlineAudio />
              <span className="sr-only">录制语音</span>
            </button>
          </div>

          {/* 右侧发送按钮和密级选择 */}
          <div className="flex items-center space-x-2">
            {/* 密级选择单选按钮 */}
            <div
              className="flex items-center space-x-2"
              role="radiogroup"
              aria-label="消息密级选择"
            >
              <div className="flex items-center">
                <input
                  id="security-normal"
                  type="radio"
                  name="security-level"
                  value="非密"
                  checked={securityLevel === "非密"}
                  onChange={() => handleSecurityLevelChange("非密")}
                  className="size-3 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600"
                />
                <label
                  htmlFor="security-normal"
                  className="ml-1 cursor-pointer rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-500"
                >
                  非密
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="security-secret"
                  type="radio"
                  name="security-level"
                  value="秘密"
                  checked={securityLevel === "秘密"}
                  onChange={() => handleSecurityLevelChange("秘密")}
                  className="size-3 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-yellow-600"
                />
                <label
                  htmlFor="security-secret"
                  className="ml-1 cursor-pointer rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500"
                >
                  秘密
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="security-confidential"
                  type="radio"
                  name="security-level"
                  value="机密"
                  checked={securityLevel === "机密"}
                  onChange={() => handleSecurityLevelChange("机密")}
                  className="size-3 border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-orange-600"
                />
                <label
                  htmlFor="security-confidential"
                  className="ml-1 cursor-pointer rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-500"
                >
                  机密
                </label>
              </div>
            </div>

            <Button size="xs">
              <BiSend className="mr-2 size-5" />
              发送
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
