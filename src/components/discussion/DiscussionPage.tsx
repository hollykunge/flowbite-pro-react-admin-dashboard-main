import type { ChangeEvent, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { HiBadgeCheck, HiCog, HiSearch, HiUserAdd } from "react-icons/hi";
import { PiNotificationFill } from "react-icons/pi";
import {
  RiContactsBookFill,
  RiGovernmentFill,
  RiGroup2Line,
  RiListCheck2,
} from "react-icons/ri";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import ChatFileMessage from "../ChatFileMessage";
import ChatMessage from "../ChatMessage";
import ChatRelayCard from "../ChatRelayCard";
import ChatTaskCard from "../ChatTaskCard";
import ChatVoiceMessage from "../ChatVoiceMessage";
import ChatVoteCard from "../ChatVoteCard";
import type { MessageSecurityLevel } from "../MessageInput";
import MessageInput from "../MessageInput";
import SettingsDrawer from "../SettingsDrawer";
import ContactsTab from "./ContactsTab";
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

  // 模拟的研讨会话列表数据 - 更新为新的格式
  const [discussionList, setDiscussionList] = useState([
    {
      id: 1,
      name: "张小明",
      avatar: "/images/users/roberta-casas.png",
      lastMessage: "正在输入...",
      time: "18:05",
      unread: 0,
      status: "online",
      isTyping: true,
      category: "recent",
      members: 5,
      tag: "团队",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 2,
      name: "李华",
      avatar: "/images/users/leslie-livingston.png",
      lastMessage: "好的，我们可以做到！",
      time: "14:23",
      unread: 0,
      status: "online",
      category: "recent",
      members: 2,
      tag: "私聊",
      securityLevel: "秘密" as MessageSecurityLevel,
    },
    {
      id: 3,
      name: "王强",
      avatar: "/images/users/neil-sims.png",
      lastMessage: "语音消息",
      time: "10:02",
      unread: 4,
      status: "offline",
      isVoiceMessage: true,
      category: "recent",
      members: 3,
      tag: "项目",
      securityLevel: "机密" as MessageSecurityLevel,
    },
    {
      id: 4,
      name: "赵敏",
      avatar: "/images/users/michael-gough.png",
      lastMessage: "没关系，我会从车站取回物品并带回办公室。",
      time: "07:45",
      unread: 0,
      status: "online",
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 5,
      name: "陈静",
      avatar: "/images/users/bonnie-green.png",
      lastMessage: "发送了一张照片",
      time: "15h",
      unread: 0,
      status: "offline",
      isPhoto: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "秘密" as MessageSecurityLevel,
    },
    {
      id: 6,
      name: "XXX研究室",
      avatar: "/images/users/zuzhi.png",
      lastMessage: "🎉 太棒了，我们走吧！",
      time: "16h",
      unread: 0,
      status: "online",
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 7,
      name: "XXX研究室党支部",
      avatar: "/images/users/dangzhibu.png",
      lastMessage: "是的，我们可以做到！",
      time: "18h",
      unread: 0,
      status: "offline",
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "机密" as MessageSecurityLevel,
    },
    {
      id: 9,
      name: "XXX研究室工会",
      avatar: "/images/users/gonghui.png",
      lastMessage: "语音消息",
      time: "2d",
      unread: 0,
      status: "offline",
      isVoiceMessage: true,
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "秘密" as MessageSecurityLevel,
    },
    {
      id: 10,
      name: "吴鑫",
      avatar: "/images/users/robert-brown.png",
      lastMessage: "好久不见，最近怎么样兄弟？",
      time: "1w",
      unread: 0,
      status: "offline",
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "非密" as MessageSecurityLevel,
    },
    {
      id: 11,
      name: "项目管理群",
      avatar: "/images/users/joseph-mcfall.png",
      lastMessage: "我们下个月再做吧",
      time: "04.03.2025",
      unread: 0,
      status: "online",
      isGroup: true,
      category: "recent",
      members: 0,
      tag: "",
      securityLevel: "机密" as MessageSecurityLevel,
    },
  ]);

  // 模拟的研讨消息数据 - 更新为适配ChatMessage组件的格式并丰富消息类型
  const [discussions, setDiscussions] = useState<MessageType[]>([
    {
      id: 1,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "大家好，我们今天讨论一下项目进度",
      time: "10:30",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 2,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "好的，我这边的模块已经完成了80%",
      time: "10:32",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 3,
      sender: "王五",
      avatarSrc: "/images/users/thomas-lean.png",
      content: "我负责的部分遇到了一些问题，需要大家帮忙",
      time: "10:35",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 4,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "我可以帮忙解决，请详细说明一下问题",
      time: "10:36",
      status: "已读",
      messageType: "text",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 5,
      sender: "王五",
      avatarSrc: "/images/users/thomas-lean.png",
      content: "主要是API集成部分出现了兼容性问题",
      time: "10:38",
      status: "已读",
      messageType: "text",
      securityLevel: "非密",
    },
    {
      id: 6,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "项目进度评估投票",
      time: "10:39",
      status: "已读",
      messageType: "vote",
      securityLevel: "非密",
      voteData: {
        title: "使用哪个设计方案？",
        description: "请团队成员投票选择产品原型最终采用的设计方案",
        options: [
          { id: 1, text: "方案一：XXX设计方案", votes: 4 },
          { id: 2, text: "方案二：XXX设计方案", votes: 6 },
          { id: 3, text: "方案三：XXX设计方案", votes: 3 },
          { id: 4, text: "方案四：XXX设计方案", votes: 2 },
        ],
        totalVotes: 15,
        deadline: "2023-05-30 18:00",
        hasVoted: false,
      },
    },
    {
      id: 7,
      sender: "王五",
      avatarSrc: "/images/users/thomas-lean.png",
      content: "../images/kanban/task-1.jpg",
      time: "10:40",
      status: "已读",
      messageType: "image",
      securityLevel: "非密",
    },
    {
      id: 8,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "我看到问题了，这是版本不匹配导致的",
      time: "10:41",
      status: "已读",
      messageType: "text",
      isOwn: true,
      replyTo: {
        sender: "王五",
        message: "主要是API集成部分出现了兼容性问题",
      },
      securityLevel: "非密",
    },
    {
      id: 9,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "API集成兼容性修复任务",
      time: "10:42",
      status: "已读",
      messageType: "task",
      securityLevel: "非密",
      taskData: {
        title: "XXX分系统概要设计",
        description:
          "解决当前版本与旧系统协议的兼容性问题，确保数据正确传输和处理",
        dueDate: "2023-05-25",
        priority: "high",
        status: "in-progress",
        progress: 30,
        assignees: [
          { id: 1, name: "张三", avatar: "/images/users/bonnie-green.png" },
          { id: 2, name: "李四", avatar: "/images/users/jese-leos.png" },
          { id: 3, name: "王五", avatar: "/images/users/thomas-lean.png" },
          { id: 4, name: "赵六", avatar: "/images/users/neil-sims.png" },
          { id: 5, name: "钱七", avatar: "/images/users/robert-brown.png" },
        ],
        tags: ["API", "优先级高", "兼容性", "后端"],
      },
    },
    {
      id: 10,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "项目文档.pdf",
      time: "10:45",
      status: "已读",
      messageType: "file",
      securityLevel: "非密",
    },
    {
      id: 11,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "语音说明 (0:30)",
      time: "10:47",
      status: "已读",
      messageType: "voice",
      securityLevel: "非密",
    },
    {
      id: 12,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "我已经修复了API问题，大家可以更新代码测试一下",
      time: "10:50",
      status: "已读",
      messageType: "text",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 13,
      sender: "李四",
      avatarSrc: "/images/users/jese-leos.png",
      content: "太好了，我马上测试",
      time: "10:52",
      status: "已读",
      messageType: "text",
      replyTo: {
        sender: "我",
        message: "我已经修复了API问题，大家可以更新代码测试一下",
      },
      securityLevel: "非密",
    },
    {
      id: 14,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "这是我们的项目时间线，请大家查看一下",
      time: "10:56",
      status: "已读",
      messageType: "text",
      replyTo: {
        sender: "张三",
        message: "../images/users/neil-sims.png",
      },
      securityLevel: "非密",
    },
    {
      id: 15,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "语音消息 (3:42)",
      time: "11:00",
      status: "已读",
      messageType: "voice",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 16,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "Flowbite Terms & Conditions.pdf",
      time: "11:05",
      status: "已读",
      messageType: "file",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 17,
      sender: "我",
      avatarSrc: "/images/users/michael-gough.png",
      content: "../images/kanban/task-2.jpg",
      time: "11:10",
      status: "已读",
      messageType: "image",
      isOwn: true,
      securityLevel: "非密",
    },
    {
      id: 18,
      sender: "张三",
      avatarSrc: "/images/users/bonnie-green.png",
      content: "五一假期出行计划接龙",
      time: "11:15",
      status: "已读",
      messageType: "relay",
      securityLevel: "非密",
      relayData: {
        title: "五一假期出行计划接龙",
        description: "请大家填写各自的五一假期出行计划，便于统筹安排",
        deadline: "2023-04-25 18:00",
        participants: [
          {
            id: 1,
            name: "张三",
            avatar: "/images/users/bonnie-green.png",
            content: "计划去杭州西湖，4月30日至5月2日",
            time: "11:15",
          },
          {
            id: 2,
            name: "李四",
            avatar: "/images/users/jese-leos.png",
            content: "计划去上海，5月1日至5月3日",
            time: "11:20",
          },
          {
            id: 3,
            name: "王五",
            avatar: "/images/users/thomas-lean.png",
            content: "计划去北京，4月29日至5月4日",
            time: "11:25",
          },
        ],
        totalParticipants: 3,
        maxParticipants: 10,
        status: "ongoing",
        tags: ["假期", "出行", "接龙"],
      },
    },
  ]);

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
    // 在实际应用中，这里应该根据id加载对应的消息记录
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
    // 在实际应用中，这里可以打开一个模态框让用户输入接龙内容
  };

  // 处理接龙点击
  const handleRelayClick = (relayId: number) => {
    console.log(`点击了接龙 ID: ${relayId}`);
    // 这里可以添加查看接龙详情的逻辑
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
              <div className="flex h-full flex-col overflow-hidden">
                <div className="relative flex-1 overflow-y-auto overflow-x-hidden bg-transparent px-4 [scrollbar-width:thin] [&.scrolling]:opacity-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/0 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                  <div className="min-h-full rounded-lg p-4">
                    <div className="mb-6">
                      <div className="flex justify-end mb-2">
                        <button
                          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer"
                          title="返回"
                          onClick={() => {
                            setRightPanelType("message");
                            setSelectedOfficialGroup(null);
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mb-4 flex items-center justify-center">
                        <div className="flex size-24 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
                          <RiGovernmentFill className="size-12" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-center text-xl font-medium text-gray-900 dark:text-white">
                        {selectedOfficialGroup.name}
                      </h3>
                      <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {selectedOfficialGroup.groupId * 20} 名成员
                      </p>
                      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
                        <h4 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                          群组介绍
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          这是{selectedOfficialGroup.name}
                          的官方群组，由系统管理员创建和维护。群组成员可以在此交流工作相关事宜，分享资源和信息。
                          <br />
                          <br />
                          群组创建于2023年{selectedOfficialGroup.groupId}
                          月，目前有{selectedOfficialGroup.groupId * 20}名成员。
                          <br />
                          <br />
                          请遵守群组规则，保持良好的沟通氛围。
                        </p>
                      </div>
                      <div className="flex justify-center gap-3">
                        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 cursor-pointer">
                          进入群组
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                      <h4 className="mb-3 text-base font-medium text-gray-900 dark:text-white">
                        最近活动
                      </h4>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <img
                                className="size-8 rounded-full object-cover"
                                src={`https://flowbite.com/docs/images/people/profile-picture-${(index % 5) + 1}.jpg`}
                                alt={`用户${index + 1}头像`}
                              />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                用户{index + 1}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {index + 1}小时前
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              分享了一个关于{selectedOfficialGroup.name}
                              的重要通知，请大家查看并及时回复。
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <div className="min-h-full rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          成员列表
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedOrganization.departmentId ? 8 : 15} 名成员
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({
                          length: selectedOrganization.departmentId ? 8 : 15,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/60"
                          >
                            <div className="relative flex size-12 shrink-0 items-center justify-center">
                              <img
                                className="size-12 rounded-full object-cover shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                                src={`/images/users/${
                                  [
                                    "neil-sims.png",
                                    "bonnie-green.png",
                                    "michael-gough.png",
                                    "lana-byrd.png",
                                    "thomas-lean.png",
                                    "helene-engels.png",
                                    "robert-brown.png",
                                    "leslie-livingston.png",
                                    "joseph-mcfall.png",
                                    "jese-leos.png",
                                    "roberta-casas.png",
                                  ][index % 11]
                                }`}
                                alt={`成员${index + 1}的头像`}
                              />
                              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedOrganization.name} 成员 {index + 1}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {index % 2 === 0 ? "在线" : "离线"}
                              </p>
                              <div className="mt-1 flex gap-1">
                                <button className="rounded-md bg-blue-50 p-1 text-xs text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 cursor-pointer">
                                  发消息
                                </button>
                                <button className="rounded-md bg-gray-50 p-1 text-xs text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 cursor-pointer">
                                  查看资料
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-full rounded-lg p-4">
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
                            <div className="flex items-start mb-2">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center">
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
                            <div className="flex items-start mb-2">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center">
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
                            <div className="flex items-start mb-2">
                              <img
                                className="size-8 rounded-full mr-2"
                                src={msg.avatarSrc}
                                alt={`${msg.sender}的头像`}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center">
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
                        ) : (
                          <ChatMessage
                            key={msg.id}
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
    </NavbarSidebarLayout>
  );
};

export default DiscussionPage;
