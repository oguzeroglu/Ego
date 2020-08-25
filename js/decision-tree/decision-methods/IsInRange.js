import { DecisionMethod } from "./DecisionMethod";

var IsInRange = function(range){
  DecisionMethod.call(this, range);
}

IsInRange.prototype = Object.create(DecisionMethod.prototype);

IsInRange.prototype.perform = function(val){
  var range = this._parameter;

  if (val.isVector){
    return range.testNumber(val.length);
  }

  return range.testNumber(val);
}

Object.defineProperty(IsInRange.prototype, 'constructor', { value: IsInRange,  enumerable: false, writable: true });
export { IsInRange };
