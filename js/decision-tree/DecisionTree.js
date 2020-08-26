import { Decision } from "./Decision";

var DecisionTree = function(rootNode){
  if (!(rootNode instanceof Decision)){
    throw new Error("Root node must be an instance of Ego.Decision");
  }

  this._rootNode = rootNode;
}

DecisionTree.prototype.makeDecision = function(knowledge){

  var currentNode = this._rootNode;

  while(currentNode instanceof Decision){
    currentNode = currentNode.make(knowledge);
  }

  return currentNode;
}

export { DecisionTree };
