import type { FC } from "react";
import { useState } from "react";

/**
 * 语音消息组件属性接口
 * @interface VoiceMessageProps
 * @property {string} [duration] - 语音消息的时长
 * @property {boolean} [isOwn] - 是否为用户自己发送的消息
 * @property {() => void} [onPlay] - 播放按钮点击事件处理函数
 */
interface VoiceMessageProps {
  duration?: string;
  isOwn?: boolean;
  onPlay?: () => void;
}

/**
 * 语音消息组件
 * 用于在聊天消息中显示语音类型的消息，包括波形图和播放按钮
 */
const VoiceMessage: FC<VoiceMessageProps> = ({
  duration = "3:42",
  isOwn = false,
  onPlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * 处理播放按钮点击事件
   */
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div
      className={`flex w-full max-w-[320px] flex-col border-gray-200 p-4 leading-normal ${
        isOwn
          ? "rounded-s-xl rounded-ee-xl bg-blue-500 dark:bg-blue-600"
          : "rounded-e-xl rounded-es-xl bg-gray-100 dark:bg-gray-700"
      }`}
    >
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <button
          className={`inline-flex items-center self-center p-2 text-center text-sm font-medium ${
            isOwn
              ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          } rounded-lg focus:outline-none focus:ring-4`}
          type="button"
          onClick={handlePlay}
          aria-label={isPlaying ? "暂停语音" : "播放语音"}
        >
          <svg
            className={`size-4 ${isOwn ? "text-white" : "text-gray-800 dark:text-white"}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 12 16"
          >
            <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
          </svg>
        </button>
        <svg
          className="w-[145px] md:h-[40px] md:w-[185px]"
          aria-hidden="true"
          viewBox="0 0 185 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="17"
            width="3"
            height="6"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="7"
            y="15.5"
            width="3"
            height="9"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="21"
            y="6.5"
            width="3"
            height="27"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="14"
            y="6.5"
            width="3"
            height="27"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="28"
            y="3"
            width="3"
            height="34"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="35"
            y="3"
            width="3"
            height="34"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="42"
            y="5.5"
            width="3"
            height="29"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="49"
            y="10"
            width="3"
            height="20"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="56"
            y="13.5"
            width="3"
            height="13"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="63"
            y="16"
            width="3"
            height="8"
            rx="1.5"
            fill={isOwn ? "#FFFFFF" : "#6B7280"}
            className={isOwn ? "" : "dark:fill-white"}
          />
          <rect
            x="70"
            y="12.5"
            width="3"
            height="15"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="77"
            y="3"
            width="3"
            height="34"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="84"
            y="3"
            width="3"
            height="34"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="91"
            y="0.5"
            width="3"
            height="39"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="98"
            y="0.5"
            width="3"
            height="39"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="105"
            y="2"
            width="3"
            height="36"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="112"
            y="6.5"
            width="3"
            height="27"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="119"
            y="9"
            width="3"
            height="22"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="126"
            y="11.5"
            width="3"
            height="17"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="133"
            y="2"
            width="3"
            height="36"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="140"
            y="2"
            width="3"
            height="36"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="147"
            y="7"
            width="3"
            height="26"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="154"
            y="9"
            width="3"
            height="22"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="161"
            y="9"
            width="3"
            height="22"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="168"
            y="13.5"
            width="3"
            height="13"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="175"
            y="16"
            width="3"
            height="8"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="182"
            y="17.5"
            width="3"
            height="5"
            rx="1.5"
            fill={isOwn ? "#CCDDFF" : "#E5E7EB"}
            className={isOwn ? "" : "dark:fill-gray-500"}
          />
          <rect
            x="66"
            y="16"
            width="8"
            height="8"
            rx="4"
            fill={isOwn ? "#FFFFFF" : "#1C64F2"}
          />
        </svg>
        <span
          className={`inline-flex items-center self-center p-2 text-sm font-medium ${isOwn ? "text-white" : "text-gray-900 dark:text-white"}`}
        >
          {duration}
        </span>
      </div>
    </div>
  );
};

export default VoiceMessage;
