var expect = require('expect.js');
var Ego = require("../../build/Ego");

describe("StateMachine", function(){

  it("should initialize", function(){

    var knowledge = new Ego.Knowledge();

    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    expect(stateMachine instanceof Ego.State).to.eql(true);
    expect(stateMachine._knowledge).to.eql(knowledge);
    expect(stateMachine._statesByID).to.eql({});
    expect(stateMachine._transitionsByStateID).to.eql({});
    expect(stateMachine._entryState).to.eql(null);
    expect(stateMachine._currentState).to.eql(null);
    expect(stateMachine._stateChangedCallbackFunction).to.eql(null);
    expect(stateMachine._name).to.eql("stateMachine1");
    expect(stateMachine._id).to.have.length(36);
    expect(stateMachine._parent).to.eql(null);
  });

  it("should add state", function(){

    var knowledge = new Ego.Knowledge();

    var stateMachine1 = new Ego.StateMachine("stateMachine1", knowledge);
    var stateMachine2 = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("idle");

    var id1 = state1.getID();
    var id2 = state2.getID();

    var obj = {};
    var obj2 = {};
    obj[id1] = state1;
    obj2[id1] = [];

    expect(stateMachine1.addState(state1)).to.eql(true);
    expect(stateMachine1._statesByID).to.eql(obj);
    expect(stateMachine1._transitionsByStateID).to.eql(obj2);

    obj[id2] = state2;
    obj2[id2] = [];

    expect(stateMachine1.addState(state2)).to.eql(true);
    expect(stateMachine1._statesByID).to.eql(obj);
    expect(stateMachine1._transitionsByStateID).to.eql(obj2);

    expect(stateMachine1.addState(state1)).to.eql(false);
    expect(stateMachine1.addState(state2)).to.eql(false);
    expect(stateMachine1._statesByID).to.eql(obj);
    expect(stateMachine1._transitionsByStateID).to.eql(obj2);

    expect(stateMachine2.addState(state1)).to.eql(false);
    expect(stateMachine2.addState(state2)).to.eql(false);
    expect(stateMachine2._statesByID).to.eql({});
    expect(stateMachine2._transitionsByStateID).to.eql({});
  });

  it("should remove state", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state = new Ego.State("idle");

    expect(stateMachine.removeState(state)).to.eql(false);

    stateMachine.addState(state);

    expect(stateMachine.removeState(state)).to.eql(true);
    expect(stateMachine._statesByID).to.eql({});
    expect(stateMachine._transitionsByStateID).to.eql({});
  });

  it("should add transition", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");
    var state3 = new Ego.State("jumping");

    var transition = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
    var transition2 = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
    var transition3 = new Ego.Transition(state1, state3, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

    expect(stateMachine.addTransition(transition)).to.eql(false);

    stateMachine.addState(state1);

    var obj = {};
    obj[state1.getID()] = [transition];

    expect(stateMachine.addTransition(transition)).to.eql(true);
    expect(stateMachine._transitionsByStateID).to.eql(obj);

    expect(stateMachine.addTransition(transition)).to.eql(false);
    expect(stateMachine._transitionsByStateID).to.eql(obj);

    expect(stateMachine.addTransition(transition2)).to.eql(false);
    expect(stateMachine._transitionsByStateID).to.eql(obj);

    obj[state1.getID()].push(transition3);

    expect(stateMachine.addTransition(transition3)).to.eql(true);
    expect(stateMachine._transitionsByStateID).to.eql(obj);
  });

  it("should remove transition", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");
    var state3 = new Ego.State("jumping");

    var transition1 = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
    var transition2 = new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
    var transition3 = new Ego.Transition(state1, state3, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

    stateMachine.addState(state1);

    expect(stateMachine.removeTransition(transition1)).to.eql(false);
    expect(stateMachine.removeTransition(transition2)).to.eql(false);
    expect(stateMachine.removeTransition(transition3)).to.eql(false);

    stateMachine.addTransition(transition1);
    stateMachine.addTransition(transition3);

    var obj = {};
    obj[state1.getID()] = [transition3];

    expect(stateMachine.removeTransition(transition1)).to.eql(true);
    expect(stateMachine._transitionsByStateID).to.eql(obj);

    stateMachine.addTransition(transition1);
    obj = {};
    obj[state1.getID()] = [transition1];
    expect(stateMachine.removeTransition(transition3)).to.eql(true);
    expect(stateMachine._transitionsByStateID).to.eql(obj);

    obj = {};
    obj[state1.getID()] = [];
    expect(stateMachine.removeTransition(transition1)).to.eql(true);
    expect(stateMachine._transitionsByStateID).to.eql(obj);
  });

  it("should set entry state", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("moving");

    expect(stateMachine.setEntryState(state1)).to.eql(false);
    expect(stateMachine._entryState).to.eql(null);

    stateMachine.addState(state1);

    expect(stateMachine.setEntryState(state1)).to.eql(true);
    expect(stateMachine._entryState).to.eql(state1);
  });

  it("should unset entry state if the removed state is the entry state", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state = new Ego.State("idle");

    stateMachine.addState(state);
    stateMachine.setEntryState(state);

    expect(stateMachine._entryState).to.eql(state);

    stateMachine.removeState(state);

    expect(stateMachine._entryState).to.eql(null);
  });

  it("should set state change callback function", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var fn = function(newState){
      console.log("State changed: ", newState);
    };

    stateMachine.onStateChanged(fn);

    expect(stateMachine._stateChangedCallbackFunction).to.eql(fn);
  });

  it("should throw an error if updating without an entry state", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var catched = null;

    try{
      stateMachine.update();
    }catch (err){
      catched = err;
    }

    expect(catched).not.to.eql(null);
    expect(catched.message).to.eql("Entry state not set. Cannot update the StateMachine.");
  });

  it("should update", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", false);

    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");

    stateMachine.addState(state1);
    stateMachine.addState(state2);

    stateMachine.addTransition(new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));

    stateMachine.setEntryState(state1);

    expect(stateMachine._currentState).to.eql(null);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state1);

    knowledge.updateBooleanInformation("isStuffHappening", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state2);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state2);
  });

  it("should invoke state change callback function", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);

    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");

    stateMachine.addState(state1);
    stateMachine.addState(state2);

    stateMachine.addTransition(new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));

    stateMachine.setEntryState(state1);

    var param = null;
    stateMachine.onStateChanged(function(newState){
      param = newState;
    });

    stateMachine.update();

    expect(param).to.eql(state2);
  });

  it("should reset", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);

    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");

    stateMachine.addState(state1);
    stateMachine.addState(state2);

    stateMachine.addTransition(new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));

    stateMachine.setEntryState(state1);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state2);

    stateMachine.reset();

    expect(stateMachine._currentState).to.eql(null);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state2);

    stateMachine.reset();
    knowledge.updateBooleanInformation("isStuffHappening", false);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state1);
  });

  it("should update recursively", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);
    knowledge.addBooleanInformation("shouldJump", true);

    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");
    var state3 = new Ego.State("jumping");

    stateMachine.addState(state1);
    stateMachine.addState(state2);
    stateMachine.addState(state3);

    stateMachine.addTransition(new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));
    stateMachine.addTransition(new Ego.Transition(state2, state3, "shouldJump", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));

    stateMachine.setEntryState(state1);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state3);

    stateMachine.reset();
    knowledge.updateBooleanInformation("shouldJump", false);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state2);
  });

  it("should invoke state change callback function on recursive updates", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("isStuffHappening", true);
    knowledge.addBooleanInformation("shouldJump", true);

    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state1 = new Ego.State("idle");
    var state2 = new Ego.State("moving");
    var state3 = new Ego.State("jumping");

    stateMachine.addState(state1);
    stateMachine.addState(state2);
    stateMachine.addState(state3);

    stateMachine.addTransition(new Ego.Transition(state1, state2, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));
    stateMachine.addTransition(new Ego.Transition(state2, state3, "shouldJump", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));

    stateMachine.setEntryState(state1);

    var currentStates = [];
    stateMachine.onStateChanged(function(newState){
      currentStates.push(newState);
    });

    stateMachine.update();

    expect(currentStates).to.eql([state1, state2, state3]);
  });

  it("should update hierarchically", function(){

    var knowledge = new Ego.Knowledge();

    knowledge.addBooleanInformation("trashSeen", false);
    knowledge.addBooleanInformation("itemGot", false);
    knowledge.addBooleanInformation("trashDisposed", false);
    knowledge.addBooleanInformation("noPower", false);
    knowledge.addBooleanInformation("recharged", false);

    var decisionMethod = new Ego.IsTrue();

    var stateMachine = new Ego.StateMachine("stateMachine", knowledge);
    var stateMachine2 = new Ego.StateMachine("cleanUp", knowledge);

    var state1 = new Ego.State("search");
    var state2 = new Ego.State("headForTrash");
    var state3 = new Ego.State("headForCompactor");
    var state4 = new Ego.State("getPower");

    stateMachine2.addState(state1);
    stateMachine2.addState(state2);
    stateMachine2.addState(state3);

    stateMachine.addState(stateMachine2);
    stateMachine.addState(state4);

    var transition1 = new Ego.Transition(state1, state2, "trashSeen", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var transition2 = new Ego.Transition(state2, state3, "itemGot", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var transition3 = new Ego.Transition(state3, state1, "trashDisposed", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    expect(stateMachine2.addTransition(transition1)).to.eql(true);
    expect(stateMachine2.addTransition(transition2)).to.eql(true);
    expect(stateMachine2.addTransition(transition3)).to.eql(true);

    var transition4 = new Ego.Transition(stateMachine2, state4, "noPower", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);
    var transition5 = new Ego.Transition(state4, stateMachine2, "recharged", Ego.InformationTypes.TYPE_BOOLEAN, decisionMethod);

    expect(stateMachine.addTransition(transition4)).to.eql(true);
    expect(stateMachine.addTransition(transition5)).to.eql(true);

    expect(stateMachine.setEntryState(stateMachine2)).to.eql(true);
    expect(stateMachine2.setEntryState(state1)).to.eql(true);

    expect(stateMachine._currentState).to.eql(null);
    expect(stateMachine2._currentState).to.eql(null);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(stateMachine2);
    expect(stateMachine2._currentState).to.eql(state1);

    knowledge.updateBooleanInformation("trashSeen", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(stateMachine2);
    expect(stateMachine2._currentState).to.eql(state2);

    knowledge.updateBooleanInformation("trashSeen", false);
    knowledge.updateBooleanInformation("itemGot", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(stateMachine2);
    expect(stateMachine2._currentState).to.eql(state3);

    knowledge.updateBooleanInformation("itemGot", false);
    knowledge.updateBooleanInformation("trashDisposed", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(stateMachine2);
    expect(stateMachine2._currentState).to.eql(state1);

    knowledge.updateBooleanInformation("trashDisposed", false);
    knowledge.updateBooleanInformation("trashSeen", true);
    knowledge.updateBooleanInformation("itemGot", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(stateMachine2);
    expect(stateMachine2._currentState).to.eql(state3);

    knowledge.updateBooleanInformation("noPower", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state4);
    expect(stateMachine2._currentState).to.eql(null);

    knowledge.updateBooleanInformation("trashSeen", true);
    knowledge.updateBooleanInformation("itemGot", true);
    knowledge.updateBooleanInformation("trashDisposed", false);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state4);
    expect(stateMachine2._currentState).to.eql(null);

    knowledge.updateBooleanInformation("noPower", false);
    knowledge.updateBooleanInformation("recharged", true);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(stateMachine2);
    expect(stateMachine2._currentState).to.eql(state3);
  });

  it("should not invoke state change callback function on cross-hierarchy transitions", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("seenTrash", false);

    var childStateMachine = new Ego.StateMachine("childStateMachine", knowledge);
    var parentStateMachine = new Ego.StateMachine("parentStateMachine", knowledge);

    var state1 = new Ego.State("search");
    var state2 = new Ego.State("headForTrash");
    var state3 = new Ego.State("getPower");

    childStateMachine.addState(state1);
    childStateMachine.addState(state2);
    childStateMachine.setEntryState(state1);

    parentStateMachine.addState(childStateMachine);
    parentStateMachine.addState(state3);
    parentStateMachine.setEntryState(childStateMachine);

    childStateMachine.addTransition(new Ego.Transition(state1, state2, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));
    childStateMachine.addTransition(new Ego.Transition(state1, state3, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsFalse()));

    var callCount = 0;
    var lastState = null;
    childStateMachine.onStateChanged(function(newState){
      callCount ++;
      lastState = newState;
    });

    parentStateMachine.update();

    expect(callCount).to.eql(1);
    expect(lastState).to.eql(state1);
  });

  it("should update the current node of the other state machine on cross-hierarchy transitions", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("seenTrash", false);

    var childStateMachine = new Ego.StateMachine("childStateMachine", knowledge);
    var parentStateMachine = new Ego.StateMachine("parentStateMachine", knowledge);

    var state1 = new Ego.State("search");
    var state2 = new Ego.State("headForTrash");
    var state3 = new Ego.State("getPower");

    childStateMachine.addState(state1);
    childStateMachine.addState(state2);
    childStateMachine.setEntryState(state1);

    parentStateMachine.addState(childStateMachine);
    parentStateMachine.addState(state3);
    parentStateMachine.setEntryState(childStateMachine);

    childStateMachine.addTransition(new Ego.Transition(state1, state2, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));
    childStateMachine.addTransition(new Ego.Transition(state1, state3, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsFalse()));

    var states = [];
    parentStateMachine.onStateChanged(function(newState){
      states.push(newState);
    });

    parentStateMachine.update();

    expect(parentStateMachine._currentState).to.eql(state3);
    expect(states).to.eql([childStateMachine, state3]);
  });

  it("should reset on cross-hierarchy transitions", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("seenTrash", false);

    var childStateMachine = new Ego.StateMachine("childStateMachine", knowledge);
    var parentStateMachine = new Ego.StateMachine("parentStateMachine", knowledge);

    var state1 = new Ego.State("search");
    var state2 = new Ego.State("headForTrash");
    var state3 = new Ego.State("getPower");

    childStateMachine.addState(state1);
    childStateMachine.addState(state2);
    childStateMachine.setEntryState(state1);

    parentStateMachine.addState(childStateMachine);
    parentStateMachine.addState(state3);
    parentStateMachine.setEntryState(childStateMachine);

    childStateMachine.addTransition(new Ego.Transition(state1, state2, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));
    childStateMachine.addTransition(new Ego.Transition(state1, state3, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsFalse()));

    var stateChanged = false;
    childStateMachine.onStateChanged(function(state){
      stateChanged = true;
    });

    parentStateMachine.update();

    expect(stateChanged).to.eql(true);
    expect(childStateMachine._currentState).to.eql(null);
  });

  it("should keep updating the switched state machine after cross-hierarchy transition", function(){

    var knowledge = new Ego.Knowledge();
    knowledge.addBooleanInformation("seenTrash", false);
    knowledge.addBooleanInformation("isStuffHappening", true);

    var childStateMachine = new Ego.StateMachine("childStateMachine", knowledge);
    var parentStateMachine = new Ego.StateMachine("parentStateMachine", knowledge);

    var state1 = new Ego.State("search");
    var state2 = new Ego.State("headForTrash");
    var state3 = new Ego.State("getPower");
    var state4 = new Ego.State("doStuff");

    childStateMachine.addState(state1);
    childStateMachine.addState(state2);
    childStateMachine.setEntryState(state1);

    parentStateMachine.addState(childStateMachine);
    parentStateMachine.addState(state3);
    parentStateMachine.addState(state4);
    parentStateMachine.setEntryState(childStateMachine);

    childStateMachine.addTransition(new Ego.Transition(state1, state2, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));
    childStateMachine.addTransition(new Ego.Transition(state1, state3, "seenTrash", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsFalse()));

    parentStateMachine.addTransition(new Ego.Transition(state3, state4, "isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue()));

    parentStateMachine.update();

    expect(parentStateMachine._currentState).to.eql(state4);
  });

  it("should throw an error if trying to remove the active state", function(){

    var knowledge = new Ego.Knowledge();
    var stateMachine = new Ego.StateMachine("stateMachine1", knowledge);

    var state = new Ego.State("state1");

    stateMachine.addState(state);
    stateMachine.setEntryState(state);

    stateMachine.update();

    expect(stateMachine._currentState).to.eql(state);

    var thrownError = null
    try{
      stateMachine.removeState(state);
    }catch (err){
      thrownError = err;
    }

    expect(thrownError).not.to.eql(null);
    expect(thrownError.message).to.eql("Cannot remove the active state.");
  });

  describe("integration", function(){

    it("case#1", function(){

      var isTrue = new Ego.IsTrue();

      var knowledge = new Ego.Knowledge();
      knowledge.addBooleanInformation("info1", false);
      knowledge.addBooleanInformation("info2", false);
      knowledge.addBooleanInformation("info3", false);
      knowledge.addBooleanInformation("info4", false);
      knowledge.addBooleanInformation("info5", false);

      var state1 = new Ego.State("state1");
      var state2 = new Ego.State("state2");
      var state3 = new Ego.State("state3");
      var state4 = new Ego.State("state4");
      var state5 = new Ego.State("state5");

      var stateMachine1 = new Ego.StateMachine("stateMachine1", knowledge);
      var stateMachine2 = new Ego.StateMachine("stateMachine2", knowledge);
      var stateMachine3 = new Ego.StateMachine("stateMachine3", knowledge);

      stateMachine1.addState(stateMachine2);
      stateMachine1.addState(state3);
      stateMachine1.addTransition(new Ego.Transition(stateMachine2, state3, "info2", Ego.InformationTypes.TYPE_BOOLEAN, isTrue));
      stateMachine1.setEntryState(stateMachine2);

      stateMachine2.addState(state1);
      stateMachine2.addState(state2);
      stateMachine2.addTransition(new Ego.Transition(state1, state2, "info1", Ego.InformationTypes.TYPE_BOOLEAN, isTrue));
      stateMachine2.addTransition(new Ego.Transition(state2, state4, "info3", Ego.InformationTypes.TYPE_BOOLEAN, isTrue));
      stateMachine2.setEntryState(state1);

      stateMachine3.addState(stateMachine1);
      stateMachine3.addState(state4);
      stateMachine3.addState(state5);
      stateMachine3.addTransition(new Ego.Transition(state4, state5, "info4", Ego.InformationTypes.TYPE_BOOLEAN, isTrue));
      stateMachine3.addTransition(new Ego.Transition(state5, stateMachine1, "info5", Ego.InformationTypes.TYPE_BOOLEAN, isTrue));
      stateMachine3.setEntryState(stateMachine1);

      stateMachine3.update();

      expect(stateMachine3._currentState).to.eql(stateMachine1);
      expect(stateMachine1._currentState).to.eql(stateMachine2);
      expect(stateMachine2._currentState).to.eql(state1);

      knowledge.updateBooleanInformation("info1", true);

      stateMachine3.update();

      expect(stateMachine3._currentState).to.eql(stateMachine1);
      expect(stateMachine1._currentState).to.eql(stateMachine2);
      expect(stateMachine2._currentState).to.eql(state2);

      knowledge.updateBooleanInformation("info3", true);

      stateMachine3.update();

      expect(stateMachine3._currentState).to.eql(state4);
      expect(stateMachine1._currentState).to.eql(null);
      expect(stateMachine2._currentState).to.eql(null);

      knowledge.updateBooleanInformation("info4", true);

      stateMachine3.update();
      expect(stateMachine3._currentState).to.eql(state5);
      expect(stateMachine1._currentState).to.eql(null);
      expect(stateMachine2._currentState).to.eql(null);

      knowledge.updateBooleanInformation("info5", true);
      knowledge.updateBooleanInformation("info2", true);

      stateMachine3.update();
      expect(stateMachine3._currentState).to.eql(stateMachine1);
      expect(stateMachine1._currentState).to.eql(state3);
      expect(stateMachine2._currentState).to.eql(null);
    });

    it("case#2", function(){

      var isTrue = new Ego.IsTrue();

      var knowledge = new Ego.Knowledge();
      knowledge.addBooleanInformation("info1", false);
      knowledge.addBooleanInformation("info2", false);
      knowledge.addBooleanInformation("info3", false);
      knowledge.addBooleanInformation("info4", false);
      knowledge.addBooleanInformation("info5", false);
      knowledge.addBooleanInformation("info6", false);
      knowledge.addBooleanInformation("info7", false);
      knowledge.addBooleanInformation("info8", false);
      knowledge.addBooleanInformation("info9", false);
      knowledge.addBooleanInformation("info10", false);

      var state1 = new Ego.State("state1");
      var state2 = new Ego.State("state2");
      var state3 = new Ego.State("state3");
      var state4 = new Ego.State("state4");
      var state5 = new Ego.State("state5");
      var state6 = new Ego.State("state6");
      var state7 = new Ego.State("state7");

      var sm1 = new Ego.StateMachine("sm1", knowledge);
      var sm2 = new Ego.StateMachine("sm2", knowledge);
      var sm3 = new Ego.StateMachine("sm3", knowledge);

      var transition1 = new Ego.Transition(state1, state2, "info1", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition2 = new Ego.Transition(state2, state4, "info2", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition3 = new Ego.Transition(state2, state3, "info3", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition4 = new Ego.Transition(state3, sm2, "info4", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition5 = new Ego.Transition(state6, state7, "info5", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition6 = new Ego.Transition(state7, state4, "info6", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition7 = new Ego.Transition(state4, state5, "info7", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition8 = new Ego.Transition(state5, sm1, "info8", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition9 = new Ego.Transition(sm1, sm2, "info9", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);
      var transition10 = new Ego.Transition(sm2, sm1, "info10", Ego.InformationTypes.TYPE_BOOLEAN, isTrue);

      sm1.addState(state1);
      sm1.addState(state2);
      sm1.addState(state3);
      sm1.addTransition(transition1);
      sm1.addTransition(transition2);
      sm1.addTransition(transition3);
      sm1.addTransition(transition4);
      sm1.setEntryState(state1);

      sm2.addState(state6);
      sm2.addState(state7);
      sm2.addTransition(transition5);
      sm2.addTransition(transition6);
      sm2.setEntryState(state6);

      sm3.addState(sm1);
      sm3.addState(sm2);
      sm3.addState(state4);
      sm3.addState(state5);
      sm3.addTransition(transition9);
      sm3.addTransition(transition10);
      sm3.addTransition(transition7);
      sm3.addTransition(transition8);
      sm3.setEntryState(sm1);

      sm3.update();
      expect(sm3._currentState).to.eql(sm1);
      expect(sm1._currentState).to.eql(state1);
      expect(sm2._currentState).to.eql(null);

      knowledge.updateBooleanInformation("info9", true);

      sm3.update();
      expect(sm3._currentState).to.eql(sm2);
      expect(sm1._currentState).to.eql(null);
      expect(sm2._currentState).to.eql(state6);

      knowledge.updateBooleanInformation("info9", false);
      knowledge.updateBooleanInformation("info10", true);

      sm3.update();
      expect(sm3._currentState).to.eql(sm1);
      expect(sm1._currentState).to.eql(state1);
      expect(sm2._currentState).to.eql(null);

      knowledge.updateBooleanInformation("info10", false);
      knowledge.updateBooleanInformation("info9", true);
      knowledge.updateBooleanInformation("info5", true);
      knowledge.updateBooleanInformation("info6", true);
      knowledge.updateBooleanInformation("info7", true);

      sm3.update();
      expect(sm3._currentState).to.eql(state5);
      expect(sm1._currentState).to.eql(null);
      expect(sm2._currentState).to.eql(null);

      knowledge.updateBooleanInformation("info7", false);
      knowledge.updateBooleanInformation("info8", true);
      knowledge.updateBooleanInformation("info1", true);
      knowledge.updateBooleanInformation("info2", true);

      sm3.update();
      expect(sm3._currentState).to.eql(state4);
      expect(sm1._currentState).to.eql(null);
      expect(sm2._currentState).to.eql(null);

      knowledge.updateBooleanInformation("info1", false);
      knowledge.updateBooleanInformation("info2", false);
      knowledge.updateBooleanInformation("info3", false);
      knowledge.updateBooleanInformation("info4", false);
      knowledge.updateBooleanInformation("info5", true);
      knowledge.updateBooleanInformation("info6", false);
      knowledge.updateBooleanInformation("info7", true);
      knowledge.updateBooleanInformation("info8", true);
      knowledge.updateBooleanInformation("info9", true);
      knowledge.updateBooleanInformation("info10", false);

      sm3.update();
      expect(sm3._currentState).to.eql(sm2);
      expect(sm1._currentState).to.eql(null);
      expect(sm2._currentState).to.eql(state7);
    });
  });
});
