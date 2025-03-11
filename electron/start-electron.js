/**
 * Electron 启动脚本
 *
 * 此脚本会等待 Vite 开发服务器启动，然后检测其端口，
 * 并使用正确的端口启动 Electron 应用。
 */
const { spawn, execSync } = require("child_process");
const path = require("path");
const waitOn = require("wait-on");

// 要检测的端口列表
const ports = [5173, 5174, 5175];
const portUrls = ports.map((port) => `http-get://localhost:${port}`);

console.log("等待 Vite 开发服务器启动...");
console.log(`正在监听以下端口: ${ports.join(", ")}`);

// 等待任一端口可用
waitOn({
  resources: portUrls,
  timeout: 60000, // 60秒超时
  interval: 1000, // 每秒检查一次
  simultaneous: 1, // 同时只检查一个资源
})
  .then(() => {
    console.log("Vite 开发服务器已启动，正在检测可用端口...");

    try {
      // 运行端口检测脚本
      const detectPortPath = path.join(__dirname, "detect-port.js");
      const result = execSync(`node "${detectPortPath}"`, { encoding: "utf8" });

      // 从输出中提取端口
      const portMatch = result.match(/VITE_PORT=(\d+)/);
      if (portMatch && portMatch[1]) {
        const port = portMatch[1];
        console.log(`检测到 Vite 服务器运行在端口 ${port}`);

        // 启动 Electron 应用，传递正确的端口
        console.log(`正在启动 Electron 应用，连接到端口 ${port}...`);
        const electronProcess = spawn("electron", ["."], {
          env: {
            ...process.env,
            ELECTRON_START_URL: `http://localhost:${port}`,
          },
          stdio: "inherit",
        });

        electronProcess.on("close", (code) => {
          console.log(`Electron 进程已退出，退出码: ${code}`);
          process.exit(code);
        });
      } else {
        console.error("无法从检测脚本输出中提取端口");
        process.exit(1);
      }
    } catch (error) {
      console.error("运行端口检测脚本时出错:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("等待 Vite 开发服务器超时或出错:", error);
    process.exit(1);
  });
