# Socket Bot

[Live Version][live]

[live]: http://peterlemiszki.com/socket-bot

Socket Bot is a platformer(ish) puzzle browser game built with HTML Canvas. In each level, the player must redirect the flow of electricity by inserting or removing panels from sockets, creating a path to the exit.

![Screenshot](/images/shot-2.jpg)

## How to Play

An in-game tutorial is included, which introduces the player to the different objects found in each level.

Instructions are also listed below:

- Move the bot left and right using the arrow keys.

- When the bot is on an elevator, you can ascend or descend using the arrow keys.

- Your goal is to reach the red elevators and ride them up to the next level.

- Blocking your way will be doors and force fields. You can't pass through force fields with power. Doors are opened by buttons, but a button won't work unless it has power.

- You will need to change the flow of power to overcome these obstacles. You can change the flow of power by inserting/removing panels into/from sockets. Press the spacebar while in front of a socket to insert or remove a panel.

- You can increase the height of your robot by collecting spring power-ups. You can then use the up and down keys to adjust your height, allowing you to reach more sockets.

## Implementation

### Main Loop

```javascript
Game.prototype.main = function (passedThen) {
  var now = Date.now();
  var delta = now - passedThen;
  this.update(delta / 1000);
  this.renderer.renderScreen();
  newThen = now;
  window.requestAnimationFrame(function () {
    gameInstance.main(newThen);
  });
};
  ```

The main loop is the heart of the game. The current time is stored in a variable. The game then calculates the difference (in milliseconds) between the current time and the previous time the loop ran.

This difference is then passed to the game's update function, which checks to see if any of the arrow keys are currently being pressed and if so, moves the robot by the appropriate amount. The distance the robot is moved is based on elapsed time since the last loop (and therefore the last frame update). Using this method, sometimes referred to as Time-Based Modeling, the robot will move at a consistent speed regardless of how fast the script is running.

### Using Recursion to Send Power

Whenever a socket is inserted or removed, the updatePower function is called.

```javascript
Game.prototype.updatePower = function () {
  this.clearPower();
  for (var i = 0; i < this.currentLevel.powerSources.length; i++) {
    this.currentLevel.powerSources[i].sendPower(this.currentLevel.wiring, this.currentLevel.cubbies, this.currentLevel.buttonBlocks, this.currentLevel.forceFieldBlocks);
  }
};
  ```

The updatePower function first calls the clearPower function, which sets the hasPower property of all the "power objects" in the level to false. The updatePower function then iterates through each power source, calling each source's sendPower instance method.

```javascript
Wire.prototype.sendPower = function (wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {

  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  //look through wires:
  for (var i = 0; i < wiring.length; i++) {
    if (this.type.split("").indexOf("W") !== -1) {
      if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "leftward");
      }
    }
    if (this.type.split("").indexOf("N") !== -1) {
      if (wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1] && flowing !== "downward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "upward");
      }
    }
    if (this.type.split("").indexOf("E") !== -1) {
      if (wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "rightward");
      }
    }
    if (this.type.split("").indexOf("S") !== -1) {
      if (wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "downward");
      }
    }
  }
}
  ```
