var Knowledge = function(){
  this._booleanMap = {};
  this._numericalMap = {};
  this._vectorMap = {};
}

Knowledge.prototype.addBooleanInformation = function(name, booleanValue){
  if (this._hasBooleanInformation(name)){
    return false;
  }

  this._booleanMap[name] = !!booleanValue;
  return true;
}

Knowledge.prototype.addNumericalInformation = function(name, numericalValue){
  if (this._hasNumericalInformation(name)){
    return false;
  }

  var float = parseFloat(numericalValue);

  if (isNaN(float)){
    return false;
  }

  this._numericalMap[name] = float;
  return true;
}

Knowledge.prototype.addVectorInformation = function(name, x, y, z){
  if (this._hasVectorInformation(name)){
    return false;
  }

  var parsedX = parseFloat(x);
  var parsedY = parseFloat(y);
  var parsedZ = parseFloat(z);

  if (isNaN(parsedX) || isNaN(parsedY) || isNaN(parsedZ)){
    return false;
  }

  var xSqr = parsedX * parsedX;
  var ySqr = parsedY * parsedY;
  var zSqr = parsedZ * parsedZ;

  this._vectorMap[name] = {x: parsedX, y: parsedY, z: parsedZ, length: Math.sqrt(xSqr + ySqr + zSqr)};
  return true;
}

Knowledge.prototype.getBooleanInformation = function(name){
  if (this._hasBooleanInformation(name)){
    return this._booleanMap[name];
  }

  return null;
}

Knowledge.prototype.getNumericalInformation = function(name){
  if (this._hasNumericalInformation(name)){
    return this._numericalMap[name];
  }

  return null;
}

Knowledge.prototype.getVectorInformation = function(name){
  if (this._hasVectorInformation(name)){
    return this._vectorMap[name];
  }

  return null;
}

Knowledge.prototype.updateBooleanInformation = function(name, booleanValue){
  if (!this._hasBooleanInformation(name)){
    return false;
  }

  this._booleanMap[name] = !!booleanValue;
  return true;
}

Knowledge.prototype.updateNumericalInformation = function(name, numericalValue){
  if (!this._hasNumericalInformation(name)){
    return false;
  }

  var float = parseFloat(numericalValue);

  if (isNaN(float)){
    return false;
  }

  this._numericalMap[name] = float;
  return true;
}

Knowledge.prototype.updateVectorInformation = function(name, x, y, z){
  if (!this._hasVectorInformation(name)){
    return false;
  }

  var parsedX = parseFloat(x);
  var parsedY = parseFloat(y);
  var parsedZ = parseFloat(z);

  if (isNaN(parsedX) || isNaN(parsedY) || isNaN(parsedZ)){
    return false;
  }

  var xSqr = parsedX * parsedX;
  var ySqr = parsedY * parsedY;
  var zSqr = parsedZ * parsedZ;

  var vect = this._vectorMap[name];

  vect.x = parsedX;
  vect.y = parsedY;
  vect.z = parsedZ;
  vect.length = Math.sqrt(xSqr + ySqr + zSqr);
  return true;
}

Knowledge.prototype._hasBooleanInformation = function(name){
  return !(typeof this._booleanMap[name] === "undefined");
}

Knowledge.prototype._hasNumericalInformation = function(name){
  return !(typeof this._numericalMap[name] === "undefined");
}

Knowledge.prototype._hasVectorInformation = function(name){
  return !(typeof this._vectorMap[name] === "undefined");
}

export { Knowledge };
