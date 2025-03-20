import { FC, memo, useState, useCallback, useEffect, useRef } from "react";

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
        100% { transform: translateX(-50%); }
      }
      
      @keyframes scrollRight {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(0); }
      }
      
      .scroll-left {
        animation: scrollLeft 30s linear infinite;
      }
      
      .scroll-right {
        animation: scrollRight 30s linear infinite;
      }
      
      /* 纯渐变效果，移除模糊 */
      .prompt-container {
        position: relative;
        background-color: white;
      }
      
      .dark .prompt-container {
        background-color: rgb(17, 24, 39);
      }
      
      .prompt-container::before,
      .prompt-container::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 15%;
        z-index: 10;
        pointer-events: none;
      }
      
      .prompt-container::before {
        left: 0;
        background: linear-gradient(to right, 
          rgba(255, 255, 255, 1), 
          rgba(255, 255, 255, 0));
      }
      
      .prompt-container::after {
        right: 0;
        background: linear-gradient(to left, 
          rgba(255, 255, 255, 1), 
          rgba(255, 255, 255, 0));
      }
      
      .dark .prompt-container::before {
        background: linear-gradient(to right, 
          rgba(17, 24, 39, 1), 
          rgba(17, 24, 39, 0));
      }
      
      .dark .prompt-container::after {
        background: linear-gradient(to left, 
          rgba(17, 24, 39, 1), 
          rgba(17, 24, 39, 0));
      }
      
      .marquee-container {
        display: flex;
        overflow: hidden;
        width: 100%;
      }
      
      .marquee-content {
        display: flex;
        gap: 12px;
      }
    `;

    return (
      <div className="w-full mb-8 space-y-3">
        {/* 添加内联样式标签 */}
        <style dangerouslySetInnerHTML={{ __html: styleTag }} />

        {promptSuggestions.map((rowPrompts, rowIndex) => {
          return (
            <div
              key={`prompt-row-${rowIndex}`}
              className="relative prompt-container rounded-lg"
              style={{ height: "40px" }}
            >
              <div className="marquee-container">
                <div
                  className={`${rowIndex % 2 === 0 ? "scroll-left" : "scroll-right"}`}
                  style={{
                    display: "flex",
                    width: "max-content",
                    padding: "6px 0",
                  }}
                >
                  {/* 第一组重复内容 */}
                  <div className="marquee-content">
                    {rowPrompts.map((prompt, promptIndex) => (
                      <button
                        key={`${rowIndex}-a-${promptIndex}`}
                        className={`inline-flex items-center h-8 px-3 py-1 bg-purple-100/70 hover:bg-purple-200/70 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 backdrop-blur-sm rounded-full text-xs text-purple-800 dark:text-purple-200 border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 ease-out cursor-pointer whitespace-nowrap ${hoveredPrompt === prompt ? "ring-2 ring-purple-400 dark:ring-purple-500 scale-105" : ""}`}
                        onClick={() => onPromptClick(prompt)}
                        onMouseEnter={() => handlePromptHover(prompt)}
                        onMouseLeave={handlePromptLeave}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* 第二组重复内容(完全相同，确保连续滚动) */}
                  <div className="marquee-content">
                    {rowPrompts.map((prompt, promptIndex) => (
                      <button
                        key={`${rowIndex}-b-${promptIndex}`}
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
