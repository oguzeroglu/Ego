import { State } from "./State";

var StateMachine = function(name, knowledge){
  State.call(this, name);

  this._knowledge = knowledge;
  this._statesByID = {};
  this._transitionsByStateID = {};

  this._stateChangedCallbackFunction = null;

  this._entryState = null;

  this._currentState = null;
}

StateMachine.prototype = Object.create(State.prototype);

StateMachine.prototype.addState = function(state){
  if (state.setParent(this)){
    this._statesByID[state.getID()] = state;
    this._transitionsByStateID[state.getID()] = [];

    return true;
  }

  return false;
}

StateMachine.prototype.removeState = function(state){
  if (state.getParent() != this){
    return false;
  }

  if (this._entryState && this._entryState.getID() == state.getID()){
    this._entryState = null;
  }

  state.removeParent();
  delete this._statesByID[state.getID()];
  delete this._transitionsByStateID[state.getID()];
  return true;
}

StateMachine.prototype.addTransition = function(transition){
  var sourceNode = transition.getSourceNode();

  if (sourceNode.getParent() == this){

    var existingTransitions = this._transitionsByStateID[sourceNode.getID()];

    for (var i = 0; i < existingTransitions.length; i ++){
      var existingTransition = existingTransitions[i];

      if (existingTransition.getTargetNode() == transition.getTargetNode()){
        return false;
      }
    }

    existingTransitions.push(transition);
    return true;
  }

  return false;
}

StateMachine.prototype.removeTransition = function(transition){
  var sourceNode = transition.getSourceNode();

  if (sourceNode.getParent() == this){
    var transitions = this._transitionsByStateID[sourceNode.getID()];

    var index = null;
    for (var i = 0; i < transitions.length; i ++){
      if (transitions[i].getTargetNode() == transition.getTargetNode()){
        index = i;
        break;
      }
    }

    if (index == null){
      return false;
    }

    transitions.splice(index, 1);
    return true;
  }

  return false;
}

StateMachine.prototype.setEntryState = function(state){
  if (!this._statesByID[state.getID()]){
    return false;
  }

  this._entryState = state;
  return true;
}

StateMachine.prototype.onStateChanged = function(callbackFunction){
  this._stateChangedCallbackFunction = callbackFunction;
}

StateMachine.prototype.reset = function(){
  this._currentState = null;
}

StateMachine.prototype.onCrossHierarchyTransition = function(node){

}

StateMachine.prototype._onNewState = function(newState){
  if (this._stateChangedCallbackFunction){
    this._stateChangedCallbackFunction(newState);
  }
}

StateMachine.prototype._getNextState = function(currentState){

  if (currentState == null){
    return null;
  }

  var transitions = this._transitionsByStateID[currentState.getID()];

  var knowledge = this._knowledge;

  for (var i = 0; i < transitions.length; i ++){
    var transition = transitions[i];

    if (transition.isPossible(knowledge)){
      return transition;
    }
  }

  return null;
}

StateMachine.prototype._changeState = function(newState){
  this._currentState = newState;

  this._onNewState(newState);
  if (newState instanceof StateMachine){
    newState.update();
  }
}

StateMachine.prototype.update = function(){
  if (!this._entryState){
    throw new Error("Entry state not set. Cannot update the StateMachine.");
  }

  if (!this._currentState){
    this._changeState(this._entryState);
  }

  var transition = this._getNextState(this._currentState);

  while (transition){
    var targetNode = transition.getTargetNode();
    var targetParent = targetNode.getParent();

    if (targetParent == this){
      this._changeState(transition.getTargetNode());
    }else{
      targetParent.onCrossHierarchyTransition(targetNode);
      this.reset();
    }

    transition = this._getNextState(this._currentState);
  }
}

Object.defineProperty(StateMachine.prototype, 'constructor', { value: StateMachine,  enumerable: false, writable: true });
export { StateMachine };
