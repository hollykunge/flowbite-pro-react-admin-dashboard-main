import isBrowser from "./is-browser";

/**
 * 判断当前屏幕是否为大屏幕（宽度 >= 1800px）
 * @returns {boolean} 如果屏幕宽度大于等于1800px则返回true，否则返回false
 */
function isLargeScreen(): boolean {
  return isBrowser() && window.innerWidth >= 1800;
}

export default isLargeScreen;
