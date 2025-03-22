import { Button, Label, Modal, Textarea } from "flowbite-react";
import type { ChangeEvent, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import {
  HiBadgeCheck,
  HiCheck,
  HiCog,
  HiOutlineExclamation,
  HiSearch,
  HiUserAdd,
} from "react-icons/hi";
import {
  PiNotificationFill,
  PiPlusCircleFill,
  PiPushPinFill,
} from "react-icons/pi";
import { RiContactsBookFill, RiGroup2Line, RiListCheck2 } from "react-icons/ri";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import ChatDocumentCard from "../ChatDocumentCard";
import ChatFileMessage from "../ChatFileMessage";
import ChatKnowledgeCard from "../ChatKnowledgeCard";
import ChatMessage from "../ChatMessage";
import ChatNoticeCard from "../ChatNoticeCard";
import ChatRelayCard from "../ChatRelayCard";
import ChatTaskCard from "../ChatTaskCard";
import ChatVoiceMessage from "../ChatVoiceMessage";
import ChatVoteCard from "../ChatVoteCard";
import type { MessageSecurityLevel } from "../MessageInput";
import MessageInput from "../MessageInput";
import SettingsDrawer from "../SettingsDrawer";
import ContactsTab from "./ContactsTab";
import {
  defaultPinnedTopic,
  discussionListData,
  messagesData,
  platformGroupMessagesData,
} from "./mockData";
import OfficialGroupDetails from "./OfficialGroupDetails";
import OrganizationMembersList from "./OrganizationMembersList";
import TopicForm from "./TopicForm";
import { MessageType } from "./types";

/**
 * 研讨页面组件
 *
 * 显示研讨相关内容和功能，采用类似聊天界面的布局，包含左侧会话列表
 */
const DiscussionPage: FC = function () {
  const [message, setMessage] = useState("");
  const [activeDiscussionId, setActiveDiscussionId] = useState(1);
  const [activeTab, setActiveTab] = useState("messages");
  const [messageFilter, setMessageFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // 添加一个新的状态来区分右侧显示的内容类型
  const [rightPanelType, setRightPanelType] = useState<
    "message" | "contact" | "officialGroup"
  >("message");

  // 添加组织架构相关状态
  const [selectedOrganization, setSelectedOrganization] = useState<{
    instituteId: number;
    departmentId: number | null;
    name: string;
  } | null>(null);
  const [showOrganizationMembers, setShowOrganizationMembers] = useState(false);

  // 添加官方群组相关状态
  const [selectedOfficialGroup, setSelectedOfficialGroup] = useState<{
    groupId: number;
    name: string;
  } | null>(null);

  // 接龙参与相关状态
  const [showRelayParticipateModal, setShowRelayParticipateModal] =
    useState(false);
  const [relayParticipateContent, setRelayParticipateContent] = useState("");
  const [currentRelayId, setCurrentRelayId] = useState<number | null>(null);
  const [relayTitle, setRelayTitle] = useState("");

  // 话题置顶相关状态
  const [pinnedTopic, setPinnedTopic] = useState(defaultPinnedTopic);

  const [showTopicForm, setShowTopicForm] = useState<boolean>(false);
  const [topicTitle, setTopicTitle] = useState<string>("");
  const [topicContent, setTopicContent] = useState<string>("");

  // 添加进群通知弹窗相关状态
  const [showGroupNotice, setShowGroupNotice] = useState(false);
  const [groupNoticeContent, setGroupNoticeContent] = useState<{
    title: string;
    content: string;
    type: "welcome" | "rules" | "announcement" | "event";
    importance: "normal" | "important" | "urgent";
  } | null>(null);

  // 添加已确认用户信息
  const [confirmedUsers, setConfirmedUsers] = useState<
    Array<{
      id: number;
      name: string;
      avatar: string;
      time: string;
    }>
  >([
    {
      id: 1,
      name: "张三",
      avatar: "/images/users/neil-sims.png",
      time: "2023-09-15 15:30",
    },
  ]);

  // 禁用外部框架的垂直滚动
  useEffect(() => {
    // 获取主内容区域元素
    const mainContent = document.querySelector("main");
    if (mainContent) {
      // 禁用滚动
      mainContent.style.overflow = "hidden";
    }

    // 组件卸载时恢复滚动
    return () => {
      if (mainContent) {
        mainContent.style.overflow = "";
      }
    };
  }, []);

  // 使用 ref 跟踪滚动容器
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 处理滚动事件，只在滚动时显示滚动条
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.classList.add("scrolling");

    // 清除之前的定时器
    const timerId = target.dataset["scrollTimer"];
    if (timerId) {
      window.clearTimeout(parseInt(timerId));
    }

    // 设置新的定时器，1秒后隐藏滚动条
    const newTimerId = window.setTimeout(() => {
      target.classList.remove("scrolling");
    }, 1000);

    target.dataset["scrollTimer"] = newTimerId.toString();
  };

  // 初始化状态使用模拟数据
  const [discussionList, setDiscussionList] = useState(discussionListData);
  const [discussions, setDiscussions] = useState(messagesData);

  // 处理回复消息
  const handleReplyMessage = (id: number) => {
    const messageToReply = discussions.find((msg) => msg.id === id);
    if (messageToReply) {
      setReplyingTo(messageToReply);
    }
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // 添加表情反应
  const handleAddReaction = (id: number, reaction: string) => {
    setDiscussions(
      discussions.map((msg) => {
        if (msg.id === id) {
          const currentReactions = msg.reactions || [];
          // 如果已经有这个表情，则移除它（切换功能）
          if (currentReactions.includes(reaction)) {
            return {
              ...msg,
              reactions: currentReactions.filter((r) => r !== reaction),
            };
          }
          // 否则添加这个表情
          return {
            ...msg,
            reactions: [...currentReactions, reaction],
          };
        }
        return msg;
      }),
    );
  };

  // 编辑消息
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");

  const handleEditMessage = (id: number) => {
    const messageToEdit = discussions.find((msg) => msg.id === id);
    if (messageToEdit) {
      setEditingMessageId(id);
      setEditedMessageContent(messageToEdit.content);
    }
  };

  const handleSaveEdit = (content?: string) => {
    if (
      editingMessageId !== null &&
      (content || editedMessageContent.trim() !== "")
    ) {
      setDiscussions(
        discussions.map((msg) => {
          if (msg.id === editingMessageId) {
            return {
              ...msg,
              content: content || editedMessageContent,
              isEdited: true,
            };
          }
          return msg;
        }),
      );
      setEditingMessageId(null);
      setEditedMessageContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessageContent("");
  };

  // 消息类型状态
  const [messageType, setMessageType] =
    useState<MessageType["messageType"]>("text");

  // 处理链接输入
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  // 发送链接
  const handleSendLink = () => {
    if (linkUrl.trim() !== "") {
      const newMessage: MessageType = {
        id: discussions.length + 1,
        sender: "我",
        avatarSrc: "/images/users/michael-gough.png",
        content: linkTitle || linkUrl,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "已发送",
        messageType: "link",
        isOwn: true,
        securityLevel: "非密",
      };
      setDiscussions([...discussions, newMessage]);
      setLinkUrl("");
      setLinkTitle("");
      setShowLinkInput(false);
      setMessageType("text");
    }
  };

  const handleCancelLink = () => {
    setLinkUrl("");
    setLinkTitle("");
    setShowLinkInput(false);
    setMessageType("text");
  };

  // 发送新消息的处理函数
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: MessageType = {
        id: discussions.length + 1,
        sender: "我",
        avatarSrc: "/images/users/michael-gough.png", // 当前用户头像
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "已发送",
        messageType: messageType,
        isOwn: true, // 标记为自己发送的消息
        reactions: [],
        ...(replyingTo && {
          replyTo: {
            sender: replyingTo.sender,
            message: replyingTo.content,
          },
        }),
        securityLevel: securityLevel, // 使用当前选择的密级
      };
      setDiscussions([...discussions, newMessage]);
      setMessage("");
      setReplyingTo(null); // 发送后清除回复状态
      setMessageType("text"); // 重置为文本消息类型

      // 更新会话列表中的最后一条消息
      const updatedList = discussionList.map((item) => {
        if (item.id === activeDiscussionId) {
          return {
            ...item,
            lastMessage:
              messageType === "text"
                ? message
                : `[${messageType === "image" ? "图片" : messageType === "file" ? "文件" : messageType === "voice" ? "语音" : messageType === "link" ? "链接" : "消息"}]`,
            time: "刚刚",
            securityLevel: securityLevel, // 更新密级
          };
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
    setRightPanelType("message");

    // 如果选择的是平台专业建设群(ID为8)，则加载专门的消息列表并显示进群通知
    if (id === 8) {
      setDiscussions(platformGroupMessagesData);

      // 设置并显示进群通知
      setGroupNoticeContent({
        title: "平台专业建设群 - 群规则",
        content:
          "欢迎加入平台专业建设群！\n\n1. 本群用于讨论平台建设相关专业技术问题\n2. 请勿发布与主题无关的内容\n3. 重要文档和知识将固定在群置顶区\n4. 技术讨论请尽量提供详细信息和上下文\n5. 群内分享的资料仅限群内成员使用",
        type: "rules",
        importance: "important",
      });
      setShowGroupNotice(true);
    } else if (id === 7) {
      // 工会群
      setDiscussions(messagesData);

      // 设置并显示进群通知
      setGroupNoticeContent({
        title: "工会群 - 欢迎",
        content:
          "欢迎加入工会群！\n\n本群用于分享工会活动信息和员工福利相关事项。\n\n近期活动：\n- 10月15日：秋季团建活动\n- 11月5日：员工生日会",
        type: "welcome",
        importance: "normal",
      });
      setShowGroupNotice(true);
    } else if (id === 6) {
      // 党支部群
      setDiscussions(messagesData);

      // 设置并显示进群通知
      setGroupNoticeContent({
        title: "党支部群 - 公告",
        content:
          "欢迎加入党支部群！\n\n本群用于党建工作交流和学习。\n\n请注意：\n- 每周三晚7点：线上学习\n- 每月第一个周五：组织生活会",
        type: "announcement",
        importance: "important",
      });
      setShowGroupNotice(true);
    } else {
      // 其他会话使用通用消息列表
      setDiscussions(messagesData);
    }
  };

  // 消息操作处理函数
  const handleForwardMessage = (id: number) => {
    console.log(`转发消息: ${id}`);
  };

  const handleCopyMessage = (id: number) => {
    console.log(`复制消息: ${id}`);
  };

  const handleReportMessage = (id: number) => {
    console.log(`举报消息: ${id}`);
  };

  const handleDeleteMessage = (id: number) => {
    console.log(`删除消息: ${id}`);
    // 实际应用中应该从列表中删除该消息
    setDiscussions(discussions.filter((msg) => msg.id !== id));
  };

  // 处理消息类型筛选
  const handleMessageFilterChange = (filter: string) => {
    setMessageFilter(filter);
  };

  // 处理标签页切换
  const handleTabChange = (tab: string) => {
    if (tab) {
      setActiveTab(tab);
      // 如果切换到消息坞标签页，则右侧显示消息内容
      if (tab === "messages") {
        setRightPanelType("message");
        setShowOrganizationMembers(false);
      }
    }
  };

  // 处理设置抽屉的打开和关闭
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  // 添加状态来管理消息密级
  const [securityLevel, setSecurityLevel] =
    useState<MessageSecurityLevel>("非密");

  /**
   * 处理组织项点击事件
   * @param instituteId 研究院ID
   * @param departmentId 研究所ID
   * @param name 组织名称
   */
  const handleOrganizationItemClick = (
    instituteId: number,
    departmentId: number | null,
    name: string,
  ) => {
    setSelectedOrganization({
      instituteId,
      departmentId,
      name,
    });
    setShowOrganizationMembers(true);
    setRightPanelType("contact");
    // 不需要切换到消息坞标签页，保持当前标签页
  };

  /**
   * 处理官方群组点击事件
   * @param groupId 群组ID
   * @param name 群组名称
   */
  const handleOfficialGroupClick = (groupId: number, name: string) => {
    setSelectedOfficialGroup({
      groupId,
      name,
    });
    setRightPanelType("officialGroup");
  };

  // 处理投票
  const handleVote = (messageId: number, optionId: number) => {
    setDiscussions(
      discussions.map((msg) => {
        if (msg.id === messageId && msg.voteData) {
          const updatedOptions = msg.voteData.options.map((opt) =>
            opt.id === optionId
              ? { ...opt, votes: opt.votes + 1, voted: true }
              : opt,
          );

          return {
            ...msg,
            voteData: {
              ...msg.voteData,
              options: updatedOptions,
              totalVotes: msg.voteData.totalVotes + 1,
              hasVoted: true,
            },
          };
        }
        return msg;
      }),
    );
  };

  // 处理任务状态变更
  const handleTaskStatusChange = (messageId: number, newStatus: string) => {
    setDiscussions(
      discussions.map((msg) => {
        if (msg.id === messageId && msg.taskData) {
          return {
            ...msg,
            taskData: {
              ...msg.taskData,
              status: newStatus as "pending" | "in-progress" | "completed",
            },
          };
        }
        return msg;
      }),
    );
  };

  // 处理任务点击
  const handleTaskClick = (messageId: number) => {
    console.log(`点击了任务 ID: ${messageId}`);
    // 这里可以添加查看任务详情的逻辑
  };

  // 处理任务接受
  const handleTaskAccept = (messageId: number) => {
    console.log(`接受处理任务 ID: ${messageId}`);
    setDiscussions(
      discussions.map((msg) => {
        if (msg.id === messageId && msg.taskData) {
          return {
            ...msg,
            taskData: {
              ...msg.taskData,
              status: "in-progress",
            },
          };
        }
        return msg;
      }),
    );
    // 可以在这里添加接受任务的其他逻辑
  };

  // 处理任务拒绝
  const handleTaskReject = (messageId: number) => {
    console.log(`拒绝任务 ID: ${messageId}`);
    // 可以在这里添加拒绝任务的逻辑
  };

  // 处理接龙参与
  const handleRelayParticipate = (relayId: number) => {
    console.log(`参与接龙 ID: ${relayId}`);
    // 打开模态框让用户输入接龙内容
    setCurrentRelayId(relayId);
    setRelayParticipateContent("");

    // 获取当前接龙的标题
    const relay = discussions.find(
      (msg) => msg.id === relayId && msg.relayData,
    );
    if (relay && relay.relayData) {
      setRelayTitle(relay.relayData.title);
    } else {
      setRelayTitle("");
    }

    setShowRelayParticipateModal(true);
  };

  // 提交接龙参与内容
  const handleSubmitRelayParticipate = () => {
    if (!relayParticipateContent.trim() || !currentRelayId) return;

    // 找到对应的接龙消息
    const updatedDiscussions = discussions.map((msg) => {
      if (msg.id === currentRelayId && msg.relayData) {
        // 创建新的参与者
        const newParticipant = {
          id: msg.relayData.participants.length + 1,
          name: "我", // 当前用户名
          avatar: "/images/users/jese-leos.png", // 当前用户头像，使用本地图片
          content: relayParticipateContent,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // 更新接龙数据
        return {
          ...msg,
          relayData: {
            ...msg.relayData,
            participants: [...msg.relayData.participants, newParticipant],
            totalParticipants: msg.relayData.totalParticipants + 1,
          },
        };
      }
      return msg;
    });

    // 更新消息列表
    setDiscussions(updatedDiscussions);

    // 关闭模态框并清空内容
    setShowRelayParticipateModal(false);
    setRelayParticipateContent("");
    setCurrentRelayId(null);
  };

  // 取消接龙参与
  const handleCancelRelayParticipate = () => {
    setShowRelayParticipateModal(false);
    setRelayParticipateContent("");
    setCurrentRelayId(null);
  };

  // 处理接龙点击
  const handleRelayClick = (relayId: number) => {
    console.log(`点击了接龙 ID: ${relayId}`);
    // 这里可以添加查看接龙详情的逻辑
  };

  // 处理话题置顶/取消置顶
  const handleTogglePinTopic = () => {
    if (pinnedTopic) {
      setPinnedTopic({
        ...pinnedTopic,
        isPinned: !pinnedTopic.isPinned,
      });
    }
  };

  // 处理创建新话题
  const handleCreateTopic = () => {
    if (topicTitle.trim() && topicContent.trim()) {
      setPinnedTopic({
        title: topicTitle,
        content: topicContent,
        creator: "我", // 当前用户
        createdAt: new Date().toLocaleDateString(),
        isPinned: true,
        messageId: 0, // 新创建的话题没有关联消息
      });
      setShowTopicForm(false);
      setTopicTitle("");
      setTopicContent("");
    }
  };

  // 处理取消创建话题
  const handleCancelCreateTopic = () => {
    setShowTopicForm(false);
    setTopicTitle("");
    setTopicContent("");
  };

  /**
   * 从消息创建话题
   * @param {number} id 消息ID
   */
  const handleCreateTopicFromMessage = (id: number) => {
    const messageToCreateTopic = discussions.find((msg) => msg.id === id);
    if (messageToCreateTopic) {
      setTopicTitle(`来自 ${messageToCreateTopic.sender} 的话题`);
      setTopicContent(messageToCreateTopic.content);
      setShowTopicForm(true);

      // 滚动到顶部，显示话题创建表单
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0;
      }
    }
  };

  /**
   * 处理置顶消息
   * @param {number} id 消息ID
   */
  const handlePinMessage = (id: number) => {
    const messageToPinned = discussions.find((msg) => msg.id === id);
    if (messageToPinned) {
      setPinnedTopic({
        title:
          messageToPinned.messageType === "text"
            ? "置顶消息"
            : `置顶${messageToPinned.messageType === "image" ? "图片" : messageToPinned.messageType === "file" ? "文件" : messageToPinned.messageType === "voice" ? "语音" : "消息"}`,
        content: messageToPinned.content,
        creator: messageToPinned.sender,
        createdAt: messageToPinned.time,
        isPinned: true,
        messageId: messageToPinned.id,
      });

      // 滚动到顶部，显示置顶消息
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0;
      }
    }
  };

  /**
   * 滚动到原始消息位置
   * @param {number} messageId 消息ID
   */
  const scrollToOriginalMessage = (messageId: number) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth" as ScrollBehavior });
      // 给消息添加一个闪烁高亮效果
      messageElement.classList.add("highlight-message");
      setTimeout(() => {
        messageElement.classList.remove("highlight-message");
      }, 2000);
    }
  };

  // 处理关闭群通知弹窗
  const handleCloseGroupNotice = () => {
    setShowGroupNotice(false);

    // 添加当前用户到已确认列表
    if (groupNoticeContent) {
      setConfirmedUsers((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: "当前用户",
          avatar: "/images/users/jese-leos.png", // 使用本地头像图片
          time: new Date().toLocaleString(),
        },
      ]);
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex h-full flex-col">
        <div className="flex h-full overflow-hidden">
          <div className="flex h-full w-64 flex-none flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <ul
                className="-mb-px grid grid-cols-2 text-center text-xs font-medium"
                role="tablist"
              >
                <li role="presentation">
                  <button
                    className={`flex w-full items-center justify-center rounded-t-lg border-b px-3 py-3 cursor-pointer ${
                      activeTab === "messages"
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white"
                    }`}
                    onClick={() => handleTabChange("messages")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "messages"}
                  >
                    <BiSolidMessageSquareDots className="mr-1.5 size-5" />
                    消息坞
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`flex w-full items-center justify-center rounded-t-lg border-b px-3 py-3 cursor-pointer ${
                      activeTab === "contacts"
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white"
                    }`}
                    onClick={() => handleTabChange("contacts")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "contacts"}
                  >
                    <RiContactsBookFill className="mr-1.5 size-5" />
                    通讯录
                  </button>
                </li>
              </ul>
            </div>
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-transparent [scrollbar-width:thin] [&.scrolling]:opacity-100 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300/0 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
            >
              {/* 消息坞标签页内容 */}
              {activeTab === "messages" && (
                <div>
                  {/* 最新消息分类 - 固定在顶部 */}
                  <div className="sticky top-0 z-10 bg-white px-2 py-2 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col w-full space-y-1">
                        <button
                          className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md cursor-pointer ${
                            messageFilter === "all"
                              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleMessageFilterChange("all")}
                          title="全部消息"
                        >
                          <RiListCheck2 className="h-5 w-5" />
                          <span>全部消息</span>
                        </button>
                        <button
                          className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md cursor-pointer ${
                            messageFilter === "unread"
                              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleMessageFilterChange("unread")}
                          title="未读消息"
                        >
                          <PiNotificationFill className="h-5 w-5" />
                          <span>未读消息</span>
                        </button>
                        <button
                          className={`flex items-center gap-2 px-4 h-8 text-sm font-medium w-full transition-colors duration-200 rounded-md cursor-pointer ${
                            messageFilter === "group"
                              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleMessageFilterChange("group")}
                          title="群组消息"
                        >
                          <RiGroup2Line className="h-5 w-5" />
                          <span>群组消息</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 w-full dark:border-gray-700"></div>

                  {/* 消息列表 */}
                  <ul>
                    {discussionList
                      .filter((item) => {
                        if (messageFilter === "all") return true;
                        if (messageFilter === "unread") return item.unread > 0;
                        if (messageFilter === "group")
                          return item.isGroup === true;
                        return true;
                      })
                      .map((item) => (
                        <button
                          key={item.id}
                          className={`flex w-full items-center justify-between border-b border-gray-200/70 px-0 py-2 text-left transition-all duration-200 hover:cursor-pointer hover:bg-blue-50 dark:border-gray-700/70 dark:hover:bg-blue-900/30 ${
                            activeDiscussionId === item.id
                              ? "bg-blue-100 shadow-sm dark:bg-blue-900/40"
                              : "bg-white dark:bg-transparent"
                          } relative overflow-hidden`}
                          onClick={() => handleSelectDiscussion(item.id)}
                          aria-pressed={activeDiscussionId === item.id}
                        >
                          {item.securityLevel && (
                            <div
                              className={`absolute left-0 top-0 h-full w-1 ${
                                item.securityLevel === ("机密" as any)
                                  ? "bg-orange-500 dark:bg-orange-600"
                                  : item.securityLevel === ("秘密" as any)
                                    ? "bg-yellow-500 dark:bg-yellow-600"
                                    : "bg-green-500 dark:bg-green-600"
                              }`}
                            ></div>
                          )}
                          <div className="flex items-center w-full px-4">
                            <div className="relative shrink-0">
                              <img
                                className={`size-7 rounded-full object-cover shadow-sm ring-1 ${
                                  item.isGroup
                                    ? "ring-2 ring-yellow-400 dark:ring-yellow-500"
                                    : "ring-gray-200/50 dark:ring-gray-700/50"
                                }`}
                                src={item.avatar}
                                alt={`${item.name} 的头像`}
                              />
                              {item.status === "online" && (
                                <span className="absolute bottom-0 right-0 size-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
                              )}
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </h3>
                                  {item.isGroup && (
                                    <HiBadgeCheck className="ml-1 flex-shrink-0 text-orange-400" />
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.time}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  {item.lastMessage}
                                </p>
                                {item.unread > 0 && (
                                  <span className="ml-1.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                    {item.unread}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                  </ul>
                </div>
              )}

              {/* 通讯录标签页内容 */}
              {activeTab === "contacts" && (
                <ContactsTab
                  onOrganizationItemClick={handleOrganizationItemClick}
                  onOfficialGroupClick={handleOfficialGroupClick}
                />
              )}
            </div>
          </div>

          <div className="flex h-full flex-1 flex-col overflow-hidden">
            {/* 官方群组内容 - 不需要标题栏 */}
            {rightPanelType === "officialGroup" && selectedOfficialGroup ? (
              <OfficialGroupDetails
                selectedOfficialGroup={selectedOfficialGroup}
                onBackClick={() => {
                  setRightPanelType("message");
                  setSelectedOfficialGroup(null);
                }}
              />
            ) : (
              <>
                {/* 聊天头部 */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center">
                    <div className="mr-3 flex size-10 shrink-0 items-center justify-center">
                      <div className="relative">
                        <img
                          className={`size-10 rounded-full object-cover shadow-sm ring-1 ${
                            discussionList.find(
                              (item) => item.id === activeDiscussionId,
                            )?.isGroup
                              ? "ring-2 ring-yellow-400 dark:ring-yellow-500"
                              : "ring-gray-200/50 dark:ring-gray-700/50"
                          }`}
                          src={
                            discussionList.find(
                              (item) => item.id === activeDiscussionId,
                            )?.avatar || "/images/users/bonnie-green.png"
                          }
                          alt="用户头像"
                        />
                        {discussionList.find(
                          (item) => item.id === activeDiscussionId,
                        )?.isGroup && (
                          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-yellow-400 text-white ring-1 ring-white dark:ring-gray-800">
                            <svg
                              className="size-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-base font-medium text-gray-900 dark:text-white">
                          {rightPanelType === "contact" && selectedOrganization
                            ? selectedOrganization.name
                            : discussionList.find(
                                (item) => item.id === activeDiscussionId,
                              )?.name || "未知用户"}
                        </h2>
                        {rightPanelType === "message" &&
                          discussionList.find(
                            (item) => item.id === activeDiscussionId,
                          )?.isGroup && (
                            <HiBadgeCheck className="ml-1 text-orange-400 size-5" />
                          )}
                        {rightPanelType === "message" && (
                          <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {discussionList.find(
                              (item) => item.id === activeDiscussionId,
                            )?.securityLevel || "非密"}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {rightPanelType === "contact" &&
                        selectedOrganization ? (
                          <span>组织架构</span>
                        ) : (
                          <>
                            <span>
                              {discussionList.find(
                                (item) => item.id === activeDiscussionId,
                              )?.members || 0}{" "}
                              成员
                            </span>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {discussionList.find(
                                (item) => item.id === activeDiscussionId,
                              )?.tag || "团队"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 返回按钮 - 仅在组织架构模式下显示 */}
                    {rightPanelType === "contact" && (
                      <button
                        className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer"
                        title="返回"
                        onClick={() => {
                          setRightPanelType("message");
                          setShowOrganizationMembers(false);
                        }}
                      >
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>
                    )}

                    {/* 查找按钮 */}
                    <button
                      className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer"
                      title="查找"
                    >
                      <HiSearch className="size-5" />
                    </button>
                    {/* 添加成员按钮 */}
                    <button
                      className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer"
                      title="添加成员"
                    >
                      <HiUserAdd className="size-5" />
                    </button>
                    {/* 设置按钮 */}
                    <button
                      className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer"
                      title="设置"
                      onClick={handleOpenSettings}
                    >
                      <HiCog className="size-5" />
                    </button>
                  </div>
                </div>

                {/* 设置抽屉 - 放在聊天头部之后 */}
                {isSettingsOpen && (
                  <SettingsDrawer
                    isOpen={isSettingsOpen}
                    onClose={handleCloseSettings}
                  />
                )}

                {/* 聊天消息区域 */}
                <div
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="relative flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-transparent px-4 [scrollbar-width:thin] [&.scrolling]:opacity-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/0 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
                >
                  {/* 组织成员列表 */}
                  {rightPanelType === "contact" && selectedOrganization ? (
                    <OrganizationMembersList
                      selectedOrganization={selectedOrganization}
                    />
                  ) : (
                    <div className="min-h-full rounded-lg p-4">
                      {/* 话题置顶 */}
                      {pinnedTopic && pinnedTopic.isPinned && (
                        <div className="sticky top-0 z-10 mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <PiPushPinFill className="mr-2 size-5 text-blue-500 dark:text-blue-400" />
                              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                                {pinnedTopic.title}
                              </h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={handleTogglePinTopic}
                                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                title={
                                  pinnedTopic.isPinned ? "取消置顶" : "置顶话题"
                                }
                              >
                                <PiPushPinFill className="size-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pinnedTopic.content}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              由 {pinnedTopic.creator} 创建于{" "}
                              {pinnedTopic.createdAt}
                            </span>
                            {pinnedTopic.messageId && (
                              <button
                                onClick={() =>
                                  scrollToOriginalMessage(
                                    pinnedTopic.messageId!,
                                  )
                                }
                                className="ml-2 text-blue-500 hover:underline dark:text-blue-400"
                              >
                                查看原始消息
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 创建话题表单 */}
                      {showTopicForm && (
                        <TopicForm
                          title={topicTitle}
                          content={topicContent}
                          onTitleChange={setTopicTitle}
                          onContentChange={setTopicContent}
                          onCreateTopic={handleCreateTopic}
                          onCancel={handleCancelCreateTopic}
                        />
                      )}

                      {/* 没有置顶话题时显示创建按钮 */}
                      {(!pinnedTopic || !pinnedTopic.isPinned) &&
                        !showTopicForm && (
                          <div className="mb-4 flex justify-center">
                            <button
                              onClick={() => setShowTopicForm(true)}
                              className="flex items-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <PiPlusCircleFill className="mr-1.5 size-5 text-gray-500 dark:text-gray-400" />
                              创建会话话题
                            </button>
                          </div>
                        )}

                      {/* 消息列表 - 支持丰富的消息类型 */}
                      {discussions.map((msg) =>
                        msg.messageType === "file" ? (
                          <ChatFileMessage
                            key={msg.id}
                            avatarSrc={msg.avatarSrc}
                            senderName={msg.sender}
                            time={msg.time}
                            fileName={msg.content}
                            fileSize="18 MB"
                            fileType="PDF"
                            pageCount={12}
                            status={msg.status}
                            onReply={() => handleReplyMessage(msg.id)}
                            onForward={() => handleForwardMessage(msg.id)}
                            onCopy={() => handleCopyMessage(msg.id)}
                            onReport={() => handleReportMessage(msg.id)}
                            onDelete={() => handleDeleteMessage(msg.id)}
                            onDownload={() => {
                              // 处理文件下载
                              console.log(`下载文件: ${msg.content}`);
                            }}
                          />
                        ) : msg.messageType === "voice" ? (
                          <ChatVoiceMessage
                            key={msg.id}
                            avatarSrc={msg.avatarSrc}
                            senderName={msg.sender}
                            time={msg.time}
                            duration="3:42"
                            status={msg.status}
                            isOwn={msg.isOwn}
                            onReply={() => handleReplyMessage(msg.id)}
                            onForward={() => handleForwardMessage(msg.id)}
                            onCopy={() => handleCopyMessage(msg.id)}
                            onReport={() => handleReportMessage(msg.id)}
                            onDelete={() => handleDeleteMessage(msg.id)}
                            onPlay={() => {
                              // 处理语音播放
                              console.log(`播放语音: ${msg.content}`);
                            }}
                          />
                        ) : msg.messageType === "vote" && msg.voteData ? (
                          <div key={msg.id} className="mb-4">
                            <div className="flex items-start">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                    {msg.sender}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {msg.time}
                                  </span>
                                </div>
                                <ChatVoteCard
                                  title={msg.voteData.title}
                                  description={msg.voteData.description}
                                  options={msg.voteData.options}
                                  totalVotes={msg.voteData.totalVotes}
                                  deadline={msg.voteData.deadline}
                                  creatorName={msg.sender}
                                  creatorAvatar={msg.avatarSrc}
                                  hasVoted={msg.voteData.hasVoted}
                                  onVote={(optionId) =>
                                    handleVote(msg.id, optionId)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : msg.messageType === "task" && msg.taskData ? (
                          <div key={msg.id} className="mb-4">
                            <div className="flex items-start">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                    {msg.sender}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {msg.time}
                                  </span>
                                </div>
                                <ChatTaskCard
                                  id={msg.id}
                                  title={msg.taskData.title}
                                  description={msg.taskData.description}
                                  dueDate={msg.taskData.dueDate}
                                  createdAt={msg.time}
                                  creatorName={msg.sender}
                                  creatorAvatar={msg.avatarSrc}
                                  priority={msg.taskData.priority}
                                  status={msg.taskData.status}
                                  progress={msg.taskData.progress}
                                  assignees={msg.taskData.assignees}
                                  tags={msg.taskData.tags}
                                  onStatusChange={(taskId, newStatus) =>
                                    handleTaskStatusChange(taskId, newStatus)
                                  }
                                  onTaskClick={(taskId) =>
                                    handleTaskClick(taskId)
                                  }
                                  onAccept={(taskId) =>
                                    handleTaskAccept(taskId)
                                  }
                                  onReject={(taskId) =>
                                    handleTaskReject(taskId)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : msg.messageType === "relay" && msg.relayData ? (
                          <div key={msg.id} className="mb-4">
                            <div className="flex items-start">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                    {msg.sender}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {msg.time}
                                  </span>
                                </div>
                                <ChatRelayCard
                                  id={msg.id}
                                  title={msg.relayData.title}
                                  description={msg.relayData.description}
                                  deadline={msg.relayData.deadline}
                                  createdAt={msg.time}
                                  creatorName={msg.sender}
                                  creatorAvatar={msg.avatarSrc}
                                  participants={msg.relayData.participants}
                                  totalParticipants={
                                    msg.relayData.totalParticipants
                                  }
                                  maxParticipants={
                                    msg.relayData.maxParticipants
                                  }
                                  status={msg.relayData.status}
                                  tags={msg.relayData.tags}
                                  onParticipate={(relayId) =>
                                    handleRelayParticipate(relayId)
                                  }
                                  onRelayClick={(relayId) =>
                                    handleRelayClick(relayId)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : msg.messageType === "knowledge" &&
                          msg.knowledgeData ? (
                          <div key={msg.id} className="mb-4">
                            <div className="flex items-start">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                    {msg.sender}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {msg.time}
                                  </span>
                                </div>
                                <ChatKnowledgeCard
                                  title={msg.knowledgeData.title}
                                  content={msg.knowledgeData.content}
                                  category={msg.knowledgeData.category}
                                  tags={msg.knowledgeData.tags}
                                  author={msg.knowledgeData.author}
                                  authorAvatar={msg.knowledgeData.authorAvatar}
                                  createdAt={msg.knowledgeData.createdAt}
                                  lastUpdated={msg.knowledgeData.lastUpdated}
                                  viewCount={msg.knowledgeData.viewCount}
                                  attachments={msg.knowledgeData.attachments}
                                  relatedTopics={
                                    msg.knowledgeData.relatedTopics
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : msg.messageType === "document" &&
                          msg.documentData ? (
                          <div key={msg.id} className="mb-4">
                            <div className="flex items-start">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                    {msg.sender}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {msg.time}
                                  </span>
                                </div>
                                <ChatDocumentCard
                                  title={msg.documentData.title}
                                  fileType={msg.documentData.fileType}
                                  fileSize={msg.documentData.fileSize}
                                  pageCount={msg.documentData.pageCount}
                                  lastEditor={msg.documentData.lastEditor}
                                  lastEditorAvatar={
                                    msg.documentData.lastEditorAvatar
                                  }
                                  lastEditTime={msg.documentData.lastEditTime}
                                  collaborators={msg.documentData.collaborators}
                                  status={msg.documentData.status}
                                  version={msg.documentData.version}
                                  commentCount={msg.documentData.commentCount}
                                />
                              </div>
                            </div>
                          </div>
                        ) : msg.messageType === "notice" && msg.noticeData ? (
                          <div key={msg.id} className="mb-4">
                            <div className="flex items-start">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                                    {msg.sender}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {msg.time}
                                  </span>
                                </div>
                                <ChatNoticeCard
                                  title={msg.noticeData.title}
                                  content={msg.noticeData.content}
                                  type={msg.noticeData.type}
                                  importance={msg.noticeData.importance}
                                  expireDate={msg.noticeData.expireDate}
                                  attachments={msg.noticeData.attachments}
                                  requireConfirmation={
                                    msg.noticeData.requireConfirmation
                                  }
                                  confirmedBy={msg.noticeData.confirmedBy}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <ChatMessage
                            key={msg.id}
                            id={`message-${msg.id}`}
                            avatarSrc={msg.avatarSrc}
                            senderName={msg.sender}
                            time={msg.time}
                            message={msg.content}
                            status={msg.status}
                            messageType={msg.messageType}
                            isOwn={msg.isOwn}
                            replyTo={msg.replyTo}
                            reactions={msg.reactions}
                            isEdited={msg.isEdited}
                            securityLevel={msg.securityLevel}
                            onReply={() => handleReplyMessage(msg.id)}
                            onForward={() => handleForwardMessage(msg.id)}
                            onCopy={() => handleCopyMessage(msg.id)}
                            onReport={() => handleReportMessage(msg.id)}
                            onDelete={() => handleDeleteMessage(msg.id)}
                            onAddReaction={(reaction) =>
                              handleAddReaction(msg.id, reaction)
                            }
                            onEdit={() => handleEditMessage(msg.id)}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                            onPin={() => handlePinMessage(msg.id)}
                            onCreateTopic={() =>
                              handleCreateTopicFromMessage(msg.id)
                            }
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 消息输入区域 - 仅在消息模式下显示 */}
            {rightPanelType === "message" && (
              <div className="mt-auto">
                {/* 回复预览 */}
                {replyingTo && (
                  <div className="mx-4 mb-2 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          回复 {replyingTo.sender}
                        </div>
                        <div className="line-clamp-1 text-sm text-gray-700 dark:text-gray-300">
                          {replyingTo.content}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCancelReply}
                      className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* 消息输入框 */}
                <div className="px-4">
                  <MessageInput
                    message={message}
                    onMessageChange={handleMessageChange}
                    onSendMessage={() => handleSendMessage()}
                    securityLevel={securityLevel}
                    onSecurityLevelChange={setSecurityLevel}
                  />
                </div>

                {/* 链接输入 */}
                {showLinkInput && (
                  <div className="mx-4 mb-4 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      添加链接
                    </div>
                    <div className="flex flex-col space-y-3">
                      <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="输入链接URL"
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="输入链接标题（可选）"
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={handleCancelLink}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={handleSendLink}
                          className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          disabled={!linkUrl.trim()}
                        >
                          添加链接
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 接龙参与模态框 */}
      <Modal
        show={showRelayParticipateModal}
        onClose={handleCancelRelayParticipate}
        size="md"
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            参与接龙：{relayTitle}
          </span>
        </Modal.Header>
        <Modal.Body className="p-6">
          <div className="space-y-4">
            <div className="mb-4 p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                请输入您的接龙内容，内容将展示在接龙卡片中。
              </p>
            </div>
            <div>
              <Label
                htmlFor="relay-content"
                className="mb-2 flex justify-between"
              >
                <span>接龙内容</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {relayParticipateContent.length}/200字
                </span>
              </Label>
              <Textarea
                id="relay-content"
                rows={4}
                placeholder="请输入您的接龙内容..."
                required
                value={relayParticipateContent}
                onChange={(e) => {
                  // 限制最多200字
                  if (e.target.value.length <= 200) {
                    setRelayParticipateContent(e.target.value);
                  }
                }}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex w-full items-center justify-end space-x-3">
            <Button color="light" onClick={handleCancelRelayParticipate}>
              取消
            </Button>
            <Button
              color="purple"
              onClick={handleSubmitRelayParticipate}
              disabled={!relayParticipateContent.trim()}
            >
              提交接龙
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* 进群通知弹窗 */}
      <Modal
        show={showGroupNotice}
        onClose={handleCloseGroupNotice}
        size="md"
        className="z-50"
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <div className="flex items-center">
            {groupNoticeContent?.type === "rules" && (
              <span className="mr-2 rounded-lg bg-red-100 p-1 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <HiOutlineExclamation className="h-5 w-5" />
              </span>
            )}
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {groupNoticeContent?.title}
            </h3>
          </div>
        </Modal.Header>
        <Modal.Body className="!p-6">
          <div className="whitespace-pre-line text-base text-gray-500 dark:text-gray-400">
            {groupNoticeContent?.content}
          </div>

          {confirmedUsers.length > 0 && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                已有 {confirmedUsers.length} 人确认
              </div>
              <div className="flex -space-x-2">
                {confirmedUsers.slice(0, 5).map((user) => (
                  <img
                    key={user.id}
                    src={user.avatar}
                    alt={user.name}
                    title={`${user.name} (${user.time})`}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                  />
                ))}
                {confirmedUsers.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs text-gray-600 font-medium border-2 border-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-800">
                    +{confirmedUsers.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end border-t border-gray-200 !p-6 dark:border-gray-700">
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-150"
            onClick={handleCloseGroupNotice}
          >
            <HiCheck className="mr-1 h-4 w-4" />
            我已阅读
          </Button>
        </Modal.Footer>
      </Modal>
    </NavbarSidebarLayout>
  );
};

export default DiscussionPage;
