import { FC, useEffect, useRef, useState } from "react";
import {
  HiBookOpen,
  HiChartPie,
  HiChip,
  HiCog,
  HiDatabase,
  HiExclamationCircle,
  HiLightningBolt,
  HiMenuAlt2,
  HiOutlineLightBulb,
  HiSparkles,
  HiTemplate,
  HiUserCircle,
  HiUserGroup,
  HiX,
} from "react-icons/hi";
import { PiBirdDuotone } from "react-icons/pi";
import AISettingsModal from "./AISettingsModal";
import ChatHistoryDrawer from "./ChatHistoryDrawer";

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
  // 控制当前选中的导航项
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);

  // 黑洞效果的画布引用
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 控制头像下拉菜单的显示状态
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // 点击页面其他区域时关闭下拉菜单
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 黑洞效果实现
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置画布尺寸为窗口大小
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 黑洞中心位置
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    // 星星类
    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      angle: number;
      distance: number;
      speed: number;

      constructor() {
        // 随机位置和深度
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * (canvas?.width || 1000) * 0.8 + 50;
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
        this.z = Math.random() * 2;

        // 星星大小和颜色
        this.size = Math.random() * 2 + 0.5;

        // 根据暗色/亮色模式和距离设置颜色
        const isDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const colorIntensity = Math.floor(Math.random() * 100 + 155);

        // 根据距离中心的远近设置不同颜色
        const canvasWidth = canvas?.width || 1000;
        const distanceRatio = this.distance / (canvasWidth * 0.4);

        if (distanceRatio < 0.3) {
          // 靠近中心的星星 - 蓝色/紫色调
          this.color = `rgba(${colorIntensity - 100}, ${colorIntensity - 150}, ${colorIntensity}, ${0.8 - distanceRatio})`;
        } else if (distanceRatio < 0.6) {
          // 中间区域的星星 - 紫色/粉色调
          this.color = `rgba(${colorIntensity - 50}, ${colorIntensity - 150}, ${colorIntensity}, ${0.7 - distanceRatio * 0.5})`;
        } else {
          // 外围的星星 - 白色/淡蓝色调
          this.color = `rgba(${colorIntensity}, ${colorIntensity}, ${colorIntensity}, ${0.6 - distanceRatio * 0.3})`;
        }

        // 旋转速度 - 越靠近中心旋转越快
        this.speed = (1 - Math.min(0.8, distanceRatio)) * 0.02;
      }

      update() {
        if (!canvas) return;

        // 更新角度 - 模拟围绕黑洞旋转
        this.angle += this.speed;

        // 随着旋转，逐渐向中心靠近（模拟被吸入黑洞）
        this.distance -= 0.1 + (1 - this.distance / (canvas.width * 0.4)) * 0.2;

        // 如果距离太小（被吸入黑洞中心），重新生成在外围
        if (this.distance < 20) {
          this.distance =
            Math.random() * canvas.width * 0.3 + canvas.width * 0.5;
          this.speed =
            (1 - Math.min(0.8, this.distance / (canvas.width * 0.4))) * 0.02;
        }

        // 更新位置
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
      }

      draw() {
        if (!ctx) return;

        // 绘制星星
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 为部分星星添加光晕效果
        if (Math.random() > 0.8) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color
            .replace(")", ", 0.3)")
            .replace("rgba", "rgba");
          ctx.fill();
        }
      }
    }

    // 创建星星数组
    const canvasWidth = canvas?.width || 1000;
    const canvasHeight = canvas?.height || 800;
    const starCount = Math.min(
      200,
      Math.floor((canvasWidth * canvasHeight) / 8000),
    );
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    // 绘制黑洞中心
    const drawBlackHole = () => {
      if (!ctx || !canvas) return;

      // 创建径向渐变 - 从中心向外
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        canvas.width * 0.2,
      );

      // 设置渐变颜色
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(0.2, "rgba(20, 0, 40, 0.8)");
      gradient.addColorStop(0.4, "rgba(40, 0, 80, 0.6)");
      gradient.addColorStop(0.6, "rgba(60, 20, 120, 0.4)");
      gradient.addColorStop(0.8, "rgba(80, 40, 160, 0.2)");
      gradient.addColorStop(1, "rgba(100, 60, 200, 0)");

      // 绘制黑洞
      ctx.beginPath();
      ctx.arc(centerX, centerY, canvas.width * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    // 动画循环
    const animate = () => {
      if (!ctx || !canvas) return;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制黑洞
      drawBlackHole();

      // 更新并绘制所有星星
      for (const star of stars) {
        star.update();
        star.draw();
      }

      // 继续动画循环
      requestAnimationFrame(animate);
    };

    // 更新黑洞中心位置
    const updateCenter = () => {
      if (!canvas) return;
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
    };

    // 监听窗口大小变化，更新黑洞中心位置
    window.addEventListener("resize", updateCenter);

    // 启动动画
    animate();

    // 清理函数
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", updateCenter);
    };
  }, []);

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

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  // 提示词数据 - 每行不同的提示词
  const promptSuggestions = [
    // 第一行提示词
    [
      "如何提高英语口语水平？",
      "Python数据分析入门指南",
      "健康饮食的基本原则",
      "高效时间管理技巧",
      "如何培养良好的阅读习惯",
      "提高工作效率的方法",
      "如何开始冥想练习",
      "职场沟通技巧",
      "如何制定可行的财务计划",
      "旅行摄影技巧分享",
    ],
    // 第二行提示词
    [
      "创意写作的灵感来源",
      "如何开始学习人工智能",
      "居家办公的环境布置",
      "提高演讲能力的方法",
      "如何培养批判性思维",
      "有效的学习方法总结",
      "如何开始投资理财",
      "提高专注力的技巧",
      "如何写一篇好的论文",
      "团队协作的有效方式",
    ],
  ];

  // 控制每行滚动状态
  const [pauseScrolling, setPauseScrolling] = useState([false, false]);

  // 暂停特定行的滚动
  const handlePauseScroll = (rowIndex: number) => {
    const newPauseState = [...pauseScrolling];
    newPauseState[rowIndex] = true;
    setPauseScrolling(newPauseState);
  };

  // 恢复特定行的滚动
  const handleResumeScroll = (rowIndex: number) => {
    const newPauseState = [...pauseScrolling];
    newPauseState[rowIndex] = false;
    setPauseScrolling(newPauseState);
  };

  // 点击提示词卡片，将内容填入输入框
  const handlePromptClick = (prompt: string) => {
    const inputElement = document.querySelector(
      'input[placeholder="随便问点什么"]',
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = prompt;
      inputElement.focus();
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center relative overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-900 to-purple-900 dark:from-black dark:to-purple-950 text-gray-200 dark:text-white">
      {/* 宇宙黑洞效果背景画布 */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* CSS动画样式 */}
      <style>
        {`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-scroll-left {
          animation: scrollLeft linear infinite;
        }
        
        .animate-scroll-right {
          animation: scrollRight linear infinite;
        }
        
        .prompt-container {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
        }
        
        .prompt-container::before,
        .prompt-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 15%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .prompt-container::before {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.7), transparent);
        }
        
        .prompt-container::after {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,0.7), transparent);
        }
        `}
      </style>

      <div className="flex flex-col items-center w-full h-full relative">
        {/* 悬浮导航栏 - 增加设置和会话列表按钮 */}
        <div className="w-full max-w-5xl mx-auto px-4 mt-6 mb-2 z-20">
          <div className="flex items-center justify-between p-2 bg-transparent backdrop-blur-sm rounded-xl shadow-lg">
            {/* 左侧功能按钮组 */}
            <div className="flex space-x-3">
              {/* 知识库按钮 - 图标和文字 */}
              <button
                onClick={() =>
                  setActiveNavItem(
                    activeNavItem === "knowledge" ? null : "knowledge",
                  )
                }
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeNavItem === "knowledge"
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="知识库"
                title="知识库"
              >
                <HiDatabase className="w-5 h-5" />
                <span className="text-sm font-medium">知识库</span>
              </button>

              {/* 智能体按钮 - 图标和文字 */}
              <button
                onClick={() =>
                  setActiveNavItem(activeNavItem === "agents" ? null : "agents")
                }
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeNavItem === "agents"
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="智能体"
                title="智能体"
              >
                <HiUserGroup className="w-5 h-5" />
                <span className="text-sm font-medium">智能体</span>
              </button>

              {/* 提示词模板按钮 - 图标和文字 */}
              <button
                onClick={() =>
                  setActiveNavItem(
                    activeNavItem === "templates" ? null : "templates",
                  )
                }
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeNavItem === "templates"
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="提示词模板"
                title="提示词模板"
              >
                <HiTemplate className="w-5 h-5" />
                <span className="text-sm font-medium">提示词模板</span>
              </button>
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
                <HiMenuAlt2 className="w-5 h-5" />
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

          {/* 导航内容面板 - 根据选中的导航项显示不同内容 */}
          {activeNavItem && (
            <div className="mt-2 p-4 bg-transparent backdrop-blur-sm rounded-xl shadow-lg animate-fadeIn">
              {activeNavItem === "knowledge" && (
                <div className="text-sm">
                  <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                    我的知识库
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">工作文档</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        12个文件
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">学习笔记</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        8个文件
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">项目资料</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        15个文件
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-dashed border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 text-center flex items-center justify-center cursor-pointer">
                      <span className="text-primary-600 dark:text-primary-400">
                        + 创建知识库
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeNavItem === "agents" && (
                <div className="text-sm">
                  <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                    智能体
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">代码助手</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        编程辅助
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">数据分析师</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        数据处理
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">创意写手</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        内容创作
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">学习导师</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        知识辅导
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">翻译专家</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        多语言翻译
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-dashed border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 text-center flex items-center justify-center cursor-pointer">
                      <span className="text-primary-600 dark:text-primary-400">
                        + 自定义
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeNavItem === "templates" && (
                <div className="text-sm">
                  <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                    提示词模板
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">论文写作助手</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        帮助构建学术论文结构和内容
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">代码优化</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        分析并优化代码性能和结构
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">营销文案生成</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        创建吸引人的营销内容
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-dashed border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 text-center cursor-pointer">
                      <span className="text-primary-600 dark:text-primary-400">
                        + 创建模板
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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

        {/* 内容区域 */}
        <div className="flex flex-col items-center w-full max-w-5xl pb-8 z-10">
          {/* 可关闭的升级提示 - 放在组件顶部 */}
          {showUpgradeAlert && (
            <div className="w-full mt-2 mb-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 shadow-md">
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
          <div className="mb-8 mt-32 flex items-center">
            <div className="mr-4 text-5xl">
              <PiBirdDuotone className="text-6xl text-purple-600 dark:text-purple-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              百灵2.0
            </h1>
          </div>

          {/* 横向滚动提示词区域 - 2行 */}
          <div className="w-full mb-8 space-y-3">
            {promptSuggestions.map((rowPrompts, rowIndex) => (
              <div
                key={`prompt-row-${rowIndex}`}
                className="relative overflow-hidden prompt-container"
                onMouseEnter={() => handlePauseScroll(rowIndex)}
                onMouseLeave={() => handleResumeScroll(rowIndex)}
              >
                <div
                  className={`flex space-x-3 whitespace-nowrap py-1 ${
                    !pauseScrolling[rowIndex]
                      ? `animate-scroll-${rowIndex % 2 === 0 ? "left" : "right"}`
                      : ""
                  }`}
                  style={{
                    animationDuration: `${30 + rowIndex * 5}s`,
                    animationPlayState: pauseScrolling[rowIndex]
                      ? "paused"
                      : "running",
                    width: "100%",
                  }}
                >
                  {/* 复制一份提示词，确保滚动时无缝衔接 */}
                  {[...rowPrompts, ...rowPrompts].map((prompt, promptIndex) => (
                    <button
                      key={`${rowIndex}-${promptIndex}`}
                      className="inline-flex items-center h-8 px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/20 transition-colors duration-200 cursor-pointer"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      <span className="truncate max-w-xs">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
