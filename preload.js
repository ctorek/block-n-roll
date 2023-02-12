const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {});

contextBridge.exposeInMainWorld("electronAPI", {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})