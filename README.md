# Ego

Ego is a lightweight decision making library for game AI. It provides decision trees and state machines (hierarchical and finite).

Ego is originally designed to be used by the [ROYGBIV engine](https://github.com/oguzeroglu/ROYGBIV), however can easily be used outside of ROYGBIV as well.

# Getting Started

## Index

 - [Including It](#including-it)
   - [Client-side Javascript](#client-side-javascript)
   - [NodeJS](#nodejs)    
 - [Using Decision trees](#using-decision-trees)
   - [Creating the Knowledge](#creating-the-knowledge)
   - [Creating Decisions](#creating-decisions)
   - [Connecting the Decisions](#connecting-the-decisions)
   - [Creating the Decision Tree](#creating-the-decision-tree)
   -  [Putting It All Together](#putting-it-all-together)
 - [Using State Machines](#using-state-machines)
   - [Creating the Knowledge](#creating-the-knowledge-1)  
   - [Creating States](#creating-states)
   - [Creating Transitions](#creating-transitions)
   - [Creating the State Machine](#creating-the-state-machine)
   - [Putting It All Together](#putting-it-all-together-1)
   - [Note About Hierarchical State Machines](#note-about-hierarchical-state-machines)

## Including It

### Client-side Javascript

Download the latest release from [releases page](https://github.com/oguzeroglu/Ego/releases). Then include the `ego.min.js` file into your project via `<script>` tag:

`<script src="PATH_TO_ego.min.js"></script>`

### NodeJS

Install it via npm:

`npm i @oguz.eroglu/ego-js`

Then include the module into your project via `require`:

```javascript
var Ego = require("@oguz.eroglu/ego-js");
```

## Using Decision Trees

To get started with decision trees, let's create this decision tree with Ego:

![](/example-images/decision-tree.png?raw=true)  

### Creating the Knowledge

We'll start by creating the `Knowledge`. Knowledge class can contain boolean, numerical (integer/float) and vector (with x, y, z and length properties) information. For this decision tree, we need these informations to put into our knowledge:

* isEnemyVisible (of type boolean)
* isEnemyAudible (of type boolean)
* isEnemyOnFlank (of type boolean)
* distanceToEnemy (of type 3D vector)

```javascript
// Instantiate a Knowledge
var knowledge = new Ego.Knowledge();

// add isEnemyVisible information
knowledge.addBooleanInformation("isEnemyVisible", false);

// add isEnemyAudible information
knowledge.addBooleanInformation("isEnemyAudible", false);

// add isEnemyOnFlank information
knowledge.addBooleanInformation("isEnemyOnFlank", false);

// add distanceToEnemy information. We'll assume the enemy is 100 units far away on the axis x.
knowledge.addVectorInformation("distanceToEnemy", 100, 0, 0);
```

### Creating Decisions

We'll continue by creating the decisions. Ego provides these three decision methods:

* `IsTrue` to check if given boolean information is true.
* `IsFalse` to check if given boolean information is false.
* `IsInRange` to check if given numerical information or the length of given vector information is within given range.

We can reuse the decision methods across several decisions. For this decision tree, we need `IsTrue` and `IsInRange` decision methods. Let's create them:

```javascript
// create the IsTrue decision method
var isTrue = new Ego.IsTrue();

// create the IsInRange decision method. We'll start by creating a Range object.
// The first parameter is the lower bound and the second is the upper bound.
// Note that Ego Range instances are inclusive by default.
// Since we'd like to check if given distance is less than 10 units
// we'll set the lower bound to -Infinity and the upper bound to 10.

// [-Infinity, 10[
var range = new Ego.Range(-Infinity, 10);
range.makeUpperBoundExclusive();

// Create the decision method
var isInRange = new Ego.IsInRange(range);
```

```javascript

// the first parameter is the information name inside the Knowledge
// the second is the type of the information
// the third is the decision method

var isEnemyVisible = new Ego.Decision("isEnemyVisible", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var isEnemyAudible = new Ego.Decision("isEnemyAudible", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var isEnemyOnFlank = new Ego.Decision("isEnemyOnFlank", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var distanceLessThan10Units = new Ego.Decision("distanceToEnemy", Ego.InformationTypes.TYPE_VECTOR, isInRange);
```

### Connecting the Decisions
We'll then connect the decisions that we've created. If we connect a decision with another decision, Ego will continue to perform the decision tests. If we connect it with any other type (such as a String or an Object), Ego will act as if the decision is done and return the connected object:

```javascript
// If enemy is visible, we'll test if enemy is close.
isEnemyVisible.setYesNode(distanceLessThan10Units);

// If enemy is not visible, we'll test if enemy is audible.
isEnemyVisible.setNoNode(isEnemyAudible);

// If enemy is audible, we'll creep. We can simply return a string in this case.
isEnemyAudible.setYesNode("creep");

// If enemy is not audible, we'll do nothing. We can simply return a string in this case.
isEnemyAudible.setNoNode("doNothing");

// If enemy is less than 10 units away, we'll attack
distanceLessThan10Units.setYesNode("attack");

// We'll perform isEnemyOnFlank test otherwise
distanceLessThan10Units.setNoNode(isEnemyOnFlank);

// If enemy is on flank, we'll move
isEnemyOnFlank.setYesNode("move");

// We'll attack otherwise
isEnemyOnFlank.setNoNode("attack");
```

### Creating the Decision Tree
Now that we're all set, we can create our Decision Tree. We need to specifiy the root decision when creating the decision tree. In this case, the root decision is `isEnemyVisible`:

```javascript
var decisionTree = new Ego.DecisionTree(isEnemyVisible);
```

We can now make decisions. Since given our knowledge the enemy is not visible and also not audible, the initial decision result would be to do nothing.

```javascript
decisionTree.makeDecision(knowledge); // returns "doNothing"
```

We can always update our knowledge with new information and make new decisions. Let's update `isEnemyVisible` information. Since now enemy is visible and also the length of the distance vector is less than 10 units, we'll now chose to attack:

```javascript

// update isEnemyVisible information
knowledge.updateBooleanInformation("isEnemyVisible", true);

decisionTree.makeDecision(knowledge); // returns "attack"
```

In the same way, if we put the enemy 500 units away on the axis X (the length would be than more than 10 units) and the enemy is now on flank, we'll chose to move instead.

```javascript

// update knowledge
knowledge.updateVectorInformation("distanceToEnemy", 500, 0, 0);
knowledge.updateBooleanInformation("isEnemyOnFlank", true);

decisionTree.makeDecision(knowledge); // return "move"
```

### Putting It All Together

```javascript
var Ego = require("@oguz.eroglu/ego-js");

var knowledge = new Ego.Knowledge();

knowledge.addBooleanInformation("isEnemyVisible", false);
knowledge.addBooleanInformation("isEnemyAudible", false);
knowledge.addBooleanInformation("isEnemyOnFlank", false);
knowledge.addVectorInformation("distanceToEnemy", 100, 0, 0);

var isTrue = new Ego.IsTrue();

var range = new Ego.Range(-Infinity, 10);
range.makeUpperBoundExclusive();

var isInRange = new Ego.IsInRange(range);

var isEnemyVisible = new Ego.Decision("isEnemyVisible", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var isEnemyAudible = new Ego.Decision("isEnemyAudible", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var isEnemyOnFlank = new Ego.Decision("isEnemyOnFlank", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var distanceLessThan10Units = new Ego.Decision("distanceToEnemy", Ego.InformationTypes.TYPE_VECTOR, isInRange);

isEnemyVisible.setYesNode(distanceLessThan10Units);
isEnemyVisible.setNoNode(isEnemyAudible);

isEnemyAudible.setYesNode("creep");
isEnemyAudible.setNoNode("doNothing");

distanceLessThan10Units.setYesNode("attack");
distanceLessThan10Units.setNoNode(isEnemyOnFlank);

isEnemyOnFlank.setYesNode("move");
isEnemyOnFlank.setNoNode("attack");

var decisionTree = new Ego.DecisionTree(isEnemyVisible);

knowledge.updateBooleanInformation("isEnemyVisible", true);
knowledge.updateVectorInformation("distanceToEnemy", 500, 0, 0);
knowledge.updateBooleanInformation("isEnemyOnFlank", true);

console.log(decisionTree.makeDecision(knowledge));
```

## Using State Machines

To get started with state machines, let's create this state machine with Ego:

![](/example-images/simple-state-machine.png?raw=true) 

### Creating the Knowledge

Just like Decision Trees, State Machines also use a Knowledge in order to decide if it's possible to switch from one state to another. For this example we'll need following informations to store in our Knowledge:

* isWeakEnemySeen (of type boolean)
* isStrongEnemySeen (of type boolean)
* health (of type float)
* distanceToEnemy (of type Vector)

`isWeakEnemySeen` and `isStrongEnemySeen` boolean informations will be set to true when the player sees a weak or a strong enemy. We'll use `health` information to decide whether the player is losing the fight or not. `distanceToEnemy` will be used to decide if the player is successfully escaped from an enemy.

```javascript
// create the knowledge
var knowledge = new Ego.Knowledge();

// create isWeakEnemySeen information
knowledge.addBooleanInformation("isWeakEnemySeen", false);

// create isStrongEnemySeen information
knowledge.addBooleanInformation("isStrongEnemySeen", false);

// create health information. Initially we'll set this to 100.
knowledge.addNumericalInformation("health", 100);

// create distanceToEnemy information. Initially we'll assume the enemy is 500 units far away on the axis X.
knowledge.addVectorInformation("distanceToEnemy", 500, 0, 0);
```

### Creating States
We'll move on by creating the states. For this example we need 3 states: `OnGuard`, `Fight` and `RunAway`:

```javascript
// create OnGuard state
var onGuardState = new Ego.State("OnGuard");

// create Fight state
var fightState = new Ego.State("Fight");

// create RunAway state
var runAwayState = new Ego.State("RunAway");
```

### Creating Transitions
We then need to create Transitions. Transitions are a subclass of Decisions, so they work the same way. In addition to Decisions, we need to define the source state and the target state as well in order to create a Transition.

We'll first define the decision methods just like we did while working with Decision Trees. For this example we need these decision methods:

* `IsTrue` to check if strong or weak enemy is seen (`isStrongEnemySeen` and `isWeakEnemySeen` informations)
* `IsInRange` to check if the player is losing the fight (`health` information is less than 20)
* Another `IsInRange` to check if the player successfully escaped (The length of `distanceToEnemy` is greater than 100 units)

```javascript
// create IsTrue decision method
var isTrue = new Ego.IsTrue();

// create IsInRange decision method for the health information.

// define the range
var lessThan20Range = new Ego.Range(-Infinity, 20);
lessThan20Range.makeUpperBoundExclusive();

// create the Decision method
var lessThan20 = new Ego.IsInRange(lessThan20Range);

// create IsInRange decision method for the distanceToEnemy information

// define the range
var greaterThan100Range = new Ego.Range(100, Infinity);
greaterThan100Range.makeLowerBoundExclusive();

// create the Decision method
var greaterThan100 = new Ego.IsInRange(greaterThan100Range);
```

Now that we have our decision methods ready, we can create our Transitions. The first parameter is the source state, the second is the target state, the third is the information name that we use inside our Knowledge, the fourth is the type of the information (either `Ego.InformationTypes.TYPE_BOOLEAN` or `Ego.InformationTypes.TYPE_NUMERICAL` or `Ego.InformationTypes.TYPE_VECTOR`) and the fifth is the decision method.

```javascript
// Transition for: See weak enemy
var seeWeakEnemyTransition = new Ego.Transition(onGuardState, fightState, "isWeakEnemySeen", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);

// Transition for: See strong enemy
var seeStrongEnemyTransition = new Ego.Transition(onGuardState, runAwayState, "isStrongEnemySeen", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);

// Transition for: Losing fight
var losingFightTransition = new Ego.Transition(fightState, runAwayState, "health", Ego.InformationTypes.TYPE_NUMERICAL, lessThan20);

// Transition for: Escaped
var escapedTransition = new Ego.Transition(runAwayState, onGuardState, "distanceToEnemy", Ego.InformationTypes.TYPE_VECTOR, greaterThan100);
```

### Creating the State Machine
Now that we have our states and transitions ready, we can create our State Machine. While creating the State Machine, we need to pass a name as the first argument, and the knowledge as the second one:

```javascript
// create the state machine
var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

// add states
stateMachine.addState(onGuardState);
stateMachine.addState(runAwayState);
stateMachine.addState(fightState);

// add transitions
stateMachine.addTransition(seeWeakEnemyTransition);
stateMachine.addTransition(seeStrongEnemyTransition);
stateMachine.addTransition(losingFightTransition);
stateMachine.addTransition(escapedTransition);

// set the initial (entry) state
stateMachine.setEntryState(onGuardState);
```

Now that we have our state machine ready, we want to update it and listen for state changes. Note that state machines are updated recursively, that's why it's important not to create circular transitions to avoid infinite loops.

```javascript
// listen for state changes
stateMachine.onStateChanged(function(newState){
  console.log("New state is: " + newState.getName());
});

// update the state machine
stateMachine.update();
```

This will print out: `New state is: OnGuard`. Since none of our transition conditions are satisfied, we're stuck in the initial state. Now, let's update the knowledge to jump to other states:

```javascript
// the player has seen a weak enemy
knowledge.updateBooleanInformation("isWeakEnemySeen", true);

stateMachine.update();
```

Now that the player has seen a weak enemy, this will additionally print out: `New state is: Fight`. Let's lose the fight:

```javascript
knowledge.updateNumericalInformation("health", 10);
knowledge.updateVectorInformation("distanceToEnemy", 3, 0, 0);

stateMachine.update(); // prints out: New state is: RunAway
```

### Putting It All Together

```javascript
var knowledge = new Ego.Knowledge();

knowledge.addBooleanInformation("isWeakEnemySeen", false);
knowledge.addBooleanInformation("isStrongEnemySeen", false);
knowledge.addNumericalInformation("health", 100);
knowledge.addVectorInformation("distanceToEnemy", 500, 0, 0);

var onGuardState = new Ego.State("OnGuard");
var fightState = new Ego.State("Fight");
var runAwayState = new Ego.State("RunAway");
var isTrue = new Ego.IsTrue();

var lessThan20Range = new Ego.Range(-Infinity, 20);
lessThan20Range.makeUpperBoundExclusive();
var lessThan20 = new Ego.IsInRange(lessThan20Range);

var greaterThan100Range = new Ego.Range(100, Infinity);
greaterThan100Range.makeLowerBoundExclusive();
var greaterThan100 = new Ego.IsInRange(greaterThan100Range);

var seeWeakEnemyTransition = new Ego.Transition(onGuardState, fightState, "isWeakEnemySeen", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var seeStrongEnemyTransition = new Ego.Transition(onGuardState, runAwayState, "isStrongEnemySeen", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
var losingFightTransition = new Ego.Transition(fightState, runAwayState, "health", Ego.InformationTypes.TYPE_NUMERICAL, lessThan20);
var escapedTransition = new Ego.Transition(runAwayState, onGuardState, "distanceToEnemy", Ego.InformationTypes.TYPE_VECTOR, greaterThan100);

var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

stateMachine.addState(onGuardState);
stateMachine.addState(runAwayState);
stateMachine.addState(fightState);

stateMachine.addTransition(seeWeakEnemyTransition);
stateMachine.addTransition(seeStrongEnemyTransition);
stateMachine.addTransition(losingFightTransition);
stateMachine.addTransition(escapedTransition);

stateMachine.setEntryState(onGuardState);

stateMachine.onStateChanged(function(newState){
  console.log("New state is: " + newState.getName());
});

stateMachine.update();

knowledge.updateBooleanInformation("isWeakEnemySeen", true);

stateMachine.update();

knowledge.updateNumericalInformation("health", 10);
knowledge.updateVectorInformation("distanceToEnemy", 3, 0, 0);

stateMachine.update();
```

### Note About Hierarchical State Machines

Ego supports hierarchical state machines and cross hierarchy transitions. If a state machine is passed rather than a state to `StateMachine#addState` API, Ego automatically updates the child state machine if the current state of the parent state machine is the child state machine and the parent state machine is updated.

# License

Ego uses MIT license.
