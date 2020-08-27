var expect = require('expect.js');
var Ego = require("../../build/Ego");

describe("Transition", function(){

  it("should initialize", function(){

    var state1 = new Ego.State("state1");
    var state2 = new Ego.State("state2");

    var decisionMethod = new Ego.IsTrue();

    var transition = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    expect(transition instanceof Ego.Decision).to.eql(true);
    expect(transition._informationName).to.eql("isStuffHappening");
    expect(transition._informationType).to.eql(Ego.InformationTypes.TYPE_BOOLEAN);
    expect(transition._decisionMethod).to.eql(decisionMethod);
    expect(transition._yesNode).to.eql(state2);
    expect(transition._noNode).to.eql(state1);
  });

  it("should check if possible", function(){

    var state1 = new Ego.State("state1");
    var state2 = new Ego.State("state2");

    var decisionMethod = new Ego.IsTrue();

    var transition = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);

    expect(transition.isPossible(knowledge)).to.eql(true);

    knowledge.updateBooleanInformation("isStuffHappening", false);

    expect(transition.isPossible(knowledge)).to.eql(false);
  });
});
