import type { FC, FormEvent, KeyboardEvent, ChangeEvent } from "react";

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

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="chat" className="sr-only">
        您的消息
      </label>
      <div className="flex items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
        <button
          type="button"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="size-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              fill="currentColor"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
          </svg>
          <span className="sr-only">上传图片</span>
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="size-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
            />
          </svg>
          <span className="sr-only">添加表情</span>
        </button>
        <textarea
          id="chat"
          rows={1}
          className="mx-4 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="您的消息..."
          value={message}
          onChange={onMessageChange}
          onKeyPress={handleKeyPress}
        ></textarea>
        <button
          type="submit"
          className="inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            className="size-5 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">发送消息</span>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
