/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiArchive,
  HiBell,
  HiCog,
  HiCurrencyDollar,
  HiEye,
  HiInbox,
  HiLogout,
  HiMenuAlt1,
  HiOutlineTicket,
  HiSearch,
  HiShoppingBag,
  HiUserCircle,
  HiUsers,
  HiViewGrid,
  HiX,
} from "react-icons/hi";
import { LuBrainCircuit } from "react-icons/lu";

import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
} from "react-icons/vsc";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import "../styles/electron.css";

// 窗口控制按钮组件
const WindowControls: FC = function () {
  const [isMaximized, setIsMaximized] = useState(false);

  // 检查窗口是否最大化
  useEffect(() => {
    // 如果在Electron环境中
    if (window.electron) {
      // 监听窗口状态变化
      window.electron.receive(
        "window-maximized-state",
        (...args: unknown[]) => {
          if (args.length > 0 && typeof args[0] === "boolean") {
            setIsMaximized(args[0]);
          }
        },
      );
    }
  }, []);

  // 最小化窗口
  const minimizeWindow = () => {
    if (window.electron) {
      window.electron.send("window-minimize");
    }
  };

  // 最大化/还原窗口
  const maximizeWindow = () => {
    if (window.electron) {
      window.electron.send("window-maximize");
      setIsMaximized(!isMaximized);
    }
  };

  // 关闭窗口
  const closeWindow = () => {
    if (window.electron) {
      window.electron.send("window-close");
    }
  };

  return (
    <div className="mr-2 flex items-center">
      <button
        onClick={minimizeWindow}
        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="最小化"
      >
        <VscChromeMinimize className="size-4" />
      </button>
      <button
        onClick={maximizeWindow}
        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title={isMaximized ? "还原" : "最大化"}
      >
        {isMaximized ? (
          <VscChromeRestore className="size-4" />
        ) : (
          <VscChromeMaximize className="size-4" />
        )}
      </button>
      <button
        onClick={closeWindow}
        className="p-1.5 text-gray-600 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-red-400"
        title="关闭"
      >
        <VscChromeClose className="size-4" />
      </button>
    </div>
  );
};

const ExampleNavbar: FC = function () {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  // 添加搜索模态框状态
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 打开搜索模态框
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  // 关闭搜索模态框
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加搜索逻辑
    console.log("搜索查询:", searchQuery);
    closeSearchModal();
  };

  return (
    <Navbar fluid className="app-drag-region py-1">
      <div className="w-full lg:px-4 lg:pl-2">
        <div className="grid grid-cols-3 items-center">
          {/* 左侧品牌区域 */}
          <div className="no-drag flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-2 cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="size-5" />
                ) : (
                  <HiMenuAlt1 className="size-5" />
                )}
              </button>
            )}
            <Navbar.Brand href="/" className="no-drag">
              <img
                alt=""
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-2 h-5 sm:h-6"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Flowbite
              </span>
            </Navbar.Brand>
          </div>

          {/* 中间搜索区域 - 可拖动 */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={openSearchModal}
              className="no-drag hidden h-9 w-64 items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 md:flex"
            >
              <HiSearch className="mr-2 size-4" />
              <span>搜索...</span>
            </button>
          </div>

          {/* 右侧功能区域 */}
          <div className="no-drag flex items-center justify-end lg:gap-2">
            <Button
              outline
              gradientDuoTone="purpleToPink"
              size="sm"
              className="mr-2"
            >
              <LuBrainCircuit className="mr-2 size-5 text-purple-500" />
              AI意识体
            </Button>
            <button
              onClick={openSearchModal}
              className="cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 md:hidden"
            >
              <span className="sr-only">Search</span>
              <HiSearch className="size-5" />
            </button>
            <NotificationBellDropdown />
            <AppDrawerDropdown />
            <DarkThemeToggle />
            <WindowControls />
          </div>
        </div>
      </div>

      {/* 搜索模态框 */}
      <div
        className={`${isSearchModalOpen ? "fixed" : "hidden"} inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4`}
      >
        <div className="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-2xl transition-all dark:bg-gray-800">
          {/* 搜索输入区域 */}
          <div className="p-5">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiSearch className="size-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="search"
                  id="modal-search"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="搜索关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={closeSearchModal}
                  className="absolute right-2.5 top-2.5 rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <HiX className="size-5" />
                  <span className="sr-only">关闭</span>
                </button>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <HiSearch className="mr-2 size-4" />
                    全局搜索
                  </button>
                  <Button
                    type="button"
                    outline
                    gradientDuoTone="purpleToPink"
                    onClick={() => {
                      console.log("AI搜索:", searchQuery);
                      closeSearchModal();
                    }}
                  >
                    <svg
                      className="mr-2 size-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    AI搜索
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* 搜索建议区域 */}
          <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              热门搜索
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  <HiSearch className="mr-2 size-4" />
                  仪表盘设计
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  <HiSearch className="mr-2 size-4" />
                  用户管理
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  <HiSearch className="mr-2 size-4" />
                  数据分析
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  <HiSearch className="mr-2 size-4" />
                  设置选项
                </a>
              </li>
            </ul>
          </div>

          {/* 最近搜索区域 */}
          <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                最近搜索
              </h3>
              <button className="text-xs text-blue-600 hover:underline dark:text-blue-500">
                清除全部
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center justify-between">
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  <HiSearch className="mr-2 size-4" />
                  项目统计
                </a>
                <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HiX className="size-4 text-gray-400" />
                </button>
              </li>
              <li className="flex items-center justify-between">
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  <HiSearch className="mr-2 size-4" />
                  团队成员
                </a>
                <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HiX className="size-4 text-gray-400" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

