const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');
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
  
  try {
    // 获取屏幕尺寸
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    // 创建悬浮窗口
    floatingWindow = new BrowserWindow({
      width: 360,
      height: 76, // 调整高度以匹配新的样式
      x: width - 380, // 调整位置以适应新的宽度
      y: 100, // 距离顶部100px
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
    const floatingHtmlPath = path.join(__dirname, '../floating.html');
    console.log('加载悬浮窗口HTML:', floatingHtmlPath);
    
    // 检查文件是否存在
    if (require('fs').existsSync(floatingHtmlPath)) {
      console.log('悬浮窗口HTML文件存在');
      floatingWindow.loadFile(floatingHtmlPath);
    } else {
      console.error('悬浮窗口HTML文件不存在:', floatingHtmlPath);
      // 创建一个简单的HTML内容，匹配新的设计
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>悬浮窗</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent;
            font-family: 'Arial', sans-serif;
            user-select: none;
          }
          
          .floating-container {
            width: 240px;
            height: 64px;
            background-color: rgba(30, 41, 59, 0.85);
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .icon-container {
            width: 52px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-app-region: drag;
            app-region: drag;
            cursor: move;
            padding-left: 6px;
          }
          
          .app-logo {
            width: 40px;
            height: 40px;
          }
          
          .input-container {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 6px 12px 6px 6px;
            -webkit-app-region: no-drag;
            app-region: no-drag;
          }
          
          .search-input {
            width: 100%;
            height: 40px;
            background-color: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: white;
            padding: 0 12px;
            font-size: 14px;
            outline: none;
          }
          
          .search-input:focus {
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
          }
          
          .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        </style>
      </head>
      <body>
        <div class="floating-container">
          <div class="icon-container" id="dragHandle">
            <img src="https://flowbite.com/docs/images/logo.svg" alt="Logo" class="app-logo">
          </div>
          <div class="input-container">
            <input type="text" class="search-input" placeholder="搜索..." id="searchInput">
          </div>
        </div>

        <script>
          // 获取DOM元素
          const searchInput = document.getElementById('searchInput');
          const dragHandle = document.getElementById('dragHandle');
          
          // 搜索输入处理
          searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              const searchTerm = searchInput.value.trim();
              if (searchTerm) {
                console.log('搜索:', searchTerm);
                // 如果需要，可以通过IPC发送搜索请求到主进程
                if (window.electron) {
                  window.electron.send('search-term', searchTerm);
                }
                searchInput.value = '';
              }
            }
          });
          
          // 监听来自主进程的消息
          if (window.electron) {
            window.electron.receive('make-draggable', () => {
              console.log('悬浮窗已可拖动');
            });
          }
        </script>
      </body>
      </html>
      `;
      
      // 使用loadURL加载HTML内容
      floatingWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    }

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
      console.log('悬浮窗口加载完成，设置可拖动');
      floatingWindow.webContents.send('make-draggable');
      
      // 如果主窗口已经存在，获取当前主题并设置悬浮窗口主题
      if (mainWindow && mainWindow.webContents) {
        console.log('主窗口存在，正在获取主题状态');
        mainWindow.webContents.executeJavaScript('localStorage.getItem("theme")')
          .then((theme) => {
            const isDarkMode = theme === 'dark';
            console.log('当前主题:', isDarkMode ? '暗色模式' : '亮色模式');
            console.log('正在通知悬浮窗口更新主题');
            floatingWindow.webContents.send('theme-changed', isDarkMode);
          })
          .catch(err => {
            console.error('获取主题状态出错:', err);
          });
      } else {
        console.log('主窗口不存在，无法获取主题状态');
      }
    });

    // 悬浮窗口关闭事件
    floatingWindow.on('closed', () => {
      floatingWindow = null;
    });
    
    // 打开开发者工具查看问题
    floatingWindow.webContents.openDevTools({ mode: 'detach' });
    
  } catch (error) {
    console.error('创建悬浮窗口时出错:', error);
  }
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
    
    // 获取当前主题状态并通知悬浮窗口
    if (floatingWindow && floatingWindow.webContents) {
      // 从localStorage中读取主题状态
      console.log('正在获取主题状态并通知悬浮窗口');
      mainWindow.webContents.executeJavaScript('localStorage.getItem("theme")')
        .then((theme) => {
          const isDarkMode = theme === 'dark';
          console.log('当前主题:', isDarkMode ? '暗色模式' : '亮色模式');
          console.log('正在通知悬浮窗口更新主题');
          floatingWindow.webContents.send('theme-changed', isDarkMode);
        })
        .catch(err => {
          console.error('获取主题状态出错:', err);
        });
    } else {
      console.log('悬浮窗口不存在或未准备好，无法通知主题变化');
    }
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
  try {
    // 创建托盘图标
    const iconPath = path.join(__dirname, '../public/tray-icon.png');
    console.log('托盘图标路径:', iconPath);
    
    // 确保public目录存在
    const publicDir = path.join(__dirname, '../public');
    if (!require('fs').existsSync(publicDir)) {
      console.log('创建public目录');
      require('fs').mkdirSync(publicDir, { recursive: true });
    }
    
    // 检查图标文件是否存在，如果不存在则创建一个默认图标
    if (!require('fs').existsSync(iconPath)) {
      console.log('创建默认托盘图标');
      // 使用nativeImage创建一个默认图标
      const icon = nativeImage.createFromDataURL('data:image/png;base64,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');
      // 保存图标到文件
      require('fs').writeFileSync(iconPath, icon.toPNG());
    }
    
    console.log('创建托盘');
    tray = new Tray(iconPath);
    
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
          } else {
            createFloatingWindow();
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
    
    console.log('托盘创建成功');
  } catch (error) {
    console.error('创建托盘时出错:', error);
  }
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  console.log('Electron已准备就绪，创建窗口...');
  
  // 先创建主窗口
  createWindow();
  
  // 延迟创建悬浮窗口，确保主窗口已经创建完成
  setTimeout(() => {
    console.log('延迟创建悬浮窗口，确保主窗口已经加载完成');
    createFloatingWindow();
  }, 3000); // 增加延迟时间，确保主窗口有足够时间加载
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

// 处理搜索请求
ipcMain.on('search-term', (event, searchTerm) => {
  console.log('收到搜索请求:', searchTerm);
  
  // 显示主窗口并将搜索词传递给主窗口
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send('perform-search', searchTerm);
  }
});

// 处理搜索框获取焦点
ipcMain.on('search-focus', (event, isFocused) => {
  console.log('搜索框焦点状态:', isFocused);
  
  if (floatingWindow) {
    if (isFocused) {
      // 搜索框获取焦点时，扩展悬浮窗口为聊天界面
      floatingWindow.setSize(480, 600);
      // 发送消息到渲染进程，通知其更新UI
      floatingWindow.webContents.send('update-ui', { expanded: true });
    } else {
      // 搜索框失去焦点时，恢复悬浮窗口原始大小
      floatingWindow.setSize(360, 76);
      // 发送消息到渲染进程，通知其更新UI
      floatingWindow.webContents.send('update-ui', { expanded: false });
    }
  }
});

// 处理打开PDF的请求
ipcMain.on('open-pdf', (event) => {
  console.log('收到打开PDF的请求');
  
  // 这里可以添加打开PDF文件的逻辑
  // 例如，使用dialog.showDialog让用户选择PDF文件
  const { dialog } = require('electron');
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'PDF文件', extensions: ['pdf'] }]
  });
});

// 处理打开链接的请求
ipcMain.on('open-link', (event) => {
  console.log('收到打开链接的请求');
  
  // 使用dialog.showMessageBox代替dialog.showInputBox
  const { dialog } = require('electron');
  const { shell } = require('electron');
  
  // 打开默认浏览器访问Flowbite文档
  shell.openExternal('https://flowbite.com/docs/');
});

// 处理主题变化
ipcMain.on('theme-changed', (event, isDarkMode) => {
  console.log('收到主题变化通知:', isDarkMode ? '暗色模式' : '亮色模式');
  
  // 通知悬浮窗口更新主题
  if (floatingWindow && floatingWindow.webContents) {
    console.log('正在通知悬浮窗口更新主题');
    floatingWindow.webContents.send('theme-changed', isDarkMode);
  } else {
    console.log('悬浮窗口不存在或未准备好，无法通知主题变化');
  }
}); 