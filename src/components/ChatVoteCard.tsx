import { Avatar, Badge, Progress, Tooltip } from "flowbite-react";
import { FC, useState } from "react";
import { HiCheckCircle, HiThumbUp } from "react-icons/hi";

export interface VoteOption {
  id: number;
  text: string;
  votes: number;
  voted?: boolean;
}

export interface ChatVoteCardProps {
  title: string;
  description?: string;
  options: VoteOption[];
  totalVotes: number;
  deadline?: string;
  creatorName: string;
  creatorAvatar: string;
  hasVoted: boolean;
  onVote: (optionId: number) => void;
}

const ChatVoteCard: FC<ChatVoteCardProps> = ({
  title,
  description,
  options,
  totalVotes,
  deadline,
  creatorName,
  creatorAvatar,
  hasVoted,
  onVote,
}) => {
  const [localOptions, setLocalOptions] = useState<VoteOption[]>(options);
  const [localHasVoted, setLocalHasVoted] = useState<boolean>(hasVoted);

  const handleVote = (optionId: number) => {
    if (localHasVoted) return;

    // 更新本地状态
    setLocalOptions(
      localOptions.map((opt) =>
        opt.id === optionId
          ? { ...opt, votes: opt.votes + 1, voted: true }
          : opt,
      ),
    );
    setLocalHasVoted(true);

    // 调用父组件的回调
    onVote(optionId);
  };

  // 计算投票百分比
  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round(
      (votes / (totalVotes + (localHasVoted && !hasVoted ? 1 : 0))) * 100,
    );
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge color="purple" className="px-2.5 py-1">
            <span className="flex items-center gap-1">
              <HiThumbUp className="h-3.5 w-3.5" />
              投票
            </span>
          </Badge>
          {deadline && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              截止日期: {deadline}
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>

      {description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}

      <div className="space-y-3 mb-4">
        {localOptions.map((option) => (
          <div
            key={option.id}
            className={`relative rounded-lg border border-gray-200 dark:border-gray-700 ${
              !localHasVoted
                ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                : ""
            } ${
              option.voted
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                : ""
            }`}
            onClick={() => !localHasVoted && handleVote(option.id)}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.text}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {calculatePercentage(option.votes)}%
                </span>
              </div>
              <div className="w-full">
                <Progress
                  progress={calculatePercentage(option.votes)}
                  color={option.voted ? "purple" : "blue"}
                  size="sm"
                />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {option.votes} 票
                </span>
                {option.voted && (
                  <HiCheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                )}
              </div>
            </div>

            {!localHasVoted && (
              <Tooltip content="点击投票">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/0 hover:bg-gray-900/5 dark:hover:bg-gray-700/30 rounded-lg transition-all duration-200"></div>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Avatar img={creatorAvatar} size="xs" rounded />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            由 {creatorName} 创建
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {totalVotes + (localHasVoted && !hasVoted ? 1 : 0)} 人参与
        </span>
      </div>
    </div>
  );
};

export default ChatVoteCard;
