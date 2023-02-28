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

// update dropdown options w networks
function updateNetworks() {
    ipcRenderer.invoke("networks").then((networks) => {
        // clear currently existing options
        const ssid = document.getElementById("ssid")
        while (ssid.childNodes[1]) {
            ssid.removeChild(ssid.childNodes[1]);
        }

        networks.forEach((network) => {
            // do not include option if blank
            if (network === "") return;

            // do not include option if same as selected
            if (network === ssid.value) return;

            // generate option from ssid
            var option = document.createElement("option");
            option.setAttribute("value", network);
            option.innerText = network;
    
            // add option to dropdown
            document.getElementById("ssid").appendChild(option);
        });
    });    
}

// blockly serialized data should only be sent once at start
ipcRenderer.on("blocklyLoad", (event, data) => {
    // update workspace w deserialized data
    Blockly.serialization.workspaces.load(data, workspace);
});

// initialize dropdown options from available wifi networks on start
updateNetworks();

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

// robot wifi ssid input
const ssidInput = document.getElementById("ssid");

const refreshBtn = document.getElementById("refresh");
refreshBtn.addEventListener("click", (event) => {
    event.preventDefault;
    updateNetworks();
});

// robot connect button
const connectBtn = document.getElementById("connect");
connectBtn.addEventListener("click", (event) => {
    // prevent page refresh/submit
    event.preventDefault();

    // connect to selected network
    ipcRenderer.invoke("connect", ssidInput.value);
});

// save workspace before window close
window.addEventListener("beforeunload", (event) => {
    var saveData = Blockly.serialization.workspaces.save(workspace);
    ipcRenderer.invoke("save", JSON.stringify(saveData));
})