import { State } from "./State";

var StateMachine = function(name, knowledge){
  State.call(this, name);

  this._knowledge = knowledge;
  this._statesByID = {};
  this._transitionsByStateID = {};

  this._entryState = null;
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

Object.defineProperty(StateMachine.prototype, 'constructor', { value: StateMachine,  enumerable: false, writable: true });
export { StateMachine };
