const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

app.whenReady().then(() => {
    // create browser window
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    ipcMain.on("set-title", (event, title) => {
        const webContents = event.sender;
        const window = BrowserWindow.fromWebContents(webContents);
        window.setTitle(title);
    })

    // load html view into browser
    window.loadFile("index.html");
});

// runs when all app windows are closed
app.on("window-all-closed", () => {
    // quit running app
    app.quit();
});