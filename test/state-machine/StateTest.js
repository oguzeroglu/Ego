var expect = require('expect.js');
var Ego = require("../../build/Ego");

describe("State", function(){

  it("should initialize", function(){

    var state = new Ego.State("idle");

    expect(state._name).to.eql("idle");
    expect(state._id).to.have.length(36);
    expect(state._parent).to.eql(null);
  });
});
