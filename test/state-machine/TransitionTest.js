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

  it("should get source node", function(){

    var state1 = new Ego.State("state1");
    var state2 = new Ego.State("state2");

    var decisionMethod = new Ego.IsTrue();

    var transition = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    expect(transition.getSourceNode()).to.eql(state1);
  });

  it("should get target node", function(){

    var state1 = new Ego.State("state1");
    var state2 = new Ego.State("state2");

    var decisionMethod = new Ego.IsTrue();

    var transition = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    expect(transition.getTargetNode()).to.eql(state2);
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

  it("should clone", function(){

    var state1 = new Ego.State("state1");
    var state2 = new Ego.State("state2");

    var transition = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

    var cloned = transition.clone();

    expect(cloned instanceof Ego.Transition).to.eql(true);

    expect(cloned._informationName).to.eql(transition._informationName);
    expect(cloned._informationType).to.eql(transition._informationType);
    expect(cloned._decisionMethod).to.eql(transition._decisionMethod);
    expect(cloned.getYesNode().getName()).to.eql(transition.getYesNode().getName());
    expect(cloned.getNoNode().getName()).to.eql(transition.getNoNode().getName());
    expect(cloned.getYesNode() === transition.getYesNode()).to.eql(false);
    expect(cloned.getNoNode() === transition.getNoNode()).to.eql(false);

    cloned = transition.clone(state1);

    expect(cloned._informationName).to.eql(transition._informationName);
    expect(cloned._informationType).to.eql(transition._informationType);
    expect(cloned._decisionMethod).to.eql(transition._decisionMethod);
    expect(cloned.getYesNode().getName()).to.eql(transition.getYesNode().getName());
    expect(cloned.getNoNode().getName()).to.eql(transition.getNoNode().getName());
    expect(cloned.getYesNode() === transition.getYesNode()).to.eql(false);
    expect(cloned.getNoNode() === transition.getNoNode()).to.eql(true);

    cloned = transition.clone(null, state2);
    expect(cloned._informationName).to.eql(transition._informationName);
    expect(cloned._informationType).to.eql(transition._informationType);
    expect(cloned._decisionMethod).to.eql(transition._decisionMethod);
    expect(cloned.getYesNode().getName()).to.eql(transition.getYesNode().getName());
    expect(cloned.getNoNode().getName()).to.eql(transition.getNoNode().getName());
    expect(cloned.getYesNode() === transition.getYesNode()).to.eql(true);
    expect(cloned.getNoNode() === transition.getNoNode()).to.eql(false);

    cloned = transition.clone(state1, state2);
    expect(cloned._informationName).to.eql(transition._informationName);
    expect(cloned._informationType).to.eql(transition._informationType);
    expect(cloned._decisionMethod).to.eql(transition._decisionMethod);
    expect(cloned.getYesNode().getName()).to.eql(transition.getYesNode().getName());
    expect(cloned.getNoNode().getName()).to.eql(transition.getNoNode().getName());
    expect(cloned.getYesNode() === transition.getYesNode()).to.eql(true);
    expect(cloned.getNoNode() === transition.getNoNode()).to.eql(true);

    var sm1 = new Ego.StateMachine("sm1", new Ego.Knowledge())
    var tmpState = new Ego.State("tmpState");
    sm1.addState(tmpState);
    sm1.setEntryState(tmpState)

    var transition2 = new Ego.Transition(sm1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
    var newKnowledge = new Ego.Knowledge();

    var obj = {};
    cloned = transition2.clone(null, null, newKnowledge, obj);
    expect(cloned.getSourceNode()._knowledge === newKnowledge).to.eql(true);
    expect(Object.keys(obj).length).to.eql(1);
    expect(cloned.getSourceNode()._entryState.getName()).to.eql("tmpState");
  });
});
