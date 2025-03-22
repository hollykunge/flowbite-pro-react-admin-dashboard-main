import { Avatar, Badge, Button, Card } from "flowbite-react";
import { FC } from "react";
import {
  HiCheck,
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
} from "react-icons/hi";

interface NoticeConfirmation {
  id: number;
  name: string;
  avatar: string;
  time: string;
}

interface NoticeAttachment {
  id: number;
  name: string;
  type: string;
  size?: string;
}

interface ChatNoticeCardProps {
  title: string;
  content: string;
  type: "welcome" | "rules" | "announcement" | "event";
  importance: "normal" | "important" | "urgent";
  expireDate?: string;
  attachments?: NoticeAttachment[];
  requireConfirmation?: boolean;
  confirmedBy?: NoticeConfirmation[];
}

const ChatNoticeCard: FC<ChatNoticeCardProps> = ({
  title,
  content,
  type,
  importance,
  expireDate,
  attachments,
  requireConfirmation,
  confirmedBy,
}) => {
  // 确定通知类型图标
  const getNoticeIcon = () => {
    switch (type) {
      case "welcome":
        return (
          <HiOutlineBell className="h-6 w-6 text-green-600 dark:text-green-400" />
        );
      case "rules":
        return (
          <HiOutlineExclamation className="h-6 w-6 text-red-600 dark:text-red-400" />
        );
      case "announcement":
        return (
          <HiOutlineInformationCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        );
      case "event":
        return (
          <HiOutlineCalendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        );
      default:
        return (
          <HiOutlineInformationCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        );
    }
  };

  // 确定通知重要性的样式
  const getImportanceBadge = () => {
    switch (importance) {
      case "normal":
        return (
          <Badge color="info" className="ml-2">
            一般
          </Badge>
        );
      case "important":
        return (
          <Badge color="yellow" className="ml-2">
            重要
          </Badge>
        );
      case "urgent":
        return (
          <Badge color="red" className="ml-2 animate-pulse">
            紧急
          </Badge>
        );
      default:
        return null;
    }
  };

  // 确定通知类型的名称
  const getNoticeTypeName = () => {
    switch (type) {
      case "welcome":
        return "欢迎";
      case "rules":
        return "群规则";
      case "announcement":
        return "公告";
      case "event":
        return "活动";
      default:
        return "通知";
    }
  };

  // 确定通知卡片的背景色及样式
  const getCardClassName = () => {
    let baseClass = "max-w-lg border-0 shadow-lg overflow-hidden";

    switch (importance) {
      case "normal":
        return `${baseClass} border-gray-200 dark:border-gray-700`;
      case "important":
        return `${baseClass} border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20`;
      case "urgent":
        return `${baseClass} border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20`;
      default:
        return baseClass;
    }
  };

  // 确定通知图标的背景样式
  const getIconStyle = () => {
    switch (type) {
      case "welcome":
        return "bg-gradient-to-br from-green-400 to-green-600 text-white";
      case "rules":
        return "bg-gradient-to-br from-red-400 to-red-600 text-white";
      case "announcement":
        return "bg-gradient-to-br from-blue-400 to-blue-600 text-white";
      case "event":
        return "bg-gradient-to-br from-purple-400 to-purple-600 text-white";
      default:
        return "bg-gradient-to-br from-blue-400 to-blue-600 text-white";
    }
  };

  return (
    <Card className={getCardClassName()}>
      <div className="absolute right-0 top-0 h-32 w-32 opacity-5">
        {getNoticeIcon()}
      </div>
      <div className="flex items-center space-x-3">
        <div className={`rounded-lg ${getIconStyle()} p-3 shadow-md`}>
          {getNoticeIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
              {title}
            </h3>
            {getImportanceBadge()}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
              {getNoticeTypeName()}
            </span>
            {expireDate && (
              <span className="flex items-center text-xs">
                <HiOutlineCalendar className="mr-1 h-3 w-3" />
                {expireDate}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 p-4 rounded-lg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
        {content}
      </div>

      {attachments && attachments.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <HiOutlineDocumentText className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1.5" />
            附件 ({attachments.length})
          </div>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <HiOutlineDocumentText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
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

      {requireConfirmation && (
        <div className="mt-4">
          {confirmedBy && confirmedBy.length > 0 ? (
            <div className="flex flex-col space-y-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <HiCheck className="mr-1.5 h-4 w-4" />
                <span className="font-medium">已确认阅读</span>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {confirmedBy.map((person) => (
                  <Avatar
                    key={person.id}
                    img={person.avatar}
                    rounded
                    size="xs"
                    stacked
                    title={`${person.name} (${person.time})`}
                    className="border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                ))}
                {confirmedBy.length > 5 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    +{confirmedBy.length - 5} 人
                  </span>
                )}
              </div>
            </div>
          ) : (
            <Button
              color="success"
              size="sm"
              className="w-full shadow-sm transition-all duration-150 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0"
            >
              <HiOutlineClipboardCheck className="mr-2 h-4 w-4" />
              确认已阅
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default ChatNoticeCard;
