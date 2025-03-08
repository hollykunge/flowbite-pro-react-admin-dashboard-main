/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import type { FC } from "react";
import { Fragment, useState } from "react";
import {
  HiArrowsExpand,
  HiClipboard,
  HiClipboardCopy,
  HiEye,
  HiFolder,
  HiPaperClip,
  HiPencilAlt,
  HiPlus,
} from "react-icons/hi";
import { ReactSortable } from "react-sortablejs";
import kanbanBoards from "../data/kanban.json";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

// 添加中文字体样式
import "../styles/chinese-fonts.css";

interface KanbanBoard {
  id: number;
  title: string;
  tasks: KanbanItem[];
}

interface KanbanItem {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  daysLeft: number;
  attachment?: string;
  members: KanbanItemMember[];
}

interface KanbanItemMember {
  id: number;
  name: string;
  avatar: string;
}

const KanbanPage: FC = function () {
  const [list, setList] = useState<KanbanBoard[]>(kanbanBoards);

  // 汉化看板标题
  const translateBoardTitle = (title: string): string => {
    switch (title) {
      case "To Do":
        return "待办";
      case "In Progress":
        return "进行中";
      case "Done":
        return "已完成";
      default:
        return title;
    }
  };

  // 汉化剩余天数
  const translateDaysLeft = (days: number): string => {
    if (days === 0) return "已完成";
    return `剩余 ${days} 天`;
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="mb-6 flex items-start justify-start space-x-4 px-4">
            {list.map((board) => (
              <div key={board.id}>
                <div className="chinese-font py-4 text-base font-semibold text-gray-900 dark:text-gray-300">
                  {translateBoardTitle(board.title)}
                </div>
                <div className="mb-6 space-y-4">
                  <ReactSortable
                    animation={100}
                    forceFallback
                    group="kanban"
                    list={board.tasks}
                    setList={(tasks) =>
                      setList((list) => {
                        const newList = [...list];
                        const index = newList.findIndex(
                          (item) => item.id === board.id,
                        );
                        if (index !== -1 && newList[index]) {
                          newList[index].tasks = tasks;
                        }
                        return newList;
                      })
                    }
                  >
                    {board.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="mb-4 w-[28rem] cursor-grab rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between pb-4">
                          <div className="chinese-font text-base font-semibold text-gray-900 dark:text-white">
                            {task.name}
                          </div>
                          <div className="w-8">
                            <EditCardModal />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          {task.attachment && (
                            <img
                              alt=""
                              src={task.attachment}
                              className="mb-3 rounded-lg"
                            />
                          )}
                          <div className="chinese-font pb-4 text-sm font-normal text-gray-700 dark:text-gray-400">
                            {task.description}
                          </div>
                          <div className="flex justify-between">
                            <div className="flex items-center justify-start">
                              {task.members.map((member) => (
                                <Fragment key={member.id}>
                                  <a href="#" className="-mr-3">
                                    <img
                                      alt={member.name}
                                      src={`/images/users/${member.avatar}`}
                                      className="size-7 rounded-full border-2 border-white dark:border-gray-800"
                                    />
                                  </a>
                                  <div className="chinese-font invisible absolute z-50 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                    {member.name}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                            <div className="chinese-font flex items-center justify-center rounded-lg bg-purple-100 px-3 text-sm font-medium text-purple-800 dark:bg-purple-200">
                              <svg
                                className="mr-1 size-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              {translateDaysLeft(task.daysLeft)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ReactSortable>
                </div>
                <AddAnotherCardModal />
              </div>
            ))}
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const EditCardModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center rounded-lg border-2 border-transparent py-2 font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <span className="sr-only">编辑卡片</span>
        <HiPencilAlt className="text-lg" />
      </button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong className="chinese-font">编辑任务</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="chinese-font mb-3 text-2xl font-semibold leading-none text-gray-900 dark:text-white">
            重新设计 Themesberg 主页
          </div>
          <div className="mb-5 flex flex-col items-start justify-center space-y-3">
            <div className="chinese-font text-sm text-gray-500 dark:text-gray-400">
              由{" "}
              <a className="cursor-pointer text-primary-700 no-underline hover:underline dark:text-primary-500">
                Bonnie Green
              </a>{" "}
              添加，22 小时前
            </div>
            <div className="flex flex-row flex-wrap">
              <div className="flex items-center justify-start">
                <a
                  href="#"
                  data-tooltip-target="bonnie-tooltip"
                  className="-mr-3"
                >
                  <img
                    className="size-7 rounded-full border-2 border-white dark:border-gray-800"
                    src="../images/users/bonnie-green.png"
                    alt="Bonnie Green"
                  />
                </a>
                <div
                  id="bonnie-tooltip"
                  role="tooltip"
                  className="chinese-font invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                >
                  Bonnie Green
                </div>
                <a
                  href="#"
                  data-tooltip-target="roberta-tooltip"
                  className="-mr-3"
                >
                  <img
                    className="size-7 rounded-full border-2 border-white dark:border-gray-800"
                    src="../images/users/roberta-casas.png"
                    alt="Roberta Casas"
                  />
                </a>
                <div
                  id="roberta-tooltip"
                  role="tooltip"
                  className="chinese-font invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                >
                  Roberta Casas
                </div>
                <a
                  href="#"
                  data-tooltip-target="michael-tooltip"
                  className="-mr-3"
                >
                  <img
                    className="size-7 rounded-full border-2 border-white dark:border-gray-800"
                    src="../images/users/michael-gough.png"
                    alt="Michael Gough"
                  />
                </a>
                <div
                  id="michael-tooltip"
                  role="tooltip"
                  className="chinese-font invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                >
                  Michael Gough
                </div>
              </div>
              <Button
                color="gray"
                className="chinese-font ml-5 font-bold dark:bg-gray-600 [&>*]:py-1"
              >
                <div className="flex items-center gap-x-2 text-xs">
                  <HiPlus />
                  加入
                </div>
              </Button>
              <Button
                color="gray"
                className="chinese-font ml-3 font-bold dark:bg-gray-600 [&>*]:py-1"
              >
                <div className="flex items-center gap-x-2 text-xs">
                  <HiPaperClip />
                  附件
                </div>
              </Button>
            </div>
          </div>
          <div className="chinese-font mb-2 inline-flex items-center text-center text-lg font-semibold text-gray-900 dark:text-white">
            <svg
              className="mr-1 size-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              ></path>
            </svg>
            描述
          </div>
          <div className="chinese-font mb-4 space-y-2 text-base text-gray-500 dark:text-gray-400">
            <p>
              我制作了一些线框图，我们希望您遵循这些线框图，因为我们正在使用
              Google 的 Material Design
              构建它（请了解更多相关信息，并了解如何将标准 Material Design
              改进为更美观的设计）。除此之外，您可以按照自己的喜好进行设计。
            </p>
            <p>
              下周五应该完成。下周一我们应该交付第一个迭代版本。请确保我们在当天交付一个好的结果。
            </p>
            <div className="chinese-font w-max cursor-pointer text-sm font-semibold text-primary-700 hover:underline dark:text-primary-500">
              显示完整描述
            </div>
          </div>
          <div className="mb-4 w-full rounded-lg border border-gray-100 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
            <div className="p-4">
              <label htmlFor="compose-mail" className="sr-only">
                您的评论
              </label>
              <textarea
                id="compose-mail"
                rows={4}
                className="chinese-font block w-full border-0 bg-gray-100 px-0 text-base text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                placeholder="写下评论..."
              ></textarea>
            </div>
            <div className="flex items-center justify-between border-t p-4 dark:border-gray-600">
              <button
                type="button"
                className="chinese-font inline-flex items-center rounded-lg bg-primary-700 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-primary-800"
              >
                <svg
                  className="mr-1 size-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                发表评论
              </button>

              <div className="flex space-x-1 pl-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <a href="#" className="shrink-0">
                <img
                  className="size-7 rounded-full"
                  src="../images/users/michael-gough.png"
                  alt="Micheal Gough"
                />
              </a>
              <div className="min-w-0 flex-1">
                <p className="chinese-font truncate text-sm font-semibold text-gray-900 dark:text-white">
                  Micheal Gough
                </p>
                <p className="chinese-font truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                  产品经理
                </p>
              </div>
              <a
                href="#"
                className="rounded-lg p-1 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                <svg
                  className="size-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </a>
            </div>
            <ul className="chinese-font list-outside list-disc pl-6 text-xs text-gray-500 dark:text-gray-400">
              <li>
                最新点击/转化。在您当前放置商家徽标的位置，我们应该使用代表引荐流量来源的徽标（例如
                Google 或
                Facebook）。所以我们实际上缺少一个应该标记为"来源"的列。并且商家不应该有图标。
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="grid w-full grid-cols-2 items-center gap-3 sm:grid-cols-5">
            <Button
              color="primary"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              <div className="flex items-center gap-x-2">
                <HiClipboard className="text-xl" />
                保存
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              <div className="flex items-center gap-x-2">
                <HiArrowsExpand className="text-xl" />
                移动
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              <div className="flex items-center gap-x-2">
                <HiClipboardCopy className="text-xl" />
                复制
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              <div className="flex items-center gap-x-2">
                <HiFolder className="text-xl" />
                归档
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              <div className="flex items-center gap-x-2">
                <HiEye className="text-xl" />
                关注
              </div>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AddAnotherCardModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="chinese-font flex w-full items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed border-gray-200 px-5 py-2 font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <svg
          className="size-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        添加新卡片
      </button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong className="chinese-font">添加新任务</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-4 grid grid-cols-1 gap-y-2">
              <Label htmlFor="taskName" className="chinese-font">
                任务名称
              </Label>
              <TextInput
                id="taskName"
                name="taskName"
                placeholder="重新设计主页"
                className="chinese-font"
              />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-y-2">
              <Label htmlFor="description" className="chinese-font">
                输入描述
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="在第 672 行，你需要..."
                rows={6}
                className="chinese-font"
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="fileUpload"
                aria-label="上传文件"
                className="chinese-font flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="size-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="chinese-font text-base">拖放文件上传</p>
                </div>
                <input type="file" id="fileUpload" className="hidden" />
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center gap-x-3">
            <Button
              color="primary"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              <div className="flex items-center gap-x-2">
                <HiPlus className="text-lg" />
                添加卡片
              </div>
            </Button>
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              className="chinese-font"
            >
              关闭
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default KanbanPage;
