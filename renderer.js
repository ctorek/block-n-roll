const blockly = require("blockly");
const pythonGen = require("blockly/python");

// https://developers.google.com/blockly/guides/configure/web/toolbox
const toolbox = {
    "kind": "flyoutToolbox",
    "contents": [
        {
            "kind": "block",
            "type": "controls_if"
        }
    ]
};

// inject blockly into document
const workspace = blockly.inject('blocklyDiv', {
    toolbox: toolbox
});