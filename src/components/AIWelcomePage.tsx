import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HiBookOpen,
  HiChartPie,
  HiChevronDown,
  HiChip,
  HiCog,
  HiDatabase,
  HiExclamationCircle,
  HiLightningBolt,
  HiMenuAlt2,
  HiOutlineLightBulb,
  HiTemplate,
  HiUserCircle,
  HiUserGroup,
  HiX,
  HiPlus,
} from "react-icons/hi";
import { PiBooksDuotone } from "react-icons/pi";
import { PiRobotDuotone } from "react-icons/pi";
import { PiListDashesDuotone } from "react-icons/pi";
import { PiBrainDuotone } from "react-icons/pi";
import { PiBookOpenDuotone } from "react-icons/pi";
import { TbHistory } from "react-icons/tb";
import { Dropdown, Select } from "flowbite-react";

import AISettingsModal from "./AISettingsModal";
import ChatHistoryDrawer from "./ChatHistoryDrawer";
import BackgroundCanvas from "./BackgroundCanvas";
import ScrollingPrompts from "./ScrollingPrompts";
import AppGrid from "./AppGrid";
import AIInputBox from "./AIInputBox";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);

  // 使用 useMemo 优化状态初始化
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  // 使用 useMemo 优化计算属性
  const selectedModel = useMemo(
    () => ({
      id: "gpt-4",
      name: "GPT-4",
      icon: "🧠",
      description: "高级推理能力",
    }),
    [],
  );

  const availableModels = useMemo(
    () => [
      { id: "gpt-4", name: "GPT-4", icon: "🧠", description: "高级推理能力" },
      {
        id: "claude-3",
        name: "Claude 3",
        icon: "🔮",
        description: "长文本处理",
      },
      {
        id: "bailing-7b",
        name: "百灵-7B",
        icon: "🐦",
        description: "本地部署",
      },
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        icon: "💎",
        description: "多模态能力",
      },
      { id: "llama-3", name: "Llama 3", icon: "🦙", description: "开源模型" },
    ],
    [],
  );

  const promptSuggestions = useMemo(
    () => [
      [
        "如何做系统设计？",
        "Python数据分析入门指南",
        "分系统是什么？",
        "高效时间管理技巧",
        "如何培养良好的阅读习惯",
        "提高工作效率的方法",
        "如何开始写任务书",
        "职场沟通技巧",
        "如何制定可行的工作计划",
        "Word技巧分享",
      ],
      [
        "知识工程数据来源",
        "如何开始学习人工智能",
        "办公室的环境布置",
        "提高演讲能力的方法",
        "如何培养批判性思维",
        "有效的学习方法总结",
        "如何开始型号设计",
        "提高专注力的技巧",
        "如何写一篇好的论文",
        "团队协作的有效方式",
      ],
    ],
    [],
  );

  // 使用 useCallback 优化事件处理函数
  const handleSettingsChange = useCallback((newSettings: any) => {
    setUseKnowledgeBase(newSettings.knowledgeBase);
    setUseThinkingMode(newSettings.thinkingMode);
  }, []);

  const handleSendMessage = useCallback(
    (message: string) => {
      let finalMessage = message;
      if (useKnowledgeBase) finalMessage = "DeepSearch: " + finalMessage;
      if (useThinkingMode) finalMessage = "Think: " + finalMessage;
      finalMessage = `[${selectedModel.name}] ${finalMessage}`;
      onSendMessage(finalMessage);
    },
    [useKnowledgeBase, useThinkingMode, selectedModel.name, onSendMessage],
  );

  const handlePromptClick = useCallback((prompt: string) => {
    const inputElement = document.querySelector(
      'input[placeholder="随便问点什么"]',
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = prompt;
      inputElement.focus();
    }
  }, []);

  const handleModelSelect = useCallback((model: typeof selectedModel) => {
    setShowModelSelector(false);
  }, []);

  // 添加 handleSettingsClick
  const handleSettingsClick = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  // 使用 useEffect 优化副作用
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 使用 useRef 优化 DOM 引用
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // 使用 useMemo 优化系统主题检测
  const isDarkMode = useMemo(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    [],
  );

  return (
    <div className="flex h-full w-full flex-col items-center relative overflow-y-auto overflow-x-hidden text-gray-800 dark:text-gray-200">
      <BackgroundCanvas isDarkMode={isDarkMode} />

      <div className="flex flex-col items-center w-full h-full relative">
        {/* 悬浮导航栏 */}
        <div className="w-full max-w-5xl mx-auto px-4 mt-6 mb-2 z-20">
          <div className="flex items-center justify-between p-2 bg-transparent backdrop-blur-sm rounded-xl">
            {/* 左侧功能按钮组 */}
            <div className="flex space-x-3">
              {/* 知识库按钮 */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
                  onClick={() => setShowKnowledgeMenu(!showKnowledgeMenu)}
                >
                  <PiBooksDuotone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span>知识工程</span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showKnowledgeMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Flyout 菜单 */}
                <div
                  className={`absolute left-1/2 z-10 mt-2 flex w-screen max-w-md -translate-x-1/2 px-4 transition-all duration-200 ${
                    showKnowledgeMenu
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-sm/6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                    <div className="p-4">
                      {/* 知识库 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiDatabase className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            知识库
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            管理和访问结构化知识资源
                          </p>
                        </div>
                      </div>

                      {/* 知识图谱 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiTemplate className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            知识图谱
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            可视化展示知识关联关系
                          </p>
                        </div>
                      </div>

                      {/* 决策支持系统 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiChartPie className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            决策支持系统
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            智能分析和辅助决策
                          </p>
                        </div>
                      </div>

                      {/* 知识推荐系统 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiLightningBolt className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            知识推荐系统
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            智能推荐相关知识内容
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 底部操作按钮 */}
                    <div className="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-gray-700/5 bg-gray-50 dark:bg-gray-700/50">
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiOutlineLightBulb className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        使用教程
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiPlus className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        创建知识库
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 智能体按钮 */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
                  onClick={() =>
                    setActiveNavItem(
                      activeNavItem === "agents" ? null : "agents",
                    )
                  }
                >
                  <PiRobotDuotone className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  <span>智能体</span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${activeNavItem === "agents" ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Flyout 菜单 */}
                <div
                  className={`absolute left-1/2 z-10 mt-2 flex w-screen max-w-md -translate-x-1/2 px-4 transition-all duration-200 ${
                    activeNavItem === "agents"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-sm/6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                    <div className="p-4">
                      {/* 代码助手 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiChip className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            AI应用平台
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            智能编程辅助和代码优化
                          </p>
                        </div>
                      </div>

                      {/* 数据分析师 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiChartPie className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            数据管理
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            专业的数据处理和分析
                          </p>
                        </div>
                      </div>

                      {/* 创意写手 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiTemplate className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            工作流
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            智能内容创作和文案生成
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 底部操作按钮 */}
                    <div className="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-gray-700/5 bg-gray-50 dark:bg-gray-700/50">
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiOutlineLightBulb className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        使用教程
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiPlus className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        自定义智能体
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 提示词按钮 */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
                  onClick={() =>
                    setActiveNavItem(
                      activeNavItem === "templates" ? null : "templates",
                    )
                  }
                >
                  <PiListDashesDuotone className="w-5 h-5 text-green-500 dark:text-green-400" />
                  <span>提示词</span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${activeNavItem === "templates" ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Flyout 菜单 */}
                <div
                  className={`absolute left-1/2 z-10 mt-2 flex w-screen max-w-md -translate-x-1/2 px-4 transition-all duration-200 ${
                    activeNavItem === "templates"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-sm/6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                    <div className="p-4">
                      {/* 论文写作助手 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiBookOpen className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            论文写作助手
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            帮助构建学术论文结构和内容
                          </p>
                        </div>
                      </div>

                      {/* 代码优化 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiTemplate className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            代码优化
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            分析并优化代码性能和结构
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 底部操作按钮 */}
                    <div className="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-gray-700/5 bg-gray-50 dark:bg-gray-700/50">
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiOutlineLightBulb className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        使用教程
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiPlus className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        创建模板
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 大模型按钮 */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
                  onClick={() =>
                    setActiveNavItem(
                      activeNavItem === "models" ? null : "models",
                    )
                  }
                >
                  <PiBrainDuotone className="w-5 h-5 text-primary-400 dark:text-primary-400" />
                  <span>大模型</span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${activeNavItem === "models" ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Flyout 菜单 */}
                <div
                  className={`absolute left-1/2 z-10 mt-2 flex w-screen max-w-md -translate-x-1/2 px-4 transition-all duration-200 ${
                    activeNavItem === "models"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-sm/6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                    <div className="p-4">
                      {/* 通义千问Max */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiChip className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            通义千问Max
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            高级推理能力和知识问答
                          </p>
                        </div>
                      </div>

                      {/* DeepSeek-R1 */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiLightningBolt className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            DeepSeek-R1
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            长文本处理和深度理解
                          </p>
                        </div>
                      </div>

                      {/* 百灵-7B */}
                      <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                          <HiDatabase className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="font-semibold text-gray-900 dark:text-gray-100"
                          >
                            百灵-7B
                            <span className="absolute inset-0"></span>
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            本地部署的轻量级模型
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 底部操作按钮 */}
                    <div className="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-gray-700/5 bg-gray-50 dark:bg-gray-700/50">
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiOutlineLightBulb className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        模型对比
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <HiPlus className="h-5 w-5 flex-none text-gray-400 dark:text-gray-500" />
                        添加模型
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 使用帮助按钮 */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
                >
                  <PiBookOpenDuotone className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                  <span>使用帮助</span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${activeNavItem === "help" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* 右侧功能按钮组 */}
            <div className="flex space-x-3">
              {/* 会话列表按钮 - 仅图标 */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`}
                aria-label="会话列表"
                title="会话列表"
              >
                <TbHistory className="w-5 h-5" />
              </button>

              {/* 头像和下拉菜单 */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200"
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="用户菜单"
                  title="用户菜单"
                >
                  <HiUserCircle className="w-8 h-8" />
                </button>

                {/* 下拉菜单 */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-30 animate-fadeIn">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSettingsClick();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiCog className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                      设置
                    </button>
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiExclamationCircle className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                      反馈问题
                    </button>
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiChartPie className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                      数据
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 聊天历史抽屉 - 使用模拟数据 */}
        <ChatHistoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          chatHistory={chatHistory}
          onSelectChat={onSelectChat}
        />

        {/* AI设置对话框 */}
        <AISettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={{
            memory: true,
            knowledgeBase: useKnowledgeBase,
            thinkingMode: useThinkingMode,
            temperature: 0.7,
          }}
          onSettingsChange={handleSettingsChange}
        />

        {/* 内容区域 */}
        <div className="flex flex-col items-center w-full max-w-5xl pb-8 z-10">
          {/* 升级提示 */}

          {/* Logo */}
          <div className="mb-8 mt-32 flex items-center">
            <div className="mr-4 text-5xl">
              <img
                src="/images/logo-bailing.svg"
                alt="百灵 Logo"
                className="w-16 h-16"
                loading="lazy"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-700 dark:text-white">
              百灵2.0
            </h1>
          </div>

          {/* 滚动提示词 */}
          <ScrollingPrompts
            promptSuggestions={promptSuggestions}
            onPromptClick={handlePromptClick}
          />

          {/* 输入区 */}
          <div className="mb-6 w-full max-w-3xl px-4">
            <AIInputBox
              message={inputMessage}
              onMessageChange={(e) => {
                setInputMessage(e.target.value);
              }}
              onSendMessage={() => {
                if (inputMessage.trim() !== "") {
                  handleSendMessage(inputMessage);
                  setInputMessage("");
                }
              }}
              onDeepSearch={() => setUseKnowledgeBase(!useKnowledgeBase)}
              onThink={() => setUseThinkingMode(!useThinkingMode)}
            />
          </div>

          {/* 应用网格 */}
          <AppGrid />
        </div>
      </div>
    </div>
  );
};

export default AIWelcomePage;
