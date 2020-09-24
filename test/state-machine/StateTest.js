var expect = require('expect.js');
var Ego = require("../../build/Ego");

describe("State", function(){

  it("should initialize", function(){

    var state = new Ego.State("idle");

    expect(state._name).to.eql("idle");
    expect(state._id).to.have.length(36);
    expect(state._parent).to.eql(null);
  });

  it("should set parent", function(){

    var state = new Ego.State("idle");
    var parent = new Ego.State("parent");

    expect(state.setParent(parent)).to.eql(true);
    expect(state._parent).to.eql(parent);

    var parent2 = new Ego.State("parent2");

    expect(state.setParent(parent2)).to.eql(false);
    expect(state._parent).to.eql(parent);
  });

  it("should get parent", function(){

    var state = new Ego.State("idle");
    var parent = new Ego.State("parent");

    state.setParent(parent);

    expect(state.getParent()).to.eql(parent);
  });

  it("should removeParent", function(){

    var state = new Ego.State("idle");
    var parent = new Ego.State("parent");

    state.setParent(parent);
    state.removeParent();

    expect(state.getParent()).to.eql(null);
  });

  it("should get ID", function(){

    var state = new Ego.State("idle");

    expect(state.getID()).to.eql(state._id);
    expect(state.getID()).to.have.length(36);
  });

  it("should get name", function(){

    var state = new Ego.State("testState");

    expect(state.getName()).to.eql("testState");
  });

  it("should clone", function(){

    var state = new Ego.State("state1");
    var cloned = state.clone();

    expect(state.getName()).to.eql(cloned.getName());
    expect(state === cloned).to.eql(false);
  })
});
