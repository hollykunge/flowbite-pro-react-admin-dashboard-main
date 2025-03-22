import { FC } from "react";

/**
 * 话题表单组件属性
 */
interface TopicFormProps {
  /**
   * 话题标题
   */
  title: string;
  /**
   * 话题内容
   */
  content: string;
  /**
   * 标题变更回调
   */
  onTitleChange: (title: string) => void;
  /**
   * 内容变更回调
   */
  onContentChange: (content: string) => void;
  /**
   * 创建话题回调
   */
  onCreateTopic: () => void;
  /**
   * 取消创建话题回调
   */
  onCancel: () => void;
}

/**
 * 话题表单组件
 *
 * 用于创建新话题的表单组件
 */
const TopicForm: FC<TopicFormProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onCreateTopic,
  onCancel,
}) => {
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-900 dark:text-white">
          创建新话题
        </h3>
        <button
          onClick={onCancel}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          title="关闭"
        >
          <svg
            className="size-4"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="topic-title"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            话题标题
          </label>
          <input
            type="text"
            id="topic-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="请输入话题标题"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="topic-content"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            话题内容
          </label>
          <textarea
            id="topic-content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="请输入话题内容"
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            取消
          </button>
          <button
            onClick={onCreateTopic}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            disabled={!title.trim() || !content.trim()}
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicForm;
