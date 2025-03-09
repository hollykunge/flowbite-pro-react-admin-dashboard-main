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

const ExampleSidebar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
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
                  iconClassName={
                    "/" === currentPage
                      ? "text-blue-600 dark:text-blue-500"
                      : ""
                  }
                  className={
                    "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                  }
                >
                  主页
                </Sidebar.Item>
                <Sidebar.Item
                  href="/kanban"
                  icon={HiViewGrid}
                  active={"/kanban" === currentPage}
                  iconClassName={
                    "/kanban" === currentPage
                      ? "text-blue-600 dark:text-blue-500"
                      : ""
                  }
                  className={
                    "/kanban" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  任务
                </Sidebar.Item>
                <Sidebar.Item
                  href="/discussion"
                  icon={PiChatTeardropDotsFill}
                  active={"/discussion" === currentPage}
                  iconClassName={
                    "/discussion" === currentPage
                      ? "text-blue-600 dark:text-blue-500"
                      : ""
                  }
                  className={
                    "/discussion" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  研讨
                </Sidebar.Item>
                <Sidebar.Item
                  href="/workspace"
                  icon={FaPeopleGroup}
                  active={"/workspace" === currentPage}
                  iconClassName={
                    "/workspace" === currentPage
                      ? "text-blue-600 dark:text-blue-500"
                      : ""
                  }
                  className={
                    "/workspace" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  协同空间
                </Sidebar.Item>
                <Sidebar.Item
                  href="/mailing/inbox"
                  icon={PiBirdFill}
                  active={"/mailing/inbox" === currentPage}
                  iconClassName={
                    "/mailing/inbox" === currentPage
                      ? "text-blue-600 dark:text-blue-500"
                      : ""
                  }
                  className={
                    "/mailing/inbox" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  百灵AI
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
  const isSidebarCollapsed = isOpenOnSmallScreens && !isSmallScreen();

  return (
    <div
      className={classNames(
        "flex items-center justify-center py-4",
        isSidebarCollapsed ? "px-2" : "gap-x-3 px-3",
      )}
    >
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <div
            className={classNames(
              "flex cursor-pointer items-center",
              isSidebarCollapsed ? "" : "gap-x-3",
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
            {!isSidebarCollapsed && (
              <div className="hidden text-left lg:block">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Neil Sims
                </div>
                <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                  neil.sims@flowbite.com
                </div>
              </div>
            )}
          </div>
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">Neil Sims</span>
          <span className="block truncate text-sm font-medium">
            neil.sims@flowbite.com
          </span>
        </Dropdown.Header>
        <Dropdown.Item>仪表盘</Dropdown.Item>
        <Dropdown.Item>设置</Dropdown.Item>
        <Dropdown.Item>收益</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>退出登录</Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default ExampleSidebar;