const NotificationBellDropdown: FC = function () {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Notifications</span>
          <HiBell className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
        </span>
      }
    >
      <div className="max-w-[22rem]">
        <div className="block rounded-t-xl bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          Notifications
        </div>
        <div>
          <a
            href="#"
            className="flex border-y px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src="../images/users/bonnie-green.png"
                className="size-9 rounded-full"
              />
              <div className="absolute -mt-4 ml-5 flex size-4 items-center justify-center rounded-full border border-white bg-primary-700 dark:border-gray-700">
                <NewMessageIcon />
              </div>
            </div>
            <div className="w-full pl-2">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                New message from&nbsp;
                <span className="font-semibold text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                : "Hey, what's up? All set for the presentation?"
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                a few moments ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src="../images/users/jese-leos.png"
                className="size-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex size-5 items-center justify-center rounded-full border border-white bg-gray-900 dark:border-gray-700">
                <NewFollowIcon />
              </div>
            </div>
            <div className="w-full pl-2">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Jese Leos
                </span>
                &nbsp;and&nbsp;
                <span className="font-medium text-gray-900 dark:text-white">
                  5 others
                </span>
                &nbsp;started following you.
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                10 minutes ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src="../images/users/joseph-mcfall.png"
                className="size-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex size-5 items-center justify-center rounded-full border border-white bg-red-600 dark:border-gray-700">
                <NewLoveIcon />
              </div>
            </div>
            <div className="w-full pl-2">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Joseph Mcfall
                </span>
                &nbsp;and&nbsp;
                <span className="font-medium text-gray-900 dark:text-white">
                  141 others
                </span>
                &nbsp;love your story. See it and view more stories.
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                44 minutes ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src="../images/users/leslie-livingston.png"
                className="size-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex size-5 items-center justify-center rounded-full border border-white bg-green-400 dark:border-gray-700">
                <NewMentionIcon />
              </div>
            </div>
            <div className="w-full pl-2">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Leslie Livingston
                </span>
                &nbsp;mentioned you in a comment:&nbsp;
                <span className="font-medium text-primary-700 dark:text-primary-500">
                  @bonnie.green
                </span>
                &nbsp;what do you say?
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                1 hour ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src="../images/users/robert-brown.png"
                className="size-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex size-5 items-center justify-center rounded-full border border-white bg-purple-500 dark:border-gray-700">
                <NewVideoIcon />
              </div>
            </div>
            <div className="w-full pl-2">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Robert Brown
                </span>
                &nbsp;posted a new video: Glassmorphism - learn how to implement
                the new design trend.
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                3 hours ago
              </div>
            </div>
          </a>
        </div>
        <a
          href="#"
          className="block rounded-b-xl bg-gray-50 px-3 py-1.5 text-center text-xs font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
        >
          <div className="inline-flex items-center gap-x-1.5">
            <HiEye className="size-4" />
            <span>View all</span>
          </div>
        </a>
      </div>
    </Dropdown>
  );
};

const NewMessageIcon: FC = function () {
  return (
    <svg
      className="size-2.5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
    </svg>
  );
};

const NewFollowIcon: FC = function () {
  return (
    <svg
      className="size-2.5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
    </svg>
  );
};

const NewLoveIcon: FC = function () {
  return (
    <svg
      className="size-2.5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NewMentionIcon: FC = function () {
  return (
    <svg
      className="size-2.5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NewVideoIcon: FC = function () {
  return (
    <svg
      className="size-2.5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
    </svg>
  );
};

const AppDrawerDropdown: FC = function () {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
        </span>
      }
    >
      <div className="block rounded-t-lg border-b bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-white">
        Apps
      </div>
      <div className="grid grid-cols-3 gap-3 p-3">
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiShoppingBag className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Sales
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiUsers className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Users
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiInbox className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Inbox
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiUserCircle className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Profile
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiCog className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Settings
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiArchive className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Products
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiCurrencyDollar className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Pricing
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiOutlineTicket className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Billing
          </div>
        </a>
        <a
          href="#"
          className="block rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiLogout className="mx-auto mb-1 size-6 text-gray-500 dark:text-white" />
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            Logout
          </div>
        </a>
      </div>
    </Dropdown>
  );
};

export default ExampleNavbar;
