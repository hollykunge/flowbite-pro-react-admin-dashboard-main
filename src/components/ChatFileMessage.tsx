import type { FC } from "react";
import { useState } from "react";
import FileMessage from "./FileMessage";

/**
 * 聊天文件消息组件属性接口
 * @interface ChatFileMessageProps
 * @property {string} avatarSrc - 头像图片路径
 * @property {string} senderName - 发送者名称
 * @property {string} time - 消息发送时间
 * @property {string} fileName - 文件名称
 * @property {string} [fileSize] - 文件大小
 * @property {string} [fileType] - 文件类型
 * @property {number} [pageCount] - 文件页数（如果是文档类型）
 * @property {string} [status] - 消息状态（如"已发送"、"已读"等）
 * @property {() => void} [onReply] - 回复按钮点击事件处理函数
 * @property {() => void} [onForward] - 转发按钮点击事件处理函数
 * @property {() => void} [onCopy] - 复制按钮点击事件处理函数
 * @property {() => void} [onReport] - 举报按钮点击事件处理函数
 * @property {() => void} [onDelete] - 删除按钮点击事件处理函数
 * @property {() => void} [onDownload] - 下载文件事件处理函数
 */
interface ChatFileMessageProps {
  avatarSrc: string;
  senderName: string;
  time: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  pageCount?: number;
  status?: string;
  onReply?: () => void;
  onForward?: () => void;
  onCopy?: () => void;
  onReport?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

/**
 * 聊天文件消息组件
 * 用于在聊天界面中显示文件类型的消息，包括发送者头像、名称、时间和文件信息
 */
const ChatFileMessage: FC<ChatFileMessageProps> = ({
  avatarSrc,
  senderName,
  time,
  fileName,
  fileSize,
  fileType = "PDF",
  pageCount,
  status,
  onReply,
  onForward,
  onCopy,
  onReport,
  onDelete,
  onDownload,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  /**
   * 处理菜单项点击事件
   * @param {Function} handler - 点击事件处理函数
   */
  const handleMenuItemClick = (handler?: () => void) => {
    if (handler) {
      handler();
    }
    setShowDropdown(false);
  };

  return (
    <div className="flex items-start gap-2.5">
      <img
        className="size-8 rounded-full"
        src={avatarSrc}
        alt={`${senderName} 的头像`}
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {senderName}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {time}
          </span>
        </div>
        <FileMessage
          fileName={fileName}
          fileSize={fileSize}
          fileType={fileType}
          pageCount={pageCount}
          onDownload={onDownload}
        />
        {status && (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {status}
          </span>
        )}
      </div>
      <div
        className="relative"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          data-dropdown-placement="bottom-start"
          className="inline-flex items-center self-center p-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
          type="button"
        >
          <svg
            className="size-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
          >
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        </button>
        {showDropdown && (
          <div
            className="absolute z-10 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-lg border border-gray-100 dark:divide-gray-600 dark:bg-gray-700 dark:border-gray-600"
            style={{
              top: "0",
              left: "100%",
              marginLeft: "8px",
              transform: "translateY(-25%)",
            }}
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    console.log("使用AI助手处理文件:", fileName);
                    setShowDropdown(false);
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                  AI助手
                </button>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleMenuItemClick(onCopy)}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  复制
                </button>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleMenuItemClick(onReply)}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    ></path>
                  </svg>
                  引用
                </button>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleMenuItemClick(onForward)}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                  转发
                </button>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleMenuItemClick(onReport)}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  举报
                </button>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleMenuItemClick(onDelete)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  删除
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFileMessage;
