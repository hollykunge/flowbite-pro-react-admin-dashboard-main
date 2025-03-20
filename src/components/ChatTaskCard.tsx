import { Avatar, Badge, Progress } from "flowbite-react";
import { FC, useState } from "react";
import {
  HiCalendar,
  HiClipboardCheck,
  HiClock,
  HiThumbDown,
  HiThumbUp,
  HiUser,
} from "react-icons/hi";

export interface TaskAssignee {
  id: number;
  name: string;
  avatar: string;
  status?: "pending" | "in-progress" | "completed";
}

export interface ChatTaskCardProps {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt: string;
  creatorName: string;
  creatorAvatar: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed";
  progress?: number;
  assignees: TaskAssignee[];
  tags?: string[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick?: (taskId: number) => void;
  onAccept?: (taskId: number) => void;
  onReject?: (taskId: number) => void;
}

const ChatTaskCard: FC<ChatTaskCardProps> = ({
  id,
  title,
  description,
  dueDate,
  createdAt,
  creatorName,
  creatorAvatar,
  priority,
  status,
  progress = 0,
  assignees,
  tags = [],
  onStatusChange,
  onTaskClick,
  onAccept,
  onReject,
}) => {
  const [localStatus, setLocalStatus] = useState<string>(status);

  const handleStatusChange = (newStatus: string) => {
    setLocalStatus(newStatus);
    onStatusChange(id, newStatus);
  };

  // 处理任务
  const handleAccept = () => {
    if (onAccept) onAccept(id);
  };

  // 拒绝任务
  const handleReject = () => {
    if (onReject) onReject(id);
  };

  // 优先级对应的颜色
  const priorityColor = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  // 状态对应的颜色
  const statusColor = {
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    "in-progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge color="indigo" className="px-2.5 py-1">
            <span className="flex items-center gap-1">
              <HiClipboardCheck className="h-3.5 w-3.5" />
              任务
            </span>
          </Badge>
          <div
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityColor[priority]}`}
          >
            {priority === "low" && "低优先级"}
            {priority === "medium" && "中优先级"}
            {priority === "high" && "高优先级"}
            {priority === "urgent" && "紧急"}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <h3
          className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          onClick={() => onTaskClick && onTaskClick(id)}
        >
          {title}
        </h3>
      </div>

      {description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}

      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiClock className="mr-1.5 h-4 w-4" />
            进度:
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {progress}%
          </span>
        </div>
        <Progress progress={progress} size="sm" color="indigo" />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        {dueDate && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiCalendar className="mr-1.5 h-4 w-4" />
            截止日期: {dueDate}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiUser className="mr-1.5 h-4 w-4" />
          负责人: {assignees.length}
        </div>
      </div>

      {assignees.length > 0 && (
        <div className="mb-4">
          <div className="flex -space-x-2 mb-2">
            {assignees.slice(0, 4).map((assignee) => (
              <Avatar
                key={assignee.id}
                img={assignee.avatar}
                rounded
                size="xs"
                stacked
              />
            ))}
            {assignees.length > 4 && (
              <div className="flex items-center justify-center size-6 rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400">
                +{assignees.length - 4}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 任务底部操作部分 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Avatar img={creatorAvatar} size="xs" rounded />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            由 {creatorName} 创建于 {createdAt}
          </span>
        </div>
        <div className="flex items-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-2 py-1 text-xs font-medium rounded-l-lg border border-gray-200 ${
                localStatus === "pending"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              }`}
              onClick={() => handleStatusChange("pending")}
            >
              待办
            </button>
            <button
              type="button"
              className={`px-2 py-1 text-xs font-medium border-t border-b border-gray-200 ${
                localStatus === "in-progress"
                  ? "bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              }`}
              onClick={() => handleStatusChange("in-progress")}
            >
              进行中
            </button>
            <button
              type="button"
              className={`px-2 py-1 text-xs font-medium rounded-r-lg border border-gray-200 ${
                localStatus === "completed"
                  ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              }`}
              onClick={() => handleStatusChange("completed")}
            >
              已完成
            </button>
          </div>
        </div>
      </div>

      {/* 处理/拒绝任务按钮 - 移到底部 */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleAccept}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600"
        >
          <HiThumbUp className="h-4 w-4" />
          处理
        </button>
        <button
          onClick={handleReject}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
        >
          <HiThumbDown className="h-4 w-4" />
          拒绝
        </button>
      </div>
    </div>
  );
};

export default ChatTaskCard;
