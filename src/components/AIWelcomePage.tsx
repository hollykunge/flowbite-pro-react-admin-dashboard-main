import { FC, useState } from "react";
import { HiLightningBolt, HiOutlineLightBulb, HiX } from "react-icons/hi";
import { PiBirdFill } from "react-icons/pi";

interface AIWelcomePageProps {
  onSendMessage: (message: string) => void;
}

/**
 * AI欢迎页面组件
 *
 * 显示欢迎信息和功能介绍，用户可以通过输入框发送消息开始对话
 * 支持黑白主题（暗色模式和亮色模式）
 */
const AIWelcomePage: FC<AIWelcomePageProps> = ({ onSendMessage }) => {
  // 控制升级提示是否显示
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(true);

  return (
    <div className="flex h-full w-full flex-col items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
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
                  <p>尝试我们的新功能：深度搜索和思考模式</p>
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
      <div className="mb-12 mt-36 flex items-center">
        <div className="mr-4 text-5xl">
          <PiBirdFill className="text-6xl text-primary-600 dark:text-primary-500" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          百灵2.0
        </h1>
      </div>

      {/* 输入区 */}
      <div className="mb-6 w-full max-w-3xl">
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
                  onSendMessage(target.value);
                  target.value = "";
                }
              }}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 p-2 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
              onClick={() => {
                const inputElement = document.querySelector(
                  'input[placeholder="随便问点什么"]',
                ) as HTMLInputElement;
                if (inputElement && inputElement.value.trim() !== "") {
                  onSendMessage(inputElement.value);
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

          {/* 功能区 - 在输入框下方，没有分割线 */}
          <div className="flex items-center justify-start gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800">
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={() => onSendMessage("DeepSearch: ")}
            >
              <div className="flex items-center justify-center h-5">
                <HiLightningBolt
                  className="text-lg text-primary-600 dark:text-primary-500"
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
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={() => onSendMessage("Think: ")}
            >
              <div className="flex items-center justify-center h-5">
                <HiOutlineLightBulb
                  className="text-lg text-primary-600 dark:text-primary-500"
                  style={{ transform: "translateY(-1px)" }}
                />
              </div>
              <div className="flex items-center justify-center h-5">
                <span style={{ transform: "translateY(-1px)" }}>思考模式</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWelcomePage;
