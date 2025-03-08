import { Button } from "flowbite-react";
import type { ChangeEvent, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { HiCog, HiSearch, HiUserAdd } from "react-icons/hi";
import ChatFileMessage from "../components/ChatFileMessage";
import ChatMessage from "../components/ChatMessage";
import ChatVoiceMessage from "../components/ChatVoiceMessage";
import type { MessageSecurityLevel } from "../components/MessageInput";
import MessageInput from "../components/MessageInput";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

/**
 * 消息类型定义
 * @interface MessageType
 */
interface MessageType {
  id: number;
  sender: string;
  avatarSrc: string;
  content: string;
  time: string;
  status?: string;
  messageType:
    | "text"
    | "image"
    | "file"
    | "voice"
    | "video"
    | "location"
    | "link";
  isOwn?: boolean;
  replyTo?: {
    sender: string;
    message: string;
  };
  reactions?: string[];
  isEdited?: boolean;
  securityLevel: MessageSecurityLevel;
}

/**
 * 自定义抽屉组件
 */
const SettingsDrawer: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        tabIndex={0}
        role="button"
        aria-label="关闭设置面板"
      ></div>
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="relative w-screen max-w-xs">
          <div className="flex h-full flex-col overflow-y-auto bg-white py-4 shadow-xl dark:bg-gray-800">
            <div className="px-4">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  聊天设置
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭面板</span>
                    <svg
                      className="size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="relative mt-4 flex-1 px-4">
              <div className="space-y-4">
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  在这里您可以调整聊天设置，管理通知，以及自定义您的聊天体验。
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    通知设置
                  </button>
                  <button className="inline-flex items-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    高级设置&nbsp;
                    <svg
                      className="ms-2 size-3.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 研讨页面组件
 *
 * 显示研讨相关内容和功能，采用类似聊天界面的布局，包含左侧会话列表
 */
const DiscussionPage: FC = function () {
  const [message, setMessage] = useState("");
  const [activeDiscussionId, setActiveDiscussionId] = useState(1);
  const [activeTab, setActiveTab] = useState("messages");
  const [messageFilter, setMessageFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 添加组织导航状态
  const [organizationLevel, setOrganizationLevel] = useState<
    "institute" | "department"
  >("institute");
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(
    null,
  );

  // 禁用外部框架的垂直滚动
  useEffect(() => {
    // 获取主内容区域元素
    const mainContent = document.querySelector("main");
    if (mainContent) {
      // 禁用滚动
      mainContent.style.overflow = "hidden";
    }

    // 组件卸载时恢复滚动
    return () => {
      if (mainContent) {
        mainContent.style.overflow = "";
      }
    };
  }, []);

  // 使用 ref 跟踪滚动容器
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 处理滚动事件，只在滚动时显示滚动条
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.classList.add("scrolling");

    // 清除之前的定时器
    const timerId = target.dataset["scrollTimer"];
    if (timerId) {
      window.clearTimeout(parseInt(timerId));
    }

    // 设置新的定时器，1秒后隐藏滚动条
    const newTimerId = window.setTimeout(() => {
      target.classList.remove("scrolling");
    }, 1000);

    target.dataset["scrollTimer"] = newTimerId.toString();
  };

  // 模拟的研讨会话列表数据 - 更新为新的格式
  const [discussionList, setDiscussionList] = useState([
    {
      id: 1,
      name: "张小明",
      avatar: "/images/users/roberta-casas.png",
      lastMessage: "正在输入...",
      time: "18:05",
      unread: 0,
      status: "online",
      isTyping: true,
      category: "recent",
      members: 5,
      tag: "团队",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 2,
      name: "李华",
      avatar: "/images/users/leslie-livingston.png",
      lastMessage: "好的，我们可以做到！🔥",
      time: "14:23",
      unread: 0,
      status: "online",
      category: "recent",
      members: 2,
      tag: "私聊",
      securityLevel: "秘密" as MessageSecurityLevel,
    },
    {
      id: 3,
      name: "王强",
      avatar: "/images/users/neil-sims.png",
      lastMessage: "语音消息",
      time: "10:02",
      unread: 4,
      status: "offline",
      isVoiceMessage: true,
      category: "recent",
      members: 3,
      tag: "项目",
      securityLevel: "机密" as MessageSecurityLevel,
    },
    {
      id: 4,
      name: "赵敏",
      avatar: "/images/users/michael-gough.png",
      lastMessage: "没关系，我会从车站取回物品并带回办公室。",
      time: "07:45",
      unread: 0,
      status: "online",
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 5,
      name: "陈静",
      avatar: "/images/users/bonnie-green.png",
      lastMessage: "发送了一张照片",
      time: "15h",
      unread: 0,
      status: "offline",
      isPhoto: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "秘密" as MessageSecurityLevel,
    },
    {
      id: 6,
      name: "产品研发群",
      avatar: "/images/users/lana-byrd.png",
      lastMessage: "🎉 太棒了，我们走吧！",
      time: "16h",
      unread: 0,
      status: "online",
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 7,
      name: "市场部小组",
      avatar: "/images/users/helene-engels.png",
      lastMessage: "是的，我们可以做到！🔥",
      time: "18h",
      unread: 0,
      status: "offline",
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "机密" as MessageSecurityLevel,
    },
    {
      id: 9,
      name: "技术交流群",
      avatar: "/images/users/thomas-lean.png",
      lastMessage: "语音消息",
      time: "2d",
      unread: 0,
      status: "offline",
      isVoiceMessage: true,
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "秘密" as MessageSecurityLevel,
    },
    {
      id: 10,
      name: "吴鑫",
      avatar: "/images/users/robert-brown.png",
      lastMessage: "好久不见，最近怎么样兄弟？",
      time: "1w",
      unread: 0,
      status: "offline",
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 11,
      name: "项目管理群",
      avatar: "/images/users/joseph-mcfall.png",
      lastMessage: "我们下个月再做吧",
      time: "04.03.2025",
      unread: 0,
      status: "online",
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "机密" as MessageSecurityLevel,
    },
  ]);

  // 模拟的研讨消息数据 - 更新为适配ChatMessage组件的格式并丰富消息类型
  const [discussions, setDiscussions] = useState<MessageType[]>([
    {
      id: 1,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "大家好，我们今天讨论一下项目进度",
      time: "10:30",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 2,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "好的，我这边的模块已经完成了80%",
      time: "10:32",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 3,
      sender: "王五",
      avatarSrc: "/images/users/thomas-lean.png",
      content: "我负责的部分遇到了一些问题，需要大家帮忙",
      time: "10:35",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 4,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "我可以帮忙解决，请详细说明一下问题",
      time: "10:36",
      status: "已读",
      messageType: "text",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 5,
      sender: "王五",
      avatarSrc: "/images/users/thomas-lean.png",
      content: "主要是API集成部分出现了兼容性问题",
      time: "10:38",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 6,
      sender: "王五",
      avatarSrc: "/images/users/thomas-lean.png",
      content: "../images/kanban/task-1.jpg",
      time: "10:39",
      status: "已读",
      messageType: "image",
      securityLevel: "非密",
    },
    {
      id: 7,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "我看到问题了，这是版本不匹配导致的",
      time: "10:40",
      status: "已读",
      messageType: "text",
      isOwn: true,
      replyTo: {
        sender: "王五",
        message: "主要是API集成部分出现了兼容性问题",
      },
      securityLevel: "非密",
    },
    {
      id: 8,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "项目文档.pdf",
      time: "10:42",
      status: "已读",
      messageType: "file",
      securityLevel: "非密",
    },
    {
      id: 9,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "语音说明 (0:30)",
      time: "10:45",
      status: "已读",
      messageType: "voice",
      securityLevel: "非密",
    },
    {
      id: 10,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "我已经修复了API问题，大家可以更新代码测试一下",
      time: "10:50",
      status: "已读",
      messageType: "text",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 11,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "太好了，我马上测试",
      time: "10:52",
      status: "已读",
      messageType: "text",
      replyTo: {
        sender: "我",
        message: "我已经修复了API问题，大家可以更新代码测试一下",
      },
      securityLevel: "非密",
    },
    {
      id: 13,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "这是我们的项目时间线，请大家查看一下",
      time: "10:56",
      status: "已读",
      messageType: "text",
      replyTo: {
        sender: "张三",
        message: "../images/users/neil-sims.png",
      },
      securityLevel: "非密",
    },
    {
      id: 14,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "语音消息 (3:42)",
      time: "11:00",
      status: "已读",
      messageType: "voice",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 15,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "Flowbite Terms & Conditions.pdf",
      time: "11:05",
      status: "已读",
      messageType: "file",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 16,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "../images/kanban/task-2.jpg",
      time: "11:10",
      status: "已读",
      messageType: "image",
      isOwn: true,
      securityLevel: "非密",
    },
  ]);

  // 处理回复消息
  const handleReplyMessage = (id: number) => {
    const messageToReply = discussions.find((msg) => msg.id === id);
    if (messageToReply) {
      setReplyingTo(messageToReply);
    }
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // 添加表情反应
  const handleAddReaction = (id: number, reaction: string) => {
    setDiscussions(
      discussions.map((msg) => {
        if (msg.id === id) {
          const currentReactions = msg.reactions || [];
          // 如果已经有这个表情，则移除它（切换功能）
          if (currentReactions.includes(reaction)) {
            return {
              ...msg,
              reactions: currentReactions.filter((r) => r !== reaction),
            };
          }
          // 否则添加这个表情
          return {
            ...msg,
            reactions: [...currentReactions, reaction],
          };
        }
        return msg;
      }),
    );
  };

  // 编辑消息
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");

  const handleEditMessage = (id: number) => {
    const messageToEdit = discussions.find((msg) => msg.id === id);
    if (messageToEdit) {
      setEditingMessageId(id);
      setEditedMessageContent(messageToEdit.content);
    }
  };

  const handleSaveEdit = (content?: string) => {
    if (
      editingMessageId !== null &&
      (content || editedMessageContent.trim() !== "")
    ) {
      setDiscussions(
        discussions.map((msg) => {
          if (msg.id === editingMessageId) {
            return {
              ...msg,
              content: content || editedMessageContent,
              isEdited: true,
            };
          }
          return msg;
        }),
      );
      setEditingMessageId(null);
      setEditedMessageContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessageContent("");
  };

  // 消息类型状态
  const [messageType, setMessageType] =
    useState<MessageType["messageType"]>("text");

  // 处理链接输入
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  // 发送链接
  const handleSendLink = () => {
    if (linkUrl.trim() !== "") {
      const newMessage: MessageType = {
        id: discussions.length + 1,
        sender: "我",
        avatarSrc: "/images/users/michael-gough.png",
        content: linkTitle || linkUrl,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "已发送",
        messageType: "link",
        isOwn: true,
        securityLevel: "非密",
      };
      setDiscussions([...discussions, newMessage]);
      setLinkUrl("");
      setLinkTitle("");
      setShowLinkInput(false);
      setMessageType("text");
    }
  };

  const handleCancelLink = () => {
    setLinkUrl("");
    setLinkTitle("");
    setShowLinkInput(false);
    setMessageType("text");
  };

  // 发送新消息的处理函数
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: MessageType = {
        id: discussions.length + 1,
        sender: "我",
        avatarSrc: "/images/users/michael-gough.png", // 当前用户头像
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "已发送",
        messageType: messageType,
        isOwn: true, // 标记为自己发送的消息
        reactions: [],
        ...(replyingTo && {
          replyTo: {
            sender: replyingTo.sender,
            message: replyingTo.content,
          },
        }),
        securityLevel: securityLevel, // 使用当前选择的密级
      };
      setDiscussions([...discussions, newMessage]);
      setMessage("");
      setReplyingTo(null); // 发送后清除回复状态
      setMessageType("text"); // 重置为文本消息类型

      // 更新会话列表中的最后一条消息
      const updatedList = discussionList.map((item) => {
        if (item.id === activeDiscussionId) {
          return {
            ...item,
            lastMessage:
              messageType === "text"
                ? message
                : `[${messageType === "image" ? "图片" : messageType === "file" ? "文件" : messageType === "voice" ? "语音" : messageType === "link" ? "链接" : "消息"}]`,
            time: "刚刚",
            securityLevel: securityLevel, // 更新密级
          };
        }
        return item;
      });
      setDiscussionList(updatedList);
    }
  };

  // 处理消息内容变化
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // 切换当前活跃的研讨会话
  const handleSelectDiscussion = (id: number) => {
    setActiveDiscussionId(id);
    // 在实际应用中，这里应该根据id加载对应的消息记录
  };

  // 消息操作处理函数
  const handleForwardMessage = (id: number) => {
    console.log(`转发消息: ${id}`);
  };

  const handleCopyMessage = (id: number) => {
    console.log(`复制消息: ${id}`);
  };

  const handleReportMessage = (id: number) => {
    console.log(`举报消息: ${id}`);
  };

  const handleDeleteMessage = (id: number) => {
    console.log(`删除消息: ${id}`);
    // 实际应用中应该从列表中删除该消息
    setDiscussions(discussions.filter((msg) => msg.id !== id));
  };

  // 处理标签页切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 处理消息类型筛选
  const handleMessageFilterChange = (filter: string) => {
    setMessageFilter(filter);
  };

  // 处理设置抽屉的打开和关闭
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  // 添加状态来管理消息密级
  const [securityLevel, setSecurityLevel] =
    useState<MessageSecurityLevel>("非密");

  // 处理研究院点击事件
  const handleInstituteClick = (instituteId: number) => {
    setSelectedInstitute(instituteId);
    setOrganizationLevel("department");
  };

  // 处理返回上级组织
  const handleBackToInstitutes = () => {
    setSelectedInstitute(null);
    setOrganizationLevel("institute");
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex h-full flex-col">
        <div className="flex h-full overflow-hidden">
          <div className="flex h-full w-1/4 flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <ul
                className="-mb-px grid grid-cols-2 text-center text-xs font-medium"
                role="tablist"
              >
                <li role="presentation">
                  <button
                    className={`flex w-full items-center justify-center rounded-t-lg border-b px-3 py-4 ${
                      activeTab === "messages"
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white"
                    }`}
                    onClick={() => handleTabChange("messages")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "messages"}
                  >
                    <svg
                      className="me-1.5 size-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    消息坞
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`flex w-full items-center justify-center rounded-t-lg border-b px-3 py-4 ${
                      activeTab === "contacts"
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white"
                    }`}
                    onClick={() => handleTabChange("contacts")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "contacts"}
                  >
                    <svg
                      className="me-1.5 size-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
                    </svg>
                    通讯录
                  </button>
                </li>
              </ul>
            </div>
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [&.scrolling]:opacity-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/0 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
            >
              {/* 消息坞标签页内容 */}
              {activeTab === "messages" && (
                <div>
                  {/* 最新消息分类 - 固定在顶部 */}
                  <div className="sticky top-0 z-10 bg-white px-4 py-1 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        最新
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          className={`rounded-full p-1 ${
                            messageFilter === "unread"
                              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleMessageFilterChange("unread")}
                          title="未读消息"
                        >
                          <svg
                            className="size-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9Z" />
                            <path d="M7 5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1H7V5Zm0 3h10v8a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V8Z" />
                          </svg>
                        </button>
                        <button
                          className={`rounded-full p-1 ${
                            messageFilter === "group"
                              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleMessageFilterChange("group")}
                          title="群组消息"
                        >
                          <svg
                            className="size-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M15 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
                            <path d="M16.25 7.5a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z" />
                            <path d="M18 16.5h-4.74c-.28-.9-.71-1.72-1.26-2.44.4-.19.79-.31 1.16-.31h5.5a2.75 2.75 0 0 1 0 5.5h-1a.75.75 0 0 1 0-1.5h1a1.25 1.25 0 1 0 0-2.5v1.25a.75.75 0 0 1-1.5 0v-1.25a.75.75 0 0 1 .75-.75h.09Z" />
                            <path d="M9 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
                            <path d="M10.25 7.5a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z" />
                            <path d="M6 16.5h4.74c.28-.9.71-1.72 1.26-2.44-.4-.19-.79-.31-1.16-.31h-5.5a2.75 2.75 0 0 0 0 5.5h1a.75.75 0 0 0 0-1.5h-1a1.25 1.25 0 1 1 0-2.5v1.25a.75.75 0 0 0 1.5 0v-1.25a.75.75 0 0 0-.75-.75H6Z" />
                          </svg>
                        </button>
                        <button
                          className={`rounded-full p-1 ${
                            messageFilter === "all"
                              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleMessageFilterChange("all")}
                          title="全部消息"
                        >
                          <svg
                            className="size-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4 7a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm0 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm0 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul>
                    {discussionList
                      .filter((item) => {
                        if (messageFilter === "all") return true;
                        if (messageFilter === "unread") return item.unread > 0;
                        if (messageFilter === "media")
                          return item.isPhoto || item.isVoiceMessage;
                        return true;
                      })
                      .map((item) => (
                        <button
                          key={item.id}
                          className={`flex w-full items-center justify-between border-b border-gray-200/70 px-4 py-3 text-left hover:cursor-pointer hover:bg-gray-100 dark:border-gray-700/70 dark:hover:bg-gray-700 ${
                            activeDiscussionId === item.id
                              ? "bg-blue-50 dark:bg-blue-900/30"
                              : ""
                          }`}
                          onClick={() => handleSelectDiscussion(item.id)}
                          aria-pressed={activeDiscussionId === item.id}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="relative shrink-0">
                              <img
                                className="size-8 rounded-full"
                                src={item.avatar}
                                alt={`${item.name} 的头像`}
                              />
                              <span
                                className={`absolute start-6 top-0 size-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                                  item.isGroup
                                    ? "bg-blue-500"
                                    : item.status === "online"
                                      ? "bg-green-400"
                                      : "bg-red-500"
                                }`}
                              ></span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col leading-tight">
                              <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </span>
                              {item.isTyping ? (
                                <p className="truncate text-sm font-normal text-primary-600 dark:text-primary-500">
                                  {item.lastMessage}
                                </p>
                              ) : item.isVoiceMessage ? (
                                <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                                  <svg
                                    className="me-1 size-4 shrink-0"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 8a1 1 0 0 1 1 1v3a4.006 4.006 0 0 0 4 4h4a4.006 4.006 0 0 0 4-4V9a1 1 0 1 1 2 0v3.001A6.006 6.006 0 0 1 14.001 18H13v2h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2H9.999A6.006 6.006 0 0 1 4 12.001V9a1 1 0 0 1 1-1Z"
                                      clipRule="evenodd"
                                    />
                                    <path d="M7 6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V6Z" />
                                  </svg>
                                  <span className="min-w-0 flex-1 truncate font-medium text-gray-900 dark:text-white">
                                    {item.lastMessage}
                                  </span>
                                </p>
                              ) : item.isPhoto ? (
                                <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                                  <svg
                                    className="me-1 size-4 shrink-0"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z"
                                      clipRule="evenodd"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="min-w-0 flex-1 truncate">
                                    {item.lastMessage}
                                  </span>
                                </p>
                              ) : (
                                <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                                  {item.lastMessage}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="ml-2 flex w-20 shrink-0 flex-col items-end">
                            {/* 密级标签 - 上行 */}
                            <div
                              className={`mb-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                                item.securityLevel === "非密"
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500"
                                  : item.securityLevel === "秘密"
                                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500"
                                    : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500"
                              }`}
                            >
                              {item.securityLevel}
                            </div>

                            {/* 时间和未读数量 - 下行 */}
                            <div className="flex items-center">
                              <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                {item.time}
                              </span>
                              {item.unread > 0 && (
                                <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary-100 p-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                  {item.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                  </ul>
                </div>
              )}

              {/* 通讯录标签页内容 */}
              {activeTab === "contacts" && (
                <div className="p-4">
                  {organizationLevel === "institute" ? (
                    <ul>
                      {[...Array(10)].map((_, index) => (
                        <li
                          key={index}
                          className="mb-1 flex items-center gap-3 rounded-lg border-b border-gray-200/70 p-2 hover:bg-gray-100 dark:border-gray-700/70 dark:hover:bg-gray-700"
                        >
                          <button
                            className="flex w-full items-center gap-3"
                            onClick={() => handleInstituteClick(index + 1)}
                            aria-label={`查看第${index + 1}研究院详情`}
                          >
                            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500">
                              <svg
                                className="size-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.5 3A3.5 3.5 0 0 0 14 6.5v11a3.5 3.5 0 0 0 7 0v-11A3.5 3.5 0 0 0 17.5 3Zm0 2a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-3 0v-11A1.5 1.5 0 0 1 17.5 5ZM10 3a1 1 0 0 0-1 1v15a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1ZM3.5 8A3.5 3.5 0 0 0 0 11.5v6A3.5 3.5 0 0 0 3.5 21a3.5 3.5 0 0 0 3.5-3.5v-6A3.5 3.5 0 0 0 3.5 8Zm0 2a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 3.5 10Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-left text-sm font-medium text-gray-900 dark:text-white">
                                第{index + 1}研究院
                              </h4>
                              <p className="text-left text-xs text-gray-500 dark:text-gray-400">
                                {(index + 1) * 15} 成员
                              </p>
                            </div>
                            {/* 展开按钮 */}
                            <div className="ml-auto shrink-0 text-right">
                              <span className="rounded-full p-1 text-gray-500">
                                <svg
                                  className="size-5"
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
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      {/* 返回按钮 */}
                      <div className="mb-4">
                        <button
                          onClick={handleBackToInstitutes}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <svg
                            className="mr-1 size-4"
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
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          返回研究院列表
                        </button>
                      </div>

                      {/* 研究所列表 */}
                      <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        第{selectedInstitute}研究院下属研究所
                      </h4>
                      <ul>
                        {[...Array(10)].map((_, index) => (
                          <li
                            key={index}
                            className="mb-1 flex items-center gap-3 rounded-lg border-b border-gray-200/70 p-2 hover:bg-gray-100 dark:border-gray-700/70 dark:hover:bg-gray-700"
                          >
                            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
                              <svg
                                className="size-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11.5 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" />
                                <path d="M11.5 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0ZM14 1a1 1 0 0 0-.867.5 1 1 0 0 1-1.731 0A1 1 0 0 0 10 1a1 1 0 0 0-.867.5 1 1 0 0 1-1.731 0A1 1 0 0 0 6 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-4Z" />
                                <path d="M13 14.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-7Z" />
                                <path d="M19 14.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V16H9.5A1.5 1.5 0 0 0 8 17.5v4A1.5 1.5 0 0 0 9.5 23H13v-8.5Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                第{index + 1}研究所
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(index + 1) * 8} 成员
                              </p>
                            </div>
                            {/* 展开按钮 */}
                            <div className="ml-auto shrink-0 text-right">
                              <button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <svg
                                  className="size-5"
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
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex h-full w-3/4 flex-col overflow-hidden bg-transparent">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {/* 会话头像 */}
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={
                      discussionList.find(
                        (item) => item.id === activeDiscussionId,
                      )?.avatar || "/images/users/avatar.png"
                    }
                    alt="会话头像"
                    className="size-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white sm:text-xl">
                    {discussionList.find(
                      (item) => item.id === activeDiscussionId,
                    )?.name || "研讨"}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {discussionList.find(
                        (item) => item.id === activeDiscussionId,
                      )?.members || 0}{" "}
                      成员
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {discussionList.find(
                        (item) => item.id === activeDiscussionId,
                      )?.tag || "团队"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* 查找按钮 */}
                <Button size="xs" color="gray" pill iconOnly>
                  <HiSearch className="size-4" />
                </Button>
                {/* 添加成员按钮 */}
                <Button size="xs" color="gray" pill iconOnly>
                  <HiUserAdd className="size-4" />
                </Button>
                {/* 设置按钮 */}
                <Button
                  size="xs"
                  color="gray"
                  pill
                  iconOnly
                  onClick={handleOpenSettings}
                >
                  <HiCog className="size-4" />
                </Button>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="relative flex-1 overflow-y-auto overflow-x-hidden bg-transparent px-4 [scrollbar-width:thin] [&.scrolling]:opacity-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/0 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
            >
              {/* 设置抽屉 - 放在聊天容器内部 */}
              {isSettingsOpen && (
                <SettingsDrawer
                  isOpen={isSettingsOpen}
                  onClose={handleCloseSettings}
                />
              )}

              <div className="min-h-full rounded-lg p-4">
                {/* 消息列表 - 支持丰富的消息类型 */}
                {discussions.map((msg) =>
                  msg.messageType === "file" ? (
                    <ChatFileMessage
                      key={msg.id}
                      avatarSrc={msg.avatarSrc}
                      senderName={msg.sender}
                      time={msg.time}
                      fileName={msg.content}
                      fileSize="18 MB"
                      fileType="PDF"
                      pageCount={12}
                      status={msg.status}
                      onReply={() => handleReplyMessage(msg.id)}
                      onForward={() => handleForwardMessage(msg.id)}
                      onCopy={() => handleCopyMessage(msg.id)}
                      onReport={() => handleReportMessage(msg.id)}
                      onDelete={() => handleDeleteMessage(msg.id)}
                      onDownload={() => {
                        // 处理文件下载
                        console.log(`下载文件: ${msg.content}`);
                      }}
                    />
                  ) : msg.messageType === "voice" ? (
                    <ChatVoiceMessage
                      key={msg.id}
                      avatarSrc={msg.avatarSrc}
                      senderName={msg.sender}
                      time={msg.time}
                      duration="3:42"
                      status={msg.status}
                      isOwn={msg.isOwn}
                      onReply={() => handleReplyMessage(msg.id)}
                      onForward={() => handleForwardMessage(msg.id)}
                      onCopy={() => handleCopyMessage(msg.id)}
                      onReport={() => handleReportMessage(msg.id)}
                      onDelete={() => handleDeleteMessage(msg.id)}
                      onPlay={() => {
                        // 处理语音播放
                        console.log(`播放语音: ${msg.content}`);
                      }}
                    />
                  ) : (
                    <ChatMessage
                      key={msg.id}
                      avatarSrc={msg.avatarSrc}
                      senderName={msg.sender}
                      time={msg.time}
                      message={msg.content}
                      status={msg.status}
                      messageType={msg.messageType}
                      isOwn={msg.isOwn}
                      replyTo={msg.replyTo}
                      reactions={msg.reactions}
                      isEdited={msg.isEdited}
                      securityLevel={msg.securityLevel}
                      onReply={() => handleReplyMessage(msg.id)}
                      onForward={() => handleForwardMessage(msg.id)}
                      onCopy={() => handleCopyMessage(msg.id)}
                      onReport={() => handleReportMessage(msg.id)}
                      onDelete={() => handleDeleteMessage(msg.id)}
                      onAddReaction={(reaction) =>
                        handleAddReaction(msg.id, reaction)
                      }
                      onEdit={() => handleEditMessage(msg.id)}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                    />
                  ),
                )}
              </div>
            </div>

            {/* 消息输入区域 */}
            <div className="mt-auto">
              {/* 回复预览 */}
              {replyingTo && (
                <div className="mx-4 mb-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        回复 {replyingTo.sender}
                      </div>
                      <div className="line-clamp-1 text-sm text-gray-700 dark:text-gray-300">
                        {replyingTo.content}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelReply}
                    className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
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
              )}

              {/* 消息输入框 */}
              <div className="px-4">
                <MessageInput
                  message={message}
                  onMessageChange={handleMessageChange}
                  onSendMessage={() => handleSendMessage()}
                  securityLevel={securityLevel}
                  onSecurityLevelChange={setSecurityLevel}
                />
              </div>

              {/* 链接输入 */}
              {showLinkInput && (
                <div className="mx-4 mb-4 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    添加链接
                  </div>
                  <div className="flex flex-col space-y-3">
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="输入链接URL"
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      placeholder="输入链接标题（可选）"
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleCancelLink}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleSendLink}
                        className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        disabled={!linkUrl.trim()}
                      >
                        添加链接
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default DiscussionPage;
