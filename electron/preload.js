const { contextBridge, ipcRenderer } = require('electron');

// 在window对象上暴露API给渲染进程使用
contextBridge.exposeInMainWorld('electron', {
  // 可以在这里添加您需要的API
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
}); 