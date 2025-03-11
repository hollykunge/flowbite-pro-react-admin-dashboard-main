import { FC, useState } from "react";
import { HiLightningBolt, HiOutlineLightBulb, HiX } from "react-icons/hi";
import { PiChatTeardropBold } from "react-icons/pi";
import { PiBirdDuotone } from "react-icons/pi";
import {
  HiMenuAlt2,
  HiCog,
  HiBookOpen,
  HiChip,
  HiSparkles,
} from "react-icons/hi";
import ChatHistoryDrawer from "./ChatHistoryDrawer";
import AISettingsModal from "./AISettingsModal";

interface AIWelcomePageProps {
  onSendMessage: (message: string) => void;
  onToggleDrawer?: () => void;
  onOpenSettings?: () => void;
  onNewChat?: () => void;
  chatHistory?: {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
  }[];
  onSelectChat?: (chatId: string) => void;
}

/**
 * AI欢迎页面组件
 *
 * 显示欢迎信息和功能介绍，用户可以通过输入框发送消息开始对话
 * 支持黑白主题（暗色模式和亮色模式）
 */
const AIWelcomePage: FC<AIWelcomePageProps> = ({
  onSendMessage,
  onToggleDrawer,
  onOpenSettings,
  onNewChat = () => {},
  chatHistory = [],
  onSelectChat = () => {},
}) => {
  // 控制升级提示是否显示
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(true);
  // 控制抽屉是否打开
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // 控制设置对话框是否打开
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // 控制功能选择状态
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);

  // 模拟聊天历史数据
  const mockChatHistory = [
    {
      id: "chat-1",
      title: "AI技术与未来发展",
      lastMessage: "大模型在医疗领域的应用前景如何？",
      timestamp: "今天 14:30",
    },
    {
      id: "chat-2",
      title: "Python进阶学习",
      lastMessage: "如何优化深度学习模型的训练效率",
      timestamp: "昨天 09:45",
    },
    {
      id: "chat-3",
      title: "云南旅行规划",
      lastMessage: "大理、丽江、香格里拉七日游最佳路线",
      timestamp: "3天前 18:22",
    },
    {
      id: "chat-4",
      title: "健康生活方式",
      lastMessage: "间歇性断食对身体代谢的影响研究",
      timestamp: "11月8日",
    },
    {
      id: "chat-5",
      title: "技术领导力培养",
      lastMessage: "如何从技术专家转型为团队管理者",
      timestamp: "11月5日",
    },
    {
      id: "chat-6",
      title: "前端开发趋势",
      lastMessage: "2024年值得关注的Web前端技术栈",
      timestamp: "10月28日",
    },
    {
      id: "chat-7",
      title: "创意写作指导",
      lastMessage: "如何构建引人入胜的故事开头",
      timestamp: "10月20日",
    },
  ];

  // AI设置
  const [aiSettings, setAiSettings] = useState({
    memory: true,
    knowledgeBase: false,
    thinkingMode: false,
    temperature: 0.7,
  });

  // 处理设置变更
  const handleSettingsChange = (newSettings: typeof aiSettings) => {
    setAiSettings(newSettings);
    // 同步更新功能按钮状态
    setUseKnowledgeBase(newSettings.knowledgeBase);
    setUseThinkingMode(newSettings.thinkingMode);
  };

  // 处理消息发送，添加前缀
  const handleSendMessage = (message: string) => {
    let finalMessage = message;

    if (useKnowledgeBase) {
      finalMessage = "DeepSearch: " + finalMessage;
    }

    if (useThinkingMode) {
      finalMessage = "Think: " + finalMessage;
    }

    onSendMessage(finalMessage);
  };

  return (
    <div className="flex h-full w-full flex-col items-center relative overflow-y-auto overflow-x-hidden bg-gradient-to-br from-white to-purple-100 dark:from-gray-900 dark:to-purple-900/30 text-gray-800 dark:text-white">
      <div className="flex flex-col items-center w-full h-full relative">
        {/* 顶部功能区 */}
        <div className="w-full px-4 py-2 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
          {/* 左侧按钮 */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label="设置"
          >
            <HiCog className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* 右侧按钮组 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewChat}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label="新建会话"
            >
              <PiChatTeardropBold className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label="历史记录"
            >
              <HiMenuAlt2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* 聊天历史抽屉 - 使用模拟数据 */}
        <ChatHistoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          chatHistory={mockChatHistory}
          onSelectChat={onSelectChat}
        />

        {/* AI设置对话框 */}
        <AISettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={aiSettings}
          onSettingsChange={handleSettingsChange}
        />

        {/* 背景剪影 - 放在最底层 */}
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none z-0">
          <PiBirdDuotone className="w-full h-full text-gray-900 dark:text-white transform rotate-60" />
        </div>

        {/* 内容区域 */}
        <div className="flex flex-col items-center w-full max-w-full pb-8 z-10">
          {/* 可关闭的升级提示 - 放在组件顶部 */}
          {showUpgradeAlert && (
            <div className="w-full mt-2 max-w-3xl mb-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 shadow-md">
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiLightningBolt
                      className="h-5 w-5 text-primary-600 dark:text-primary-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">
                      百灵2.0 全新升级
                    </h3>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <p>尝试我们的新功能：关联知识库和思考模式</p>
                    </div>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      type="button"
                      onClick={() => setShowUpgradeAlert(false)}
                      className="inline-flex rounded-md p-1.5 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <span className="sr-only">关闭</span>
                      <HiX className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logo */}
          <div className="mb-12 mt-32 flex items-center">
            <div className="mr-4 text-5xl">
              <PiBirdDuotone className="text-6xl text-purple-600 dark:text-purple-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              百灵2.0
            </h1>
          </div>

          {/* 输入区 */}
          <div className="mb-6 w-full max-w-3xl px-4">
            {/* 整合的输入框和功能区容器 */}
            <div className="relative rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              {/* 输入框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="随便问点什么"
                  className="w-full bg-transparent px-6 py-4 text-gray-800 dark:text-white outline-none border-none focus:ring-0 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement;
                      handleSendMessage(target.value);
                      target.value = "";
                    }
                  }}
                />
              </div>

              {/* 功能区 */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <button
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                      useKnowledgeBase
                        ? "bg-primary-600 text-white dark:bg-primary-500"
                        : "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700"
                    } hover:bg-opacity-90 transition-colors duration-200`}
                    onClick={() => {
                      const newValue = !useKnowledgeBase;
                      setUseKnowledgeBase(newValue);
                      setAiSettings({
                        ...aiSettings,
                        knowledgeBase: newValue,
                      });
                    }}
                  >
                    <div className="flex items-center justify-center h-5">
                      <HiLightningBolt
                        className={`text-lg ${
                          useKnowledgeBase
                            ? "text-white"
                            : "text-primary-600 dark:text-primary-500"
                        }`}
                        style={{ transform: "translateY(-1px)" }}
                      />
                    </div>
                    <div className="flex items-center justify-center h-5">
                      <span style={{ transform: "translateY(-1px)" }}>
                        关联知识库
                      </span>
                    </div>
                  </button>
                  <button
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                      useThinkingMode
                        ? "bg-primary-600 text-white dark:bg-primary-500"
                        : "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700"
                    } hover:bg-opacity-90 transition-colors duration-200`}
                    onClick={() => {
                      const newValue = !useThinkingMode;
                      setUseThinkingMode(newValue);
                      setAiSettings({
                        ...aiSettings,
                        thinkingMode: newValue,
                      });
                    }}
                  >
                    <div className="flex items-center justify-center h-5">
                      <HiOutlineLightBulb
                        className={`text-lg ${
                          useThinkingMode
                            ? "text-white"
                            : "text-primary-600 dark:text-primary-500"
                        }`}
                        style={{ transform: "translateY(-1px)" }}
                      />
                    </div>
                    <div className="flex items-center justify-center h-5">
                      <span style={{ transform: "translateY(-1px)" }}>
                        思考模式
                      </span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="添加附件"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                  <button
                    className="flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 p-2 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
                    onClick={() => {
                      const inputElement = document.querySelector(
                        'input[placeholder="随便问点什么"]',
                      ) as HTMLInputElement;
                      if (inputElement && inputElement.value.trim() !== "") {
                        handleSendMessage(inputElement.value);
                        inputElement.value = "";
                      }
                    }}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 提示框区域 */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {/* 提示词教程 */}
              <button className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow duration-200">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800 mb-4">
                  <HiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  提示词教程
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400 text-center">
                  学习如何更好地与AI对话
                </p>
              </button>

              {/* 大模型介绍 */}
              <button className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow duration-200">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800 mb-4">
                  <HiChip className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
                  大模型介绍
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400 text-center">
                  了解AI大模型的能力
                </p>
              </button>

              {/* 百灵功能介绍 */}
              <button className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-shadow duration-200">
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-800 mb-4">
                  <HiSparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-300 mb-2">
                  百灵功能介绍
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 text-center">
                  探索百灵的特色功能
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWelcomePage;
