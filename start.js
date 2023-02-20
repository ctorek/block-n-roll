const { ipcRenderer } = require("electron");

document.getElementById("opendir").addEventListener("click", async () => {
    // open file dialog in backend
    ipcRenderer.invoke("openDir");

    // no extra code is needed bc backend automatically does redirect
});