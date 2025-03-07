import { Button, Avatar } from "flowbite-react";
import type { FC, ChangeEvent } from "react";
import { HiPlus } from "react-icons/hi";
import { useState } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import MessageInput from "../components/MessageInput";

/**
 * 研讨页面组件
 *
 * 显示研讨相关内容和功能，采用类似聊天界面的布局，包含左侧会话列表
 */
const DiscussionPage: FC = function () {
  const [message, setMessage] = useState("");
  const [activeDiscussionId, setActiveDiscussionId] = useState(1);

  // 模拟的研讨会话列表数据
  const [discussionList, setDiscussionList] = useState([
    {
      id: 1,
      title: "项目进度讨论",
      lastMessage: "我负责的部分遇到了一些问题，需要大家帮忙",
      time: "10:35",
      unread: 2,
      color: "purple", // 添加头像颜色
    },
    {
      id: 2,
      title: "产品设计讨论",
      lastMessage: "新版本的UI设计已经完成",
      time: "昨天",
      unread: 0,
      color: "blue", // 添加头像颜色
    },
    {
      id: 3,
      title: "技术方案评审",
      lastMessage: "我们需要考虑性能优化问题",
      time: "周一",
      unread: 5,
      color: "green", // 添加头像颜色
    },
    {
      id: 4,
      title: "周会安排",
      lastMessage: "本周五下午3点进行项目周会",
      time: "上周",
      unread: 0,
      color: "red", // 添加头像颜色
    },
  ]);

  // 模拟的研讨消息数据
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      sender: "张三",
      content: "大家好，我们今天讨论一下项目进度",
      time: "10:30",
    },
    {
      id: 2,
      sender: "李四",
      content: "好的，我这边的模块已经完成了80%",
      time: "10:32",
    },
    {
      id: 3,
      sender: "王五",
      content: "我负责的部分遇到了一些问题，需要大家帮忙",
      time: "10:35",
    },
  ]);

  // 发送新消息的处理函数
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        id: discussions.length + 1,
        sender: "我",
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setDiscussions([...discussions, newMessage]);
      setMessage("");

      // 更新会话列表中的最后一条消息
      const updatedList = discussionList.map((item) => {
        if (item.id === activeDiscussionId) {
          return { ...item, lastMessage: message, time: "刚刚" };
        }
        return item;
      });
      setDiscussionList(updatedList);
    }
  };

  // 处理消息内容变化
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // 切换当前活跃的研讨会话
  const handleSelectDiscussion = (id: number) => {
    setActiveDiscussionId(id);
    // 在实际应用中，这里应该根据id加载对应的消息记录
  };

  return (
    <NavbarSidebarLayout>
      <div className="flex h-screen">
        {/* 左侧会话列表 */}
        <div className="flex h-full w-1/4 flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="mb-4 w-full border-b border-gray-200 dark:border-gray-700">
            <ul
              data-tabs-active-classes="text-primary-600 dark:text-primary-500 border-primary-600"
              data-tabs-inactive-classes="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 dark:hover:border-gray-600 hover:border-gray-300 hover:text-gray-900 dark:hover:text-white"
              className="-mb-px grid grid-cols-2 text-center text-sm font-medium"
              id="contacts-tab"
              data-tabs-toggle="#contacts-tab-content"
              role="tablist"
            >
              <li role="presentation">
                <button
                  className="flex w-full items-center justify-center rounded-t-lg border-b px-4 py-5 text-gray-500 dark:text-gray-400"
                  id="chats-tab"
                  data-tabs-target="#chats"
                  type="button"
                  role="tab"
                  aria-controls="chats"
                  aria-selected="false"
                >
                  <svg
                    className="me-2 size-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  研讨会话
                </button>
              </li>
              <li role="presentation">
                <button
                  className="flex w-full items-center justify-center rounded-t-lg border-b px-4 py-5 text-gray-500 dark:text-gray-400"
                  id="calls-tab"
                  data-tabs-target="#calls"
                  type="button"
                  role="tab"
                  aria-controls="calls"
                  aria-selected="false"
                >
                  <svg
                    className="me-2 size-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
                  </svg>
                  最近通话
                </button>
              </li>
            </ul>
          </div>
          <div className="h-full flex-1 overflow-y-auto overflow-x-hidden">
            {discussionList.map((item) => (
              <button
                key={item.id}
                className={`w-full cursor-pointer border-b border-gray-100 p-3 text-left hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-700 ${
                  activeDiscussionId === item.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => handleSelectDiscussion(item.id)}
                aria-pressed={activeDiscussionId === item.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar rounded size="sm" color={item.color} />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="w-40 truncate text-sm text-gray-500 dark:text-gray-400">
                        {item.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.time}
                    </span>
                    {item.unread > 0 && (
                      <span className="mt-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                        {item.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧聊天区域 */}
        <div className="flex h-full w-3/4 flex-col">
          <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between px-4 pt-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                {discussionList.find((item) => item.id === activeDiscussionId)
                  ?.title || "研讨"}
              </h1>
              <Button size="sm" color="primary">
                <div className="flex items-center gap-x-2">
                  <HiPlus className="text-lg" />
                  创建新研讨
                </div>
              </Button>
            </div>

            {/* 研讨消息区域 - 可滚动 */}
            <div className="flex-1 overflow-y-auto px-4">
              <div className="h-full rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                {discussions.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 max-w-[75%] ${msg.sender === "我" ? "ml-auto" : ""}`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        msg.sender === "我"
                          ? "ml-auto bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      <div className="text-sm font-bold">{msg.sender}</div>
                      <div>{msg.content}</div>
                      <div className="mt-1 text-right text-xs opacity-70">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 消息输入区域 - 固定在底部 */}
            <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <MessageInput
                message={message}
                onMessageChange={handleMessageChange}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default DiscussionPage;
