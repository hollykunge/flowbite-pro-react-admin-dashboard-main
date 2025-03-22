# 研讨组件模块

本目录包含研讨功能相关的组件和数据模型。

## 模拟数据（mockData.ts）

`mockData.ts` 文件提供了研讨功能所需的模拟数据，包括以下数据结构：

### 研讨会话列表 (discussionListData)

包含用户可以参与的研讨会话列表，每个会话项目包含以下属性：

- `id`: 会话唯一标识
- `name`: 会话名称（个人聊天为用户名，群组为群组名）
- `avatar`: 头像图片路径
- `lastMessage`: 最后一条消息内容
- `time`: 最后消息时间
- `unread`: 未读消息数量
- `status`: 在线状态（"online" 或 "offline"）
- `isTyping`: 是否正在输入中
- `isGroup`: 是否为群组会话
- `isVoiceMessage`: 最后消息是否为语音消息
- `isPhoto`: 最后消息是否为图片
- `category`: 分类（"recent" 等）
- `members`: 成员数量
- `tag`: 标签（"团队"、"私聊"、"项目"、"专业群" 等）
- `securityLevel`: 安全级别（"非密"、"秘密"、"机密"）

特殊会话类型包括：

- 研究室群组：包括普通研究室群组、党支部群组和工会群组
- 专业建设群：如平台专业建设群，用于专业技术研讨和平台建设方案讨论

### 消息列表 (messagesData)

包含单个研讨会话中的消息列表，每条消息包含以下属性：

- `id`: 消息唯一标识
- `sender`: 发送者名称
- `avatarSrc`: 发送者头像路径
- `content`: 消息内容
- `time`: 发送时间
- `status`: 消息状态（"已读" 等）
- `messageType`: 消息类型（"text"、"image"、"file"、"voice"、"video"、"location"、"link"、"vote"、"task"、"relay"、"knowledge"、"document"、"notice" 等）
- `isOwn`: 是否为自己发送的消息
- `replyTo`: 回复信息（包含 sender 和 message）
- `reactions`: 表情回应
- `isEdited`: 是否已编辑
- `securityLevel`: 安全级别

根据 `messageType` 不同，消息可能包含以下特殊数据结构：

#### 投票数据 (voteData)

用于 `messageType: "vote"` 类型的消息：

- `title`: 投票标题
- `description`: 投票描述
- `options`: 选项列表（id、text、votes）
- `totalVotes`: 总投票数
- `deadline`: 截止日期
- `hasVoted`: 当前用户是否已投票

#### 任务数据 (taskData)

用于 `messageType: "task"` 类型的消息：

- `title`: 任务标题
- `description`: 任务描述
- `dueDate`: 截止日期
- `priority`: 优先级（"low"、"medium"、"high"、"urgent"）
- `status`: 状态（"pending"、"in-progress"、"completed"）
- `progress`: 完成进度（百分比）
- `assignees`: 负责人列表
- `tags`: 标签列表

#### 接龙数据 (relayData)

用于 `messageType: "relay"` 类型的消息：

- `id`: 接龙唯一标识
- `title`: 接龙标题
- `description`: 接龙描述
- `createdAt`: 创建时间
- `deadline`: 截止日期
- `participants`: 参与者列表
- `totalParticipants`: 总参与人数
- `maxParticipants`: 最大参与人数
- `status`: 状态（"ongoing"、"completed"）
- `tags`: 标签列表

#### 知识卡片数据 (knowledgeData)

用于 `messageType: "knowledge"` 类型的消息：

- `title`: 知识标题
- `content`: 知识内容
- `category`: 知识分类
- `tags`: 标签列表
- `author`: 作者
- `authorAvatar`: 作者头像
- `createdAt`: 创建时间
- `lastUpdated`: 最后更新时间
- `viewCount`: 查看次数
- `attachments`: 附件列表
- `relatedTopics`: 相关主题

#### 文档编辑卡片数据 (documentData)

用于 `messageType: "document"` 类型的消息：

- `title`: 文档标题
- `content`: 文档内容
- `fileType`: 文件类型（"word"、"excel"、"ppt"、"pdf"、"other"）
- `fileSize`: 文件大小
- `pageCount`: 页数
- `lastEditor`: 最后编辑者
- `lastEditorAvatar`: 最后编辑者头像
- `lastEditTime`: 最后编辑时间
- `collaborators`: 协作者列表
- `status`: 状态（"editing"、"viewing"、"locked"）
- `version`: 版本号
- `commentCount`: 评论数量

#### 通知公告数据 (noticeData)

用于 `messageType: "notice"` 类型的消息：

- `title`: 通知标题
- `content`: 通知内容
- `type`: 通知类型（"welcome"、"rules"、"announcement"、"event"）
- `importance`: 重要程度（"normal"、"important"、"urgent"）
- `expireDate`: 过期日期
- `attachments`: 附件列表
- `requireConfirmation`: 是否需要确认
- `confirmedBy`: 已确认人员列表

### 置顶话题 (defaultPinnedTopic)

包含默认的置顶话题数据：

- `title`: 话题标题
- `content`: 话题内容
- `creator`: 创建者
- `createdAt`: 创建时间
- `isPinned`: 是否被置顶

## 特殊功能

### 进群通知

平台专业建设群等特殊群组在用户首次点击群组时会弹出自动通知，显示群规则或重要信息：

- 功能流程：当用户点击平台专业建设群，系统会自动弹出模态对话框，展示群规则、欢迎信息等内容
- 实现方式：在 `handleSelectDiscussion` 函数中，检测到特定群组ID(如ID为8的平台专业建设群)时，设置 `groupNoticeContent` 并显示通知弹窗
- 通知类型：支持多种类型通知，如规则(rules)、欢迎(welcome)、公告(announcement)、活动(event)等
- 样式区分：根据通知重要程度（normal/important/urgent）和类型，显示不同样式的通知卡片

通知弹窗包含以下元素：

- 标题与图标：根据通知类型显示相应图标和标题
- 通知内容：支持多行文本展示，可包含格式化内容
- 确认按钮：允许用户确认已阅读通知

### 用户头像

研讨组件中使用本地头像文件，所有用户头像均从`/images/users/`目录获取：

- 所有用户和群组的头像都使用本地图片资源
- 在`platformGroupMessagesData`中，所有用户头像路径已更新为使用本地头像
- 可用头像包括：jese-leos.png, neil-sims.png, robert-brown.png, michael-gough.png, thomas-lean.png, bonnie-green.png, roberta-casas.png, leslie-livingston.png等
- 特殊群组头像：dangzhibu.png（党支部）, gonghui.png（工会）, zuzhi.png（组织）
- 用户创建内容（如参与接龙、确认通知等）时自动使用jese-leos.png作为默认头像

## 使用方法

在组件中导入所需的模拟数据：

```tsx
import { discussionListData, messagesData, platformGroupMessagesData, defaultPinnedTopic } from './mockData';

// 使用数据
const DiscussionComponent = () => {
  // 获取会话列表
  const discussions = discussionListData;

  // 获取普通消息列表
  const messages = messagesData;

  // 获取专业建设群消息列表
  const platformMessages = platformGroupMessagesData;

  // 获取置顶话题
  const pinnedTopic = defaultPinnedTopic;

  return (
    // 组件渲染逻辑...
  );
};
```

## 组件列表

本目录包含以下主要组件：

- `DiscussionPage.tsx`: 研讨页面主组件
- `OrganizationMembersList.tsx`: 组织成员列表组件
- `TopicForm.tsx`: 话题创建表单组件

## 类型定义

类型定义在 `types.ts` 文件中，包含消息和相关数据结构的类型定义。
