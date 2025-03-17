import { FC, memo, lazy, Suspense } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineCode,
  HiOutlineChartBar,
  HiOutlinePhotograph,
  HiOutlineTranslate,
  HiOutlinePencilAlt,
  HiOutlineUserGroup,
  HiOutlinePlus,
} from "react-icons/hi";

interface AppCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

const AppCard: FC<AppCardProps> = memo(
  ({ icon, title, description, color, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border ${color} hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm hover:${color.replace("border-", "bg-").replace("-200", "-50")} dark:hover:${color.replace("border-", "bg-").replace("-200", "-900")}/20`}
    >
      <div
        className={`p-3 rounded-full ${color.replace("border-", "bg-").replace("-200", "-100")} dark:${color.replace("border-", "bg-").replace("-200", "-800")}/70 mb-3`}
      >
        {icon}
      </div>
      <h3
        className={`text-sm font-medium ${color.replace("border-", "text-").replace("-200", "-900")} dark:${color.replace("border-", "text-").replace("-200", "-300")}`}
      >
        {title}
      </h3>
      <p
        className={`text-xs ${color.replace("border-", "text-").replace("-200", "-700")} dark:${color.replace("border-", "text-").replace("-200", "-400")} text-center mt-1`}
      >
        {description}
      </p>
    </button>
  ),
);

AppCard.displayName = "AppCard";

const apps = [
  {
    icon: (
      <HiOutlineDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    ),
    title: "文档助手",
    description: "智能文档处理与总结",
    color: "border-blue-200 dark:border-blue-700",
  },
  {
    icon: (
      <HiOutlineCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
    ),
    title: "代码助手",
    description: "编程辅助与代码优化",
    color: "border-purple-200 dark:border-purple-700",
  },
  {
    icon: (
      <HiOutlineChartBar className="w-6 h-6 text-green-600 dark:text-green-400" />
    ),
    title: "数据分析",
    description: "数据处理与可视化",
    color: "border-green-200 dark:border-green-700",
  },
  {
    icon: (
      <HiOutlinePhotograph className="w-6 h-6 text-amber-600 dark:text-amber-400" />
    ),
    title: "图像生成",
    description: "AI图像创作与编辑",
    color: "border-amber-200 dark:border-amber-700",
  },
  {
    icon: (
      <HiOutlineTranslate className="w-6 h-6 text-red-600 dark:text-red-400" />
    ),
    title: "翻译助手",
    description: "多语言翻译与校对",
    color: "border-red-200 dark:border-red-700",
  },
  {
    icon: (
      <HiOutlinePencilAlt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    ),
    title: "写作助手",
    description: "内容创作与润色",
    color: "border-indigo-200 dark:border-indigo-700",
  },
  {
    icon: (
      <HiOutlineUserGroup className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
    ),
    title: "会议助手",
    description: "会议记录与总结",
    color: "border-cyan-200 dark:border-cyan-700",
  },
];

const AppGrid: FC = memo(() => {
  return (
    <div className="mt-8 w-full">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
        智能微应用
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {apps.map((app, index) => (
          <AppCard key={index} {...app} />
        ))}
        <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
            <HiOutlinePlus className="w-6 h-6 text-gray-500 dark:text-gray-400" />
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
  );
});

AppGrid.displayName = "AppGrid";

export default AppGrid;
