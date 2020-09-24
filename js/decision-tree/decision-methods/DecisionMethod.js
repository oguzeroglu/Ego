var DecisionMethod = function(parameter){
  this._parameter = parameter;
}

DecisionMethod.prototype.updateParameter = function(parameter){
  this._parameter = parameter;
}

DecisionMethod.prototype.perform = function(val){
  return true;
}

DecisionMethod.prototype.clone = function(){
  var clonedParam = (this._parameter && this._parameter.clone)? this._parameter.clone(): this._parameter;

  return new this.constructor(clonedParam);
}

export { DecisionMethod };
