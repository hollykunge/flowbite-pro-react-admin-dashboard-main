import type { ChangeEvent, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { HiCog, HiChevronDown } from "react-icons/hi";
import type { MessageSecurityLevel } from "../components/MessageInput";
import ModernMessageInput from "../components/ModernMessageInput";
import AIConversationList from "../components/AIConversationList";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

/**
 * 消息类型定义
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
 * 会话类型定义
 */
interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

/**
 * 设置抽屉组件
 */
const SettingsDrawer: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-500/75 transition-opacity"
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
                  AI聊天设置
                </h2>
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
            <div className="relative mt-4 flex-1 px-4">
              <div className="space-y-4">
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  在这里您可以调整AI聊天设置，管理模型选择，以及自定义您的AI聊天体验。
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600">
                    模型选择
                  </button>
                  <button className="inline-flex items-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    高级设置
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
 * AI聊天页面组件
 */
const AIChatPage: FC = function () {
  const [message, setMessage] = useState("");
  const [securityLevel, setSecurityLevel] =
    useState<MessageSecurityLevel>("非密");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  // 可用的大模型列表
  const availableModels = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5", provider: "OpenAI" },
    { id: "claude-3", name: "Claude 3", provider: "Anthropic" },
    { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
    { id: "llama-3", name: "Llama 3", provider: "Meta" },
  ];

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "初次对话",
      lastMessage: "你好，AI意识体！",
      timestamp: "2025-03-09 10:31",
    },
  ]);

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: "用户",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "你好，AI意识体！",
      time: "10:30",
      messageType: "text",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 2,
      sender: "AI意识体",
      avatarSrc: "/images/logo.svg",
      content:
        "您好！我是AI意识体，很高兴为您服务。请问有什么我可以帮助您的吗？",
      time: "10:31",
      messageType: "text",
      isOwn: false,
      securityLevel: "非密",
    },
  ]);

  // 禁用外部框架的垂直滚动
  useEffect(() => {
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.style.overflow = "hidden";
    }
    return () => {
      if (mainContent) {
        mainContent.style.overflow = "";
      }
    };
  }, []);

  // 关闭模型下拉菜单的点击外部处理
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHistoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.classList.add("scrolling");
    const timerId = target.dataset["scrollTimer"];
    if (timerId) {
      window.clearTimeout(parseInt(timerId));
    }
    const newTimerId = window.setTimeout(() => {
      target.classList.remove("scrolling");
    }, 1000);
    target.dataset["scrollTimer"] = newTimerId.toString();
  };

  const handleMessageChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const userMessage: MessageType = {
      id: messages.length + 1,
      sender: "用户",
      avatarSrc: "/images/users/bonnie-green.png",
      content: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      messageType: "text",
      isOwn: true,
      securityLevel,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 更新会话历史的最后消息
    setChatSessions((prevSessions) => {
      const updatedSessions = [...prevSessions];
      if (updatedSessions.length > 0) {
        // 确保id和title字段有值，避免类型错误
        const currentSession = updatedSessions[0];
        // 如果当前会话存在，则更新其属性
        if (currentSession) {
          updatedSessions[0] = {
            id: currentSession.id,
            title: currentSession.title,
            lastMessage: message,
            timestamp: new Date().toLocaleString(),
          };
        }
      }
      return updatedSessions;
    });

    setMessage("");

    setTimeout(() => {
      const aiMessage: MessageType = {
        id: messages.length + 2,
        sender: "AI意识体",
        avatarSrc: "/images/logo.svg",
        content: `我收到了您的消息："${message}"。我正在处理中，请稍候...`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        messageType: "text",
        isOwn: false,
        securityLevel,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 1000);
  };

  const handleSecurityLevelChange = (level: MessageSecurityLevel) => {
    setSecurityLevel(level);
  };

  const handleModelChange = (modelId: string) => {
    const selectedModel = availableModels.find((model) => model.id === modelId);
    if (selectedModel) {
      setSelectedModel(selectedModel.name);
      setIsModelDropdownOpen(false);
    }
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `对话 ${chatSessions.length + 1}`,
      lastMessage: "",
      timestamp: new Date().toLocaleString(),
    };
    setChatSessions([newSession, ...chatSessions]);
    setMessages([]);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      // 这里可以添加加载对应会话消息的逻辑
      setIsHistoryOpen(false);
    }
  };

  return (
    <NavbarSidebarLayout>
      <div className="relative size-full">
        {/* 顶部工具栏 */}
        <div className="border-b border-gray-200 bg-white px-4 py-2.5 pb-4 dark:border-gray-700 dark:bg-gray-800 sm:pb-2.5">
          <div className="mb-2.5 flex w-full items-center justify-between sm:mb-0">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
                onClick={() => setIsSettingsOpen(true)}
              >
                <span className="sr-only">聊天设置</span>
                <HiCog className="size-6" />
              </button>

              {/* 大模型选择器 */}
              <div className="relative" ref={modelDropdownRef}>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                >
                  {selectedModel}
                  <HiChevronDown className="ml-2 size-4" />
                </button>
                {isModelDropdownOpen && (
                  <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-700">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        选择大模型
                      </div>
                      {availableModels.map((model) => (
                        <button
                          key={model.id}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          onClick={() => handleModelChange(model.id)}
                        >
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {model.provider}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 会话历史 */}
              <div className="relative" ref={historyDropdownRef}>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                  会话历史
                  <HiChevronDown className="ml-2 size-4" />
                </button>
                {isHistoryOpen && (
                  <div className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-700">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        最近会话
                      </div>
                      {chatSessions.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                          暂无会话历史
                        </div>
                      ) : (
                        chatSessions.map((session) => (
                          <button
                            key={session.id}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                            onClick={() => handleSelectSession(session.id)}
                          >
                            <div className="font-medium">{session.title}</div>
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {session.lastMessage || "暂无消息"}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {session.timestamp}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="me-4 hidden w-full items-center justify-center rounded-lg bg-primary-700 px-6 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:flex sm:w-auto"
                onClick={handleNewChat}
              >
                <svg
                  className="me-2 size-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.44 3a1 1 0 0 1 .707.293l2.56 2.56a1 1 0 0 1 0 1.414L18.194 9.78 14.22 5.806l2.513-2.513A1 1 0 0 1 17.44 3Zm-4.634 4.22-9.513 9.513a1 1 0 0 0 0 1.414l2.56 2.56a1 1 0 0 0 1.414 0l9.513-9.513-3.974-3.974ZM6 6a1 1 0 0 1 1 1v1h1a1 1 0 0 1 0 2H7v1a1 1 0 1 1-2 0v-1H4a1 1 0 0 1 0-2h1V7a1 1 0 0 1 1-1Zm9 9a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z"
                    clipRule="evenodd"
                  />
                </svg>
                新对话
              </button>
            </div>
          </div>
        </div>

        {/* 消息区域 */}
        <div
          className="h-4/5 overflow-y-auto"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          <AIConversationList
            messages={messages}
            onCopyMessage={(messageId) => {
              console.log(`复制消息 ID: ${messageId}`);
            }}
          />
        </div>

        {/* 输入区域 */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="w-full bg-transparent px-4 py-3">
            <div className="flex items-center gap-4">
              <ModernMessageInput
                message={message}
                onMessageChange={handleMessageChange}
                onSendMessage={handleSendMessage}
                securityLevel={securityLevel}
                onSecurityLevelChange={handleSecurityLevelChange}
                onDeepSearch={() => console.log("深度搜索模式")}
                onThink={() => console.log("思考模式")}
              />
            </div>
          </div>
        </div>
      </div>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </NavbarSidebarLayout>
  );
};

export default AIChatPage;
