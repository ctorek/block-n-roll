import wpilib

class BlocklyRobot (wpilib.TimedRobot):

    def robotInit(self):
        # replace w generated code
        print("hello world")

    def autonomousInit(self):
        # replace w generated code
        print("autonomous init")

    def autonomousPeriodic(self):
        # replace w generated code
        print("autonomous periodic")

    def teleopInit(self):
        # replace w generated code
        print("teleop init")

    def teleopPeriodic(self):
        # replace w generated code
        print("teleop periodic")

if __name__ == "__main__":
    wpilib.run(BlocklyRobot)