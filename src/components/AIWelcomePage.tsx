import { FC, useEffect, useRef, useState } from "react";
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
} from "react-icons/hi";
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

  // 模型选择相关状态
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState({
    id: "gpt-4",
    name: "GPT-4",
    icon: "🧠",
    description: "高级推理能力",
  });
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // 可选模型列表
  const availableModels = [
    { id: "gpt-4", name: "GPT-4", icon: "🧠", description: "高级推理能力" },
    { id: "claude-3", name: "Claude 3", icon: "🔮", description: "长文本处理" },
    { id: "bailing-7b", name: "百灵-7B", icon: "🐦", description: "本地部署" },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      icon: "💎",
      description: "多模态能力",
    },
    { id: "llama-3", name: "Llama 3", icon: "🦙", description: "开源模型" },
  ];

  // 点击页面其他区域时关闭模型选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(event.target as Node)
      ) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    // 绘制科技蓝亚克力动态效果
    const drawTechBackground = () => {
      if (!ctx || !canvas) return;

      // 检测当前是否为暗色模式
      const isDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (isDarkMode) {
        // 暗色模式下保留原有的黑洞效果
        // 创建径向渐变 - 从中心向外
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          canvas.width * 0.2,
        );

        // 暗色模式下的渐变颜色
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
      } else {
        // 亮色模式下绘制科技蓝亚克力效果
        // 不绘制中心圆形，而是绘制多个半透明的蓝色几何图形

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景网格
        const gridSize = 50;
        ctx.strokeStyle = "rgba(0, 120, 255, 0.1)";
        ctx.lineWidth = 0.5;

        // 水平线
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // 垂直线
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      }
    };

    // 星星类改为粒子类
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      shape: "circle" | "square" | "triangle";

      constructor() {
        // 随机位置
        this.x = Math.random() * (canvas?.width || 1000);
        this.y = Math.random() * (canvas?.height || 800);

        // 粒子大小
        this.size = Math.random() * 3 + 1;

        // 默认形状为圆形，避免 undefined
        this.shape = "circle";

        // 检测当前是否为暗色模式
        const isDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (isDarkMode) {
          // 暗色模式下保留原有的星星效果
          const colorIntensity = Math.floor(Math.random() * 100 + 155);
          const distanceFromCenter = Math.sqrt(
            Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2),
          );
          const canvasWidth = canvas?.width || 1000;
          const distanceRatio = distanceFromCenter / (canvasWidth * 0.4);

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

          // 速度 - 向黑洞中心移动
          const angle = Math.atan2(centerY - this.y, centerX - this.x);
          const speed = 0.2 + Math.random() * 0.3;
          this.speedX = Math.cos(angle) * speed;
          this.speedY = Math.sin(angle) * speed;

          this.opacity = 0.7 + Math.random() * 0.3;
          // 暗色模式下都使用圆形
          this.shape = "circle";
        } else {
          // 亮色模式下的科技蓝亚克力效果粒子
          // 蓝色调粒子
          const blueShade = Math.floor(Math.random() * 100) + 155;
          this.color = `rgba(0, ${blueShade}, 255, ${Math.random() * 0.3 + 0.1})`;

          // 随机速度
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.speedY = (Math.random() - 0.5) * 0.5;

          this.opacity = Math.random() * 0.3 + 0.1;

          // 随机形状：圆形、方形或三角形
          const shapes: Array<"circle" | "square" | "triangle"> = [
            "circle",
            "square",
            "triangle",
          ];
          this.shape =
            shapes[Math.floor(Math.random() * shapes.length)] || "circle";
        }
      }

      update() {
        if (!canvas) return;

        // 检测当前是否为暗色模式
        const isDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (isDarkMode) {
          // 暗色模式下向黑洞中心移动
          this.x += this.speedX;
          this.y += this.speedY;

          // 如果粒子到达中心附近，重新生成在边缘
          const distanceFromCenter = Math.sqrt(
            Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2),
          );

          if (distanceFromCenter < 20) {
            // 重新生成在画布边缘
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.max(canvas.width, canvas.height) * 0.5;
            this.x = centerX + Math.cos(angle) * distance;
            this.y = centerY + Math.sin(angle) * distance;

            // 重新计算向中心的速度
            const newAngle = Math.atan2(centerY - this.y, centerX - this.x);
            const speed = 0.2 + Math.random() * 0.3;
            this.speedX = Math.cos(newAngle) * speed;
            this.speedY = Math.sin(newAngle) * speed;
          }
        } else {
          // 亮色模式下自由移动
          this.x += this.speedX;
          this.y += this.speedY;

          // 边界检查 - 如果超出画布边界，从另一侧重新进入
          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
          if (this.y < 0) this.y = canvas.height;
          if (this.y > canvas.height) this.y = 0;
        }
      }

      draw() {
        if (!ctx) return;

        ctx.globalAlpha = this.opacity;

        if (this.shape === "circle") {
          // 绘制圆形
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else if (this.shape === "square") {
          // 绘制方形
          ctx.fillStyle = this.color;
          ctx.fillRect(
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2,
          );
        } else if (this.shape === "triangle") {
          // 绘制三角形
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }
    }

    // 创建粒子数组
    const canvasWidth = canvas?.width || 1000;
    const canvasHeight = canvas?.height || 800;
    const particleCount = Math.min(
      150,
      Math.floor((canvasWidth * canvasHeight) / 10000),
    );
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 动画循环
    const animate = () => {
      if (!ctx || !canvas) return;

      // 检测当前是否为暗色模式
      const isDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景
      drawTechBackground();

      // 更新并绘制所有粒子
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      // 亮色模式下添加连接线效果
      if (!isDarkMode && ctx && particles.length > 0) {
        ctx.strokeStyle = "rgba(0, 120, 255, 0.05)";
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            if (!p1 || !p2) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 只连接距离较近的粒子
            if (distance < 100) {
              // 距离越近，线条越不透明
              const opacity = (1 - distance / 100) * 0.2;
              ctx.globalAlpha = opacity;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        ctx.globalAlpha = 1;
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

    // 添加模型信息
    finalMessage = `[${selectedModel.name}] ${finalMessage}`;

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

  // 处理模型选择
  const handleModelSelect = (model: typeof selectedModel) => {
    setSelectedModel(model);
    setShowModelSelector(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-center relative overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* 科技蓝亚克力动态背景效果画布 */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* 模型选择下拉菜单 - 移到顶层 */}
      {showModelSelector && modelSelectorRef.current && (
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-blue-500 dark:border-blue-700 py-1 z-[9999]"
          style={{
            top: modelSelectorRef.current.getBoundingClientRect().bottom + 5,
            left: modelSelectorRef.current.getBoundingClientRect().left,
            width: "14rem",
          }}
        >
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              选择模型
            </h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedModel.id === model.id
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="mr-2 text-lg">{model.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {model.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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
          overflow: hidden;
        }
        
        .prompt-container::before,
        .prompt-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 20%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .prompt-container::before {
          left: 0;
          background: linear-gradient(to right, rgba(255,255,255,0.95), transparent);
        }
        
        .prompt-container::after {
          right: 0;
          background: linear-gradient(to left, rgba(255,255,255,0.95), transparent);
        }
        
        .dark .prompt-container::before {
          background: linear-gradient(to right, rgba(17,24,39,0.95), transparent);
        }
        
        .dark .prompt-container::after {
          background: linear-gradient(to left, rgba(17,24,39,0.95), transparent);
        }
        
        @media (prefers-color-scheme: dark) {
          .prompt-container::before {
            background: linear-gradient(to right, rgba(17,24,39,0.95), transparent);
          }
          
          .prompt-container::after {
            background: linear-gradient(to left, rgba(17,24,39,0.95), transparent);
          }
        }
        
        /* 输入框焦点效果 */
        .input-focus-effect {
          transition: all 0.3s ease;
        }
        
        .input-focus-effect:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
        }
        
        .dark .input-focus-effect:focus-within {
          border-color: #60a5fa;
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.25);
        }
        `}
      </style>

      <div className="flex flex-col items-center w-full h-full relative">
        {/* 悬浮导航栏 - 增加设置和会话列表按钮 */}
        <div className="w-full max-w-5xl mx-auto px-4 mt-6 mb-2 z-20">
          <div className="flex items-center justify-between p-2 bg-transparent backdrop-blur-sm rounded-xl">
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
                    : "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="知识库"
                title="知识库"
              >
                <HiDatabase className="w-5 h-5" />
                <span className="text-sm font-medium">知识工程</span>
              </button>

              {/* 智能体按钮 - 图标和文字 */}
              <button
                onClick={() =>
                  setActiveNavItem(activeNavItem === "agents" ? null : "agents")
                }
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeNavItem === "agents"
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
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
                    : "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="提示词"
                title="提示词"
              >
                <HiTemplate className="w-5 h-5" />
                <span className="text-sm font-medium">提示词</span>
              </button>

              {/* 模型管理按钮 - 图标和文字 */}
              <button
                onClick={() =>
                  setActiveNavItem(activeNavItem === "models" ? null : "models")
                }
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeNavItem === "models"
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="模型管理"
                title="模型管理"
              >
                <HiChip className="w-5 h-5" />
                <span className="text-sm font-medium">模型管理</span>
              </button>

              {/* 使用帮助按钮 - 图标和文字 */}
              <button
                onClick={() =>
                  setActiveNavItem(activeNavItem === "help" ? null : "help")
                }
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  activeNavItem === "help"
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                }`}
                aria-label="使用帮助"
                title="使用帮助"
              >
                <HiBookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">使用帮助</span>
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
            <div className="mt-2 p-4 bg-transparent backdrop-blur-sm rounded-xl animate-fadeIn">
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

              {activeNavItem === "models" && (
                <div className="text-sm">
                  <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                    模型管理
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">GPT-4</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        高级推理能力
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">Claude 3</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        长文本处理
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">百灵-7B</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        本地部署
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">Gemini Pro</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        多模态能力
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium">Llama 3</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        开源模型
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-dashed border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 text-center flex items-center justify-center cursor-pointer">
                      <span className="text-primary-600 dark:text-primary-400">
                        + 添加模型
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeNavItem === "help" && (
                <div className="text-sm">
                  <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                    使用帮助
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium flex items-center">
                        <HiOutlineLightBulb className="w-4 h-4 mr-2 text-yellow-500" />
                        新手入门
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        百灵AI助手基础使用教程
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium flex items-center">
                        <HiLightningBolt className="w-4 h-4 mr-2 text-blue-500" />
                        高级技巧
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        提高AI对话效率的专业技巧
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium flex items-center">
                        <HiTemplate className="w-4 h-4 mr-2 text-purple-500" />
                        提示词指南
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        如何编写高效的AI提示词
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium flex items-center">
                        <HiDatabase className="w-4 h-4 mr-2 text-green-500" />
                        知识库教程
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        创建和使用个人知识库
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium flex items-center">
                        <HiChip className="w-4 h-4 mr-2 text-red-500" />
                        模型对比
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        各大模型特点和适用场景
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                      <div className="font-medium flex items-center">
                        <HiExclamationCircle className="w-4 h-4 mr-2 text-amber-500" />
                        常见问题
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        使用过程中的常见问题解答
                      </div>
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
            <div className="w-full mt-2 mb-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 shadow-md backdrop-blur-sm">
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
              <img
                src="/images/logo-bailing.svg"
                alt="百灵 Logo"
                className="w-16 h-16"
              />
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
                      className="inline-flex items-center h-8 px-3 py-1 bg-purple-100/70 hover:bg-purple-200/70 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 backdrop-blur-sm rounded-full text-xs text-purple-800 dark:text-purple-200 border border-purple-200/50 dark:border-purple-700/50 transition-colors duration-200 cursor-pointer"
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
            <div className="relative rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-lg overflow-hidden border border-gray-200 dark:border-gray-600 backdrop-blur-sm transition-all duration-200 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/30 dark:focus-within:ring-primary-400/30 input-focus-effect">
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
              <div className="flex items-center justify-between px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
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

                  {/* 模型选择按钮 */}
                  <div className="relative" ref={modelSelectorRef}>
                    <button
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-opacity-90 transition-colors duration-200"
                      onClick={() => setShowModelSelector(!showModelSelector)}
                    >
                      <div className="flex items-center justify-center h-5">
                        <span className="mr-1">{selectedModel.icon}</span>
                        <span style={{ transform: "translateY(-1px)" }}>
                          {selectedModel.name}
                        </span>
                      </div>
                      <HiChevronDown
                        className={`transition-transform duration-200 ${showModelSelector ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
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

            {/* 智能微应用网格列表区域 */}
            <div className="mt-8 w-full">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                智能微应用
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 文档助手 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    文档助手
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-400 text-center mt-1">
                    智能文档处理与总结
                  </p>
                </button>

                {/* 代码助手 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300">
                    代码助手
                  </h3>
                  <p className="text-xs text-purple-700 dark:text-purple-400 text-center mt-1">
                    编程辅助与代码优化
                  </p>
                </button>

                {/* 数据分析 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-green-900 dark:text-green-300">
                    数据分析
                  </h3>
                  <p className="text-xs text-green-700 dark:text-green-400 text-center mt-1">
                    数据处理与可视化
                  </p>
                </button>

                {/* 图像生成 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-amber-200 dark:border-amber-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-amber-600 dark:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-amber-900 dark:text-amber-300">
                    图像生成
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 text-center mt-1">
                    AI图像创作与编辑
                  </p>
                </button>

                {/* 翻译助手 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-red-200 dark:border-red-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-red-900 dark:text-red-300">
                    翻译助手
                  </h3>
                  <p className="text-xs text-red-700 dark:text-red-400 text-center mt-1">
                    多语言翻译与校对
                  </p>
                </button>

                {/* 写作助手 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                    写作助手
                  </h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 text-center mt-1">
                    内容创作与润色
                  </p>
                </button>

                {/* 会议助手 */}
                <button className="flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-800/70 mb-3">
                    <svg
                      className="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-cyan-900 dark:text-cyan-300">
                    会议助手
                  </h3>
                  <p className="text-xs text-cyan-700 dark:text-cyan-400 text-center mt-1">
                    会议记录与总结
                  </p>
                </button>

                {/* 添加更多应用 */}
                <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                    <svg
                      className="w-6 h-6 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    添加应用
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    探索更多AI微应用
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWelcomePage;
