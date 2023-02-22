const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const wifi = require("node-wifi");

const path = require("path");
const fs = require("node:fs/promises");

// initialize wifi interface
wifi.init({
    iface: null // ???
})

let window;
let blocklyFile;

app.whenReady().then(() => {
    // open project directory
    ipcMain.handle("openDir", async (event, dir) => {
        // file select menu
        var result = await dialog.showOpenDialog(window, {});
        
        // don't continue to editor if no project is selected
        if (result.filePaths[0] == null) return;
        blocklyFile = result.filePaths[0];

        // perform some file io and get blockly serialized data
        let workspace;
        try {
            workspace = await fs.readFile(blocklyFile, { encoding: "utf-8" });
        } catch (err) {
            console.error(err);
            
            // do not open editor if data does not load
            return;
        }

        // open editor view
        await window.loadFile("editor.html");

        // send blockly data to frontend
        window.webContents.send("blocklyLoad", workspace);
    });

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

    // save workspace on window close
    ipcMain.handle("saveWorkspace", (event, workspace) => {
        console.log(workspace);
        
        // TODO: write w promises fs
    });

    // create browser window
    window = new BrowserWindow({
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