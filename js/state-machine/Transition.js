import { Decision } from "../decision-tree/Decision";

var Transition = function(source, target, infoName, infoType, decisionMethod){
  Decision.call(this, infoName, infoType, decisionMethod);

  this.setYesNode(target);
  this.setNoNode(source);
}
Transition.prototype = Object.create(Decision.prototype);

Transition.prototype.clone = function(overrideSource, overrideTarget, overrideKnowledge, idsObj){
  var source = null;
  var target = null;

  if (overrideSource){
    source = overrideSource;
  }else{
    source = this.getSourceNode().clone(overrideKnowledge || null, idsObj || null);
  }

  if (overrideTarget){
    target = overrideTarget;
  }else{
    target = this.getTargetNode().clone(overrideKnowledge || null, idsObj || null);
  }

  return new Transition(source, target, this._informationName, this._informationType, this._decisionMethod.clone());
}

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
