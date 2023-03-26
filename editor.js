const Blockly = require("blockly");
const { pythonGenerator } = require("blockly/python");

// https://www.electronjs.org/docs/latest/tutorial/ipc
const { ipcRenderer } = require("electron");

// blockly toolbox imported from another file
const toolbox = require("./toolbox.js");

// inject blockly into document
const workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    trashcan: true
});

/** serialize workspace and send to backend */
function save() {
    var saveData = Blockly.serialization.workspaces.save(workspace);
    ipcRenderer.invoke("save", JSON.stringify(saveData));
}

// blockly serialized data should only be sent once at start
ipcRenderer.on("blocklyLoad", (event, data) => {
    // update workspace w deserialized data
    Blockly.serialization.workspaces.load(data, workspace);
});

// deploy button
const deployBtn = document.getElementById("dep");
deployBtn.addEventListener("click", () => {
    var code = pythonGenerator.workspaceToCode(workspace);
    ipcRenderer.invoke("deploy", code)
});

// simulate button
const simBtn = document.getElementById("sim");
simBtn.addEventListener("click", () => {
    var code = pythonGenerator.workspaceToCode(workspace);
    ipcRenderer.invoke("simulate", code);
});

// save workspace btn
const saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", save);

// save workspace before window close
window.addEventListener("beforeunload", save);