const { ipcRenderer } = require("electron");

document.getElementById("opendir").addEventListener("click", () => {
    ipcRenderer.invoke("openDir");
});