const { contextBridge, ipcRenderer } = require('electron');

// 在window对象上暴露API给渲染进程使用
contextBridge.exposeInMainWorld('electron', {
  // 可以在这里添加您需要的API
  send: (channel, data) => {
    // 允许的通道列表
    const validChannels = [
      'window-minimize', 
      'window-maximize', 
      'window-close',
      'floating-close',
      'floating-pin',
      'search-term',
      'search-focus',
      'open-pdf',
      'open-link'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    // 允许的通道列表
    const validChannels = [
      'window-maximized-state',
      'make-draggable',
      'perform-search',
      'update-ui',
      'theme-changed'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
}); 