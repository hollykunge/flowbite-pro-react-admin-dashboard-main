import { FC, useState } from "react";
import {
  HiOutlineCog,
  HiOutlinePlus,
  HiOutlineExternalLink,
  HiCalendar,
  HiDocumentText,
  HiChartBar,
  HiClock,
  HiClipboardCheck,
  HiChatAlt2,
  HiCheck,
} from "react-icons/hi";
import { Button, Card, Modal } from "flowbite-react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

/**
 * 应用页面组件
 *
 * 展示可用的应用卡片列表，用户可以打开应用、添加新应用或管理现有应用
 */
const ApplicationsPage: FC = function () {
  // 应用列表状态
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "日程管理",
      description: "管理您的日程安排、会议和重要事项提醒",
      icon: HiCalendar,
      color: "blue",
      isAdded: true,
    },
    {
      id: 2,
      name: "文档协作",
      description: "团队文档协作工具，支持实时编辑和版本控制",
      icon: HiDocumentText,
      color: "green",
      isAdded: true,
    },
    {
      id: 3,
      name: "数据分析",
      description: "可视化数据分析工具，生成专业报表和图表",
      icon: HiChartBar,
      color: "purple",
      isAdded: false,
    },
    {
      id: 4,
      name: "时间跟踪",
      description: "记录和分析团队成员的工作时间分配",
      icon: HiClock,
      color: "orange",
      isAdded: false,
    },
    {
      id: 5,
      name: "任务管理",
      description: "创建和分配任务，跟踪项目进度",
      icon: HiClipboardCheck,
      color: "red",
      isAdded: true,
    },
    {
      id: 6,
      name: "团队聊天",
      description: "团队即时通讯工具，支持群组和私聊",
      icon: HiChatAlt2,
      color: "teal",
      isAdded: false,
    },
  ]);

  // 设置模态框状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<any>(null);

  // 处理应用设置
  const handleOpenSettings = (app: any) => {
    setCurrentApp(app);
    setIsSettingsOpen(true);
  };

  // 处理添加/移除应用
  const handleToggleAddApp = (id: number) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, isAdded: !app.isAdded } : app,
      ),
    );
  };

  // 获取应用颜色类
  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      green:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      purple:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      orange:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    };
    return colorMap[color] || colorMap["gray"];
  };

  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            应用中心
          </h1>
          <Button color="primary" className="flex items-center gap-x-2">
            <HiOutlinePlus className="text-xl" />
            添加应用
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center size-12 rounded-lg ${getColorClass(app.color)}`}
                  >
                    <app.icon className="size-6" />
                  </div>
                  <h5 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                    {app.name}
                  </h5>
                </div>
                <button
                  onClick={() => handleOpenSettings(app)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <HiOutlineCog className="size-5" />
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {app.description}
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  color={app.isAdded ? "success" : "gray"}
                  className="flex-1 flex items-center justify-center gap-x-1"
                  onClick={() => handleToggleAddApp(app.id)}
                >
                  {app.isAdded ? (
                    <>
                      <HiCheck className="size-4" />
                      <span>已应用</span>
                    </>
                  ) : (
                    <>
                      <HiOutlinePlus className="size-4" />
                      <span>添加应用</span>
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  className="flex-1 flex items-center justify-center gap-x-1"
                  onClick={() =>
                    (window.location.href = `/${app.name.toLowerCase().replace(/\s+/g, "")}`)
                  }
                >
                  <HiOutlineExternalLink className="size-4" />
                  <span>打开应用</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 应用设置模态框 */}
      <Modal show={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <Modal.Header>{currentApp?.name} 设置</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="app-name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                应用名称
              </label>
              <input
                id="app-name"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                defaultValue={currentApp?.name}
              />
            </div>

            <div>
              <label
                htmlFor="app-description"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                应用描述
              </label>
              <textarea
                id="app-description"
                rows={3}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                defaultValue={currentApp?.description}
              />
            </div>

            <div className="flex items-center">
              <input
                id="app-added"
                type="checkbox"
                checked={currentApp?.isAdded}
                onChange={() => currentApp && handleToggleAddApp(currentApp.id)}
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <label
                htmlFor="app-added"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                添加到我的应用
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                权限设置
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="permission-read"
                    type="checkbox"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                  />
                  <label
                    htmlFor="permission-read"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    读取数据权限
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="permission-write"
                    type="checkbox"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                  />
                  <label
                    htmlFor="permission-write"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    写入数据权限
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="permission-notification"
                    type="checkbox"
                    checked={false}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                  />
                  <label
                    htmlFor="permission-notification"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    发送通知权限
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setIsSettingsOpen(false)}>
            保存设置
          </Button>
          <Button color="gray" onClick={() => setIsSettingsOpen(false)}>
            取消
          </Button>
        </Modal.Footer>
      </Modal>
    </NavbarSidebarLayout>
  );
};

export default ApplicationsPage;
