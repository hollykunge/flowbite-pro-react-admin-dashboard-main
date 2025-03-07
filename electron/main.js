const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const http = require('http');

// 保持对window对象的全局引用
let mainWindow;
let floatingWindow; // 悬浮窗口引用
let tray = null; // 系统托盘引用
let retryCount = 0;
const maxRetries = 30;

// 检查服务器是否可用
function checkServer(url, callback) {
  console.log(`正在检查服务器 ${url} 是否可用...`);
  
  // 只检查服务器是否响应，不检查状态码
  const request = http.get(url, (res) => {
    console.log(`服务器响应状态码: ${res.statusCode}`);
    // 只要服务器响应，就认为它是可用的
    callback(true);
  });
  
  request.on('error', (err) => {
    console.error(`检查服务器时出错: ${err.message}`);
    callback(false);
  });
  
  request.setTimeout(2000, () => {
    console.error('检查服务器超时');
    request.abort();
    callback(false);
  });
}

// 尝试加载URL
function tryLoadURL() {
  const url = 'http://localhost:5173';
  
  checkServer(url, (available) => {
    if (available) {
      console.log('服务器可用，加载URL:', url);
      if (mainWindow) {
        mainWindow.loadURL(url);
      }
    } else {
      retryCount++;
      if (retryCount <= maxRetries) {
        console.log(`服务器不可用，${retryCount}/${maxRetries} 次重试...`);
        setTimeout(tryLoadURL, 2000);
      } else {
        console.error('达到最大重试次数，无法连接到开发服务器');
        if (mainWindow) {
          mainWindow.webContents.loadFile(path.join(__dirname, 'error.html'));
        }
      }
    }
  });
}

// 创建悬浮窗口
function createFloatingWindow() {
  console.log('创建悬浮窗口...');
  
  // 创建悬浮窗口
  floatingWindow = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false, // 无边框
    transparent: true, // 透明背景
    alwaysOnTop: true, // 始终置顶
    skipTaskbar: true, // 不在任务栏显示
    resizable: false, // 不可调整大小
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载悬浮窗口的内容
  floatingWindow.loadFile(path.join(__dirname, '../floating.html'));

  // 悬浮窗口右键菜单
  floatingWindow.webContents.on('context-menu', (event, params) => {
    const menu = Menu.buildFromTemplate([
      { 
        label: '显示主窗口', 
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        } 
      },
      { type: 'separator' },
      { 
        label: '退出应用', 
        click: () => {
          app.quit();
        } 
      }
    ]);
    menu.popup();
  });

  // 悬浮窗口可拖动
  floatingWindow.webContents.on('did-finish-load', () => {
    floatingWindow.webContents.send('make-draggable');
  });

  // 悬浮窗口关闭事件
  floatingWindow.on('closed', () => {
    floatingWindow = null;
  });
}

function createWindow() {
  console.log('创建浏览器窗口...');
  
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // 去掉默认标题栏
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // 确保预加载脚本路径正确
    }
  });

  // 监听窗口最大化事件
  mainWindow.on('maximize', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('window-maximized-state', true);
    }
  });

  // 监听窗口还原事件
  mainWindow.on('unmaximize', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('window-maximized-state', false);
    }
  });

  // 尝试加载URL
  tryLoadURL();

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
  console.log('已打开开发者工具');

  // 当window被关闭时，触发下面的事件
  mainWindow.on('closed', function () {
    mainWindow = null;
    console.log('窗口已关闭');
  });
  
  // 添加页面加载事件监听
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
  });
  
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('页面加载失败:', errorCode, errorDescription);
    if (errorCode !== -3) { // -3 是取消加载，不需要重试
      console.log('页面加载失败，2秒后重试...');
      setTimeout(tryLoadURL, 2000);
    }
  });

  // 创建系统托盘
  createTray();
}

// 创建系统托盘
function createTray() {
  tray = new Tray(path.join(__dirname, '../public/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '显示主窗口', 
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      } 
    },
    { 
      label: '显示/隐藏悬浮窗', 
      click: () => {
        if (floatingWindow) {
          if (floatingWindow.isVisible()) {
            floatingWindow.hide();
          } else {
            floatingWindow.show();
          }
        }
      } 
    },
    { type: 'separator' },
    { 
      label: '退出', 
      click: () => {
        app.quit();
      } 
    }
  ]);
  tray.setToolTip('Flowbite应用');
  tray.setContextMenu(contextMenu);
  
  // 点击托盘图标显示主窗口
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  console.log('Electron已准备就绪，创建窗口...');
  createWindow();
  createFloatingWindow();
});

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  console.log('所有窗口已关闭');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  console.log('应用被激活');
  if (mainWindow === null) {
    createWindow();
  }
  if (floatingWindow === null) {
    createFloatingWindow();
  }
});

// 添加IPC通信处理窗口控制
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// 悬浮窗口控制
ipcMain.on('floating-close', () => {
  if (floatingWindow) floatingWindow.hide();
});

ipcMain.on('floating-pin', (event, isPinned) => {
  if (floatingWindow) {
    floatingWindow.setAlwaysOnTop(isPinned);
  }
}); 