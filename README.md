<h1 style="text-align: center;">Block N' Roll</h1>

Tool for programming FRC robots using Blockly, intended to teach the basics of robot control without requiring programming languages like Java, C++, or Python.

> This is intended for fun and educational purposes. Please don't try to use this for a competition robot.

### Usage Instructions

### Build Instructions

### Design

The frontend of this project uses [Blockly](https://developers.google.com/blockly/), a JavaScript library for creating editors for programs made of code blocks. This was selected due to its familiarity and its ability to generate code in Python.

The application was built using [Electron](https://www.electronjs.org/), due to the requirements of using a web-based frontend for Blockly as well as being a desktop application to be able to interface with the robot.

The frontend generates code to fit the specifications of the [RobotPy](https://robotpy.readthedocs.io/en/stable/) library and the backend uses the RobotPy command-line tools to deploy or simulate the generated robot code.

### Structure

* [`start.js`](./start.js) is the script that controls the start menu. Depending on the button selected, it sends a message to the main process using [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) which then loads the appropriate dialog menus and pages.

* [`editor.js`](./editor.js) is the script that controls the editor page. The editor interface uses [Blockly](https://developers.google.com/blockly/), and the buttons and WiFi connection menu interface with the operating system using IPC. 

* [`toolbox.js`](./toolbox.js) contains the [custom block definitions](https://developers.google.com/blockly/guides/create-custom-blocks/overview), [code generators](https://developers.google.com/blockly/guides/create-custom-blocks/generating-code), and [toolbox structure](https://developers.google.com/blockly/guides/configure/web/toolbox) for the Blockly workspace in the editor.

* [`main.js`](./main.js) is the backend process that is used to interface with the filesystem and run the code. When the simulation or deploy buttons in the editor are pressed, this script receives the generated code in Python over IPC, writes it into [`robot.py`](./robot.py), and then uses the command line to run the robot code.