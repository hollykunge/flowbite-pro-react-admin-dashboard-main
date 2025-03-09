import type { FC } from "react";
import { useState } from "react";
import type { MessageSecurityLevel } from "./MessageInput";

/**
 * 聊天消息组件属性接口
 * @interface ChatMessageProps
 * @property {string} avatarSrc - 头像图片路径
 * @property {string} senderName - 发送者名称
 * @property {string} time - 消息发送时间
 * @property {string} message - 消息内容
 * @property {string} [status] - 消息状态（如"已发送"、"已读"等）
 * @property {string} [messageType] - 消息类型（"text", "image", "file", "voice", "video", "location", "link"）
 * @property {boolean} [isOwn] - 是否为用户自己发送的消息
 * @property {object} [replyTo] - 引用回复的消息
 * @property {string[]} [reactions] - 消息的表情反应列表
 * @property {() => void} [onReply] - 回复按钮点击事件处理函数
 * @property {() => void} [onForward] - 转发按钮点击事件处理函数
 * @property {() => void} [onCopy] - 复制按钮点击事件处理函数
 * @property {() => void} [onReport] - 举报按钮点击事件处理函数
 * @property {() => void} [onDelete] - 删除按钮点击事件处理函数
 * @property {(reaction: string) => void} [onAddReaction] - 添加表情反应事件处理函数
 * @property {() => void} [onEdit] - 编辑消息事件处理函数
 * @property {(content: string) => void} [onSaveEdit] - 保存编辑事件处理函数
 * @property {() => void} [onCancelEdit] - 取消编辑事件处理函数
 * @property {boolean} [isEdited] - 消息是否被编辑过
 * @property {MessageSecurityLevel} [securityLevel] - 消息密级
 */
interface ChatMessageProps {
  avatarSrc: string;
  senderName: string;
  time: string;
  message: string;
  status?: string;
  messageType?:
    | "text"
    | "image"
    | "file"
    | "voice"
    | "video"
    | "location"
    | "link";
  isOwn?: boolean;
  replyTo?: {
    sender: string;
    message: string;
  };
  reactions?: string[];
  onReply?: () => void;
  onForward?: () => void;
  onCopy?: () => void;
  onReport?: () => void;
  onDelete?: () => void;
  onAddReaction?: (reaction: string) => void;
  onEdit?: () => void;
  onSaveEdit?: (content: string) => void;
  onCancelEdit?: () => void;
  isEdited?: boolean;
  securityLevel?: MessageSecurityLevel;
}

/**
 * 聊天消息组件
 *
 * 显示一条聊天消息，包括头像、发送者信息、消息内容、状态和操作菜单
 * 支持不同类型的消息、引用回复功能、表情反应和消息编辑
 *
 * @param {ChatMessageProps} props - 组件属性
 * @returns {JSX.Element} 渲染的聊天消息组件
 */
