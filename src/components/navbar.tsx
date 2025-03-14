/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  DarkThemeToggle,
  Dropdown,
  Navbar,
  Modal,
} from "flowbite-react";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
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
  HiCalendar,
} from "react-icons/hi";
import { MdCloudDownload, MdCloudUpload } from "react-icons/md";
import { PiBirdDuotone } from "react-icons/pi";
import { Calendar, Col, Radio, Row, Select } from "antd";
import type { CalendarProps } from "antd";
import { createStyles } from "antd-style";
import classNames from "classnames";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { HolidayUtil, Lunar } from "lunar-typescript";
import "antd/dist/reset.css";

import {
  FaRegWindowMaximize,
  FaRegWindowMinimize,
  FaRegWindowRestore,
} from "react-icons/fa";
import { FaEarlybirds } from "react-icons/fa";

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import isLargeScreen from "../helpers/is-large-screen";
import "../styles/electron.css";
import "react-calendar/dist/Calendar.css";

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
    <div className="flex items-center">
      <button
        onClick={minimizeWindow}
        className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="最小化"
      >
        <FaRegWindowMinimize className="size-4" />
      </button>
      <button
        onClick={maximizeWindow}
        className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title={isMaximized ? "还原" : "最大化"}
      >
        {isMaximized ? (
          <FaRegWindowRestore className="size-4" />
        ) : (
          <FaRegWindowMaximize className="size-4" />
        )}
      </button>
      <button
        onClick={closeWindow}
        className="rounded-md p-1.5 text-gray-600 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-red-400"
        title="关闭"
      >
        <GrClose className="size-4" />
      </button>
    </div>
  );
};

