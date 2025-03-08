import { Flowbite, useThemeMode } from "flowbite-react";
import type { FC } from "react";
import { useEffect } from "react";
import { Outlet } from "react-router";
import theme from "../flowbite-theme";

const FlowbiteWrapper: FC = function () {
  const dark = localStorage.getItem("theme") === "dark";

  return (
    <Flowbite theme={{ dark, theme }}>
      <PersistFlowbiteThemeToLocalStorage />
      <Outlet />
    </Flowbite>
  );
};

const PersistFlowbiteThemeToLocalStorage: FC = function () {
  const [themeMode] = useThemeMode();

  useEffect(() => {
    console.log("主题模式变化:", themeMode);
    localStorage.setItem("theme", themeMode);

    // 通知Electron主进程主题已更改
    if (window.electron) {
      console.log(
        "正在通知Electron主进程主题变化:",
        themeMode === "dark" ? "暗色模式" : "亮色模式",
      );
      window.electron.send("theme-changed", themeMode === "dark");
    } else {
      console.log("Electron API不可用，无法通知主题变化");
    }
  }, [themeMode]);

  return <></>;
};

export default FlowbiteWrapper;
