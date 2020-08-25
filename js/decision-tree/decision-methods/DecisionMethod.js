var DecisionMethod = function(parameter){
  this._parameter = parameter;
}

DecisionMethod.prototype.updateParameter = function(parameter){
  this._parameter = parameter;
}

DecisionMethod.prototype.perform = function(val){
  return true;
}

export { DecisionMethod };
