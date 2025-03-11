import { FC, useState, ReactNode } from "react";
import { HiUserGroup, HiUser, HiOfficeBuilding } from "react-icons/hi";
import { RiGovernmentFill } from "react-icons/ri";

/**
 * 通讯录组件属性
 */
interface ContactsTabProps {
  /**
   * 组织项点击回调函数
   * @param instituteId 研究院ID
   * @param departmentId 研究所ID，如果是点击研究院则为null
   * @param name 组织名称
   */
  onOrganizationItemClick?: (
    instituteId: number,
    departmentId: number | null,
    name: string,
  ) => void;

  /**
   * 官方群组点击回调函数
   * @param groupId 群组ID
   * @param name 群组名称
   */
  onOfficialGroupClick?: (groupId: number, name: string) => void;
}

/**
 * 通讯录组件
 *
 * 该组件用于显示我的好友、我的群组、官方群组和组织架构
 */
const ContactsTab: FC<ContactsTabProps> = function ({
  onOrganizationItemClick,
  onOfficialGroupClick,
}) {
  // 当前选中的标签
  const [activeTab, setActiveTab] = useState<string>("organization");

  // 组织导航状态
  const [organizationLevel, setOrganizationLevel] = useState<
    "institute" | "department"
  >("institute");
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(
    null,
  );

  /**
   * 处理研究院点击事件
   * @param instituteId 研究院ID
   */
  const handleInstituteClick = (instituteId: number) => {
    setSelectedInstitute(instituteId);
    setOrganizationLevel("department");

    // 通知父组件研究院被点击
    if (onOrganizationItemClick) {
      onOrganizationItemClick(instituteId, null, `第${instituteId}研究院`);
    }
  };

  /**
   * 处理研究所点击事件
   * @param departmentId 研究所ID
   */
  const handleDepartmentClick = (departmentId: number) => {
    // 通知父组件研究所被点击
    if (onOrganizationItemClick && selectedInstitute) {
      onOrganizationItemClick(
        selectedInstitute,
        departmentId,
        `第${selectedInstitute}研究院 - 第${departmentId}研究所`,
      );
    }
  };

  /**
   * 处理返回研究院列表事件
   */
  const handleBackToInstitutes = () => {
    setSelectedInstitute(null);
    setOrganizationLevel("institute");
  };

  /**
   * 处理官方群组点击事件
   * @param groupId 群组ID
   */
  const handleOfficialGroupClick = (groupId: number) => {
    // 通知父组件官方群组被点击
    if (onOfficialGroupClick) {
      onOfficialGroupClick(groupId, `官方群组 ${groupId}`);
    }
  };

  /**
   * 处理标签切换
   * @param tab 标签名称
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * 渲染组织架构内容
   * @returns 组织架构UI
   */
  const renderOrganizationStructure = () => {
    return (
      <div className="p-4">
        {organizationLevel === "institute" ? (
          <div className="w-full">
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              组织架构
            </h3>
            <ul className="w-full">
              {[...Array(10)].map((_, index) => (
                <li
                  key={index}
                  className="mb-1 flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleInstituteClick(index + 1)}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-inner dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-400">
                    <svg
                      className="size-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.5 3A3.5 3.5 0 0 0 14 6.5v11a3.5 3.5 0 0 0 7 0v-11A3.5 3.5 0 0 0 17.5 3Zm0 2a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-3 0v-11A1.5 1.5 0 0 1 17.5 5ZM10 3a1 1 0 0 0-1 1v15a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1ZM3.5 8A3.5 3.5 0 0 0 0 11.5v6A3.5 3.5 0 0 0 3.5 21a3.5 3.5 0 0 0 3.5-3.5v-6A3.5 3.5 0 0 0 3.5 8Zm0 2a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 3.5 10Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      第{index + 1}研究院
                    </h4>
                  </div>
                  {/* 展开按钮 */}
                  <div className="ml-auto shrink-0 text-right">
                    <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                      <svg
                        className="size-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="w-full">
            {/* 返回按钮 */}
            <div className="mb-2">
              <button
                onClick={handleBackToInstitutes}
                className="flex items-center gap-2 rounded-lg py-1 px-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-inner dark:from-gray-900/40 dark:to-gray-800/40 dark:text-gray-400">
                  <svg
                    className="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <span className="font-medium">返回组织架构</span>
              </button>
            </div>

            {/* 研究所列表 */}
            <ul className="w-full">
              {[...Array(10)].map((_, index) => (
                <li
                  key={index}
                  className="mb-1 flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleDepartmentClick(index + 1)}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-inner dark:from-green-900/40 dark:to-green-800/40 dark:text-green-400">
                    <svg
                      className="size-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.5 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" />
                      <path d="M11.5 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0ZM14 1a1 1 0 0 0-.867.5 1 1 0 0 1-1.731 0A1 1 0 0 0 10 1a1 1 0 0 0-.867.5 1 1 0 0 1-1.731 0A1 1 0 0 0 6 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-4Z" />
                      <path d="M13 14.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-7Z" />
                      <path d="M19 14.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V16H9.5A1.5 1.5 0 0 0 8 17.5v4A1.5 1.5 0 0 0 9.5 23H13v-8.5Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      第{index + 1}研究所
                    </h4>
                  </div>
                  {/* 展开按钮 */}
                  <div className="ml-auto shrink-0 text-right">
                    <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                      <svg
                        className="size-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  /**
   * 渲染我的好友内容
   * @returns 我的好友UI
   */
  const renderMyFriends = () => {
    return (
      <div className="p-4">
        <ul>
          {[...Array(15)].map((_, index) => (
            <li
              key={index}
              className="mb-1 flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center">
                <img
                  className="size-10 rounded-full object-cover shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                  src={`https://flowbite.com/docs/images/people/profile-picture-${(index % 5) + 1}.jpg`}
                  alt={`好友${index + 1}的头像`}
                />
                <span className="absolute bottom-0 right-0 size-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  好友{index + 1}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {index % 2 === 0 ? "在线" : "离线"}
                </p>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                    className="size-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  /**
   * 渲染我的群组内容
   * @returns 我的群组UI
   */
  const renderMyGroups = () => {
    return (
      <div className="p-4">
        <ul>
          {[...Array(8)].map((_, index) => (
            <li
              key={index}
              className="mb-1 flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-500">
                <HiUserGroup className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  我的群组 {index + 1}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(index + 1) * 5} 成员
                </p>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                    className="size-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  /**
   * 渲染官方群组内容
   * @returns 官方群组UI
   */
  const renderOfficialGroups = () => {
    return (
      <div className="p-4">
        <ul>
          {[...Array(5)].map((_, index) => (
            <li
              key={index}
              className="mb-1 flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleOfficialGroupClick(index + 1)}
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
                <RiGovernmentFill className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  官方群组 {index + 1}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(index + 1) * 20} 成员
                </p>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                    className="size-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* 固定的标签区域 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-full space-y-1">
              <button
                className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md ${
                  activeTab === "organization"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleTabChange("organization")}
                title="组织架构"
              >
                <HiOfficeBuilding className="h-4 w-4" />
                <span>组织架构</span>
              </button>
              <button
                className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md ${
                  activeTab === "friends"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleTabChange("friends")}
                title="我的好友"
              >
                <HiUser className="h-4 w-4" />
                <span>我的好友</span>
              </button>
              <button
                className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md ${
                  activeTab === "myGroups"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleTabChange("myGroups")}
                title="我的群组"
              >
                <HiUserGroup className="h-4 w-4" />
                <span>我的群组</span>
              </button>
              <button
                className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md ${
                  activeTab === "officialGroups"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleTabChange("officialGroups")}
                title="官方群组"
              >
                <RiGovernmentFill className="h-4 w-4" />
                <span>官方群组</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 w-full dark:border-gray-700"></div>
      </div>

      {/* 可滚动的内容区域 - 美化滚动条 */}
      <div
        className="flex-1 overflow-y-auto 
        [scrollbar-width:thin] 
        [&::-webkit-scrollbar]:w-1.5 
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:rounded-full 
        [&::-webkit-scrollbar-thumb]:bg-gray-300/0 
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 
        dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 
        dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
        [&.scrolling]:opacity-100 
        [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 
        dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50"
      >
        {activeTab === "organization" && renderOrganizationStructure()}
        {activeTab === "friends" && renderMyFriends()}
        {activeTab === "myGroups" && renderMyGroups()}
        {activeTab === "officialGroups" && renderOfficialGroups()}
      </div>
    </div>
  );
};

export default ContactsTab;
