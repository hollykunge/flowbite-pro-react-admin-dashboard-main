/**
 * 检测 Vite 开发服务器的可用端口
 *
 * 此脚本会尝试连接到常见的 Vite 端口（5173, 5174, 5175），
 * 并返回第一个可用的端口。
 */
const http = require("http");

// 要检测的端口列表
const ports = [5173, 5174, 5175];
let currentPortIndex = 0;

/**
 * 检查指定端口的服务器是否可用
 * @param {number} port - 要检查的端口
 * @param {function} callback - 回调函数，接收可用性结果
 */
function checkPort(port, callback) {
  console.log(`正在检查端口 ${port} 是否可用...`);

  const url = `http://localhost:${port}`;
  const request = http.get(url, (res) => {
    console.log(`端口 ${port} 响应状态码: ${res.statusCode}`);
    callback(true, port);
  });

  request.on("error", (err) => {
    console.error(`检查端口 ${port} 时出错: ${err.message}`);
    callback(false, port);
  });

  request.setTimeout(2000, () => {
    console.error(`检查端口 ${port} 超时`);
    request.abort();
    callback(false, port);
  });
}

/**
 * 尝试下一个端口
 */
function tryNextPort() {
  if (currentPortIndex >= ports.length) {
    console.error("所有端口尝试失败，无法找到可用的 Vite 服务器");
    process.exit(1);
    return;
  }

  const port = ports[currentPortIndex];
  checkPort(port, (available, checkedPort) => {
    if (available) {
      console.log(`找到可用的 Vite 服务器端口: ${checkedPort}`);
      // 将端口输出到标准输出，以便脚本可以捕获
      console.log(`VITE_PORT=${checkedPort}`);
      process.exit(0);
    } else {
      currentPortIndex++;
      tryNextPort();
    }
  });
}

// 开始检测端口
tryNextPort();
