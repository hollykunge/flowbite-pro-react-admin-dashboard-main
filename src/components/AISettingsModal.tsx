import { FC, useState } from "react";
import { HiX, HiCheck } from "react-icons/hi";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    memory: boolean;
    knowledgeBase: boolean;
    thinkingMode: boolean;
    temperature: number;
  };
  onSettingsChange: (settings: {
    memory: boolean;
    knowledgeBase: boolean;
    thinkingMode: boolean;
    temperature: number;
  }) => void;
}

/**
 * AI设置对话框组件
 *
 * 提供AI相关设置的配置界面，包括记忆、关联知识库、思考模式和温度等参数
 */
const AISettingsModal: FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  // 本地状态，用于跟踪设置变更
  const [localSettings, setLocalSettings] = useState(settings);

  // 处理设置变更
  const handleChange = (key: keyof typeof localSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  // 保存设置
  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 对话框 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI 设置
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <HiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 设置内容 */}
        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* 记忆设置 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  记忆功能
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  AI会记住对话历史，提供连贯的回复
                </p>
              </div>
              <button
                onClick={() => handleChange("memory", !localSettings.memory)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.memory
                    ? "bg-primary-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.memory ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 关联知识库设置 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  关联知识库
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  AI回答时会参考知识库中的信息
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange("knowledgeBase", !localSettings.knowledgeBase)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.knowledgeBase
                    ? "bg-primary-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.knowledgeBase
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 思考模式设置 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  思考模式
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  AI会展示思考过程，提供更详细的分析
                </p>
              </div>
              <button
                onClick={() =>
                  handleChange("thinkingMode", !localSettings.thinkingMode)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.thinkingMode
                    ? "bg-primary-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.thinkingMode
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 温度设置 */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  回答创造性 (温度)
                </h3>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {localSettings.temperature.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                较低值使回答更精确，较高值使回答更有创意
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) =>
                  handleChange("temperature", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>精确</span>
                <span>创造性</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <HiCheck className="w-4 h-4 mr-1" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISettingsModal;
