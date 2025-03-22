import { FC } from "react";

/**
 * 组织属性接口
 */
interface Organization {
  instituteId: number;
  departmentId: number | null;
  name: string;
}

/**
 * 组织成员列表组件属性
 */
interface OrganizationMembersListProps {
  /**
   * 选中的组织
   */
  selectedOrganization: Organization;
}

/**
 * 组织成员列表组件
 *
 * 该组件用于显示组织架构中的成员列表
 */
const OrganizationMembersList: FC<OrganizationMembersListProps> = ({
  selectedOrganization,
}) => {
  return (
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
  );
};

export default OrganizationMembersList;
