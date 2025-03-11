import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import isBrowser from "../helpers/is-browser";
import isSmallScreen from "../helpers/is-small-screen";
import isLargeScreen from "../helpers/is-large-screen";

interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpenOnSmallScreens: (isOpen: boolean) => void;
}

const defaultContext: SidebarContextProps = {
  isOpenOnSmallScreens: false,
  isPageWithSidebar: true,
  setOpenOnSmallScreens: () => {},
};

const SidebarContext = createContext<SidebarContextProps>(defaultContext);

export function SidebarProvider({ children }: PropsWithChildren) {
  const location = isBrowser() ? window.location.pathname : "/";
  const [isOpen, setOpen] = useState(
    isBrowser()
      ? localStorage.getItem("isSidebarOpen") === "true" || false
      : false,
  );

  // 初始化时设置侧边栏为折叠状态
  useEffect(() => {
    if (isBrowser()) {
      // 默认设置为折叠状态，无论屏幕大小
      const shouldBeOpen = false;
      setOpen(shouldBeOpen);
      localStorage.setItem("isSidebarOpen", shouldBeOpen.toString());
    }
  }, []);

  // Save latest state to localStorage
  useEffect(() => {
    window.localStorage.setItem("isSidebarOpen", isOpen.toString());
  }, [isOpen]);

  // 根据屏幕尺寸调整侧边栏状态，但保持默认折叠
  useEffect(() => {
    function handleResize() {
      if (isSmallScreen()) {
        setOpen(false);
      }
      // 移除了自动展开大屏幕的逻辑，保持折叠状态
    }

    // 初始化时执行一次
    handleResize();

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close Sidebar on page change on mobile
  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  // Close Sidebar on mobile tap inside main content
  useEffect(() => {
    function handleMobileTapInsideMain(event: MouseEvent) {
      const main = document.querySelector("main");
      const isClickInsideMain = main?.contains(event.target as Node);

      if (isSmallScreen() && isClickInsideMain) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMobileTapInsideMain);
    return () => {
      document.removeEventListener("mousedown", handleMobileTapInsideMain);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: true,
        setOpenOnSmallScreens: setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useSidebarContext should be used within the SidebarContext provider!",
    );
  }

  return context;
}
