import { FC, useId, memo } from "react";

interface BackgroundSVGProps {
  className?: string;
  isDarkMode?: boolean;
}

const BackgroundSVG: FC<BackgroundSVGProps> = memo(
  ({ className = "", isDarkMode = false }) => {
    const id = useId();

    return (
      <div
        className={`fixed inset-0 -z-5 overflow-hidden ${className}`}
        style={{ transform: "translateY(0)" }}
      >
        {/* 背景颜色渐变 */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/40 to-sky-100/50 dark:from-gray-900 dark:via-gray-800/40 dark:to-gray-700/50 opacity-90"
          aria-hidden="true"
        />

        {/* 光晕效果 - 放在底部 */}
        <div
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-150 w-150 rounded-full bg-purple-500/30 opacity-30 blur-3xl dark:opacity-20"
          aria-hidden="true"
        />

        {/* 旋转圆环 - 水平居中 */}
        <div
          className="absolute inset-x-0 flex justify-center items-center"
          style={{ top: "25%" }}
        >
          <div className="relative h-auto w-full max-w-5xl aspect-square">
            <svg
              viewBox="0 0 1026 1026"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full animate-spin-slow opacity-60"
              style={{ animationDuration: "40s" }}
            >
              <path
                d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
                stroke={isDarkMode ? "#4B5563" : "#D1D5DB"}
                strokeOpacity="0.7"
                strokeWidth="1"
              />
              <path
                d="M513 1025C230.23 1025 1 795.77 1 513"
                stroke={`url(#${id}-gradient-1)`}
                strokeLinecap="round"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id={`${id}-gradient-1`}
                  x1="1"
                  y1="513"
                  x2="1"
                  y2="1025"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              viewBox="0 0 1026 1026"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full scale-90 animate-spin-reverse-slower opacity-60"
              style={{ animationDuration: "45s" }}
            >
              <path
                d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
                stroke={isDarkMode ? "#4B5563" : "#D1D5DB"}
                strokeOpacity="0.7"
                strokeWidth="1"
              />
              <path
                d="M913 513c0 220.914-179.086 400-400 400"
                stroke={`url(#${id}-gradient-2)`}
                strokeLinecap="round"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id={`${id}-gradient-2`}
                  x1="913"
                  y1="513"
                  x2="913"
                  y2="913"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 额外的光晕效果 */}
        <div
          className="absolute -bottom-20 right-1/4 h-120 w-120 rounded-full bg-indigo-400 opacity-20 blur-3xl dark:opacity-15"
          aria-hidden="true"
        />
      </div>
    );
  },
);

BackgroundSVG.displayName = "BackgroundSVG";

export default BackgroundSVG;
