import { State } from "./State";

var StateMachine = function(name, knowledge){
  State.call(this, name);

  this._knowledge = knowledge;
  this._statesByID = {};
  this._transitionsByStateID = {};
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

Object.defineProperty(StateMachine.prototype, 'constructor', { value: StateMachine,  enumerable: false, writable: true });
export { StateMachine };
