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

  it("should set no node", function(){

    var decisionMethod = new Ego.IsTrue();
    var decision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var decision2 = new Ego.Decision("canSee", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    decision.setNoNode(decision2);

    expect(decision._noNode).to.equal(decision2);
  });

  it("should make - boolean information", function(){

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

  it("should make - numerical information", function(){

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

  it("should make - vector information", function(){

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
});
