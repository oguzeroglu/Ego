var expect = require('expect.js');
var Ego = require("../../../build/Ego");

describe("Range", function(){

  it("should initialize", function(){

    var range = new Ego.Range(20, 30);

    expect(range._isUpperBoundInclusive).to.eql(true);
    expect(range._isLowerBoundInclusive).to.eql(true);
    expect(range._upperBound).to.eql(30);
    expect(range._lowerBound).to.eql(20);
  });

  it("should make lower bound exclusive", function(){

    var range = new Ego.Range(20, 30);

    range.makeLowerBoundExclusive();

    expect(range._isLowerBoundInclusive).to.eql(false);
  });

  it("should make lower bound inclusive", function(){

    var range = new Ego.Range(20, 30);

    range.makeLowerBoundExclusive();
    range.makeLowerBoundInclusive();

    expect(range._isLowerBoundInclusive).to.eql(true);
  });

  it("should make upper bound exclusive", function(){

    var range = new Ego.Range(20, 30);

    range.makeUpperBoundExclusive();

    expect(range._isUpperBoundInclusive).to.eql(false);
  });

  it("should make upper bound inclusive", function(){

    var range = new Ego.Range(20, 30);

    range.makeUpperBoundExclusive();
    range.makeUpperBoundInclusive();

    expect(range._isUpperBoundInclusive).to.eql(true);
  });

  it("should update lower bound", function(){

    var range = new Ego.Range(20, 30);

    range.updateLowerBound(-100);

    expect(range._lowerBound).to.eql(-100);
  });

  it("should update upper bound", function(){

    var range = new Ego.Range(20, 30);

    range.updateUpperBound(300);

    expect(range._upperBound).to.eql(300);
  });

  it("should test number", function(){

    var range = new Ego.Range(20, 30);

    expect(range.testNumber(10)).to.eql(false);
    expect(range.testNumber(25)).to.eql(true);
    expect(range.testNumber(20)).to.eql(true);
    expect(range.testNumber(30)).to.eql(true);
    expect(range.testNumber(-10)).to.eql(false);
    expect(range.testNumber(40)).to.eql(false);

    range.makeLowerBoundExclusive();
    expect(range.testNumber(20)).to.eql(false);

    range.makeUpperBoundExclusive();
    expect(range.testNumber(30)).to.eql(false);

    range.updateLowerBound(-100);
    range.updateUpperBound(300);

    expect(range.testNumber(200)).to.eql(true);
    expect(range.testNumber(-85)).to.eql(true);
  });

  it("should clone", function(){

    var range1 = new Ego.Range(100, 300);
    var range2 = new Ego.Range(-100, 500);
    var range3 = new Ego.Range(200, 3000);
    var range4 = new Ego.Range(-12.5, 13.5);

    range1.makeLowerBoundExclusive();
    range1.makeUpperBoundExclusive();

    range2.makeLowerBoundExclusive();
    range2.makeUpperBoundInclusive();

    range3.makeLowerBoundInclusive();
    range3.makeUpperBoundExclusive();

    range4.makeLowerBoundInclusive();
    range4.makeUpperBoundInclusive();

    var range1Clone = range1.clone();
    var range2Clone = range2.clone();
    var range3Clone = range3.clone();
    var range4Clone = range4.clone();

    expect(range1).to.eql(range1Clone);
    expect(range1 === range1Clone).to.eql(false);

    expect(range2).to.eql(range2Clone);
    expect(range2 === range2Clone).to.eql(false);

    expect(range3).to.eql(range3Clone);
    expect(range3 === range3Clone).to.eql(false);

    expect(range4).to.eql(range4Clone);
    expect(range4 === range4Clone).to.eql(false);
  });
});
