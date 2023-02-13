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

// simulation button in header: referenced in html onclick
function simBtn() {
    console.log("todo: sim button impl");

    // returning false prevents default behavior on link press
    return false;
}

// deploy button in header: referenced in html onclick
function depBtn() {
    console.log("todo: deploy button impl");

    // returning false prevents default behavior on link press
    return false;
}