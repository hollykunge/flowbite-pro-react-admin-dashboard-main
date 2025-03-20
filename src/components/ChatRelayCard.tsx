import { Avatar, Badge, Progress } from "flowbite-react";
import { FC } from "react";
import {
  HiCalendar,
  HiChatAlt,
  HiDocumentAdd,
  HiUser,
  HiUsers,
} from "react-icons/hi";

// 参与者类型定义
interface RelayParticipant {
  id: number;
  name: string;
  avatar: string;
  content: string;
  time: string;
}

// 接龙卡片属性
export interface ChatRelayCardProps {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  createdAt: string;
  creatorName: string;
  creatorAvatar: string;
  participants: RelayParticipant[];
  totalParticipants: number;
  maxParticipants?: number;
  status: "ongoing" | "completed";
  tags?: string[];
  onParticipate?: (relayId: number) => void;
  onRelayClick?: (relayId: number) => void;
}

const ChatRelayCard: FC<ChatRelayCardProps> = ({
  id,
  title,
  description,
  deadline,
  createdAt,
  creatorName,
  creatorAvatar,
  participants,
  totalParticipants,
  maxParticipants,
  status,
  tags = [],
  onParticipate,
  onRelayClick,
}) => {
  // 计算完成百分比
  const completionPercentage = maxParticipants
    ? Math.min(Math.round((totalParticipants / maxParticipants) * 100), 100)
    : Math.min(totalParticipants * 10, 100);

  // 处理参与接龙
  const handleParticipate = () => {
    if (onParticipate) onParticipate(id);
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge color="purple" className="px-2.5 py-1">
            <span className="flex items-center gap-1">
              <HiChatAlt className="h-3.5 w-3.5" />
              接龙
            </span>
          </Badge>
          <div
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              status === "ongoing"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {status === "ongoing" ? "进行中" : "已结束"}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <h3
          className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
          onClick={() => onRelayClick && onRelayClick(id)}
        >
          {title}
        </h3>
      </div>

      {description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}

      {/* 进度显示 */}
      {maxParticipants && (
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <HiUsers className="mr-1.5 h-4 w-4" />
              参与情况:
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {totalParticipants}/{maxParticipants}
            </span>
          </div>
          <Progress progress={completionPercentage} size="sm" color="purple" />
        </div>
      )}

      <div className="mb-3 grid grid-cols-2 gap-2">
        {deadline && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiCalendar className="mr-1.5 h-4 w-4" />
            截止时间: {deadline}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiUser className="mr-1.5 h-4 w-4" />
          已参与: {totalParticipants} 人
        </div>
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 参与者列表 */}
      {participants.length > 0 && (
        <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            参与者列表
          </h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-start space-x-2 border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0"
              >
                <Avatar img={participant.avatar} size="xs" rounded />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {participant.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {participant.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {participant.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部创建者信息 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Avatar img={creatorAvatar} size="xs" rounded />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            由 {creatorName} 创建于 {createdAt}
          </span>
        </div>
      </div>

      {/* 参与接龙按钮 */}
      {status === "ongoing" && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleParticipate}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            <HiDocumentAdd className="h-4 w-4" />
            参与接龙
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRelayCard;
