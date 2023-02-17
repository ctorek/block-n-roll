const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const wifi = require("node-wifi");

// initialize wifi interface
wifi.init({
    iface: null // ???
})

app.whenReady().then(() => {
    // get available networks for dropdown
    ipcMain.handle("networks", () => {
        // available network ssids
        var ssids = [];

        // scan networks
        wifi.scan((err, networks) => {
            // no ssids if error
            if (err) {
                console.error(err);
                return;
            }

            // add each ssid to list
            for (var network in networks) {
                ssids.push(network.ssid);
            }
        });
        
        return ssids;
    });

    // robot wifi connect from frontend
    ipcMain.handle("connect", (ssid) => {
        console.log("ipc connect");
    });

    // deploy button from frontend
    ipcMain.handle("deploy", (code) => {
        console.log("ipc deploy");
    });

    // simulate button from frontend
    ipcMain.handle("simulate", (code) => {
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
    window.loadFile("index.html");
});

// runs when all app windows are closed
app.on("window-all-closed", () => {
    // quit running app
    app.quit();
});