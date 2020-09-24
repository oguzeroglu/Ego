var expect = require('expect.js');
var Ego = require("../../../build/Ego");

describe("IsFalse", function(){

  it("should initialize", function(){

    var isFalse = new Ego.IsFalse();

    expect(isFalse._parameter).to.eql(null);
  });

  it("should perform", function(){

    var isFalse = new Ego.IsFalse();

    expect(isFalse.perform(false)).to.eql(true);
    expect(isFalse.perform(true)).to.eql(false);
    expect(isFalse.perform(123)).to.eql(false);
    expect(isFalse.perform({})).to.eql(false);
  });

  it("should clone", function(){

    var isFalse = new Ego.IsFalse();
    var cloned = isFalse.clone();

    expect(cloned instanceof Ego.IsFalse).to.eql(true);
    expect(isFalse).to.eql(cloned);
    expect(isFalse === cloned).to.eql(false);
  });
});
