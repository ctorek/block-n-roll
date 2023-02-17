const Blockly = require("blockly");
const pythonGen = require("blockly/python");

const { ipcRenderer } = require("electron");

// https://developers.google.com/blockly/guides/configure/web/toolbox
const toolbox = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Events",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Logic",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Math",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Motors",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Sensors",
            "contents": []
        }
    ]
}

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
    console.log("DEPLOY");
    // await window.networking.deploy()
});

// simulate button
const simBtn = document.getElementById("sim");
simBtn.addEventListener("click", () => {
    // await window.networking.simulate()
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