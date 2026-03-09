const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
  },
  dialog: {
    openFile: (options) => ipcRenderer.invoke('dialog-open-file', options),
  },
  audio: {
    copyFile: (sourcePath, fileName) => ipcRenderer.invoke('copy-audio-file', sourcePath, fileName),
    getPath: (fileName) => ipcRenderer.invoke('get-audio-path', fileName),
  },
  board: {
    export: (data) => ipcRenderer.invoke('export-board', data),
    exportZip: (data) => ipcRenderer.invoke('export-board-zip', data),
    import: () => ipcRenderer.invoke('import-board'),
  },
});
