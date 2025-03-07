import { Button, Card } from "flowbite-react";
import type { FC } from "react";
import { HiPlus } from "react-icons/hi";

/**
 * 协同空间页面组件
 *
 * 提供团队协作和文档共享功能
 */
const WorkspacePage: FC = function () {
  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          协同空间
        </h1>
        <Button size="sm" color="primary">
          <div className="flex items-center gap-x-2">
            <HiPlus className="text-lg" />
            创建新空间
          </div>
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <Card className="max-w-full">
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            欢迎使用协同空间
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            这里是协同空间页面，您可以在这里与团队成员共享文档和协作完成项目。
          </p>
        </Card>
      </div>
    </div>
  );
};

export default WorkspacePage;
