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

Decision.prototype.getYesNode = function(){
  return this._yesNode;
}

Decision.prototype.setNoNode = function(node){
  this._noNode = node;
}

Decision.prototype.getNoNode = function(){
  return this._noNode;
}

Decision.prototype.make = function(knowledge){
  var informationType = this._informationType;
  var informationName = this._informationName;

  var information = null;
  if (informationType == InformationTypes.TYPE_BOOLEAN){
    information = knowledge.getBooleanInformation(informationName);
  }else if (informationType == InformationTypes.TYPE_NUMERICAL){
    information = knowledge.getNumericalInformation(informationName);
  }else if (informationType == InformationTypes.TYPE_VECTOR){
    information = knowledge.getVectorInformation(informationName);
  }else{
    throw new Error("No such information type.");
  }

  if (information == null){
    throw new Error("No such information in knowledge: " + informationName);
  }

  if (this._decisionMethod.perform(information)){
    return this._yesNode;
  }

  return this._noNode;
}

export { Decision };
export { InformationTypes };
