const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const wifi = require("node-wifi");
const path = require("path");
const { exec } = require("child_process");
const fs = require("node:fs/promises");

// initialize wifi interface
wifi.init({
    iface: null // ???
})

let window, blocklyFile;

let robotPyInstalled = false;

async function writeGeneratedCode(code) {
    // write code to python file
    try {
        // make directory for generated code
        try {
            // check if directory exists
            await fs.access(path.join(path.dirname(blocklyFile), "python"));
        } catch (err) {
            // create it if it doesn't exist
            await fs.mkdir(path.join(path.dirname(blocklyFile), "python"));
        }

        // write blockly-generated code to file
        await fs.writeFile(path.join(path.dirname(blocklyFile), "python", "generated.py"), code, { encoding: "utf-8" });

        // copy robot.py file to project directory for deploy
        await fs.copyFile(
            // current directory
            path.join(__dirname, "robot.py"), 
            // project directory
            path.join(path.dirname(blocklyFile), "python", "robot.py")
        );

    } catch (err) {
        console.error(err);
        return;
    }
}

app.whenReady().then(() => {
    // open existing project
    ipcMain.handle("open", async (event) => {
        // file select menu
        var result = await dialog.showOpenDialog(window, {
            properties: ["openFile"]
        });
        
        // don't continue to editor if no project is selected
        if (result.filePaths[0] == null) {
            dialog.showErrorBox("Error", "No file selected.");
            return;
        }
        blocklyFile = result.filePaths[0];

        // if a project is selected ensure it is a json file
        if (!blocklyFile.endsWith("json")) {
            dialog.showErrorBox("Error", "File selected is not a JSON file.");
            return;
        }

        // perform some file io and get blockly serialized data
        let workspace;
        try {
            workspace = await fs.readFile(blocklyFile, { encoding: "utf-8" });
        } catch (err) {
            console.error(err);
            dialog.showErrorBox("Open Error", err);
            
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
    ipcMain.handle("deploy", async (event, code) => {
        console.log(code);

        // write code to python file
        await writeGeneratedCode(code);

        // check for robotpy install before attempting deploy
        if (!robotPyInstalled) {
            dialog.showErrorBox("Deploy Unavailable", "RobotPy install not detected.");
            return;
        }

        // different commands used on windows vs linux/mac
        var command = (process.platform == "win32") ? "py -3" : "python3";
        exec(`${command} robot.py deploy`, (err, stdout, stderr) => {
            if (stderr) {
                dialog.showErrorBox("Deploy Error", stderr);
                return;
            }
        });
    });

    // simulate button from frontend
    ipcMain.handle("simulate", async (event, code) => {
        console.log(code);

        await writeGeneratedCode(code);

        if (!robotPyInstalled) {
            dialog.showErrorBox("Simulation Unavailable", "RobotPy install not detected.");
            return;
        }

        // different commands used on windows vs linux/mac
        var command = (process.platform == "win32") ? "py -3" : "python3";
        exec(`${command} robot.py sim`, (err, stdout, stderr) => {
            if (stderr) {
                dialog.showErrorBox("Simulation Error", stderr);
                return;
            }
        });
    });

    // save workspace on window close
    ipcMain.handle("save", async (event, workspace) => {      
        // write workspace to project file
        try {
            await fs.writeFile(blocklyFile, workspace, { encoding: "utf-8" });
        } catch (err) {
            console.error(err);
            dialog.showErrorBox("Save Error", err);

            return false;
        }

        return true;
    });

    // create browser window
    window = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            // preload: path.join(__dirname, "preload.js"),

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
            if (err) {
                dialog.showErrorBox("Error", "Python 3 install not detected.");
                return;
            }
            
            // robotpy install
            var pkg = stdout.split("\n").filter(line => line.includes("robotpy"));
            if (pkg.length === 0) {
                dialog.showErrorBox("Error", "RobotPy install not detected.");
                return;
            }

            robotPyInstalled = true;
        });
    } else {
        // linux and mac command
        exec("pip3 list", (err, stdout, stderr) => {
            // python install
            if (err) {
                dialog.showErrorBox("Error", "Python 3 install not detected.");
                return;
            }

            // robotpy install
            var pkg = stdout.split("\n").filter(line => line.includes("robotpy"));
            if (pkg.length === 0) {
                dialog.showErrorBox("Error", "RobotPy install not detected.");
                return;
            }

            robotPyInstalled = true;
        });
    }
});

// runs when all app windows are closed
app.on("window-all-closed", () => {
    // quit running app
    app.quit();
});