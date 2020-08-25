import { DecisionMethod } from "./DecisionMethod";

var IsTrue = function(){
  DecisionMethod.call(this, null);
}

IsTrue.prototype = Object.create(DecisionMethod.prototype);

IsTrue.prototype.perform = function(val){
  return val == true;
}

Object.defineProperty(IsTrue.prototype, 'constructor', { value: IsTrue,  enumerable: false, writable: true });
export { IsTrue };
