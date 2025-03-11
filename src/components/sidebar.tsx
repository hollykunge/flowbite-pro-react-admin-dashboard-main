/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Avatar, Dropdown, Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import { HiHome, HiSearch, HiViewGrid } from "react-icons/hi";
import { PiBirdFill, PiChatTeardropDotsFill } from "react-icons/pi";

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import isLargeScreen from "../helpers/is-large-screen";

// 添加自定义CSS样式，用于设置活动项目的图标颜色
import "./sidebar.css";

const ExampleSidebar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
  }, [setCurrentPage]);

  // 监听窗口大小变化，但保持默认折叠状态
  useEffect(() => {
    function handleResize() {
      // 无论屏幕大小如何，都保持折叠状态
      setIsCollapsed(true);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isCollapsed && !isSmallScreen()}
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <form className="pb-3 md:hidden">
              <TextInput
                icon={HiSearch}
                type="search"
                placeholder="Search"
                required
                size={32}
              />
            </form>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="/"
                  icon={HiHome}
                  active={"/" === currentPage}
                  className={classNames({
                    "bg-gray-100 dark:bg-gray-700": "/" === currentPage,
                    "active-sidebar-item": "/" === currentPage,
                  })}
                >
                  主页
                </Sidebar.Item>

                <Sidebar.Item
                  href="/discussion"
                  icon={PiChatTeardropDotsFill}
                  active={"/discussion" === currentPage}
                  className={classNames({
                    "bg-gray-100 dark:bg-gray-700":
                      "/discussion" === currentPage,
                    "active-sidebar-item": "/discussion" === currentPage,
                  })}
                >
                  研讨
                </Sidebar.Item>
                <Sidebar.Item
                  href="/workspace"
                  icon={FaPeopleGroup}
                  active={"/workspace" === currentPage}
                  className={classNames({
                    "bg-gray-100 dark:bg-gray-700":
                      "/workspace" === currentPage,
                    "active-sidebar-item": "/workspace" === currentPage,
                  })}
                >
                  协同空间
                </Sidebar.Item>
                <Sidebar.Item
                  href="/aichat"
                  icon={PiBirdFill}
                  active={"/aichat" === currentPage}
                  className={classNames({
                    "bg-gray-100 dark:bg-gray-700": "/aichat" === currentPage,
                    "active-sidebar-item": "/aichat" === currentPage,
                  })}
                >
                  百灵AI
                </Sidebar.Item>
                <Sidebar.Item
                  href="/applications"
                  icon={HiViewGrid}
                  active={"/applications" === currentPage}
                  className={classNames({
                    "bg-gray-100 dark:bg-gray-700":
                      "/applications" === currentPage,
                    "active-sidebar-item": "/applications" === currentPage,
                  })}
                >
                  应用
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
          <UserProfileMenu />
        </div>
      </Sidebar>
    </div>
  );
};

/**
 * 用户个人资料菜单组件，显示在侧边栏底部
 * 包含用户头像和下拉菜单选项
 * 在侧边栏最小化时只显示头像
 */
const UserProfileMenu: FC = function () {
  const { isOpenOnSmallScreens } = useSidebarContext();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 监听窗口大小变化，但保持默认折叠状态
  useEffect(() => {
    function handleResize() {
      // 无论屏幕大小如何，都保持折叠状态
      setIsCollapsed(true);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={classNames(
        "flex items-center justify-center py-4",
        isCollapsed && !isSmallScreen() ? "px-2" : "gap-x-3 px-3",
      )}
    >
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <div
            className={classNames(
              "flex cursor-pointer items-center",
              isCollapsed && !isSmallScreen() ? "" : "gap-x-3",
            )}
          >
            <div className="overflow-hidden rounded-full transition-all duration-200 hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-600">
              <Avatar
                alt="用户头像"
                img="../images/users/neil-sims.png"
                rounded
                size="sm"
                className="!h-8 min-h-8 !w-8 min-w-8 transition-transform duration-200 hover:scale-110"
              />
            </div>
            {!(isCollapsed && !isSmallScreen()) && (
              <div className="hidden text-left lg:block">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  张明
                </div>
                <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                  第十九研究室
                </div>
              </div>
            )}
          </div>
        }
      >
        <Dropdown.Header>
          <span className="block text-base font-medium">张明</span>
          <span className="block truncate text-sm text-gray-500">
            第十九研究室
          </span>
        </Dropdown.Header>
        <Dropdown.Item className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          个人资料
        </Dropdown.Item>
        <Dropdown.Item className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          应用设置
        </Dropdown.Item>
        <Dropdown.Item className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          问题反馈
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-gray-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          退出登录
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default ExampleSidebar;
