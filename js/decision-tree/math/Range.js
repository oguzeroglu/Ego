var Range = function(lowerBound, upperBound){
  this._isLowerBoundInclusive = true;
  this._isUpperBoundInclusive = true;

  this._lowerBound = lowerBound;
  this._upperBound = upperBound;
}

Range.prototype.clone = function(){
  var cloned = new Range(this._lowerBound, this._upperBound);

  if (this._isLowerBoundInclusive){
    cloned.makeLowerBoundInclusive();
  }else{
    cloned.makeLowerBoundExclusive();
  }

  if (this._isUpperBoundInclusive){
    cloned.makeUpperBoundInclusive();
  }else{
    cloned.makeUpperBoundExclusive();
  }

  return cloned;
}

Range.prototype.makeLowerBoundInclusive = function(){
  this._isLowerBoundInclusive = true;
}

Range.prototype.makeLowerBoundExclusive = function(){
  this._isLowerBoundInclusive = false;
}

Range.prototype.makeUpperBoundInclusive = function(){
  this._isUpperBoundInclusive = true;
}

Range.prototype.makeUpperBoundExclusive = function(){
  this._isUpperBoundInclusive = false;
}

Range.prototype.updateLowerBound = function(lowerBound){
  this._lowerBound = lowerBound;
}

Range.prototype.updateUpperBound = function(upperBound){
  this._upperBound = upperBound;
}

Range.prototype.testNumber = function(number){
  var lower = this._lowerBound;
  var upper = this._upperBound;

  if (this._isUpperBoundInclusive){
    if (number > upper){
      return false;
    }
  }else{
    if (number >= upper){
      return false;
    }
  }

  if (this._isLowerBoundInclusive){
    if (number < lower){
      return false;
    }
  }else{
    if (number <= lower){
      return false;
    }
  }

  return true;
}

export { Range };
