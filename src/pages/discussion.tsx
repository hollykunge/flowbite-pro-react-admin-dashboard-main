import { Button, Card } from "flowbite-react";
import type { FC } from "react";
import { HiPlus } from "react-icons/hi";

/**
 * 研讨页面组件
 *
 * 显示研讨相关内容和功能
 */
const DiscussionPage: FC = function () {
  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          研讨
        </h1>
        <Button size="sm" color="primary">
          <div className="flex items-center gap-x-2">
            <HiPlus className="text-lg" />
            创建新研讨
          </div>
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <Card className="max-w-full">
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            欢迎使用研讨功能
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            这里是研讨页面，您可以在这里创建和参与各种研讨活动。
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DiscussionPage;
