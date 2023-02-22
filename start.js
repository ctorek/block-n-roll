const { ipcRenderer } = require("electron");

// open existing project button
document.getElementById("open").addEventListener("click", async () => {
    // open file dialog in backend
    ipcRenderer.invoke("open");

    // no extra code is needed bc backend automatically does redirect
});

// create new project button
document.getElementById("create").addEventListener("click", async () => {
    // create file dialog triggered from backend
    ipcRenderer.invoke("create");

    // backend automatically redirects to editor
})