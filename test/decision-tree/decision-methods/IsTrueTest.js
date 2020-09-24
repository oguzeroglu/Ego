var expect = require('expect.js');
var Ego = require("../../../build/Ego");

describe("IsTrue", function(){

  it("should initialize", function(){

    var isTrue = new Ego.IsTrue();

    expect(isTrue._parameter).to.eql(null);
  });

  it("should perform", function(){

    var isTrue = new Ego.IsTrue();

    expect(isTrue.perform(true)).to.eql(true);
    expect(isTrue.perform(false)).to.eql(false);
    expect(isTrue.perform(123)).to.eql(false);
    expect(isTrue.perform({})).to.eql(false);
  });

  it("should clone", function(){

    var isTrue = new Ego.IsTrue();
    var cloned = isTrue.clone();

    expect(cloned instanceof Ego.IsTrue).to.eql(true);
    expect(isTrue).to.eql(cloned);
    expect(isTrue === cloned).to.eql(false);
  });
});
