const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

app.whenReady().then(() => {
    // robot wifi connect from frontend
    ipcMain.handle("connect", (ssid) => {

    });

    // deploy button from frontend
    ipcMain.handle("deploy", (code) => {

    });

    // simulate button from frontend
    ipcMain.handle("simulate", (code) => {

    });

    // create browser window
    const window = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            // preload script runs in renderer
            preload: path.join(__dirname, "preload.js"),

            // allow using npm modules in renderer
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // load html view into browser
    window.loadFile("index.html");
});

// runs when all app windows are closed
app.on("window-all-closed", () => {
    // quit running app
    app.quit();
});