// 添加下载上传管理组件
const DownloadUploadManager: FC = function () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "download">("upload");

  // 打开模态框
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span className="sr-only">下载上传管理</span>
        <MdCloudDownload className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
      </button>

      {/* 自定义模态框，与搜索框样式一致 */}
      <div
        className={`${
          isModalOpen ? "fixed" : "hidden"
        } inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm`}
      >
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white/95 shadow-xl transition-all dark:bg-gray-800/95">
          {/* 模态框头部 */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTab === "upload" ? (
                  <MdCloudUpload className="text-xl text-blue-600 dark:text-blue-500" />
                ) : (
                  <MdCloudDownload className="text-xl text-purple-600 dark:text-purple-500" />
                )}
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  文件传输管理
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <HiX className="size-5" />
                <span className="sr-only">关闭</span>
              </button>
            </div>
          </div>

          {/* 模态框内容 */}
          <div className="p-4">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`inline-flex items-center justify-center p-4 ${
                      activeTab === "upload"
                        ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    <MdCloudUpload className="mr-2 size-4" />
                    上传管理
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab("download")}
                    className={`inline-flex items-center justify-center p-4 ${
                      activeTab === "download"
                        ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    <MdCloudDownload className="mr-2 size-4" />
                    下载管理
                  </button>
                </li>
              </ul>
            </div>

            {activeTab === "upload" ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <MdCloudUpload className="size-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          项目报告.docx
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          2.5MB / 2.5MB
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                      已完成
                    </span>
                  </div>
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="rounded-full bg-green-600 p-0.5 text-center text-xs font-medium leading-none text-green-100 dark:bg-green-500"
                      style={{ width: "100%" }}
                    >
                      100%
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <MdCloudUpload className="size-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          产品设计图.psd
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          15MB / 45MB
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      上传中
                    </span>
                  </div>
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="rounded-full bg-blue-600 p-0.5 text-center text-xs font-medium leading-none text-blue-100 dark:bg-blue-500"
                      style={{ width: "33%" }}
                    >
                      33%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                        <MdCloudDownload className="size-5 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          系统更新包.zip
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          120MB / 120MB
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                      已完成
                    </span>
                  </div>
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="rounded-full bg-green-600 p-0.5 text-center text-xs font-medium leading-none text-green-100 dark:bg-green-500"
                      style={{ width: "100%" }}
                    >
                      100%
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                        <MdCloudDownload className="size-5 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          研究数据集.csv
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          25MB / 80MB
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      下载中
                    </span>
                  </div>
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="rounded-full bg-purple-600 p-0.5 text-center text-xs font-medium leading-none text-purple-100 dark:bg-purple-500"
                      style={{ width: "31%" }}
                    >
                      31%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ExampleNavbar: FC = function () {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  // 添加搜索模态框状态
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(!isLargeScreen());

  // 监听窗口大小变化，调整侧边栏状态
  useEffect(() => {
    function handleResize() {
      setIsCollapsed(!isLargeScreen());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  // 切换侧边栏状态
  const toggleSidebar = () => {
    if (isSmallScreen()) {
      setOpenOnSmallScreens(!isOpenOnSmallScreens);
    } else {
      setIsCollapsed(!isCollapsed);
      setOpenOnSmallScreens(!isCollapsed);
    }
  };

  return (
    <Navbar fluid className="app-drag-region py-1">
      <div className="w-full lg:px-4 lg:pl-2">
        <div className="grid grid-cols-3 items-center">
          {/* 左侧品牌区域 */}
          <div className="flex items-center ml-2">
            <Navbar.Brand href="/" className="no-drag">
              <img
                src="/images/logo.svg"
                alt="易知云雀 Logo"
                className="mr-2 h-7 sm:h-8"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                易知云雀
              </span>
            </Navbar.Brand>
          </div>

          {/* 中间搜索区域 */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={openSearchModal}
              className="no-drag hidden h-7 w-64 items-center rounded-lg border-0 bg-gray-100 px-2 py-1.5 text-left text-sm text-gray-600 shadow-sm transition-all hover:bg-gray-100/90 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700/70 dark:text-gray-300 dark:hover:bg-gray-600/70 dark:focus:ring-blue-500 md:flex"
            >
              <HiSearch className="mr-2 size-4" />
              <span>搜索...</span>
            </button>
          </div>

          {/* 右侧功能区域 */}
          <div className="flex items-center justify-end lg:gap-2">
            <Button
              outline
              gradientDuoTone="purpleToPink"
              size="xs"
              className="no-drag mr-2 hover:text-white group"
            >
              <PiBirdDuotone className="mr-1 size-5 text-purple-500 group-hover:text-white" />
              <span className="text-purple-500 group-hover:text-white">
                AI助手
              </span>
            </Button>
            <button
              onClick={openSearchModal}
              className="no-drag cursor-pointer rounded-lg p-1.5 text-gray-600 transition-all hover:bg-gray-50/90 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700/70 dark:hover:text-white dark:focus:ring-blue-500 md:hidden"
            >
              <span className="sr-only">搜索</span>
              <HiSearch className="size-5" />
            </button>
            <div className="no-drag">
              <NotificationBellDropdown />
            </div>
            <div className="no-drag">
              <AppDrawerDropdown />
            </div>
            <div className="no-drag">
              <DownloadUploadManager />
            </div>
            <div className="no-drag">
              <DarkThemeToggle />
            </div>
            <div className="no-drag">
              <WindowControls />
            </div>
          </div>
        </div>
      </div>

      {/* 搜索模态框 */}
      <div
        className={`${isSearchModalOpen ? "fixed" : "hidden"} inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm`}
      >
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white/95 shadow-xl transition-all dark:bg-gray-800/95">
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
                  className="block w-full rounded-lg border-2 bg-gray-100 p-2 pl-10 text-sm text-gray-800 ring-0 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700/70 dark:text-white dark:placeholder:text-gray-300 dark:focus:bg-gray-700 dark:focus:ring-blue-500"
                  placeholder="搜索关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={closeSearchModal}
                  className="absolute inset-y-0 right-2.5 flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <HiX className="size-5" />
                  <span className="sr-only">关闭</span>
                </button>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-0 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <HiSearch className="mr-2 size-4" />
                    全局搜索
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-0"
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
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 搜索建议区域 */}
          <div className="px-5 py-4 dark:border-gray-700">
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
          <div className="mt-2 px-5 py-4 dark:border-gray-700">
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
          <span className="sr-only">通知</span>
          <HiBell className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
        </span>
      }
    >
      <div className="max-w-[22rem]">
        <div className="block rounded-t-xl bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          系统通知
        </div>
        <div>
          <a
            href="#"
            className="flex border-y px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <HiOutlineTicket className="size-5 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  系统更新提醒
                </span>
                <br />
                系统将于今晚22:00进行例行维护更新，预计耗时2小时。
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                10分钟前
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <HiUsers className="size-5 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  团队协作更新
                </span>
                <br />
                新版团队协作功能已上线，支持实时多人协作。
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                30分钟前
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <HiArchive className="size-5 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  数据备份完成
                </span>
                <br />
                您的所有工作数据已自动备份至云端存储。
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                2小时前
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <HiCog className="size-5 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  系统功能优化
                </span>
                <br />
                性能优化更新已完成，系统运行速度提升30%。
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                4小时前
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <HiInbox className="size-5 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  存储空间提醒
                </span>
                <br />
                您的存储空间已使用80%，请及时清理。
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                6小时前
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
            <span>查看全部通知</span>
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

const useStyle = createStyles(({ token, css, cx }) => {
  const lunar = css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `;
  const weekend = css`
    color: ${token.colorError};
    &.gray {
      opacity: 0.4;
    }
  `;
  return {
    wrapper: css`
      width: 100%;
      padding: 5px;
    `,
    dateCell: css`
      position: relative;
      &:before {
        content: "";
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 40px;
        max-height: 40px;
        background: transparent;
        transition: background-color 300ms;
        border-radius: ${token.borderRadiusOuter}px;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
      &:hover:before {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    today: css`
      &:before {
        border: 1px solid ${token.colorPrimary};
      }
    `,
    text: css`
      position: relative;
      z-index: 1;
    `,
    lunar,
    current: css`
      color: ${token.colorTextLightSolid};
      &:before {
        background: ${token.colorPrimary};
      }
      &:hover:before {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
      .${cx(lunar)} {
        color: ${token.colorTextLightSolid};
        opacity: 0.9;
      }
      .${cx(weekend)} {
        color: ${token.colorTextLightSolid};
      }
    `,
    weekend,
  };
});

const AppDrawerDropdown: FC = function () {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { styles } = useStyle({ test: true });
  const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
  const [panelDate, setPanelDate] = useState<Dayjs>(dayjs());

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    console.log(value.format("YYYY-MM-DD"), mode);
    setPanelDate(value);
  };

  const onDateChange: CalendarProps<Dayjs>["onSelect"] = (
    value,
    selectInfo,
  ) => {
    console.log(value.format("YYYY-MM-DD"), selectInfo);
    if (selectInfo.source === "date") {
      setSelectDate(value);
    }
  };

  const cellRender: CalendarProps<Dayjs>["fullCellRender"] = (date, info) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const isWeekend = date.day() === 6 || date.day() === 0;
    const h = HolidayUtil.getHoliday(
      date.get("year"),
      date.get("month") + 1,
      date.get("date"),
    );
    const displayHoliday =
      h?.getTarget() === h?.getDay() ? h?.getName() : undefined;

    if (info.type === "date") {
      return React.cloneElement(info.originNode, {
        ...(info.originNode as React.ReactElement<any>).props,
        className: classNames(styles.dateCell, {
          [styles.current]: selectDate.isSame(date, "date"),
          [styles.today]: date.isSame(dayjs(), "date"),
        }),
        children: (
          <div className={styles.text}>
            <span
              className={classNames({
                [styles.weekend]: isWeekend,
                gray: !panelDate.isSame(date, "month"),
              })}
            >
              {date.get("date")}
            </span>
            <div className={styles.lunar}>
              {displayHoliday || solarTerm || lunar}
            </div>
          </div>
        ),
      });
    }
    return info.originNode;
  };

  return (
    <>
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span className="sr-only">应用抽屉</span>
        <HiCalendar className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
      </button>

      {/* 自定义日历模态框，与搜索框样式一致 */}
      <div
        className={`${
          isCalendarOpen ? "fixed" : "hidden"
        } inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm`}
      >
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white/95 shadow-xl transition-all dark:bg-gray-800/95">
          {/* 模态框头部 */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiCalendar className="text-xl text-blue-600 dark:text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  日历
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <HiX className="size-5" />
                <span className="sr-only">关闭</span>
              </button>
            </div>
          </div>

          {/* 模态框内容 */}
          <div className="p-4">
            <Calendar
              fullscreen={false}
              onPanelChange={onPanelChange}
              onSelect={onDateChange}
              fullCellRender={cellRender}
              className="bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExampleNavbar;
