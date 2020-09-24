var expect = require('expect.js');
var Ego = require("../../../build/Ego");

describe("DecisionMethod", function(){

  it("should initialize", function(){

    var decisionMethod = new Ego.DecisionMethod(100);

    expect(decisionMethod._parameter).to.eql(100);
  });

  it("should update parameter", function(){

    var decisionMethod = new Ego.DecisionMethod(100);

    decisionMethod.updateParameter(200);

    expect(decisionMethod._parameter).to.eql(200);
  });

  it("should perform", function(){

    var decisionMethod = new Ego.DecisionMethod(100);

    expect(decisionMethod.perform()).to.eql(true);
  });

  it("should clone", function(){

    var decisionMethod = new Ego.DecisionMethod(300);
    var cloned = decisionMethod.clone();

    expect(decisionMethod).to.eql(cloned);
    expect(decisionMethod === cloned).to.eql(false);

    var called = false;
    decisionMethod = new Ego.DecisionMethod({clone: function(){
      called = true;
      return this;
    }});

    cloned = decisionMethod.clone();

    expect(decisionMethod).to.eql(cloned);
    expect(decisionMethod === cloned).to.eql(false);
    expect(called).to.eql(true);
  });
});
