const Blockly= require("blockly");

// https://developers.google.com/blockly/guides/configure/web/custom-blocks

/* events */
Blockly.Blocks["robot_init"] = {
    init: function() {
        // event block: no previous statement
        this.setPreviousStatement(false);
        this.setNextStatement(false);

        this.appendDummyInput()
            .appendField("Robot Init");

        this.appendStatementInput("DO");
    }
}

Blockly.Blocks["robot_periodic"] = {
    init: function() {
        // event block
        this.setPreviousStatement(false);
        this.setNextStatement(false);

        this.appendDummyInput()
            .appendField("Robot Periodic");

        this.appendStatementInput("DO");
    }
}

/* motors */
Blockly.Blocks["init_can_motor"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Init motor on CAN ")
            .appendField(new Blockly.FieldNumber(1, 1, 30, 1), "CAN_ID")
            .appendField(" to type ")
            .appendField(new Blockly.FieldDropdown([
                ["Spark Max", "SPARK"],
                ["Falcon 500", "FALCON"],
                ["Talon SRX", "TALON"],
                ["Victor SPX", "VICTOR"]
            ]));
    }
}

Blockly.Blocks["init_pwm_motor"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Init motor on PWM ")
            .appendField(new Blockly.FieldNumber(1, 1, 30, 1), "PWM_PORT")
            .appendField(" to type ")
            .appendField(new Blockly.FieldDropdown([
                ["Spark Max", "SPARK"],
                ["Falcon 500", "FALCON"],
                ["Talon SRX", "TALON"],
                ["Victor SPX", "VICTOR"]  // TODO: change to pwm
            ]));
    }
}

/* sensors */
Blockly.Blocks["init_gyro"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Init gyro of type ")
            .appendField(new Blockly.FieldDropdown([
                ["NavX", "NAVX"]
                // TODO: more types
            ]));
    }
}

Blockly.Blocks["get_gyro_angle"] = {
    init: function() {
        this.setOutput(true, "Number");

        this.appendDummyInput()
            .appendField("Gyro angle");
    }
}

/* controllers */
Blockly.Blocks["get_raw_axis"] = {
    init: function() {
        this.setOutput(true, "Number");

        this.appendDummyInput()
            .appendField("Get value of joystick ")
            .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "PORT")
            .appendField(" axis ")
            .appendField(new Blockly.FieldNumber(1, 1, 10, 1), "AXIS");
    }
}

Blockly.Blocks["while_btn_held"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("While button ")
            .appendField(new Blockly.FieldNumber(0, 0, 20, 1), "BTN")
            .appendField(" on joystick ")
            .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "PORT")
            .appendField(" is held")

        this.appendStatementInput("DO");
    }
}

Blockly.Blocks["when_btn_pressed"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("When button ")
            .appendField(new Blockly.FieldNumber(0, 0, 20, 1), "BTN")
            .appendField(" on joystick ")
            .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "PORT")
            .appendField(" is pressed")

        this.appendStatementInput("DO");
    }
}

/* commands */

// https://developers.google.com/blockly/guides/configure/web/toolbox
module.exports = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Events",
            "contents": [
                {
                    "type": "robot_init",
                    "kind": "block"
                },
                {
                    "type": "robot_periodic",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Logic",
            "contents": [
                {
                    "type": "controls_if",
                    "kind": "block"
                },
                {
                    "type": "logic_compare",
                    "kind": "block",
                    "fields": {
                        "OP": "EQ"
                    }
                },
                {
                    "type": "logic_operation",
                    "kind": "block",
                    "fields": {
                        "OP": "AND"
                    }
                },
                {
                    "type": "logic_negate",
                    "kind": "block"
                },
                {
                    "type": "logic_boolean",
                    "kind": "block",
                    "fields": {
                        "BOOL": "TRUE"
                    }
                },
                {
                    "type": "logic_ternary",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Math",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Motors",
            "contents": [
                {
                    "type": "init_can_motor",
                    "kind": "block"
                }
            ]   
        },
        {
            "kind": "category",
            "name": "Sensors",
            "contents": [
                {
                    "type": "init_gyro",
                    "kind": "block"
                },
                {
                    "type": "get_gyro_angle",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Controllers",
            "contents": [
                {
                    "type": "get_raw_axis",
                    "kind": "block"
                },
                {
                    "type": "while_btn_held",
                    "kind": "block"
                },
                {
                    "type": "when_btn_pressed",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Commands",
            "contents": []
        }
    ]
}