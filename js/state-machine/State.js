import uuidv4 from "../util/UUIDV4";

var State = function(name){
  this._name = name;
  this._id = uuidv4();

  this._parent = null;
}

export { State };
