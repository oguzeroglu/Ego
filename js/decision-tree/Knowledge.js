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
  return this._booleanMap[name] || null;
}

Knowledge.prototype.getNumericalInformation = function(name){
  return this._numericalMap[name] || null;
}

Knowledge.prototype.getVectorInformation = function(name){
  return this._vectorMap[name] || null;
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
