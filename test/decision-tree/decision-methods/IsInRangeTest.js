var expect = require('expect.js');
var Ego = require("../../../build/Ego");

describe("IsInRange", function(){

  it("should initialize", function(){

    var range = new Ego.Range(10, 30);

    var isInRange = new Ego.IsInRange(range);

    expect(isInRange._parameter).to.equal(range);
  });

  it("should perform for numbers", function(){

    var range = new Ego.Range(10, 30);

    var isInRange = new Ego.IsInRange(range);

    expect(isInRange.perform(25)).to.equal(true);
    expect(isInRange.perform(45)).to.equal(false);
    expect(isInRange.perform(-10)).to.equal(false);
  });

  it("should perform for vectors", function(){

    var range = new Ego.Range(10, 30);

    var vec1 = {isVector: true, length: 25};
    var vec2 = {isVector: true, length: 45};
    var vec3 = {isVector: true, length: -10};

    var isInRange = new Ego.IsInRange(range);

    expect(isInRange.perform(vec1)).to.equal(true);
    expect(isInRange.perform(vec2)).to.equal(false);
    expect(isInRange.perform(vec3)).to.equal(false);
  });

  it("should clone", function(){

    var range = new Ego.Range(10, 30);
    var isInRange = new Ego.IsInRange(range);
    var cloned = isInRange.clone();

    expect(cloned instanceof Ego.IsInRange).to.eql(true);
    expect(cloned._parameter).to.eql(range);
    expect(cloned._parameter === range).to.eql(false);
    expect(isInRange).to.eql(cloned);
    expect(isInRange === cloned).to.eql(false);
  });
});
