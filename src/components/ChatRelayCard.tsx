import { Avatar, Badge, Progress, Tooltip } from "flowbite-react";
import { FC } from "react";
import {
  HiCalendar,
  HiChatAlt,
  HiDocumentAdd,
  HiUser,
  HiUsers,
  HiClock,
  HiChevronRight,
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
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge
            color="purple"
            className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40"
          >
            <span className="flex items-center gap-1">
              <HiChatAlt className="h-3.5 w-3.5" />
              接龙
            </span>
          </Badge>
          <div
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              status === "ongoing"
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {status === "ongoing" ? "进行中" : "已结束"}
          </div>
        </div>
        {deadline && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            <HiClock className="mr-1 h-3 w-3" />
            截止: {deadline}
          </div>
        )}
      </div>

      <div className="mb-2">
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          onClick={() => onRelayClick && onRelayClick(id)}
        >
          {title}
        </h3>
      </div>

      {description && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-md border-l-4 border-purple-300 dark:border-purple-700">
          {description}
        </p>
      )}

      {/* 进度显示 */}
      {maxParticipants && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm text-purple-700 dark:text-purple-400">
              <HiUsers className="mr-1.5 h-4 w-4" />
              参与情况
            </div>
            <span className="text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
              {totalParticipants}/{maxParticipants}
            </span>
          </div>
          <Progress
            progress={completionPercentage}
            size="md"
            color="purple"
            className="rounded-full"
          />
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-purple-700 dark:text-purple-400">
              {completionPercentage}% 已完成
            </span>
            {status === "ongoing" && totalParticipants < maxParticipants && (
              <span className="text-xs text-purple-700 dark:text-purple-400">
                还剩 {maxParticipants - totalParticipants} 个名额
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-700/30 p-2.5 rounded-lg">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiUser className="mr-1.5 h-4 w-4 text-purple-500 dark:text-purple-400" />
          <span>
            已参与:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {totalParticipants} 人
            </span>
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiCalendar className="mr-1.5 h-4 w-4 text-purple-500 dark:text-purple-400" />
          <span>
            创建于:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {createdAt}
            </span>
          </span>
        </div>
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
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
        <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 flex justify-between items-center">
            <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400">
              参与者列表
            </h4>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {participants.length} 位参与者
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-start space-x-2.5 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200"
              >
                <Avatar img={participant.avatar} size="xs" rounded bordered />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {participant.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {participant.time}
                    </span>
                  </div>
                  <Tooltip content={participant.content} placement="bottom">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-full">
                      {participant.content}
                    </p>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
          {participants.length > 4 && (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-center">
              <button
                onClick={() => onRelayClick && onRelayClick(id)}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center justify-center w-full"
              >
                <span>查看全部</span>
                <HiChevronRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 底部创建者信息 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Avatar img={creatorAvatar} size="xs" rounded bordered />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            由{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {creatorName}
            </span>{" "}
            创建
          </span>
        </div>
      </div>

      {/* 参与接龙按钮 */}
      {status === "ongoing" && (
        <div className="mt-4">
          <button
            onClick={handleParticipate}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600"
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
