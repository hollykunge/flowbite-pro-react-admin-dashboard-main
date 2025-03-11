/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, Modal } from "flowbite-react";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import "antd/dist/reset.css";
import {
  PiSunHorizonDuotone,
  PiSunDimDuotone,
  PiMoonStarsDuotone,
  PiCalendarCheckDuotone,
  PiListChecksDuotone,
} from "react-icons/pi";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { PiChatTeardropDuotone } from "react-icons/pi";
import { PiListNumbersDuotone } from "react-icons/pi";
import { PiBookOpenDuotone } from "react-icons/pi";

import {
  HiOutlineVideoCamera,
  HiOutlineClock,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineBookOpen,
  HiOutlineCube,
  HiOutlineDocument,
  HiOutlineCog,
} from "react-icons/hi2";

/**
 * AI智慧屏页面组件
 */
const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="min-h-screen px-4 pt-6 bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <Greeting />
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          {/* 左侧列 */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DateCard />
              <TodoCard />
            </div>
            <div>
              <MessageSummaryCard />
            </div>
          </div>

          {/* 右侧列 */}
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <TaskSummaryCard />
            </div>
            <div>
              <WorkPlanCard />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

/**
 * 日期卡片组件
 */
const DateCard: FC = function () {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const today = useMemo(() => {
    const date = selectedDate;
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
        date.getDay()
      ],
    };
  }, [selectedDate]);

  return (
    <>
      <Card
        className="text-center cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-col items-center space-y-4">
          <PiCalendarCheckDuotone
            className="text-blue-500 dark:text-blue-400"
            size={48}
          />
          <div className="text-blue-900 dark:text-blue-100">
            <div className="text-lg font-semibold">
              {today.year}年{today.month}月{today.day}日
            </div>
            <div className="text-base">{today.weekday}</div>
          </div>
        </div>
      </Card>

      <Modal show={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <Modal.Header>选择日期</Modal.Header>
        <Modal.Body>
          <Calendar
            fullscreen={false}
            onSelect={(date: Dayjs) => {
              setSelectedDate(date.toDate());
              setIsOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

/**
 * 待办卡片组件
 */
const TodoCard: FC = function () {
  return (
    <Card className="text-center bg-green-50 dark:bg-green-900">
      <div className="flex flex-col items-center space-y-4">
        <PiListChecksDuotone
          className="text-green-500 dark:text-green-400"
          size={48}
        />
        <div className="text-green-900 dark:text-green-100">
          <div className="text-lg font-semibold">今日待办</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            5
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 问候语组件
 */
const Greeting: FC = function () {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) {
      return {
        text: "早上好，新的一天从这里开始！",
        icon: <PiSunHorizonDuotone className="text-yellow-400" size={48} />,
      };
    } else if (hour >= 9 && hour < 12) {
      return {
        text: "上午好，愿你工作顺利！",
        icon: <PiSunHorizonDuotone className="text-yellow-400" size={48} />,
      };
    } else if (hour >= 12 && hour < 14) {
      return {
        text: "中午好，忙碌了半天，记得稍作休息！",
        icon: <PiSunDimDuotone className="text-yellow-500" size={48} />,
      };
    } else if (hour >= 14 && hour < 18) {
      return {
        text: "下午好，保持专注与热情！",
        icon: <PiSunDimDuotone className="text-yellow-500" size={48} />,
      };
    } else {
      return {
        text: "晚上好，向最努力的你致敬！",
        icon: <PiMoonStarsDuotone className="text-blue-400" size={48} />,
      };
    }
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{greeting.icon}</span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {greeting.text}
        </h1>
      </div>
      <button
        type="button"
        className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <HiOutlineCog className="w-6 h-6" />
        <span className="sr-only">设置</span>
      </button>
    </div>
  );
};

/**
 * 消息总结卡片组件
 */
const MessageSummaryCard: FC = function () {
  return (
    <Card className="min-h-[300px] overflow-hidden">
      <div className="flex items-center gap-1 py-6 px-6 -mt-px -mx-px bg-gradient-to-r from-blue-100 to-white dark:from-blue-900/50 dark:to-gray-800">
        <PiChatTeardropDuotone className="size-5 text-blue-600 dark:text-blue-400" />
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          消息摘要
        </h5>
      </div>
      <div className="p-6 pt-4">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="size-8 rounded-full"
                  src="/images/users/neil-sims.png"
                  alt="Neil Sims"
                />
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    待处理任务
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    3项待办
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>用户管理模块开发</p>
                  <p>首页性能优化</p>
                  <p>数据可视化组件集成</p>
                </div>
              </div>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="size-8 rounded-full"
                  src="/images/users/bonnie-green.png"
                  alt="Bonnie Green"
                />
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    待回复消息
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2条未回复
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>张三：关于项目进度的咨询</p>
                  <p>李四：新需求变更确认</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
};

/**
 * 任务总结卡片组件
 */
const TaskSummaryCard: FC = function () {
  return (
    <Card className="min-h-[300px] [&>div]:!block">
      <div className="flex items-center gap-1 py-6 px-6 -mt-px -mx-px bg-gradient-to-r from-green-100 to-white dark:from-green-900/50 dark:to-gray-800">
        <PiListNumbersDuotone className="size-5 text-green-600 dark:text-green-400" />
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          任务摘要
        </h5>
      </div>
      <div className="p-6 pt-4">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  数据处理模块重构
                </p>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  XXX型号XXX项目
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                项目组昨日新增两名后端开发，创建了3个相关任务。其中有2个交付物需要你进行代码评审，1个接口文档等待确认。
              </p>
            </div>
          </li>
          <li className="py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  首页性能优化
                </p>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  管理系统开发
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                性能测试团队完成了首轮评估，发现3个关键性能问题。已创建相应优化任务，其中2个与你负责的缓存模块相关，需要本周内完成。
              </p>
            </div>
          </li>
          <li className="py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  数据可视化组件
                </p>
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  数据分析平台
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                新增echarts图表库集成任务，已完成基础框架搭建。设计团队提供了4个新的图表原型，其中2个需要你负责实现，预计下周开始开发。
              </p>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
};

/**
 * 知识推荐卡片组件
 */
const WorkPlanCard: FC = function () {
  return (
    <Card className="min-h-[300px]">
      <div className="flex items-center gap-2 py-6 px-6 -mt-px -mx-px bg-gradient-to-r from-orange-100 to-white dark:from-orange-900/50 dark:to-gray-800">
        <PiBookOpenDuotone className="size-5 text-orange-600 dark:text-orange-400" />
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          知识推荐
        </h5>
      </div>
      <div className="p-6 pt-4">
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/70">
            <div className="flex items-center gap-3 mb-3">
              <HiOutlineCube className="size-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                架构设计
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 微服务架构设计最佳实践
              </a>
              <a
                href="#"
                className="block text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 高可用系统设计原则
              </a>
              <a
                href="#"
                className="block text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 分布式系统架构模式
              </a>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 transition-colors hover:bg-green-100 dark:hover:bg-green-900/70">
            <div className="flex items-center gap-3 mb-3">
              <HiOutlineDocument className="size-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                任务书编写
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 软件需求规格说明书模板
              </a>
              <a
                href="#"
                className="block text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 技术方案撰写指南
              </a>
              <a
                href="#"
                className="block text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 项目计划书编写规范
              </a>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/50 rounded-lg p-4 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/70">
            <div className="flex items-center gap-3 mb-3">
              <HiOutlineBookOpen className="size-5 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                系统工程
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • DevOps实践指南
              </a>
              <a
                href="#"
                className="block text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 持续集成最佳实践
              </a>
              <a
                href="#"
                className="block text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 px-2 py-1 -mx-2 rounded transition-colors"
              >
                • 自动化测试框架搭建
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardPage;
