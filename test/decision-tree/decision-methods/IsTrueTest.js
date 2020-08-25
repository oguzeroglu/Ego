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
});
