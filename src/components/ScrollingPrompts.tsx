import { FC, memo, useState, useCallback } from "react";

interface ScrollingPromptsProps {
  promptSuggestions: string[][];
  onPromptClick: (prompt: string) => void;
}

const ScrollingPrompts: FC<ScrollingPromptsProps> = memo(
  ({ promptSuggestions, onPromptClick }) => {
    // 不再暂停整行滚动，只跟踪悬停的提示词
    const [hoveredPrompt, setHoveredPrompt] = useState<string | null>(null);

    const handlePromptHover = useCallback((prompt: string) => {
      setHoveredPrompt(prompt);
    }, []);

    const handlePromptLeave = useCallback(() => {
      setHoveredPrompt(null);
    }, []);

    // 创建内联样式标签，定义滚动动画
    const styleTag = `
      @keyframes scrollLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(-50% - 1rem)); }
      }
      
      @keyframes scrollRight {
        0% { transform: translateX(calc(-50% - 1rem)); }
        100% { transform: translateX(0); }
      }
      
      .scroll-left {
        animation: scrollLeft 30s linear infinite;
      }
      
      .scroll-right {
        animation: scrollRight 30s linear infinite;
      }
    `;

    return (
      <div className="w-full mb-8 space-y-3">
        {/* 添加内联样式标签 */}
        <style dangerouslySetInnerHTML={{ __html: styleTag }} />

        {promptSuggestions.map((rowPrompts, rowIndex) => {
          // 确保有足够的提示词以实现无缝滚动
          const duplicatedPrompts = [
            ...rowPrompts,
            ...rowPrompts,
            ...rowPrompts,
          ];

          return (
            <div
              key={`prompt-row-${rowIndex}`}
              className="relative overflow-hidden prompt-container"
              style={{ height: "40px" }}
            >
              <div
                className={`flex space-x-3 py-1 ${rowIndex === 0 ? "scroll-left" : "scroll-right"}`}
                style={{
                  width: "fit-content",
                  minWidth: "200%", // 确保内容足够长以实现滚动效果
                  display: "flex",
                  flexWrap: "nowrap",
                }}
              >
                {duplicatedPrompts.map((prompt, promptIndex) => (
                  <button
                    key={`${rowIndex}-${promptIndex}`}
                    className={`inline-flex items-center h-8 px-3 py-1 bg-purple-100/70 hover:bg-purple-200/70 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 backdrop-blur-sm rounded-full text-xs text-purple-800 dark:text-purple-200 border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 ease-out cursor-pointer whitespace-nowrap ${hoveredPrompt === prompt ? "ring-2 ring-purple-400 dark:ring-purple-500 scale-105" : ""}`}
                    onClick={() => onPromptClick(prompt)}
                    onMouseEnter={() => handlePromptHover(prompt)}
                    onMouseLeave={handlePromptLeave}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

ScrollingPrompts.displayName = "ScrollingPrompts";

export default ScrollingPrompts;
