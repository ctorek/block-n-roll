const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const wifi = require("node-wifi");

// initialize wifi interface
wifi.init({
    iface: null // ???
})

app.whenReady().then(() => {
    // get available networks for dropdown
    ipcMain.handle("networks", async (event) => {
        // available network ssids
        var ssids = (await wifi.scan()).map((network) => network.ssid);
        return ssids;
    });

    // robot wifi connect from frontend
    ipcMain.handle("connect", async (event, ssid) => {
        // todo: implement support for robot wifi networks w/ passwords
        wifi.connect({ ssid: ssid }, () => {
            // callback still might run even on connection fail on win
            console.log(`Connected to ${ssid}`);
        })
    });

    // deploy button from frontend
    ipcMain.handle("deploy", (event, code) => {
        console.log("ipc deploy");
    });

    // simulate button from frontend
    ipcMain.handle("simulate", (event, code) => {
        console.log("ipc sim");
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
    window.loadFile("start.html");
});

// runs when all app windows are closed
app.on("window-all-closed", () => {
    // quit running app
    app.quit();
});