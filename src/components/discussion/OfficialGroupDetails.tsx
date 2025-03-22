import { FC } from "react";
import { RiGovernmentFill } from "react-icons/ri";

/**
 * 官方群组属性接口
 */
interface OfficialGroup {
  groupId: number;
  name: string;
}

/**
 * 官方群组详情组件属性
 */
interface OfficialGroupDetailsProps {
  /**
   * 选中的官方群组
   */
  selectedOfficialGroup: OfficialGroup;
  /**
   * 返回按钮点击回调
   */
  onBackClick: () => void;
}

/**
 * 官方群组详情组件
 *
 * 该组件用于显示官方群组的详细信息
 */
const OfficialGroupDetails: FC<OfficialGroupDetailsProps> = ({
  selectedOfficialGroup,
  onBackClick,
}) => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden bg-transparent px-4 [scrollbar-width:thin] [&.scrolling]:opacity-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/0 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/0 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&.scrolling]:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
        <div className="min-h-full rounded-lg p-4">
          <div className="mb-6">
            <div className="flex justify-end mb-2">
              <button
                className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer"
                title="返回"
                onClick={onBackClick}
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
  );
};

export default OfficialGroupDetails;
