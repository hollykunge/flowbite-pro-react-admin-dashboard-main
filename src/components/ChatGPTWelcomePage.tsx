import { FC } from "react";
import {
  HiLightningBolt,
  HiOutlineLightBulb,
  HiOutlineDocumentText,
} from "react-icons/hi";

interface ChatGPTWelcomePageProps {
  onSendMessage: (message: string) => void;
}

/**
 * ChatGPT风格的欢迎页面组件
 */
const ChatGPTWelcomePage: FC<ChatGPTWelcomePageProps> = ({ onSendMessage }) => {
  // 示例提示列表
  const examplePrompts = [
    "帮我写一个React组件，实现拖拽排序功能",
    "解释一下量子计算的基本原理",
    "给我推荐几本科幻小说",
    "如何提高英语口语水平？",
  ];

  // 功能列表
  const capabilities = [
    {
      icon: <HiLightningBolt className="h-6 w-6" />,
      title: "GPT-4",
      description: "我们最智能、最强大的模型，能够解决复杂问题",
    },
    {
      icon: <HiOutlineLightBulb className="h-6 w-6" />,
      title: "DALL·E",
      description: "创建逼真的图像和艺术作品，基于文本描述",
    },
    {
      icon: <HiOutlineDocumentText className="h-6 w-6" />,
      title: "数据分析",
      description: "上传文档并提取信息，总结内容或回答相关问题",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-between bg-white dark:bg-gray-900">
      {/* 顶部标题 */}
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          ChatGPT
        </h1>
      </div>

      {/* 中间内容 */}
      <div className="flex w-full max-w-3xl flex-col items-center">
        {/* 功能卡片 */}
        <div className="mb-8 grid w-full grid-cols-1 gap-3 md:grid-cols-3">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700"
            >
              <div className="mb-2 rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                {capability.icon}
              </div>
              <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
                {capability.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {capability.description}
              </p>
            </div>
          ))}
        </div>

        {/* 示例提示 */}
        <div className="mb-8 w-full">
          <h2 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
            示例
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                className="rounded-xl border border-gray-200 p-4 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                onClick={() => onSendMessage(prompt)}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部输入框 */}
      <div className="mb-8 w-full max-w-3xl">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-full border border-gray-300 bg-white py-3 pl-4 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="发送消息..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  onSendMessage(target.value);
                  target.value = "";
                }
              }
            }}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => {
              const input = document.querySelector(
                'input[type="text"]',
              ) as HTMLInputElement;
              if (input && input.value.trim()) {
                onSendMessage(input.value);
                input.value = "";
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
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          ChatGPT可能会产生不准确的信息，包括关于人物、地点或事实的内容。
        </p>
      </div>
    </div>
  );
};

export default ChatGPTWelcomePage;
