var expect = require('expect.js');
var Ego = require("../../build/Ego");

describe("Decision", function(){

  it("should export information types", function(){

    var informationTypes = Ego.InformationTypes;

    expect(informationTypes.TYPE_BOOLEAN).to.eql("TYPE_BOOLEAN");
    expect(informationTypes.TYPE_NUMERICAL).to.eql("TYPE_NUMERICAL");
    expect(informationTypes.TYPE_VECTOR).to.eql("TYPE_VECTOR");
  });

  it("should initialize", function(){

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    expect(decision._informationName).to.eql("isStuffHappening");
    expect(decision._informationType).to.eql(Ego.InformationTypes.TYPE_BOOLEAN);
    expect(decision._decisionMethod).to.equal(decisionMethod);

    expect(decision._yesNode).to.eql(null);
    expect(decision._noNode).to.eql(null);
  });

  it("should set yes node", function(){

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var decision2 = new Ego.Decision("canSee", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setYesNode(decision2);

    expect(decision._yesNode).to.equal(decision2);
  });

  it("should get yes node", function(){

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var decision2 = new Ego.Decision("canSee", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setYesNode(decision2);

    expect(decision.getYesNode()).to.equal(decision2);
  });

  it("should set no node", function(){

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var decision2 = new Ego.Decision("canSee", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setNoNode(decision2);

    expect(decision._noNode).to.equal(decision2);
  });

  it("should get no node", function(){

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var decision2 = new Ego.Decision("canSee", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setNoNode(decision2);

    expect(decision.getNoNode()).to.equal(decision2);
  });

  it("should make given boolean information", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setYesNode("yes");
    decision.setNoNode("no");

    expect(decision.make(knowledge)).to.eql("yes");

    knowledge.updateBooleanInformation("isStuffHappening", false);

    expect(decision.make(knowledge)).to.eql("no");
  });

  it("should make given numerical information", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addNumericalInformation("health", 70);

    var range = new Ego.Range(0, 30);
    var decisionMethod = new Ego.IsInRange(range);
    var decision = new Ego.Decision("health", Ego.InformationTypes.TYPE_NUMERICAL, decisionMethod);

    decision.setYesNode("yes");
    decision.setNoNode("no");

    expect(decision.make(knowledge)).to.eql("no");

    knowledge.updateNumericalInformation("health", 15);

    expect(decision.make(knowledge)).to.eql("yes");
  });

  it("should make given vector information", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addVectorInformation("distance", 100, 100, 100);

    var range = new Ego.Range(0, 100);
    var decisionMethod = new Ego.IsInRange(range);
    var decision = new Ego.Decision("distance", Ego.InformationTypes.TYPE_VECTOR, decisionMethod);

    decision.setYesNode("yes");
    decision.setNoNode("no");

    expect(decision.make(knowledge)).to.eql("no");

    range.updateUpperBound(300);

    expect(decision.make(knowledge)).to.eql("yes");
  });

  it("should throw an exception if information type unknown", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.UNKNOWN_INFORMATION, decisionMethod);

    decision.setYesNode("yes");
    decision.setNoNode("no");

    var catchedErr = null;
    try {
      decision.make(knowledge);
    }catch (err){
      catchedErr = err;
    }

    expect(catchedErr).not.to.eql(null);
    expect(catchedErr.message).to.eql("No such information type.");
  });

  it("should throw an exception if information non existent", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("stuff", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setYesNode("yes");
    decision.setNoNode("no");

    var catchedErr = null;
    try {
      decision.make(knowledge);
    }catch (err){
      catchedErr = err;
    }

    expect(catchedErr).not.to.eql(null);
    expect(catchedErr.message).to.eql("No such information in knowledge: stuff")
  });

  it("should clone", function(){

    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

    var cloned = decision.clone();

    expect(decision).to.eql(cloned);
    expect(decision === cloned).to.eql(false);
    expect(decision._decisionMethod).to.eql(cloned._decisionMethod);
    expect(decision._decisionMethod === cloned._decisionMethod).to.eql(false);

    var decision2 = new Ego.Decision("age", Ego.InformationTypes.TYPE_NUMERICAL, new Ego.IsInRange(new Ego.Range(70, Infinity)));
    var decision3 = new Ego.Decision("areYouOk", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

    decision.setYesNode(decision2);
    decision.setNoNode(decision3);

    decision2.setYesNode("You're old.");
    decision2.setNoNode("You're not old.");

    decision3.setYesNode("You're ok.");
    decision3.setNoNode("You're not ok.");

    cloned = decision.clone();
    expect(decision).to.eql(cloned);
    expect(decision === cloned).to.eql(false);
  });
});
