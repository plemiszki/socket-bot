# Socket Bot

[Live Version][live]

[live]: http://plemiszki.github.io/socket-bot

Socket Bot is a platformer browser game built with HTML Canvas. In each level, the player must redirect the flow of electricity by inserting or removing panels from sockets, creating a path to the exit.

[![Screenshot](/images/shot-2.jpg)][live]

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

The main loop is the heart of the game. The current time is stored in a variable. The game then calculates the difference (in milliseconds) between the current time and the previous time the loop ran.

This difference is then passed to the game's update function, which checks what arrow keys are pressed and moves the robot by the appropriate amount. The distance the robot is moved is based on elapsed time since the last loop (and therefore the last frame update). Using this method, sometimes referred to as Time-Based Modeling, the robot will move at a consistent speed regardless of how fast the script is running.

```javascript
main(passedThen) {
  let now = Date.now();
  let delta = now - passedThen;
  this.update(delta / 1000);
  this.renderer.renderScreen();
  let newThen = now;
  window.requestAnimationFrame(() => {
    this.main(newThen);
  });
}
  ```

### Using Inheritance for "Power Objects"

A few different objects in this game can have power - power sources, wires, force field blocks, and button blocks. Therefore, I decided to create a parent class called PowerObject, which has a hasPower property, and have the four subclasses inherit from it.

```javascript
class PowerObject {
  constructor(options) {
    this.hasPower = false;
    this.id = options.id;
    this.rowCol = options.rowCol;
  }

  toString() {
    return this.constructor.name;
  }
}
```
```javascript
class PowerSource extends PowerObject {
  constructor(options) {
    super(options);
  }
}
```
```javascript
class Wire extends PowerObject {
  constructor(options) {
    super(options);
    this.type = options.type;
  }
}
  ```
```javascript
class ButtonBlock extends PowerObject {
  constructor(options) {
    super(options);
    this.side = options.side;
    this.pushFunc = options.func;
    this.color = options.color || 'red';
  }
}
  ```
```javascript
class ForceFieldBlock extends PowerObject {
  constructor(options) {
    super(options);
  }
}
  ```

Additionally, power sources and wires can both send power to their neighbors, so the sendPower function was defined on the powerObject class. See below for more information about the sendPower function.

### Using Recursion to Send Power

Whenever a socket is inserted or removed, the updatePower function is called.

```javascript
updatePower() {
  this.clearPower();
  for (let i = 0; i < this.currentLevel.powerSources.length; i++) {
    this.currentLevel.powerSources[i].sendPower(this.currentLevel.wiring, this.currentLevel.cubbies, this.currentLevel.buttonBlocks, this.currentLevel.forceFieldBlocks);
  }
}
  ```

The updatePower function first calls the clearPower function, which sets the hasPower property of all the power objects in the level to false. The updatePower function then iterates through each power source, calling each source's sendPower instance method (defined on the parent PowerObject class).

```javascript
sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {

  let topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  let leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  let rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  let bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  //if object is a Power Source, send power in all four directions
  if (this.constructor.name === 'PowerSource') {
    this.type = "NESW";
  }

  //look through wires:
  for (let i = 0; i < wiring.length; i++) {
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

  //look through force field blocks:
  for (let i = 0; i < forceFieldBlocks.length; i++) {
    if (forceFieldBlocks[i].rowCol[0] === leftRowCol[0] && forceFieldBlocks[i].rowCol[1] === leftRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
    if (forceFieldBlocks[i].rowCol[0] === topRowCol[0] && forceFieldBlocks[i].rowCol[1] === topRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
    if (forceFieldBlocks[i].rowCol[0] === rightRowCol[0] && forceFieldBlocks[i].rowCol[1] === rightRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
    if (forceFieldBlocks[i].rowCol[0] === bottomRowCol[0] && forceFieldBlocks[i].rowCol[1] === bottomRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
  }

  //look through button blocks:
  for (let i = 0; i < buttonBlocks.length; i++) {
    if (buttonBlocks[i].rowCol[0] === leftRowCol[0] && buttonBlocks[i].rowCol[1] === leftRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
    if (buttonBlocks[i].rowCol[0] === topRowCol[0] && buttonBlocks[i].rowCol[1] === topRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
    if (buttonBlocks[i].rowCol[0] === rightRowCol[0] && buttonBlocks[i].rowCol[1] === rightRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
    if (buttonBlocks[i].rowCol[0] === bottomRowCol[0] && buttonBlocks[i].rowCol[1] === bottomRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
  }
}
  ```

  The sendPower function checks to see which directions power should be sent. If the object is a power source, power is sent in all four directions. If the object is a wire, power is sent only in the direction(s) where the wire is pointing (and not in the same direction where the power has come from).

  After determining which directions power should be sent, the sendPower function then checks to see if there are neighboring objects in those directions that can also send power. If so, the sendPower function is called on those objects. The base case is reached when an object is reached with no neighboring objects to transfer the power to.

  Button blocks and force field blocks do not send power, but should receive power if a wire is connected to them. Therefore, the sendPower function also checks the location of each button block and force field block and sets its hasPower property to true if it's connected.

  Using this method, power is delivered from each power source to all the objects connected to that source.
