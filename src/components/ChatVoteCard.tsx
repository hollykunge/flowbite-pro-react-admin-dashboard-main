import { Avatar, Badge, Progress, Tooltip } from "flowbite-react";
import { FC, useState } from "react";
import { HiCheckCircle, HiThumbUp, HiChartBar, HiClock } from "react-icons/hi";

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
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge
            color="blue"
            className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40"
          >
            <span className="flex items-center gap-1">
              <HiChartBar className="h-3.5 w-3.5" />
              投票
            </span>
          </Badge>
        </div>
        {deadline && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            <HiClock className="mr-1 h-3 w-3" />
            截止: {deadline}
          </div>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      {description && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-2 rounded-md border-l-4 border-blue-300 dark:border-blue-700">
          {description}
        </p>
      )}

      <div className="space-y-3.5 mb-4">
        {localOptions.map((option) => (
          <div
            key={option.id}
            className={`relative rounded-lg border ${
              !localHasVoted
                ? "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200"
                : option.voted
                  ? "border-blue-300 dark:border-blue-700"
                  : "border-gray-200 dark:border-gray-700"
            } ${
              option.voted
                ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                : !localHasVoted
                  ? "hover:bg-gray-50 dark:hover:bg-gray-700/60"
                  : ""
            }`}
            onClick={() => !localHasVoted && handleVote(option.id)}
          >
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${option.voted ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}
                >
                  {option.text}
                </span>
                <span
                  className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                    option.voted
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {calculatePercentage(option.votes)}%
                </span>
              </div>
              <div className="w-full">
                <Progress
                  progress={calculatePercentage(option.votes)}
                  color={option.voted ? "blue" : "gray"}
                  size="md"
                  className="rounded-full"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {option.votes} 票
                </span>
                {option.voted && (
                  <span className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                    <HiCheckCircle className="h-3.5 w-3.5 mr-1" />
                    已投票
                  </span>
                )}
              </div>
            </div>

            {!localHasVoted && (
              <Tooltip content="点击投票" placement="left">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/0 hover:bg-gray-900/5 dark:hover:bg-gray-700/30 rounded-lg transition-all duration-200"></div>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

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
        <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
          {totalVotes + (localHasVoted && !hasVoted ? 1 : 0)} 人参与
        </span>
      </div>
    </div>
  );
};

export default ChatVoteCard;
