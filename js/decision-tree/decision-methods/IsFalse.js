import { DecisionMethod } from "./DecisionMethod";

var IsFalse = function(){
  DecisionMethod.call(this, null);
}

IsFalse.prototype = Object.create(DecisionMethod.prototype);

IsFalse.prototype.perform = function(val){
  return val == false;
}

Object.defineProperty(IsFalse.prototype, 'constructor', { value: IsFalse,  enumerable: false, writable: true });
export { IsFalse };
