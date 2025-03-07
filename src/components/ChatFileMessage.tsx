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
   * 切换下拉菜单显示状态
   */
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
      <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex items-center self-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-600"
        type="button"
        onClick={toggleDropdown}
      >
        <svg
          className="size-4 text-gray-500 dark:text-gray-400"
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
          className="absolute z-10 mt-2 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-sm dark:divide-gray-600 dark:bg-gray-700"
          style={{ top: "auto", right: "auto" }}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleMenuItemClick(onReply)}
              >
                回复
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleMenuItemClick(onForward)}
              >
                转发
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleMenuItemClick(onCopy)}
              >
                复制
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleMenuItemClick(onReport)}
              >
                举报
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleMenuItemClick(onDelete)}
              >
                删除
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatFileMessage;
