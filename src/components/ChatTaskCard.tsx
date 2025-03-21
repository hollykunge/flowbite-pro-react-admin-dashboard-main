import { Avatar, Badge, Progress, Tooltip } from "flowbite-react";
import { FC, useState } from "react";
import {
  HiCalendar,
  HiClipboardCheck,
  HiClock,
  HiThumbDown,
  HiThumbUp,
  HiUser,
  HiFire,
  HiTag,
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

  // 优先级对应的颜色和图标
  const priorityConfig = {
    low: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      label: "低优先级",
    },
    medium: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      label: "中优先级",
    },
    high: {
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
      label: "高优先级",
    },
    urgent: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      label: "紧急",
    },
  };

  // 状态对应的颜色和标签
  const statusConfig = {
    pending: {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      buttonColor: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white",
      label: "待办",
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      buttonColor: "bg-blue-600 text-white dark:bg-blue-700 dark:text-white",
      label: "进行中",
    },
    completed: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      buttonColor: "bg-green-600 text-white dark:bg-green-700 dark:text-white",
      label: "已完成",
    },
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge
            color="indigo"
            className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40"
          >
            <span className="flex items-center gap-1">
              <HiClipboardCheck className="h-3.5 w-3.5" />
              任务
            </span>
          </Badge>
          <div
            className={`flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityConfig[priority].color}`}
          >
            {priority === "urgent" && <HiFire className="mr-1 h-3 w-3" />}
            {priorityConfig[priority].label}
          </div>
        </div>
        <div
          className={`flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${statusConfig[localStatus as keyof typeof statusConfig].color}`}
        >
          {statusConfig[localStatus as keyof typeof statusConfig].label}
        </div>
      </div>

      <div className="mb-2">
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          onClick={() => onTaskClick && onTaskClick(id)}
        >
          {title}
        </h3>
      </div>

      {description && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-md border-l-4 border-indigo-300 dark:border-indigo-700">
          {description}
        </p>
      )}

      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiClock className="mr-1.5 h-4 w-4" />
            进度
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              progress >= 80
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                : progress >= 40
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {progress}%
          </span>
        </div>
        <Progress
          progress={progress}
          size="md"
          color={progress >= 80 ? "green" : progress >= 40 ? "blue" : "gray"}
          className="rounded-full"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-700/30 p-2.5 rounded-lg">
        {dueDate && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiCalendar className="mr-1.5 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span>
              截止:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {dueDate}
              </span>
            </span>
          </div>
        )}
        {assignees.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiUser className="mr-1.5 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span>
              负责人:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {assignees.length}
              </span>
            </span>
          </div>
        )}
      </div>

      {assignees.length > 0 && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              团队成员
            </h4>
            {assignees.length > 4 && (
              <span className="text-xs text-indigo-600 dark:text-indigo-400">
                共 {assignees.length} 人
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {assignees.map((assignee) => (
              <Tooltip key={assignee.id} content={assignee.name}>
                <Avatar img={assignee.avatar} rounded bordered size="sm" />
              </Tooltip>
            ))}
          </div>
        </div>
      )}

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <HiTag className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-1" />
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
          <Avatar img={creatorAvatar} size="xs" rounded bordered />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            由{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {creatorName}
            </span>{" "}
            创建于 {createdAt}
          </span>
        </div>
      </div>

      {/* 状态切换和处理按钮组 */}
      <div className="grid grid-cols-1 gap-3 mt-4">
        <div className="flex w-full rounded-md overflow-hidden">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-medium transition-colors duration-200 ${
              localStatus === "pending"
                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleStatusChange("pending")}
          >
            待办
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-medium transition-colors duration-200 ${
              localStatus === "in-progress"
                ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleStatusChange("in-progress")}
          >
            进行中
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-medium transition-colors duration-200 ${
              localStatus === "completed"
                ? "bg-green-600 text-white dark:bg-green-700 dark:text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleStatusChange("completed")}
          >
            已完成
          </button>
        </div>
      </div>

      {/* 处理/拒绝任务按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          onClick={handleAccept}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          <HiThumbUp className="h-4 w-4" />
          处理
        </button>
        <button
          onClick={handleReject}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <HiThumbDown className="h-4 w-4" />
          拒绝
        </button>
      </div>
    </div>
  );
};

export default ChatTaskCard;
