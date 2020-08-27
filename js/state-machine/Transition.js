import { Decision } from "../decision-tree/Decision";

var Transition = function(source, target, infoName, infoType, decisionMethod){
  Decision.call(this, infoName, infoType, decisionMethod);

  this.setYesNode(target);
  this.setNoNode(source);
}
Transition.prototype = Object.create(Decision.prototype);

Transition.prototype.isPossible = function(knowledge){
  var decisionResult = this.make(knowledge);

  if (decisionResult == this._yesNode){
    return true;
  }

  return false;
}

Transition.prototype.getSourceNode = function(){
  return this.getNoNode();
}

Transition.prototype.getTargetNode = function(){
  return this.getYesNode();
}

Object.defineProperty(Transition.prototype, 'constructor', { value: Transition,  enumerable: false, writable: true });
export { Transition };
