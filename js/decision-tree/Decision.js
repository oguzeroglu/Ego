var InformationTypes = {
  TYPE_BOOLEAN: "TYPE_BOOLEAN",
  TYPE_NUMERICAL: "TYPE_NUMERICAL",
  TYPE_VECTOR: "TYPE_VECTOR"
};

var Decision = function(informationName, informationType, decisionMethod){
  this._informationName = informationName;
  this._informationType = informationType;
  this._decisionMethod = decisionMethod;

  this._yesNode = null;
  this._noNode = null;
}

Decision.prototype.setYesNode = function(node){
  this._yesNode = node;
}

Decision.prototype.setNoNode = function(node){
  this._noNode = node;
}

Decision.prototype.make = function(knowledge){
  var informationType = this._informationType;
  var informationName = this._informationName;

  var information;
  if (informationType == InformationTypes.TYPE_BOOLEAN){
    information = knowledge.getBooleanInformation(informationName);
  }else if (informationType == InformationTypes.TYPE_NUMERICAL){
    information = knowledge.getNumericalInformation(informationName);
  }else{
    information = knowledge.getVectorInformation(informationName);
  }

  if (this._decisionMethod.perform(information)){
    return this._yesNode;
  }

  return this._noNode;
}

export { Decision };
export { InformationTypes };
