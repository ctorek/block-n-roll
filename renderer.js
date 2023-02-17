const Blockly = require("blockly");
const pythonGen = require("blockly/python");

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

// initialize dropdown options from available wifi networks
var ssids = window.networking.networks();
console.log(ssids);

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

// robot connect button
const connectBtn = document.getElementById("connect");
connectBtn.addEventListener("click", () => {
    // await window.networking.connect()
});