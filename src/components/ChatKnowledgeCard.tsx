import { Badge, Card } from "flowbite-react";
import { FC } from "react";
import {
  HiBookOpen,
  HiClock,
  HiDocument,
  HiEye,
  HiLink,
  HiTag,
} from "react-icons/hi";

interface ChatKnowledgeCardProps {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  author: string;
  authorAvatar: string;
  createdAt: string;
  lastUpdated?: string;
  viewCount?: number;
  attachments?: Array<{
    id: number;
    name: string;
    type: string;
    size?: string;
  }>;
  relatedTopics?: string[];
}

const ChatKnowledgeCard: FC<ChatKnowledgeCardProps> = ({
  title,
  content,
  category,
  tags,
  author,
  authorAvatar,
  createdAt,
  lastUpdated,
  viewCount,
  attachments,
  relatedTopics,
}) => {
  return (
    <Card className="max-w-lg overflow-hidden border-0 shadow-lg">
      <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
        <HiBookOpen className="h-full w-full text-blue-600 dark:text-blue-300" />
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
          <HiBookOpen className="h-7 w-7 text-white" />
        </div>
        <div>
          <div className="font-medium text-lg text-gray-900 dark:text-white line-clamp-1">
            {title}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 shadow-sm">
              {category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
        {content.length > 300 ? `${content.substring(0, 300)}...` : content}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              color="info"
              className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
            >
              <HiTag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {attachments && attachments.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <HiDocument className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            附件 ({attachments.length})
          </div>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <HiDocument className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {attachment.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {attachment.type}{" "}
                    {attachment.size && `• ${attachment.size}`}
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-full transition-colors duration-150">
                  <svg
                    className="w-4 h-4"
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
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedTopics && relatedTopics.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <HiLink className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            相关主题
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50 transition-colors duration-150"
              >
                <HiLink className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />
                {topic}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex items-center">
          <img
            src={authorAvatar}
            alt={author}
            className="h-6 w-6 rounded-full mr-1.5 border border-gray-200 dark:border-gray-700 shadow-sm"
          />
          <span className="font-medium">{author}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <HiClock className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-gray-500" />
            <span>{lastUpdated || createdAt}</span>
          </div>
          {viewCount !== undefined && (
            <div className="flex items-center">
              <HiEye className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-gray-500" />
              <span>{viewCount} 浏览</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3.5 py-2 text-center dark:from-blue-600 dark:to-blue-700 dark:focus:ring-blue-800 shadow-sm transition-all duration-150">
          查看详情
        </button>
      </div>
    </Card>
  );
};

export default ChatKnowledgeCard;
