const Blockly = require("blockly");
const pythonGen = require("blockly/python");

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

// initialize dropdown options from available wifi networks on start
updateNetworks();

// deploy button
const deployBtn = document.getElementById("dep");
deployBtn.addEventListener("click", () => {
    ipcRenderer.invoke("deploy", "")
});

// simulate button
const simBtn = document.getElementById("sim");
simBtn.addEventListener("click", () => {
    ipcRenderer.invoke("simulate", "");
});

// team number input
const teamNumInput = document.getElementById("num");

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