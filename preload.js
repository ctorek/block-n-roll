const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {});

contextBridge.exposeInMainWorld("networking", {
    connect: (ssid) => ipcRenderer.invoke("connect"),
    deploy: (code) => ipcRenderer.invoke("deploy"),
    simulate: (code) => ipcRenderer.invoke("simulate")
});