const ChatMessage: FC<ChatMessageProps> = ({
  avatarSrc,
  senderName,
  time,
  message,
  status,
  messageType = "text",
  isOwn = false,
  replyTo,
  reactions = [],
  onReply,
  onForward,
  onCopy,
  onReport,
  onDelete,
  onAddReaction,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isEdited = false,
  securityLevel = "非密",
}) => {
  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  // 处理编辑按钮点击
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedMessage(message);
    if (onEdit) onEdit();
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onSaveEdit) onSaveEdit(editedMessage);
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message);
    if (onCancelEdit) onCancelEdit();
  };

  /**
   * 获取密级标签的样式
   * 根据密级返回对应的颜色样式
   */
  const getSecurityLevelStyle = () => {
    switch (securityLevel) {
      case "非密":
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-600 border border-green-200 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-500 dark:border-green-800/50";
      case "秘密":
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-600 border border-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-500 dark:border-yellow-800/50";
      case "机密":
        return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 border border-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-500 dark:border-orange-800/50";
      default:
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-600 border border-green-200 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-500 dark:border-green-800/50";
    }
  };

  // 渲染消息内容
  const renderMessageContent = () => {
    // 如果是文本消息且处于编辑状态，显示编辑框
    if (messageType === "text" && isEditing) {
      return (
        <div className="flex w-full flex-col gap-2">
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              取消
            </button>
            <button
              onClick={handleSaveEdit}
              className="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      );
    }

    switch (messageType) {
      case "image":
        return (
          <div className="mb-2">
            <div className="group relative">
              <div className="absolute flex size-full items-center justify-center rounded-lg bg-gray-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  data-tooltip-target="download-image"
                  className="inline-flex size-10 items-center justify-center rounded-full bg-white/30 hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement("a");
                    link.href = message;
                    link.download = message.split("/").pop() || "image";
                    link.click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      const link = document.createElement("a");
                      link.href = message;
                      link.download = message.split("/").pop() || "image";
                      link.click();
                    }
                  }}
                  aria-label="下载图片"
                >
                  <svg
                    className="size-5 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                    ></path>
                  </svg>
                </button>
                <div
                  id="download-image"
                  role="tooltip"
                  className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                >
                  下载图片
                  <div className="tooltip-arrow" data-popper-arrow=""></div>
                </div>
              </div>
              <button
                className="w-full border-0 bg-transparent p-0"
                onClick={() => window.open(message, "_blank")}
                onKeyDown={(e) =>
                  e.key === "Enter" && window.open(message, "_blank")
                }
                aria-label="查看大图"
              >
                <img
                  src={message}
                  alt="图片消息"
                  className="max-h-64 rounded-lg transition-opacity hover:opacity-90"
                />
              </button>
            </div>
          </div>
        );
      case "file":
        return (
          <div
            className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors ${
              isOwn
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500"
            }`}
          >
            <svg
              className={`size-8 ${
                isOwn ? "text-white" : "text-gray-500 dark:text-gray-400"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 7V2.13a2.98 2.98 0 0 0-1.293.749L4.879 5.707A2.98 2.98 0 0 0 4.13 7H9Z" />
              <path d="M18.066 2H11v5a2 2 0 0 1-2 2H4v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 20 20V4a1.97 1.97 0 0 0-1.934-2Z" />
            </svg>
            <div
              className={`text-sm font-medium ${
                isOwn ? "text-white" : "text-gray-900 dark:text-white"
              }`}
            >
              {message}
            </div>
            <svg
              className={`ml-auto size-5 ${
                isOwn ? "text-white" : "text-gray-500 dark:text-gray-400"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
        );
      case "voice":
        return (
          <div className="flex items-center gap-2">
            <button
              className={`rounded-full p-2 transition-colors ${
                isOwn
                  ? "bg-white/30 hover:bg-white/50"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
            >
              <svg
                className={`size-5 ${
                  isOwn ? "text-white" : "text-gray-600 dark:text-gray-300"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M10 8v8l6-4z" />
              </svg>
            </button>
            <div className="flex-1">
              <div
                className={`h-1.5 w-full rounded-full ${
                  isOwn ? "bg-white/30" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`h-1.5 w-1/3 rounded-full ${
                    isOwn ? "bg-white" : "bg-gray-400 dark:bg-gray-400"
                  }`}
                ></div>
              </div>
              <span
                className={`text-xs ${
                  isOwn ? "text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {message}
              </span>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="relative mb-2">
            <div
              className={`flex aspect-video items-center justify-center rounded-lg ${
                isOwn ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <svg
                className={`size-12 ${
                  isOwn ? "text-white" : "text-gray-500 dark:text-gray-400"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" />
              </svg>
            </div>
            <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
              {message}
            </div>
          </div>
        );
      case "location":
        return (
          <div className="mb-2">
            <div
              className={`flex h-32 items-center justify-center rounded-lg ${
                isOwn ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <svg
                className={`size-8 ${
                  isOwn ? "text-white" : "text-gray-500 dark:text-gray-400"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div
              className={`mt-1 text-sm ${
                isOwn ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {message}
            </div>
          </div>
        );
      case "link": {
        // 处理链接消息
        const linkData = message.includes(" - http")
          ? {
              title: message.split(" - ")[0],
              url: message.split(" - ").slice(1).join(" - "),
            }
          : {
              title: message,
              url: message,
            };

        const handleLinkClick = () => {
          window.open(linkData.url, "_blank");
        };

        return (
          <button
            className={`flex w-full items-center gap-2 rounded-lg p-3 text-left transition-colors ${
              isOwn
                ? "bg-white/20 hover:bg-white/30"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500"
            }`}
            onClick={handleLinkClick}
            onKeyDown={(e) => e.key === "Enter" && handleLinkClick()}
          >
            <div
              className={`shrink-0 rounded-lg p-2 ${
                isOwn ? "bg-white/30" : "bg-blue-100 dark:bg-blue-900"
              }`}
            >
              <svg
                className={`size-5 ${
                  isOwn ? "text-white" : "text-blue-600 dark:text-blue-300"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-1.889-1.889-4.954-1.889-6.843 0l-3.536 3.536c-1.889 1.889-1.889 4.954 0 6.843 1.889 1.889 4.954 1.889 6.843 0l1.414-1.414-1.414-1.414-1.414 1.414c-1.133 1.133-3.109 1.133-4.242 0-1.133-1.133-1.133-3.109 0-4.242l3.536-3.536z" />
                <path d="M12.707 4.465c-1.889-1.889-4.954-1.889-6.843 0-1.889 1.889-1.889 4.954 0 6.843l3.536 3.536c1.889 1.889 4.954 1.889 6.843 0 1.133-1.133 1.133-3.109 0-4.242l-1.414 1.414c1.133 1.133 1.133 3.109 0 4.242-1.133 1.133-3.109 1.133-4.242 0l-3.536-3.536c-1.133-1.133-1.133-3.109 0-4.242 1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707z" />
              </svg>
            </div>
            <div className="flex-1 overflow-hidden">
              <div
                className={`truncate text-sm font-medium ${
                  isOwn ? "text-white" : "text-blue-600 dark:text-blue-300"
                }`}
              >
                {linkData.title}
              </div>
              <div
                className={`truncate text-xs ${
                  isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {linkData.url}
              </div>
            </div>
            <svg
              className={`size-4 shrink-0 ${
                isOwn ? "text-white" : "text-gray-500 dark:text-gray-400"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        );
      }
      default:
        return (
          <p
            className={`text-sm font-normal ${
              isOwn
                ? "text-white drop-shadow-sm"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {message}
            {isEdited && (
              <span
                className={`ml-1 text-xs ${
                  isOwn
                    ? "text-blue-100 opacity-80"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                (已编辑)
              </span>
            )}
          </p>
        );
    }
  };

  /**
   * 渲染表情反应
   * 显示消息收到的表情反应
   *
   * @returns {JSX.Element} 表情反应元素
   */
  const renderReactions = () => {
    if (reactions.length === 0) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {reactions.map((reaction, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-600"
          >
            {reaction}{" "}
            <span className="ml-1 text-gray-500 dark:text-gray-400">1</span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`flex items-start gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}
    >
      {!isOwn && (
        <img
          className="size-8 rounded-full border-2 border-white shadow-md dark:border-gray-800"
          src={avatarSrc}
          alt={`${senderName} 的头像`}
        />
      )}
      <div
        className={`flex w-full max-w-[320px] flex-col gap-1 ${isOwn ? "items-end" : ""}`}
      >
        <div
          className={`flex items-center space-x-2 rtl:space-x-reverse ${isOwn ? "flex-row-reverse" : ""}`}
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {senderName}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {time}
          </span>
        </div>
        <div
          className={`relative flex flex-col rounded-xl p-3 ${
            isOwn
              ? "rounded-br-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400"
              : "rounded-tl-none bg-gradient-to-br from-gray-50 to-gray-100 shadow-md shadow-gray-200/50 border border-gray-200 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600 dark:shadow-gray-900/30"
          }`}
        >
          {replyTo && (
            <div className="mb-2 border-l-2 border-gray-300 pl-2 dark:border-gray-500">
              <div
                className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}
              >
                回复 {replyTo.sender}
              </div>
              <div
                className={`line-clamp-1 text-xs ${isOwn ? "text-blue-100" : "text-gray-600 dark:text-gray-300"}`}
              >
                {replyTo.message}
              </div>
            </div>
          )}
          {renderMessageContent()}
          {renderReactions()}
        </div>
        <div
          className={`flex items-center ${isOwn ? "justify-end" : "justify-start"}`}
        >
          {status && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {status}
            </span>
          )}
          <span
            className={`ml-2 rounded-md px-1.5 py-0.5 text-xs font-medium shadow-sm ${getSecurityLevelStyle()}`}
          >
            {securityLevel}
          </span>
        </div>
      </div>
      <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex items-center self-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-600 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
        type="button"
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
      <div
        id="dropdownDots"
        className="z-10 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-lg border border-gray-100 dark:divide-gray-600 dark:bg-gray-700 dark:border-gray-600"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconButton"
        >
          {onReply && (
            <li>
              <button
                onClick={onReply}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                回复
              </button>
            </li>
          )}
          {onForward && (
            <li>
              <button
                onClick={onForward}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                转发
              </button>
            </li>
          )}
          {onCopy && (
            <li>
              <button
                onClick={onCopy}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                复制
              </button>
            </li>
          )}
          {onEdit && isOwn && (
            <li>
              <button
                onClick={handleEditClick}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                编辑
              </button>
            </li>
          )}
          {onAddReaction && (
            <li>
              <div className="block w-full px-4 py-2 text-left">
                <div className="mb-1 text-gray-500 dark:text-gray-400">
                  添加表情
                </div>
                <div className="flex gap-2">
                  {["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onAddReaction(emoji)}
                      className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          )}
          {onReport && !isOwn && (
            <li>
              <button
                onClick={onReport}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                举报
              </button>
            </li>
          )}
          {onDelete && isOwn && (
            <li>
              <button
                onClick={onDelete}
                className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                删除
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatMessage;
