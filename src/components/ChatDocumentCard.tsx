import { Avatar, Card } from "flowbite-react";
import { FC } from "react";
import {
  FaFile,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import {
  HiCalendar,
  HiChat,
  HiDocumentText,
  HiLockClosed,
  HiPencil,
  HiUser,
  HiViewList,
} from "react-icons/hi";

interface DocumentCollaborator {
  id: number;
  name: string;
  avatar: string;
  role: "editor" | "viewer" | "owner";
}

interface ChatDocumentCardProps {
  title: string;
  content?: string;
  fileType: "word" | "excel" | "ppt" | "pdf" | "other";
  fileSize?: string;
  pageCount?: number;
  lastEditor: string;
  lastEditorAvatar: string;
  lastEditTime: string;
  collaborators?: DocumentCollaborator[];
  status: "editing" | "viewing" | "locked";
  version?: string;
  commentCount?: number;
}

const ChatDocumentCard: FC<ChatDocumentCardProps> = ({
  title,
  fileType,
  fileSize,
  pageCount,
  lastEditor,
  lastEditorAvatar,
  lastEditTime,
  collaborators,
  status,
  version,
  commentCount,
}) => {
  const getFileIcon = () => {
    switch (fileType) {
      case "word":
        return <FaFileWord className="h-7 w-7 text-blue-600" />;
      case "excel":
        return <FaFileExcel className="h-7 w-7 text-green-600" />;
      case "ppt":
        return <FaFilePowerpoint className="h-7 w-7 text-orange-600" />;
      case "pdf":
        return <FaFilePdf className="h-7 w-7 text-red-600" />;
      default:
        return <FaFile className="h-7 w-7 text-gray-600" />;
    }
  };

  const getFileColor = () => {
    switch (fileType) {
      case "word":
        return "from-blue-500 to-blue-600 text-white";
      case "excel":
        return "from-green-500 to-green-600 text-white";
      case "ppt":
        return "from-orange-500 to-orange-600 text-white";
      case "pdf":
        return "from-red-500 to-red-600 text-white";
      default:
        return "from-gray-500 to-gray-600 text-white";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "editing":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center shadow-sm">
            <HiPencil className="mr-1 h-3 w-3" />
            编辑中
          </span>
        );
      case "viewing":
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 flex items-center shadow-sm">
            <HiViewList className="mr-1 h-3 w-3" />
            浏览中
          </span>
        );
      case "locked":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 flex items-center shadow-sm">
            <HiLockClosed className="mr-1 h-3 w-3" />
            已锁定
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-lg overflow-hidden border-0 shadow-lg">
      <div className="flex items-center space-x-3">
        <div
          className={`h-14 w-14 rounded-lg bg-gradient-to-br ${getFileColor()} flex items-center justify-center shadow-md`}
        >
          {getFileIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
              {title}
            </h3>
            {getStatusBadge()}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <div className="flex items-center mr-3">
              <HiDocumentText className="mr-1 h-4 w-4" />
              {fileType.toUpperCase()}
              {fileSize && ` • ${fileSize}`}
            </div>
            {pageCount && (
              <div className="flex items-center">
                <span>{pageCount} 页</span>
              </div>
            )}
            {version && (
              <div className="ml-3 flex items-center">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  v{version}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <HiCalendar className="mr-1.5 h-4 w-4" />
          <span>最后编辑：{lastEditTime}</span>
        </div>
        {commentCount !== undefined && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <HiChat className="mr-1.5 h-4 w-4" />
            <span>{commentCount} 条评论</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <HiUser className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <div className="flex items-center">
            <img
              src={lastEditorAvatar}
              alt={lastEditor}
              className="h-6 w-6 rounded-full mr-1.5 border border-gray-200 dark:border-gray-700 shadow-sm"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {lastEditor}
            </span>
          </div>
        </div>
        {collaborators && collaborators.length > 0 && (
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map((collaborator) => (
              <Avatar
                key={collaborator.id}
                img={collaborator.avatar}
                rounded
                size="xs"
                stacked
                title={`${collaborator.name} (${collaborator.role === "editor" ? "编辑者" : collaborator.role === "owner" ? "所有者" : "查看者"})`}
                className="border-2 border-white dark:border-gray-800 shadow-sm"
              />
            ))}
            {collaborators.length > 3 && (
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs text-gray-600 border-2 border-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-800 shadow-sm">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-150 shadow-sm">
          查看
        </button>
        {status !== "locked" && (
          <button className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:from-blue-600 dark:to-blue-700 dark:focus:ring-blue-800 shadow-sm transition-all duration-150">
            <HiPencil className="mr-1.5 h-4 w-4" />
            {status === "editing" ? "继续编辑" : "编辑"}
          </button>
        )}
      </div>
    </Card>
  );
};

export default ChatDocumentCard;
