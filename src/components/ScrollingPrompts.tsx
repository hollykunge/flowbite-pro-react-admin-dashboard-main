import { FC, memo, useState, useCallback } from "react";

interface ScrollingPromptsProps {
  promptSuggestions: string[][];
  onPromptClick: (prompt: string) => void;
}

const ScrollingPrompts: FC<ScrollingPromptsProps> = memo(
  ({ promptSuggestions, onPromptClick }) => {
    const [pauseScrolling, setPauseScrolling] = useState<boolean[]>(
      new Array(promptSuggestions.length).fill(false),
    );

    const handlePauseScroll = useCallback((rowIndex: number) => {
      setPauseScrolling((prev) => {
        const newState = [...prev];
        newState[rowIndex] = true;
        return newState;
      });
    }, []);

    const handleResumeScroll = useCallback((rowIndex: number) => {
      setPauseScrolling((prev) => {
        const newState = [...prev];
        newState[rowIndex] = false;
        return newState;
      });
    }, []);

    return (
      <div className="w-full mb-8 space-y-3">
        {promptSuggestions.map((rowPrompts, rowIndex) => (
          <div
            key={`prompt-row-${rowIndex}`}
            className="relative overflow-hidden prompt-container"
            onMouseEnter={() => handlePauseScroll(rowIndex)}
            onMouseLeave={() => handleResumeScroll(rowIndex)}
          >
            <div className="flex overflow-x-auto no-scrollbar">
              <div
                className={`flex space-x-3 py-1 ${
                  !pauseScrolling[rowIndex]
                    ? `animate-scroll-${rowIndex % 2 === 0 ? "left" : "right"}`
                    : ""
                }`}
                style={{
                  animationDuration: `${40 + rowIndex * 10}s`,
                  animationPlayState: pauseScrolling[rowIndex]
                    ? "paused"
                    : "running",
                  width: "fit-content",
                  minWidth: "100%",
                  transform: "translate3d(0, 0, 0)",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  perspective: "1000",
                  transformStyle: "preserve-3d",
                }}
              >
                {[...rowPrompts, ...rowPrompts].map((prompt, promptIndex) => (
                  <button
                    key={`${rowIndex}-${promptIndex}`}
                    className="inline-flex items-center h-8 px-3 py-1 bg-purple-100/70 hover:bg-purple-200/70 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 backdrop-blur-sm rounded-full text-xs text-purple-800 dark:text-purple-200 border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 ease-out cursor-pointer transform hover:scale-105 whitespace-nowrap"
                    onClick={() => onPromptClick(prompt)}
                    style={{
                      transform: "translate3d(0, 0, 0)",
                      backfaceVisibility: "hidden",
                      WebkitFontSmoothing: "antialiased",
                    }}
                  >
                    <span className="truncate max-w-xs">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
);

ScrollingPrompts.displayName = "ScrollingPrompts";

export default ScrollingPrompts;
