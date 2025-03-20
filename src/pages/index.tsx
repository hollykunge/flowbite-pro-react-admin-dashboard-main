/* eslint-disable jsx-a11y/anchor-is-valid */
import { Calendar } from "antd";
import "antd/dist/reset.css";
import type { Dayjs } from "dayjs";
import { Card, Modal } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { AiTwotoneSetting } from "react-icons/ai";
import {
  PiBookOpenDuotone,
  PiCalendarCheckDuotone,
  PiChatTeardropDuotone,
  PiListChecksDuotone,
  PiListNumbersDuotone,
  PiMoonStarsDuotone,
  PiRocketLaunchDuotone,
  PiSunDimDuotone,
  PiSunHorizonDuotone,
} from "react-icons/pi";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

import {
  HiOutlineBookOpen,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineClock,
  HiOutlineCube,
  HiOutlineDocument,
  HiOutlineVideoCamera,
} from "react-icons/hi2";

import Clock from "react-clock";
import "react-clock/dist/Clock.css";

/**
 * AI智慧屏页面组件
 */
const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="min-h-screen px-4 pt-6 bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* 背景火箭图标 - 右上角，45度角 */}
        <div className="absolute -right-20 -top-20 opacity-5 transform rotate-45 z-0">
          <PiRocketLaunchDuotone size={300} />
        </div>

        {/* 背景火箭图标 - 左下角，-45度角 */}
        <div className="absolute -left-20 -bottom-20 opacity-5 transform -rotate-45 z-0">
          <PiRocketLaunchDuotone size={300} />
        </div>

        <div className="relative z-10">
          <Greeting />
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            {/* 左侧列 */}
            <div className="w-full md:w-1/2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DateCard />
                <AnalogClockCard />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CommonAppsCard />
                <TaskReminderCard />
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
    // 农历日期信息（模拟数据）
    const lunarInfo = ["正月", "初一"];

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
        date.getDay()
      ],
      lunar: {
        month: lunarInfo[0],
        day: lunarInfo[1],
      },
    };
  }, [selectedDate]);

  return (
    <>
      <Card
        className="text-center cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-col items-center h-full justify-between">
          {/* 顶部：月份和星期 */}
          <div className="text-blue-900 dark:text-blue-100 w-full text-center border-b border-blue-200 dark:border-blue-700 pb-2">
            <div className="text-base">
              {today.year}年{today.month}月 {today.weekday}
            </div>
          </div>

          {/* 中间：日期主体部分 */}
          <div className="flex items-center justify-center my-3 relative">
            <span className="text-7xl font-bold text-blue-700 dark:text-blue-300">
              {today.day}
            </span>

            {/* 右侧：农历日期 - 垂直排列 */}
            <div className="flex flex-col ml-4 text-sm text-blue-600 dark:text-blue-400 border-l border-blue-200 dark:border-blue-700 pl-3">
              <span>{today.lunar.month}</span>
              <span>{today.lunar.day}</span>
            </div>
          </div>

          {/* 底部：图标 */}
          <div className="w-full pt-2 border-t border-blue-200 dark:border-blue-700">
            <PiCalendarCheckDuotone
              className="text-blue-500 dark:text-blue-400 mx-auto"
              size={24}
            />
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
 * 模拟表盘卡片组件
 */
const AnalogClockCard: FC = function () {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 获取当日工作信息
  const getDailyTask = () => {
    const hour = time.getHours();
    if (hour >= 6 && hour < 9) {
      return "早会讨论";
    } else if (hour >= 9 && hour < 12) {
      return "核心开发";
    } else if (hour >= 12 && hour < 14) {
      return "午休时间";
    } else if (hour >= 14 && hour < 18) {
      return "项目研讨";
    } else if (hour >= 18 && hour < 20) {
      return "总结汇报";
    } else {
      return "休息时间";
    }
  };

  const dailyTask = getDailyTask();

  return (
    <Card className="text-center bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 transition-colors cursor-pointer">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* 时钟外框装饰 */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 opacity-50 blur-sm"></div>

          <div className="relative">
            <Clock
              value={time}
              size={125}
              renderNumbers={true}
              renderMinuteMarks={true}
              renderHourMarks={true}
              hourHandWidth={4}
              minuteHandWidth={3}
              secondHandWidth={1.5}
              hourHandLength={55}
              minuteHandLength={75}
              secondHandLength={85}
              hourHandOppositeLength={12}
              minuteHandOppositeLength={12}
              secondHandOppositeLength={15}
              className="dark:invert"
            />
          </div>
        </div>

        <div className="text-purple-900 dark:text-purple-100 w-full">
          <div className="text-base font-medium border-t border-purple-200 dark:border-purple-700 pt-2 mt-1">
            当前阶段
          </div>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-300 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {dailyTask}
          </div>
        </div>
      </div>
    </Card>
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
        <AiTwotoneSetting className="w-6 h-6" />
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
    <Card className="min-h-[300px] overflow-hidden [&>div]:!p-0">
      <div className="flex items-center gap-1 py-4 px-6 bg-gradient-to-r from-blue-100 to-white dark:from-blue-900/50 dark:to-gray-800">
        <PiChatTeardropDuotone className="size-5 text-blue-600 dark:text-blue-400" />
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          消息摘要
        </h5>
      </div>
      <div className="px-6 pt-0 pb-6">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* 会议信息 */}
          <li className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <HiOutlineVideoCamera className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    项目周会
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    10:00 AM
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="flex items-center gap-1">
                    <HiOutlineClock className="size-4" />
                    2024-03-20 10:00-11:30
                  </p>
                  <p className="flex items-center gap-1">
                    <HiOutlineChatBubbleBottomCenterText className="size-4" />
                    腾讯会议：123-456-789
                  </p>
                </div>
              </div>
            </div>
          </li>

          {/* 待办事项 */}
          <li className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <PiListChecksDuotone className="size-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    待办事项
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    3项待办
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="flex items-center justify-between">
                    <span>用户管理模块开发</span>
                    <span>14:30</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>首页性能优化</span>
                    <span>16:00</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>数据可视化组件集成</span>
                    <span>明天</span>
                  </p>
                </div>
              </div>
            </div>
          </li>

          {/* 需要回复 */}
          <li className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <PiChatTeardropDuotone className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    需要回复
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2条未回复
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>张三：关于新功能开发进度的确认，需要您的反馈</p>
                  <p>李四：测试环境部署问题，请查看并回复处理方案</p>
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
    <Card className="min-h-[300px] [&>div]:!p-0">
      <div className="flex items-center gap-1 py-4 px-6 bg-gradient-to-r from-green-100 to-white dark:from-green-900/50 dark:to-gray-800 rounded-t-lg">
        <PiListNumbersDuotone className="size-5 text-green-600 dark:text-green-400" />
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          任务摘要
        </h5>
      </div>
      <div className="px-6 pt-0 pb-6">
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
    <Card className="min-h-[300px] [&>div]:!p-0">
      <div className="flex items-center gap-1 py-4 px-6 bg-gradient-to-r from-orange-100 to-white dark:from-orange-900/50 dark:to-gray-800 rounded-t-lg">
        <PiBookOpenDuotone className="size-5 text-orange-600 dark:text-orange-400" />
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          知识推荐
        </h5>
      </div>
      <div className="px-6 pt-0 pb-6">
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

/**
 * 常用应用卡片组件
 */
const CommonAppsCard: FC = function () {
  const apps = [
    {
      name: "邮件系统",
      icon: (
        <HiOutlineChatBubbleBottomCenterText className="size-6 text-blue-500" />
      ),
      color: "blue",
    },
    {
      name: "协同编辑",
      icon: <HiOutlineDocument className="size-6 text-green-500" />,
      color: "green",
    },
    {
      name: "评审系统",
      icon: <HiOutlineVideoCamera className="size-6 text-purple-500" />,
      color: "purple",
    },
    {
      name: "知识库",
      icon: <HiOutlineBookOpen className="size-6 text-orange-500" />,
      color: "orange",
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 h-full">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-1 mb-4">
            <HiOutlineCube className="size-5 text-gray-500 dark:text-gray-400" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
              常用应用
            </h5>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {apps.map((app, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors group"
              >
                <div
                  className={`p-2 rounded-full bg-${app.color}-50 dark:bg-${app.color}-900/30 mb-2 group-hover:scale-110 transition-transform`}
                >
                  {app.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
          点击图标快速访问应用
        </div>
      </div>
    </Card>
  );
};

/**
 * 任务提醒卡片组件
 */
const TaskReminderCard: FC = function () {
  const tasks = [
    {
      title: "XXX归零会",
      time: "10:30",
      priority: "高",
      priorityColor: "red",
    },
    {
      title: "XXX项目评审",
      time: "14:00",
      priority: "中",
      priorityColor: "yellow",
    },
    {
      title: "数字化周报提交",
      time: "17:30",
      priority: "中",
      priorityColor: "yellow",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 overflow-hidden [&>div]:!p-0 h-full">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineClock className="size-5 text-orange-500 dark:text-orange-400" />
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            工作提醒
          </h5>
        </div>

        <div className="flex-1 overflow-auto pr-1 space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full bg-${task.priorityColor}-500`}
                ></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {task.title}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {task.time}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-orange-100 dark:border-orange-900/30 text-xs text-center text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
          今日待办任务 <span className="font-semibold">{tasks.length}</span> 项
        </div>
      </div>
    </Card>
  );
};

export default DashboardPage;
