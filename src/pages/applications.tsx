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
  HiOutlineSearch,
  HiStar,
  HiOutlineDownload,
} from "react-icons/hi";
import { Button, Card, Modal, Tabs } from "flowbite-react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

/**
 * 应用页面组件 - 苹果应用商店风格
 *
 * 展示可用的应用卡片列表，用户可以浏览、下载和管理应用
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
      rating: 4.8,
      downloads: "10万+",
      developer: "Flowbite 团队",
      category: "效率工具",
    },
    {
      id: 2,
      name: "文档协作",
      description: "团队文档协作工具，支持实时编辑和版本控制",
      icon: HiDocumentText,
      color: "green",
      isAdded: true,
      rating: 4.6,
      downloads: "5万+",
      developer: "Flowbite 团队",
      category: "效率工具",
    },
    {
      id: 3,
      name: "数据分析",
      description: "可视化数据分析工具，生成专业报表和图表",
      icon: HiChartBar,
      color: "purple",
      isAdded: false,
      rating: 4.5,
      downloads: "3万+",
      developer: "Flowbite 团队",
      category: "商务",
    },
    {
      id: 4,
      name: "时间跟踪",
      description: "记录和分析团队成员的工作时间分配",
      icon: HiClock,
      color: "orange",
      isAdded: false,
      rating: 4.3,
      downloads: "2万+",
      developer: "Flowbite 团队",
      category: "效率工具",
    },
    {
      id: 5,
      name: "任务管理",
      description: "创建和分配任务，跟踪项目进度",
      icon: HiClipboardCheck,
      color: "red",
      isAdded: true,
      rating: 4.7,
      downloads: "8万+",
      developer: "Flowbite 团队",
      category: "效率工具",
    },
    {
      id: 6,
      name: "团队聊天",
      description: "团队即时通讯工具，支持群组和私聊",
      icon: HiChatAlt2,
      color: "teal",
      isAdded: false,
      rating: 4.4,
      downloads: "15万+",
      developer: "Flowbite 团队",
      category: "社交",
    },
  ]);

  // 活动标签页
  const [activeTab, setActiveTab] = useState("featured");

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

  // 筛选已添加和未添加的应用
  const installedApps = applications.filter((app) => app.isAdded);
  const uninstalledApps = applications.filter((app) => !app.isAdded);

  return (
    <NavbarSidebarLayout>
      <div>
        {/* 应用商店顶部区域 */}
        <div className="mb-6 flex flex-col space-y-4 bg-green-500 dark:bg-green-900/30">
          <div className="flex items-center justify-between mb-4 px-4 pt-6">
            <h1 className="text-2xl font-bold text-white dark:text-white sm:text-3xl">
              应用商店
            </h1>
            <div className="flex items-center space-x-2">
              <Button color="primary" className="flex items-center gap-x-2">
                <HiOutlinePlus className="text-xl" />
                添加应用
              </Button>
            </div>
          </div>

          {/* 标签页导航 */}
          <Tabs.Group
            style="underline"
            className="border-b border-gray-200 dark:border-gray-700 px-4 py-2"
          >
            <Tabs.Item
              active={activeTab === "featured"}
              title="精选"
              className="text-white dark:text-white"
              onClick={() => setActiveTab("featured")}
            />
            <Tabs.Item
              active={activeTab === "installed"}
              title="已安装"
              className="text-white dark:text-white"
              onClick={() => setActiveTab("installed")}
            />
            <Tabs.Item
              active={activeTab === "categories"}
              title="分类"
              className="text-white dark:text-white"
              onClick={() => setActiveTab("categories")}
            />
            <Tabs.Item
              active={activeTab === "updates"}
              title="更新"
              className="text-white dark:text-white"
              onClick={() => setActiveTab("updates")}
            />
          </Tabs.Group>
        </div>

        {/* 精选推荐应用区域 */}
        {activeTab === "featured" && (
          <>
            <div className="mb-1 px-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                推荐应用
              </h2>
              <div className="space-y-4">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div
                      className={`flex items-center justify-center size-16 rounded-xl mr-4 ${getColorClass(app.color)}`}
                    >
                      <app.icon className="size-8" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {app.name}
                        </h5>
                        <div className="flex items-center">
                          <HiStar className="text-yellow-400 size-5" />
                          <span className="ml-1 text-sm font-medium">
                            {app.rating}
                          </span>
                          <span className="mx-1 text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            {app.downloads}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {app.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {app.category}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            onClick={() => handleOpenSettings(app)}
                          >
                            <HiOutlineCog className="size-5" />
                          </button>
                          <Button
                            size="sm"
                            color={app.isAdded ? "success" : "primary"}
                            className="flex items-center justify-center gap-x-1"
                            onClick={() => handleToggleAddApp(app.id)}
                          >
                            {app.isAdded ? (
                              <>
                                <HiCheck className="size-4" />
                                <span>已安装</span>
                              </>
                            ) : (
                              <>
                                <HiOutlineDownload className="size-4" />
                                <span>安装</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 px-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                效率工具
              </h2>
              <div className="space-y-4">
                {applications
                  .filter((app) => app.category === "效率工具")
                  .map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <div
                        className={`flex items-center justify-center size-16 rounded-xl mr-4 ${getColorClass(app.color)}`}
                      >
                        <app.icon className="size-8" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {app.name}
                          </h5>
                          <div className="flex items-center">
                            <HiStar className="text-yellow-400 size-5" />
                            <span className="ml-1 text-sm font-medium">
                              {app.rating}
                            </span>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                              {app.downloads}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {app.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {app.category}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                              onClick={() => handleOpenSettings(app)}
                            >
                              <HiOutlineCog className="size-5" />
                            </button>
                            <Button
                              size="sm"
                              color={app.isAdded ? "success" : "primary"}
                              className="flex items-center justify-center gap-x-1"
                              onClick={() => handleToggleAddApp(app.id)}
                            >
                              {app.isAdded ? (
                                <>
                                  <HiCheck className="size-4" />
                                  <span>已安装</span>
                                </>
                              ) : (
                                <>
                                  <HiOutlineDownload className="size-4" />
                                  <span>安装</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* 已安装应用区域 */}
        {activeTab === "installed" && (
          <div className="mb-8 px-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              已安装应用 ({installedApps.length})
            </h2>
            <div className="space-y-4">
              {installedApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div
                    className={`flex items-center justify-center size-16 rounded-xl mr-4 ${getColorClass(app.color)}`}
                  >
                    <app.icon className="size-8" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {app.name}
                      </h5>
                      <div className="flex items-center">
                        <HiStar className="text-yellow-400 size-5" />
                        <span className="ml-1 text-sm font-medium">
                          {app.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {app.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {app.category}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                          onClick={() => handleOpenSettings(app)}
                        >
                          <HiOutlineCog className="size-5" />
                        </button>
                        <Button
                          size="sm"
                          color="gray"
                          className="flex items-center justify-center gap-x-1"
                          onClick={() => handleToggleAddApp(app.id)}
                        >
                          <span>卸载</span>
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          className="flex items-center justify-center gap-x-1"
                          onClick={() =>
                            (window.location.href = `/${app.name.toLowerCase().replace(/\s+/g, "")}`)
                          }
                        >
                          <HiOutlineExternalLink className="size-4" />
                          <span>打开</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 分类区域 */}
        {activeTab === "categories" && (
          <div className="mb-8 px-4">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                应用分类
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {["效率工具", "商务", "社交", "设计", "开发", "财务"].map(
                  (category) => (
                    <Card
                      key={category}
                      className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {category}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category === "效率工具" ? "4个应用" : "1个应用"}
                      </p>
                    </Card>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* 更新区域 */}
        {activeTab === "updates" && (
          <div className="mb-8 px-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              可用更新
            </h2>
            <Card>
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                当前所有应用均为最新版本
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* 应用设置模态框 */}
      <Modal show={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <Modal.Header>{currentApp?.name} 设置</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              {currentApp && (
                <div
                  className={`flex items-center justify-center size-16 rounded-xl ${currentApp ? getColorClass(currentApp.color) : ""}`}
                >
                  {currentApp && <currentApp.icon className="size-8" />}
                </div>
              )}
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentApp?.name}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">
                    {currentApp?.developer}
                  </span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {currentApp?.category}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <HiStar className="text-yellow-400 size-4" />
                  <span className="ml-1 text-sm font-medium">
                    {currentApp?.rating}
                  </span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {currentApp?.downloads} 次下载
                  </span>
                </div>
              </div>
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
                readOnly
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
                安装到我的应用
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
