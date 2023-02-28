const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const wifi = require("node-wifi");
const path = require("path");
const { exec } = require("child_process");
const fs = require("node:fs/promises");

// initialize wifi interface
wifi.init({
    iface: null // ???
})

let window;
let blocklyFile;

app.whenReady().then(() => {
    // open existing project
    ipcMain.handle("open", async (event) => {
        // file select menu
        var result = await dialog.showOpenDialog(window, {
            properties: ["openFile"]
        });
        
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
        window.webContents.send("blocklyLoad", JSON.parse(workspace));
    });

    // create new project
    ipcMain.handle("create", async (event) => {
        var result = await dialog.showOpenDialog(window, {
            properties: ["openDirectory"]
        });

        // don't redirect if no folder selected
        if (result.filePaths[0] == null) return;

        // set project location for save
        blocklyFile = path.join(result.filePaths[0], "blockly.json");

        // redirect to editor
        await window.loadFile("editor.html");
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
        console.log(code);
    });

    // simulate button from frontend
    ipcMain.handle("simulate", (event, code) => {
        console.log(code);
    });

    // save workspace on window close
    ipcMain.handle("save", async (event, workspace) => {
        console.log(workspace);
        
        // write workspace to project file
        try {
            await fs.writeFile(blocklyFile, workspace, { encoding: "utf-8" });
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
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

    // check if robotpy installed
    if (process.platform === "win32") {
        // windows-specific command
        exec("py -3 -m pip list", (err, stdout, stderr) => {
            // python install
            if (err || stderr) {
                dialog.showErrorBox("Error", "Python 3 install not detected");
                return;
            }
            
            // robotpy install

        });
    } else {
        // linux and mac command
        exec("pip3 list", (err, stdout, stderr) => {
            // python install
            if (err || stderr) {
                dialog.showErrorBox("Error", "Python 3 install not detected");
                return;
            }

            // robotpy install

        });
    }
});

// runs when all app windows are closed
app.on("window-all-closed", () => {
    // quit running app
    app.quit();
});