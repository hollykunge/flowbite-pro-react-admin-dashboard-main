import React, { FC, useState } from "react";
import {
  HiOutlinePhotograph,
  HiOutlinePencilAlt,
  HiOutlineAnnotation,
  HiOutlineUserGroup,
  HiOutlinePuzzle,
  HiOutlineLogout,
  HiOutlineTrash,
} from "react-icons/hi";

/**
 * 设置抽屉组件
 * 用于显示聊天设置的侧边抽屉，覆盖消息列表区域右半部分
 *
 * @param {boolean} isOpen - 控制抽屉是否打开
 * @param {Function} onClose - 关闭抽屉的回调函数
 */
const SettingsDrawer: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 当前选中的设置项
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // 模拟群组数据
  const groupData = {
    name: "产品研发群",
    avatar: "/images/users/lana-byrd.png",
    announcement: "本周五下午3点进行项目进度汇报，请各位准备相关材料。",
    members: [
      {
        id: 1,
        name: "张小明",
        avatar: "/images/users/roberta-casas.png",
        role: "群主",
      },
      {
        id: 2,
        name: "李华",
        avatar: "/images/users/leslie-livingston.png",
        role: "管理员",
      },
      {
        id: 3,
        name: "王强",
        avatar: "/images/users/neil-sims.png",
        role: "成员",
      },
      {
        id: 4,
        name: "赵敏",
        avatar: "/images/users/michael-gough.png",
        role: "成员",
      },
    ],
    applications: [
      { id: 1, name: "日程管理", icon: "📅", enabled: true },
      { id: 2, name: "投票工具", icon: "📊", enabled: true },
      { id: 3, name: "文件共享", icon: "📁", enabled: false },
    ],
  };

  // 渲染设置项内容
  const renderSettingContent = () => {
    switch (activeSection) {
      case "avatar":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={groupData.avatar}
                  alt="群头像"
                  className="size-24 rounded-full object-cover border-4 border-white shadow-md dark:border-gray-700"
                />
                <button className="absolute bottom-0 right-0 size-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors">
                  <HiOutlinePencilAlt className="size-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                点击编辑按钮更换群头像，建议使用正方形图片
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50">
                  上传图片
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  选择默认头像
                </button>
              </div>
            </div>
          </div>
        );
      case "name":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="group-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  群名称
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="group-name"
                    defaultValue={groupData.name}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-300/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <HiOutlinePencilAlt className="size-4" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                群名称长度不超过30个字符，修改后所有成员可见
              </p>
              <div className="pt-2">
                <button className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  保存修改
                </button>
              </div>
            </div>
          </div>
        );
      case "announcement":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="group-announcement"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  群公告内容
                </label>
                <textarea
                  id="group-announcement"
                  rows={4}
                  defaultValue={groupData.announcement}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-300/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500"
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  id="notify-all"
                  type="checkbox"
                  className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                />
                <label
                  htmlFor="notify-all"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  发布后通知所有成员
                </label>
              </div>
              <div className="pt-2">
                <button className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  发布公告
                </button>
              </div>
            </div>
          </div>
        );
      case "members":
        return (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                共 {groupData.members.length} 名成员
              </span>
              <button className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                <span>添加成员</span>
                <svg
                  className="ml-1 size-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
              {groupData.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="size-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <span
                        className={`text-xs ${
                          member.role === "群主"
                            ? "text-red-500 dark:text-red-400"
                            : member.role === "管理员"
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                    {member.role !== "群主" && (
                      <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "applications":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              启用或关闭群内应用功能，提升群聊体验
            </p>
            <div className="space-y-3">
              {groupData.applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-xl dark:bg-gray-700">
                      {app.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {app.enabled ? "已启用" : "未启用"}
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={app.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <svg
                className="mr-2 size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              浏览更多应用
            </button>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              在这里您可以管理群聊设置，包括群头像、名称、公告、成员和应用等。
            </p>
            <div className="grid grid-cols-1 gap-3">
              {settingOptions.map((option) => (
                <button
                  key={option.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-gray-200 bg-white text-left transition-all hover:border-primary-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-700"
                  onClick={() => setActiveSection(option.id)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      {option.icon}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="size-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  // 设置选项列表
  const settingOptions = [
    {
      id: "avatar",
      name: "群头像管理",
      description: "更换或设置群聊头像",
      icon: <HiOutlinePhotograph className="size-5" />,
    },
    {
      id: "name",
      name: "群名称管理",
      description: "修改群聊名称",
      icon: <HiOutlinePencilAlt className="size-5" />,
    },
    {
      id: "announcement",
      name: "群公告管理",
      description: "发布或更新群公告",
      icon: <HiOutlineAnnotation className="size-5" />,
    },
    {
      id: "members",
      name: "群成员管理",
      description: "管理群成员权限",
      icon: <HiOutlineUserGroup className="size-5" />,
    },
    {
      id: "applications",
      name: "群应用管理",
      description: "管理群内应用功能",
      icon: <HiOutlinePuzzle className="size-5" />,
    },
  ];

  // 获取当前页面标题
  const getCurrentTitle = () => {
    if (!activeSection) return "群聊设置";

    const option = settingOptions.find((opt) => opt.id === activeSection);
    return option ? option.name : "群聊设置";
  };

  return (
    <div className="absolute inset-y-0 right-0 z-50 w-1/2 overflow-hidden">
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="relative w-full">
          <div className="flex h-full flex-col overflow-y-auto bg-white py-4 shadow-xl dark:bg-gray-800">
            <div className="px-4 mb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {activeSection && (
                    <button
                      type="button"
                      className="mr-2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      onClick={() => setActiveSection(null)}
                    >
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {getCurrentTitle()}
                  </h2>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭面板</span>
                    <svg
                      className="size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative flex-1 px-4 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
              {renderSettingContent()}
            </div>

            {/* 底部操作按钮 */}
            <div className="mt-auto px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button className="flex-1 flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
                  <HiOutlineTrash className="mr-1.5 size-5" />
                  解散群组
                </button>
                <button className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  <HiOutlineLogout className="mr-1.5 size-5" />
                  退出群组
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;
