import { Decision } from "../decision-tree/Decision";

var Transition = function(from, to, infoName, infoType, decisionMethod){
  Decision.call(this, infoName, infoType, decisionMethod);

  this.setYesNode(to);
  this.setNoNode(from);
}
Transition.prototype = Object.create(Decision.prototype);

Transition.prototype.isPossible = function(knowledge){
  var decisionResult = this.make(knowledge);

  if (decisionResult == this._yesNode){
    return true;
  }

  return false;
}

Object.defineProperty(Transition.prototype, 'constructor', { value: Transition,  enumerable: false, writable: true });
export { Transition };
